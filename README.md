# Control de Persianas - PWA

Aplicación Progressive Web App (PWA) moderna y responsive para controlar persianas motorizadas de puertas y ventanas. Construida con Angular 19 y Material Design.

## Características

- ✅ **PWA Completa**: Instalable en dispositivos Android como una app nativa sin barra de navegación
- ✅ **Responsive**: Diseño adaptativo para móviles, tablets y escritorio
- ✅ **Material Design**: UI moderna y elegante con Angular Material
- ✅ **IndexedDB**: Almacenamiento local persistente de dispositivos
- ✅ **Offline First**: Funciona sin conexión gracias al Service Worker
- ✅ **Control en Tiempo Real**: Interfaz intuitiva para subir/bajar/parar persianas
- ✅ **Gestión de Dispositivos**: Agregar, editar y eliminar dispositivos fácilmente
- ✅ **Dispositivos Predefinidos**: Configuración inicial con dispositivos por defecto

## Tecnologías Utilizadas

- **Angular 19**: Framework frontend
- **Angular Material**: Componentes UI
- **TypeScript**: Lenguaje de programación
- **SCSS**: Estilos avanzados
- **IndexedDB**: Base de datos del navegador
- **PWA (Service Worker)**: Capacidades offline
- **RxJS**: Programación reactiva

## Requisitos Previos

- Node.js 18+ y npm 10+
- Angular CLI 19

## Instalación Local

```bash
# Clonar el repositorio
git clone <tu-repo>
cd blinds-control-app

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start
# o
ng serve

# Abrir en el navegador
# http://localhost:4200
```

## Compilación para Producción

```bash
# Build de producción
npm run build
# o
ng build --configuration production

# Los archivos compilados estarán en dist/blinds-control-app/browser
```

## 🚀 Despliegue Automático con Vercel + GitHub

### Despliegue Rápido en 3 Pasos

1. **Push tu código a GitHub**
   ```bash
   git push origin main
   ```

