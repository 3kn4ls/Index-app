/**
 * CONFIGURACIÓN DE COMANDOS DE VOZ
 *
 * Este archivo define todas las palabras clave reconocidas por el sistema
 * de control por voz. El sistema reconoce comandos en español para controlar
 * persianas y puertas en diferentes estancias de la casa.
 *
 * FORMATO DE COMANDO:
 * "[ACCIÓN] [ELEMENTO] [ESTANCIA]"
 * Ejemplo: "subir ventana salón", "cerrar puerta principal", "parar"
 */

export interface VoiceCommand {
  action: 'on' | 'off' | 'stop';
  deviceType?: 'VENTANA' | 'PUERTA';
  room?: string;
}

/**
 * PALABRAS CLAVE PARA ACCIONES
 * Define qué acción realizar sobre el dispositivo
 */
export const ACTION_KEYWORDS = {
  // SUBIR / ABRIR (comando 'on')
  UP: [
    'subir',
    'sube',
    'elevar',
    'eleva',
    'arriba',
    'abre',
    'abrir',
    'abriendo',
    'levanta',
    'levantar'
  ],

  // BAJAR / CERRAR (comando 'off')
  DOWN: [
    'bajar',
    'baja',
    'cerrar',
    'cierra',
    'cerrando',
    'abajo',
    'baja',
    'bajando',
    'descender'
  ],

  // PARAR / DETENER (comando 'stop')
  STOP: [
    'parar',
    'para',
    'stop',
    'detener',
    'detén',
    'detente',
    'espera',
    'quieto',
    'quieta',
    'alto'
  ]
};

/**
 * PALABRAS CLAVE PARA TIPOS DE DISPOSITIVO
 * Define si es una ventana o puerta
 */
export const DEVICE_TYPE_KEYWORDS = {
  VENTANA: [
    'ventana',
    'ventanas',
    'persiana',
    'persianas',
    'cristal'
  ],

  PUERTA: [
    'puerta',
    'puertas',
    'portal',
    'portón'
  ]
};

/**
 * PALABRAS CLAVE PARA ESTANCIAS
 * Define en qué habitación está el dispositivo
 */
export const ROOM_KEYWORDS = {
  // Habitación Principal
  'Hab. Principal': [
    'principal',
    'habitación principal',
    'habitacion principal',
    'dormitorio principal',
    'cuarto principal',
    'master',
    'matrimonio'
  ],

  // Salón
  'Salón': [
    'salón',
    'salon',
    'sala',
    'living',
    'comedor',
    'sala de estar'
  ],

  // Habitación de Ordenadores
  'Ordenadores': [
    'ordenadores',
    'ordenador',
    'computadora',
    'computadoras',
    'despacho',
    'oficina',
    'estudio'
  ],

  // Habitación de Jaume/Edu
  'Hab. Jaume/Edu': [
    'jaume',
    'edu',
    'jaume edu',
    'habitación jaume',
    'habitación edu',
    'habitacion jaume',
    'habitacion edu',
    'cuarto jaume',
    'cuarto edu'
  ]
};

/**
 * COMANDOS GLOBALES
 * Acciones que afectan a múltiples dispositivos
 */
export const GLOBAL_COMMANDS = {
  // Cerrar/abrir todo
  ALL: [
    'todo',
    'todos',
    'todas',
    'completo',
    'general',
    'global'
  ]
};

/**
 * MAPEO DE DESCRIPCIÓN DE DISPOSITIVO A ID
 * Relaciona las descripciones de dispositivos con sus IDs del sistema
 */
export const DEVICE_MAPPING: Record<string, string> = {
  // Habitación Principal
  'Ventana Hab. Principal': 'ZWayVDev_zway_3-0-38',
  'Puerta Hab. Principal': 'ZWayVDev_zway_8-0-38',

  // Salón
  'Ventana Salón': 'ZWayVDev_zway_4-0-38',
  'Puerta Salón': 'ZWayVDev_zway_2-0-38',

  // Ordenadores
  'Ventana Ordenadores': 'ZWayVDev_zway_7-0-38',

  // Habitación Jaume/Edu
  'Ventana Hab. Jaume/Edu': 'ZWayVDev_zway_9-0-38'
};

/**
 * CONFIGURACIÓN DE RECONOCIMIENTO
 */
export const VOICE_RECOGNITION_CONFIG = {
  // Idioma del reconocimiento
  language: 'es-ES',

  // Reconocimiento continuo (sigue escuchando después de un comando)
  continuous: false,

  // Resultados intermedios (muestra texto mientras hablas)
  interimResults: true,

  // Número máximo de alternativas de reconocimiento
  maxAlternatives: 3,

  // Tiempo de espera sin hablar antes de detener (ms)
  silenceTimeout: 2000,

  // Nivel de confianza mínimo para aceptar un comando (0-1)
  confidenceThreshold: 0.6
};

/**
 * MENSAJES DE FEEDBACK
 */
export const VOICE_FEEDBACK_MESSAGES = {
  LISTENING: '🎤 Escuchando...',
  PROCESSING: '⚙️ Procesando comando...',
  SUCCESS: '✅ Comando ejecutado',
  ERROR: '❌ No se pudo ejecutar',
  NOT_UNDERSTOOD: '❓ No se entendió el comando',
  NO_DEVICE_FOUND: '🔍 No se encontró el dispositivo',
  DEVICE_NOT_SPECIFIED: '⚠️ Especifica qué dispositivo controlar',
  READY: '🎤 Pulsa para hablar'
};
