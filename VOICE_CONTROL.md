# 🎤 Sistema de Control por Voz

## Descripción General

Sistema de reconocimiento de voz integrado en la aplicación de Control de Persianas que permite controlar ventanas y puertas mediante comandos hablados en español.

## 🚀 Cómo Usar

### Activar el Reconocimiento de Voz

1. Busca el **botón flotante morado** en la esquina inferior derecha con el icono de volumen 🔊
2. **Pulsa el botón** para comenzar a hablar
3. El botón cambiará a **color rosa** y mostrará "Escuchando..."
4. **Di tu comando** de forma clara
5. El sistema procesará automáticamente el comando y ejecutará la acción

### Feedback Visual

- **🎤 Pulsa para hablar**: Estado inicial, listo para escuchar
- **🎤 Escuchando...**: El sistema está grabando tu voz
- **⚙️ Procesando comando...**: Analizando lo que dijiste
- **✅ Comando ejecutado**: Acción completada con éxito
- **❌ Error**: Hubo un problema al ejecutar el comando
- **❓ No se entendió el comando**: El sistema no pudo interpretar tu solicitud
- **🔍 No se encontró el dispositivo**: No hay dispositivos que coincidan con tu comando

## 📝 Estructura de Comandos

Los comandos de voz siguen esta estructura flexible:

```
[ACCIÓN] [ELEMENTO] [ESTANCIA]
```

**Nota**: El orden de las palabras es flexible. Puedes decir "subir ventana salón" o "ventana del salón subir".

## 🔑 Palabras Clave Reconocidas

### ⬆️ Acciones: SUBIR / ABRIR

Palabras que activan el comando para **subir** o **abrir**:

- `subir`, `sube`
- `elevar`, `eleva`
- `arriba`
- `abre`, `abrir`, `abriendo`
- `levanta`, `levantar`

**Ejemplos**:
- "Subir ventana salón"
- "Abre la puerta principal"
- "Elevar persiana ordenadores"

---

### ⬇️ Acciones: BAJAR / CERRAR

Palabras que activan el comando para **bajar** o **cerrar**:

- `bajar`, `baja`, `bajando`
- `cerrar`, `cierra`, `cerrando`
- `abajo`
- `descender`

**Ejemplos**:
- "Bajar ventana salón"
- "Cierra la puerta principal"
- "Cerrar todas las ventanas del salón"

---

### ⏹️ Acciones: PARAR / DETENER

Palabras que activan el comando para **detener** el movimiento:

- `parar`, `para`
- `stop`
- `detener`, `detén`, `detente`
- `espera`
- `quieto`, `quieta`
- `alto`

**Ejemplos**:
- "Parar"
- "Stop ventana salón"
- "Detener todas"

---

### 🪟 Elementos: VENTANAS

Palabras para referirse a **ventanas**:

- `ventana`, `ventanas`
- `persiana`, `persianas`
- `cristal`

**Ejemplos**:
- "Subir **ventana** salón"
- "Cerrar **persianas** principal"

---

### 🚪 Elementos: PUERTAS

Palabras para referirse a **puertas**:

- `puerta`, `puertas`
- `portal`
- `portón`

**Ejemplos**:
- "Abrir **puerta** salón"
- "Cerrar **portón** principal"

---

### 🏠 Estancias de la Casa

#### **Habitación Principal**
- `principal`
- `habitación principal`, `habitacion principal`
- `dormitorio principal`
- `cuarto principal`
- `master`
- `matrimonio`

**Dispositivos disponibles**:
- ✅ Ventana Hab. Principal
- ✅ Puerta Hab. Principal

---

#### **Salón**
- `salón`, `salon`
- `sala`
- `living`
- `comedor`
- `sala de estar`

**Dispositivos disponibles**:
- ✅ Ventana Salón
- ✅ Puerta Salón

---