2. **Conecta con Vercel**
   - Ve a [vercel.com](https://vercel.com) → "New Project"
   - Importa tu repositorio de GitHub
   - **⚠️ IMPORTANTE:** Configura la variable de entorno:
     - `API_URL` = `https://tu-api-iot.com`

3. **Deploy automático**
   - Vercel despliega automáticamente
   - Cada nuevo commit despliega automáticamente
   - ✅ Despliegue continuo configurado

### 🔄 CI/CD Automático

✅ **Cada push a main:** Despliega a producción automáticamente
✅ **Cada Pull Request:** Crea preview deployment
✅ **Rollback fácil:** Un click para volver a versión anterior

📖 **[Ver guía completa de despliegue →](DEPLOYMENT.md)**

### 🔧 Configuración de API

La aplicación se conecta a tu API IoT con este formato:

```
${API_URL}/api/devices/${deviceId}/command/${command}
```

**Comandos disponibles:**
- `on` → Sube la persiana (abre)
- `off` → Baja la persiana (cierra)
- `stop` → Detiene el movimiento

**Ejemplo:**
```bash
POST https://tu-api.com/api/devices/DOOR_001/command/on
POST https://tu-api.com/api/devices/DOOR_001/command/off
POST https://tu-api.com/api/devices/DOOR_001/command/stop
```

### 📋 Variables de Entorno en Vercel

| Variable | Valor de Ejemplo | Descripción |
|----------|------------------|-------------|
| `API_URL` | `https://iot.midominio.com` | URL de tu API IoT (requerido) |

**Sin API_URL:** La app funciona en modo simulación (ideal para demos)

## Otras Opciones de Hosting Gratuito

### Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar
firebase init hosting

# Deploy
firebase deploy
```

**Configuración firebase.json:**
```json
{
  "hosting": {
    "public": "dist/blinds-control-app/browser",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist/blinds-control-app/browser
```

**Configuración netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist/blinds-control-app/browser"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Cloudflare Pages

1. Sube tu código a GitHub
2. Ve a [pages.cloudflare.com](https://pages.cloudflare.com)
3. Conecta tu repositorio
4. Configura:
   - Build command: `npm run build`
   - Build output directory: `dist/blinds-control-app/browser`

## Instalación en Android

### Como PWA Nativa

1. **Abre la aplicación en Chrome (Android)**
   - Navega a la URL de tu app desplegada
   - Ej: `https://tu-app.vercel.app`

2. **Instala la PWA**
   - Chrome mostrará un banner "Agregar a la pantalla de inicio"
   - O toca el menú (⋮) → "Instalar aplicación"

3. **Disfruta de la App**
   - La app se instalará como una aplicación nativa
   - Sin barra de navegación del navegador
   - Icono en la pantalla de inicio
   - Experiencia completa de app móvil

### Características de la PWA Instalada

- ✅ Se abre en pantalla completa (sin barra del navegador)
- ✅ Aparece en el cajón de aplicaciones
- ✅ Funciona offline
- ✅ Notificaciones push (si se implementan)
- ✅ Acceso desde la pantalla de inicio

## Uso de la Aplicación

### Dispositivos Predefinidos

La aplicación viene con 5 dispositivos de ejemplo:
- Puerta Principal Salón (DOOR_001)
- Puerta Terraza (DOOR_002)
- Ventana Dormitorio Principal (WINDOW_001)
- Ventana Cocina (WINDOW_002)
- Ventana Baño (WINDOW_003)

### Agregar Nuevo Dispositivo

1. Toca el botón "+" en la barra superior
2. Completa el formulario:
   - **ID**: Identificador único (ej: DOOR_003)
   - **Descripción**: Nombre descriptivo
   - **Tipo**: PUERTA o VENTANA
3. Toca "Agregar Dispositivo"

### Controlar Persianas

Cada tarjeta de dispositivo incluye:
- **Icono y descripción** del dispositivo
- **Barra de progreso** que muestra la posición (0-100%)
- **Estado actual**: Subiendo, Bajando, o Detenido
- **Tres botones de control**:
  - ⬆️ **Subir**: Abre la persiana
  - ⏹️ **Parar**: Detiene el movimiento
  - ⬇️ **Bajar**: Cierra la persiana

### Personalizar Dispositivos Predefinidos

Edita el archivo `src/app/config/default-devices.config.ts`:

```typescript
export const DEFAULT_DEVICES: Device[] = [
  {
    id: 'TU_ID',
    description: 'Tu Descripción',
    type: DeviceType.PUERTA // o DeviceType.VENTANA
  }
];
```

## 🔌 Integración con Hardware Real

✅ **La integración con API REST ya está implementada**

La aplicación envía comandos HTTP a tu API IoT automáticamente cuando configuras `API_URL`.

### Formato de API Implementado

```typescript
// Subir persiana
POST ${API_URL}/api/devices/${deviceId}/command/on

// Bajar persiana
POST ${API_URL}/api/devices/${deviceId}/command/off

// Detener
POST ${API_URL}/api/devices/${deviceId}/command/stop
```

### Modos de Operación

**🔹 Modo API** (cuando API_URL está configurada)
- Envía comandos reales a tu hardware
- Logs detallados en consola
- Simulación visual para mejor UX
- Fallback a simulación si hay error

**🔹 Modo Simulación** (cuando API_URL NO está configurada)
- Ideal para desarrollo y demos
- No requiere backend
- Advertencias en consola

### Ver Implementación

Revisa `src/app/services/blind-control.service.ts:51-132` para ver el código completo.

### Integración Futura (Opcional)

Si necesitas otros protocolos:

1. **WebSocket**: Control bidireccional en tiempo real
2. **MQTT**: Protocolo IoT ligero para dispositivos
3. **Cloud IoT**: AWS IoT, Google Cloud IoT, Azure IoT
4. **SSE**: Server-Sent Events para updates del servidor

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── blind-control/      # Control individual de persiana
│   │   ├── device-form/         # Formulario agregar dispositivo
│   │   └── device-list/         # Lista de dispositivos
│   ├── config/
│   │   └── default-devices.config.ts  # Dispositivos predefinidos
│   ├── models/
│   │   └── device.model.ts      # Modelos de datos
│   ├── services/
│   │   ├── blind-control.service.ts   # Lógica de control
│   │   └── indexed-db.service.ts      # Almacenamiento local
│   ├── app.component.*          # Componente principal
│   └── app.config.ts            # Configuración de la app
├── public/
│   ├── icons/                   # Iconos PWA
│   └── manifest.webmanifest     # Configuración PWA
└── styles.scss                  # Estilos globales
```

## Soporte de Navegadores

- ✅ Chrome/Edge (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)

## PWA Features Implementadas

- ✅ Service Worker para cache y offline
- ✅ Web App Manifest para instalación
- ✅ Iconos para todas las resoluciones
- ✅ Theme color y splash screen
- ✅ Display standalone (sin navegador)
- ✅ Orientación portrait
- ✅ IndexedDB para persistencia

## Comandos Útiles

```bash
# Desarrollo
npm start                 # Servidor de desarrollo
npm run build            # Build de producción
npm run watch            # Build con auto-recompilación

# PWA
npm run build -- --configuration production  # Build optimizado para PWA
```

## Troubleshooting

### La app no se instala como PWA

- Asegúrate de usar HTTPS (localhost también funciona)
- Verifica que el Service Worker esté registrado
- Comprueba la consola del navegador por errores

### Los dispositivos no se guardan

- Verifica que IndexedDB esté habilitado en el navegador
- Comprueba la consola por errores de permisos
- Intenta limpiar el almacenamiento del sitio

### El diseño no se ve bien en móvil

- Asegúrate de que viewport esté configurado correctamente
- Verifica los media queries en los archivos SCSS
- Comprueba que no haya errores de CSS en la consola

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Autor

Desarrollado con Angular 19 y Material Design

## Soporte

Para reportar bugs o solicitar features, por favor abre un issue en el repositorio.

---

¡Disfruta controlando tus persianas con esta moderna PWA! 🎉
