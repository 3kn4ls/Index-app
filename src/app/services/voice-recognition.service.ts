import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ACTION_KEYWORDS,
  DEVICE_TYPE_KEYWORDS,
  ROOM_KEYWORDS,
  DEVICE_MAPPING,
  VOICE_RECOGNITION_CONFIG,
  VOICE_FEEDBACK_MESSAGES,
  VoiceCommand
} from '../config/voice-commands.config';
import { Device, DeviceType } from '../models/device.model';

/**
 * SERVICIO DE RECONOCIMIENTO DE VOZ
 *
 * Este servicio gestiona el reconocimiento de voz usando la Web Speech API
 * y procesa los comandos reconocidos para controlar dispositivos.
 */

export interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  message: string;
  confidence: number;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {
  private recognition: any;
  private isSupported = false;

  // Estado del reconocimiento de voz
  private stateSubject = new BehaviorSubject<VoiceRecognitionState>({
    isListening: false,
    transcript: '',
    message: VOICE_FEEDBACK_MESSAGES.READY,
    confidence: 0
  });

  // Observable del estado para que los componentes se suscriban
  public state$: Observable<VoiceRecognitionState> = this.stateSubject.asObservable();

  // Dispositivos disponibles
  private availableDevices: Device[] = [];

  constructor() {
    this.initializeRecognition();
  }

  /**
   * Inicializa el reconocimiento de voz
   */
  private initializeRecognition(): void {
    // Verificar soporte del navegador
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('⚠️ El navegador no soporta reconocimiento de voz');
      this.isSupported = false;
      this.updateState({
        message: '❌ Tu navegador no soporta reconocimiento de voz',
        error: 'NOT_SUPPORTED'
      });
      return;
    }

    this.isSupported = true;
    this.recognition = new SpeechRecognition();

    // Configurar reconocimiento
    this.recognition.lang = VOICE_RECOGNITION_CONFIG.language;
    this.recognition.continuous = VOICE_RECOGNITION_CONFIG.continuous;
    this.recognition.interimResults = VOICE_RECOGNITION_CONFIG.interimResults;
    this.recognition.maxAlternatives = VOICE_RECOGNITION_CONFIG.maxAlternatives;

    // Event listeners
    this.recognition.onstart = () => this.onStart();
    this.recognition.onresult = (event: any) => this.onResult(event);
    this.recognition.onerror = (event: any) => this.onError(event);
    this.recognition.onend = () => this.onEnd();
  }

  /**
   * Setear dispositivos disponibles
   */
  public setAvailableDevices(devices: Device[]): void {
    this.availableDevices = devices;
  }

  /**
   * Iniciar reconocimiento de voz
   */
  public start(): void {
    if (!this.isSupported) {
      console.error('❌ Reconocimiento de voz no soportado');
      return;
    }

    try {
      this.recognition.start();
      console.log('🎤 Reconocimiento de voz iniciado');
    } catch (error) {
      console.error('❌ Error al iniciar reconocimiento:', error);
      this.updateState({
        isListening: false,
        message: '❌ Error al iniciar micrófono',
        error: 'START_ERROR'
      });
    }
  }

  /**
   * Detener reconocimiento de voz
   */
  public stop(): void {
    if (this.recognition && this.stateSubject.value.isListening) {
      this.recognition.stop();
      console.log('🛑 Reconocimiento de voz detenido');
    }
  }

  /**
   * Verificar si está soportado
   */
  public isRecognitionSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Handler: Inicio de reconocimiento
   */
  private onStart(): void {
    this.updateState({
      isListening: true,
      transcript: '',
      message: VOICE_FEEDBACK_MESSAGES.LISTENING,
      confidence: 0,
      error: undefined
    });
  }

  /**
   * Handler: Resultado de reconocimiento
   */
  private onResult(event: any): void {
    const results = event.results;
    const lastResult = results[results.length - 1];
    const transcript = lastResult[0].transcript.toLowerCase().trim();
    const confidence = lastResult[0].confidence;
    const isFinal = lastResult.isFinal;

    console.log('📝 Transcripción:', transcript, '| Confianza:', confidence);

    // Actualizar transcripción
    this.updateState({
      transcript: transcript,
      confidence: confidence
    });

    // Si es resultado final, procesar comando
    if (isFinal) {
      this.processCommand(transcript, confidence);
    }
  }

  /**
   * Handler: Error de reconocimiento
   */
  private onError(event: any): void {
    console.error('❌ Error de reconocimiento:', event.error);

    let message = '❌ Error en reconocimiento';
    if (event.error === 'no-speech') {
      message = '❓ No se detectó voz';
    } else if (event.error === 'audio-capture') {
      message = '🎤 Error de micrófono';
    } else if (event.error === 'not-allowed') {
      message = '🚫 Permiso de micrófono denegado';
    }

    this.updateState({
      isListening: false,
      message: message,
      error: event.error
    });
  }

  /**
   * Handler: Fin de reconocimiento
   */
  private onEnd(): void {
    this.updateState({
      isListening: false,
      message: VOICE_FEEDBACK_MESSAGES.READY
    });
  }

  /**
   * Procesar comando de voz
   */
  private processCommand(transcript: string, confidence: number): void {
    // Verificar confianza mínima
    if (confidence < VOICE_RECOGNITION_CONFIG.confidenceThreshold) {
      this.updateState({
        message: VOICE_FEEDBACK_MESSAGES.NOT_UNDERSTOOD
      });
      return;
    }

    this.updateState({
      message: VOICE_FEEDBACK_MESSAGES.PROCESSING
    });

    // Parsear comando
    const command = this.parseVoiceCommand(transcript);

    if (!command) {
      this.updateState({
        message: VOICE_FEEDBACK_MESSAGES.NOT_UNDERSTOOD
      });
      return;
    }

    // Buscar dispositivos que coincidan
    const matchedDevices = this.findMatchingDevices(command);

    if (matchedDevices.length === 0) {
      this.updateState({
        message: VOICE_FEEDBACK_MESSAGES.NO_DEVICE_FOUND
      });
      return;
    }

    // Emitir evento con los dispositivos y acción
    this.executeCommand(matchedDevices, command.action);
  }

  /**
   * Parsear comando de voz en componentes
   */
  private parseVoiceCommand(transcript: string): VoiceCommand | null {
    const words = transcript.toLowerCase().split(' ');
    let action: 'on' | 'off' | 'stop' | null = null;
    let deviceType: 'VENTANA' | 'PUERTA' | undefined = undefined;
    let room: string | undefined = undefined;

    // Detectar acción
    for (const word of words) {
      if (ACTION_KEYWORDS.UP.includes(word)) {
        action = 'on';
        break;
      } else if (ACTION_KEYWORDS.DOWN.includes(word)) {
        action = 'off';
        break;
      } else if (ACTION_KEYWORDS.STOP.includes(word)) {
        action = 'stop';
        break;
      }
    }

    if (!action) {
      return null;
    }

    // Detectar tipo de dispositivo
    for (const word of words) {
      if (DEVICE_TYPE_KEYWORDS.VENTANA.includes(word)) {
        deviceType = 'VENTANA';
        break;
      } else if (DEVICE_TYPE_KEYWORDS.PUERTA.includes(word)) {
        deviceType = 'PUERTA';
        break;
      }
    }

    // Detectar estancia (buscar coincidencias en frases completas primero)
    const transcriptLower = transcript.toLowerCase();
    for (const [roomName, keywords] of Object.entries(ROOM_KEYWORDS)) {
      for (const keyword of keywords) {
        if (transcriptLower.includes(keyword)) {
          room = roomName;
          break;
        }
      }
      if (room) break;
    }

    return { action, deviceType, room };
  }

  /**
   * Buscar dispositivos que coincidan con el comando
   */
  private findMatchingDevices(command: VoiceCommand): Device[] {
    return this.availableDevices.filter(device => {
      // Si se especificó tipo de dispositivo, debe coincidir
      if (command.deviceType && device.type !== command.deviceType) {
        return false;
      }

      // Si se especificó estancia, debe coincidir
      if (command.room && !device.description.includes(command.room)) {
        return false;
      }

      return true;
    });
  }

  /**
   * Ejecutar comando en dispositivos
   */
  private executeCommand(devices: Device[], action: string): void {
    // Crear evento personalizado para que el componente lo capture
    const event = new CustomEvent('voice-command', {
      detail: {
        devices: devices,
        action: action
      }
    });

    window.dispatchEvent(event);

    this.updateState({
      message: `${VOICE_FEEDBACK_MESSAGES.SUCCESS} (${devices.length} dispositivo${devices.length > 1 ? 's' : ''})`
    });

    console.log('✅ Comando ejecutado:', action, 'en', devices.length, 'dispositivo(s)');
  }

  /**
   * Actualizar estado
   */
  private updateState(partialState: Partial<VoiceRecognitionState>): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({ ...currentState, ...partialState });
  }
}