#### **Habitación de Ordenadores**
- `ordenadores`, `ordenador`
- `computadora`, `computadoras`
- `despacho`
- `oficina`
- `estudio`

**Dispositivos disponibles**:
- ✅ Ventana Ordenadores

---

#### **Habitación de Jaume/Edu**
- `jaume`
- `edu`
- `jaume edu`
- `habitación jaume`, `habitacion jaume`
- `habitación edu`, `habitacion edu`
- `cuarto jaume`
- `cuarto edu`

**Dispositivos disponibles**:
- ✅ Ventana Hab. Jaume/Edu

## 💡 Ejemplos de Comandos Completos

### Comandos Básicos

```
✅ "Subir ventana salón"
   → Sube la ventana del salón

✅ "Cerrar puerta principal"
   → Cierra la puerta de la habitación principal

✅ "Abrir persiana ordenadores"
   → Abre la ventana de la habitación de ordenadores

✅ "Parar"
   → Detiene todos los dispositivos que estén en movimiento
```

### Comandos con Diferentes Variaciones

```
✅ "Elevar ventana del salón"
✅ "Abre la ventana en el salón"
✅ "Ventana del salón arriba"
   → Todas estas variaciones funcionan para subir la ventana del salón

✅ "Baja la puerta de la habitación principal"
✅ "Cerrar puerta habitación principal"
✅ "Puerta principal abajo"
   → Todas estas variaciones funcionan para bajar la puerta principal
```

### Comandos por Tipo (Múltiples Dispositivos)

```
✅ "Cerrar todas las ventanas"
   → Cierra todas las ventanas de la casa (no especifica estancia)

✅ "Subir puertas"
   → Sube todas las puertas de la casa

✅ "Bajar ventanas salón"
   → Baja solo las ventanas del salón
```

### Comandos de Emergencia

```
✅ "Parar todo"
✅ "Stop"
✅ "Alto"
   → Detiene inmediatamente todos los dispositivos
```

## ⚙️ Configuración del Sistema

### Archivos de Configuración

Todas las palabras clave están definidas en:
```
src/app/config/voice-commands.config.ts
```

Este archivo contiene:
- ✅ **ACTION_KEYWORDS**: Palabras para acciones (subir, bajar, parar)
- ✅ **DEVICE_TYPE_KEYWORDS**: Palabras para tipos de dispositivo (ventana, puerta)
- ✅ **ROOM_KEYWORDS**: Palabras para estancias de la casa
- ✅ **DEVICE_MAPPING**: Mapeo de dispositivos a IDs del sistema
- ✅ **VOICE_RECOGNITION_CONFIG**: Configuración del reconocimiento
- ✅ **VOICE_FEEDBACK_MESSAGES**: Mensajes de feedback

### Parámetros de Reconocimiento

```typescript
VOICE_RECOGNITION_CONFIG = {
  language: 'es-ES',              // Idioma: Español de España
  continuous: false,              // Solo un comando por sesión
  interimResults: true,           // Muestra transcripción en tiempo real
  maxAlternatives: 3,             // Analiza 3 alternativas de reconocimiento
  silenceTimeout: 2000,           // Timeout de 2 segundos sin hablar
  confidenceThreshold: 0.6        // Confianza mínima del 60%
}
```

## 🔧 Añadir Nuevas Palabras Clave

Para añadir nuevas palabras clave, edita el archivo de configuración:

```typescript
// Ejemplo: Añadir nueva estancia
ROOM_KEYWORDS = {
  'Nueva Estancia': [
    'cocina',
    'kitchen',
    'comedor'
  ]
}
```

## 🌐 Compatibilidad de Navegadores

El sistema de reconocimiento de voz usa la **Web Speech API** y es compatible con:

- ✅ **Google Chrome** (Escritorio y Móvil)
- ✅ **Microsoft Edge** (Chromium)
- ✅ **Opera**
- ✅ **Safari** (iOS 14.5+)
- ❌ Firefox (No soportado actualmente)

