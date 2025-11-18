import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { VoiceRecognitionService, VoiceRecognitionState } from '../../services/voice-recognition.service';
import { BlindControlService } from '../../services/blind-control.service';
import { IndexedDBService } from '../../services/indexed-db.service';
import { Device } from '../../models/device.model';

/**
 * COMPONENTE DE BOTÓN DE VOZ
 *
 * Botón flotante con icono de volumen que activa/desactiva el reconocimiento de voz.
 * Muestra feedback visual del estado y transcripción en tiempo real.
 */

@Component({
  selector: 'app-voice-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './voice-button.component.html',
  styleUrls: ['./voice-button.component.scss']
})
export class VoiceButtonComponent implements OnInit, OnDestroy {
  // Estado del reconocimiento de voz
  voiceState: VoiceRecognitionState = {
    isListening: false,
    transcript: '',
    message: '🎤 Pulsa para hablar',
    confidence: 0
  };

  // Suscripciones
  private subscriptions: Subscription[] = [];

  // Dispositivos disponibles
  private devices: Device[] = [];

  constructor(
    private voiceService: VoiceRecognitionService,
    private blindControlService: BlindControlService,
    private indexedDbService: IndexedDBService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Suscribirse al estado del reconocimiento de voz
    const stateSub = this.voiceService.state$.subscribe(state => {
      this.voiceState = state;

      // Mostrar notificación si hay error
      if (state.error && state.error !== 'no-speech') {
        this.showNotification(state.message, 'error');
      }
    });
    this.subscriptions.push(stateSub);

    // Cargar dispositivos disponibles
    this.loadDevices();

    // Escuchar eventos de comando de voz
    window.addEventListener('voice-command', this.onVoiceCommand.bind(this));

    // Verificar soporte del navegador
    if (!this.voiceService.isRecognitionSupported()) {
      this.showNotification('❌ Tu navegador no soporta reconocimiento de voz', 'error');
    }
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones
    this.subscriptions.forEach(sub => sub.unsubscribe());

    // Detener reconocimiento si está activo
    if (this.voiceState.isListening) {
      this.voiceService.stop();
    }

    // Remover event listener
    window.removeEventListener('voice-command', this.onVoiceCommand.bind(this));
  }

  /**
   * Cargar dispositivos disponibles
   */
  private loadDevices(): void {
    const devicesSub = this.indexedDbService.devices$.subscribe((devices: Device[]) => {
      this.devices = devices;
      this.voiceService.setAvailableDevices(devices);
      console.log('📱 Dispositivos cargados para control por voz:', devices.length);
    });
    this.subscriptions.push(devicesSub);
  }

  /**
   * Toggle del reconocimiento de voz
   */
  toggleVoiceRecognition(): void {
    if (this.voiceState.isListening) {
      // Detener reconocimiento
      this.voiceService.stop();
    } else {
      // Iniciar reconocimiento
      this.voiceService.start();
    }
  }

  /**
   * Handler del evento de comando de voz
   */
  private onVoiceCommand(event: Event): void {
    const customEvent = event as CustomEvent;
    const { devices, action } = customEvent.detail;

    console.log('🎤 Ejecutando comando de voz:', action, 'en', devices.length, 'dispositivo(s)');

    // Ejecutar acción en cada dispositivo
    devices.forEach((device: Device) => {
      this.executeDeviceCommand(device, action);
      console.log('✅ Comando ejecutado en:', device.description);
    });

    // Mostrar notificación de éxito
    this.showNotification(
      `✅ Comando ejecutado en ${devices.length} dispositivo${devices.length > 1 ? 's' : ''}`,
      'success'
    );
  }

  /**
   * Ejecutar comando en un dispositivo
   */
  private executeDeviceCommand(device: Device, action: string): void {
    const inverted = device.inverted || false;

    switch (action) {
      case 'on':
        this.blindControlService.moveUp(device.id, inverted);
        break;

      case 'off':
        this.blindControlService.moveDown(device.id, inverted);
        break;

      case 'stop':
        this.blindControlService.stop(device.id);
        break;

      default:
        console.error('Acción desconocida:', action);
    }
  }

  /**
   * Mostrar notificación
   */
  private showNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [`snackbar-${type}`]
    });
  }

  /**
   * Obtener icono según el estado
   */
  getIcon(): string {
    if (this.voiceState.isListening) {
      return 'mic';
    }
    return 'volume_up';
  }

  /**
   * Obtener tooltip según el estado
   */
  getTooltip(): string {
    if (this.voiceState.isListening) {
      return 'Escuchando... (Pulsa para detener)';
    }
    return 'Control por voz (Pulsa para hablar)';
  }
}