**Nota**: Se requiere **conexión a Internet** para el reconocimiento de voz, ya que el procesamiento se realiza en servidores de Google.

## 🔒 Permisos

La primera vez que uses el sistema, el navegador solicitará permiso para acceder al micrófono. Debes **permitir** el acceso para que funcione el reconocimiento de voz.

## 🐛 Solución de Problemas

### El botón no aparece
- Verifica que estás usando un navegador compatible
- Revisa la consola del navegador (F12) para ver errores

### "Tu navegador no soporta reconocimiento de voz"
- Usa Google Chrome o Microsoft Edge
- Actualiza tu navegador a la última versión

### "Permiso de micrófono denegado"
- Ve a la configuración del navegador
- Busca "Permisos del sitio"
- Permite el acceso al micrófono para esta aplicación

### "No se detectó voz"
- Verifica que tu micrófono esté funcionando
- Habla más cerca del micrófono
- Reduce el ruido de fondo

### El comando no se reconoce
- Habla de forma clara y pausada
- Usa las palabras clave exactas de este documento
- Verifica que el nivel de confianza sea >60%

### El comando se reconoce pero no se ejecuta
- Verifica que el dispositivo exista en el sistema
- Comprueba la conexión con el API
- Revisa la consola del navegador para ver errores

## 📱 Uso en Dispositivos Móviles

El sistema funciona perfectamente en dispositivos móviles:

1. **Abre la aplicación** en Chrome o Safari (iOS 14.5+)
2. **Pulsa el botón de voz** (esquina inferior derecha)
3. **Permite el acceso al micrófono** cuando se solicite
4. **Habla tu comando**

**Tip**: En dispositivos móviles, mantén el teléfono cerca de tu boca para mejor reconocimiento.

## 🎯 Tips para Mejor Reconocimiento

1. **Habla claramente** y a velocidad normal
2. **Reduce el ruido de fondo** (TV, música, conversaciones)
3. **Usa las palabras clave exactas** de este documento
4. **Espera** a que el botón cambie a "Escuchando..." antes de hablar
5. **Di el comando completo** en una sola frase
6. **No grites** ni hables muy bajo
7. **Revisa el panel de feedback** para ver qué se reconoció

## 📊 Arquitectura del Sistema

### Componentes Principales

1. **VoiceButtonComponent** (`src/app/components/voice-button/`)
   - Botón flotante con icono de volumen
   - Muestra feedback visual en tiempo real
   - Gestiona la interfaz de usuario

2. **VoiceRecognitionService** (`src/app/services/voice-recognition.service.ts`)
   - Inicializa Web Speech API
   - Procesa comandos de voz
   - Emite eventos para ejecutar acciones

3. **VoiceCommandsConfig** (`src/app/config/voice-commands.config.ts`)
   - Define todas las palabras clave
   - Configura parámetros de reconocimiento
   - Mapea dispositivos

### Flujo de Ejecución

```
1. Usuario pulsa botón de voz
2. Se inicia Web Speech API
3. Usuario habla el comando
4. API transcribe voz a texto
5. Servicio parsea el comando
6. Se identifican: acción, elemento, estancia
7. Se buscan dispositivos que coincidan
8. Se emite evento con dispositivos y acción
9. Componente ejecuta comando en cada dispositivo
10. Se muestra feedback de éxito/error
```

## 🔐 Seguridad y Privacidad

- ✅ El audio NO se graba ni se almacena
- ✅ El procesamiento de voz se realiza mediante Web Speech API de Google
- ✅ Solo se envían fragmentos de audio temporales para transcripción
- ✅ No se comparte información con terceros
- ✅ El micrófono solo se activa cuando pulsas el botón

## 📄 Licencia

Este sistema es parte de la aplicación de Control de Persianas.

---

**¿Preguntas o problemas?** Consulta la consola del navegador (F12) para ver logs detallados del sistema de reconocimiento de voz.
