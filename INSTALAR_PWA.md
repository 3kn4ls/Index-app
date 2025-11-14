# Guía de Instalación de Index App como PWA

Index App ahora es una **Progressive Web App (PWA)** totalmente funcional que puedes instalar en Windows, Android, iOS y cualquier dispositivo con un navegador moderno.

## 🎯 Beneficios de Instalar como PWA

- ✅ **Acceso directo desde el escritorio** o pantalla de inicio
- ✅ **Funciona sin conexión** (caché inteligente)
- ✅ **Actualizaciones automáticas** cuando hay nuevas versiones
- ✅ **Experiencia de aplicación nativa**
- ✅ **No ocupa espacio en la tienda de apps**
- ✅ **Funciona en pantalla completa** (sin barra del navegador)

---

## 📱 Instalación en Android

### Opción 1: Chrome / Edge

1. Abre **Chrome** o **Edge** en tu Android
2. Navega a: `https://mc-s3rv3r.ddns.net/apps/`
3. Toca el menú **⋮** (tres puntos) en la esquina superior derecha
4. Selecciona **"Agregar a pantalla de inicio"** o **"Instalar app"**
5. Confirma tocando **"Instalar"** o **"Agregar"**

### Opción 2: Desde el Banner

Si el navegador lo soporta, verás un banner en la parte inferior:

- Toca **"Instalar"** cuando aparezca el mensaje
- La app se agregará automáticamente a tu pantalla de inicio

### Resultado

- 📱 Icono de "Index App" aparecerá en tu pantalla de inicio
- 🎨 Se abrirá como una app independiente (sin barra del navegador)
- 🔄 Se actualizará automáticamente cuando haya cambios

---

## 💻 Instalación en Windows

### Chrome

1. Abre **Chrome** en tu PC
2. Navega a: `https://mc-s3rv3r.ddns.net/apps/`
3. Busca el icono **⊕** (más) o **💾** (instalar) en la barra de direcciones
4. Haz clic en **"Instalar Index App"**
5. Confirma haciendo clic en **"Instalar"**

### Edge

1. Abre **Microsoft Edge**
2. Navega a: `https://mc-s3rv3r.ddns.net/apps/`
3. Haz clic en **⋮** (tres puntos) en la esquina superior derecha
4. Selecciona **"Aplicaciones" → "Instalar Index App"**
5. Confirma la instalación

### Resultado

- 🖥️ Acceso directo en el **Menú Inicio** de Windows
- 🖥️ Icono en el **Escritorio** (opcional)
- 🪟 Se abre en una ventana independiente
- ⚡ Inicia más rápido que un sitio web normal

---

## 🍎 Instalación en iOS (iPhone/iPad)

### Safari (Requerido)

1. Abre **Safari** en tu iPhone o iPad
2. Navega a: `https://mc-s3rv3r.ddns.net/apps/`
3. Toca el botón **Compartir** 📤 (cuadrado con flecha hacia arriba)
4. Desplázate hacia abajo y toca **"Agregar a pantalla de inicio"**
5. (Opcional) Edita el nombre a "Index App"
6. Toca **"Agregar"**

### Resultado

- 📱 Icono de "Index App" en tu pantalla de inicio
- 🎨 Se abrirá en modo pantalla completa
- 📶 Funciona sin conexión después de la primera carga

---

## 🖥️ Instalación en macOS

### Safari

1. Abre **Safari**
2. Navega a: `https://mc-s3rv3r.ddns.net/apps/`
3. Ve a **Archivo → Agregar al Dock**

### Chrome / Edge

Similar a Windows:
1. Abre Chrome o Edge
2. Navega a: `https://mc-s3rv3r.ddns.net/apps/`
3. Haz clic en el icono de instalar en la barra de direcciones
4. Confirma la instalación

---

## 🔍 Verificar que la PWA está Funcionando

### Señales de que está correctamente instalada:

1. **Icono personalizado**: Logo con cuadrícula azul 3x3
2. **Pantalla de carga**: Fondo blanco con el icono
3. **Sin barra del navegador**: Experiencia de app nativa
4. **Service Worker activo**: Abre DevTools (F12) → Console:
   ```
   ✅ Service Worker registrado: /apps/
   ```

### Funcionalidad Offline

Para probar que funciona sin conexión:

1. Abre la app instalada
2. Navega por las aplicaciones
3. Activa el **Modo Avión** o desconecta WiFi
4. Vuelve a abrir la app
5. ✅ Debería cargar desde la caché

---

## 🎨 Personalización del Icono

El icono de la PWA es:
- **Forma**: Círculo con gradiente azul
- **Diseño**: Cuadrícula 3x3 representando apps
- **Colores**: Azul (#007AFF) - estilo iOS/moderno

### Tamaños de Icono Generados

- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512
- favicon.ico para navegadores

---

## 🔧 Troubleshooting

### "No aparece el botón de instalar"

**Posibles causas:**

1. **HTTPS requerido**: Verifica que estés usando `https://`
2. **Navegador no compatible**: Usa Chrome, Edge o Safari
3. **Ya está instalada**: Revisa si ya la instalaste antes

**Solución:**
- Asegúrate de acceder con HTTPS
- Intenta en modo incógnito primero
- Limpia caché del navegador

### "No funciona offline"

**Solución:**

1. Abre la app al menos una vez con internet
2. Navega por varias secciones para que se cacheen
3. Espera a que el Service Worker se registre (ver console)
4. Después debería funcionar offline

### "El icono no se ve bien"

**En Android:**

Algunos launchers pueden necesitar reinicio. Intenta:
1. Reiniciar el launcher
2. Desinstalar y reinstalar la PWA

**En Windows:**

El icono puede tardar unos segundos en aparecer correctamente.

---

## 📝 Actualizar la PWA

La PWA se actualiza automáticamente cuando:

1. Hay una nueva versión desplegada
2. Abres la app con conexión a internet
3. El Service Worker detecta cambios

### Forzar Actualización Manual

Si quieres asegurarte de tener la última versión:

**En la PWA instalada:**
1. Abre DevTools (F12)
2. Ve a **Application** → **Service Workers**
3. Haz clic en **"Update"** o **"Unregister"**
4. Recarga la página (Ctrl+R)

**O simplemente:**
- Cierra completamente la app
- Vuélvela a abrir
- Se actualizará automáticamente

---

## 🗑️ Desinstalar la PWA

### Android

1. Mantén presionado el icono de "Index App"
2. Selecciona **"Desinstalar"** o arrastra a la papelera
3. Confirma

### Windows

**Método 1:**
1. Abre **Configuración** → **Aplicaciones**
2. Busca "Index App"
3. Haz clic en **"Desinstalar"**

**Método 2:**
1. Busca "Index App" en el Menú Inicio
2. Clic derecho → **"Desinstalar"**

### iOS

1. Mantén presionado el icono
2. Toca el **"X"** o **"Eliminar app"**
3. Confirma

### macOS

1. Arrastra el icono del Dock a la papelera
2. O borra desde **Aplicaciones**

---

## 🚀 Características Técnicas

### Service Worker

- **Estrategia**: Network First con fallback a Cache
- **Scope**: `/apps/`
- **Caché**: Archivos principales (HTML, JS, CSS, JSON)
- **Actualización**: Automática en segundo plano

### Manifest

- **Nombre**: Index App - Portal de Aplicaciones
- **Display**: Standalone (pantalla completa)
- **Theme Color**: #007AFF (azul iOS)
- **Orientación**: Any (adaptable)

### Compatibilidad

| Plataforma | Navegador | Soporte |
|------------|-----------|---------|
| Android | Chrome | ✅ Completo |
| Android | Edge | ✅ Completo |
| Android | Firefox | ✅ Completo |
| Android | Samsung Internet | ✅ Completo |
| iOS | Safari | ✅ Completo |
| Windows | Chrome | ✅ Completo |
| Windows | Edge | ✅ Completo |
| macOS | Safari | ✅ Completo |
| macOS | Chrome | ✅ Completo |
| Linux | Chrome/Firefox | ✅ Completo |

---

## 💡 Consejos

1. **Instala en todos tus dispositivos**: La PWA se sincroniza automáticamente
2. **Agrega a favoritos**: Si no quieres instalar, agrégala a favoritos
3. **Comparte**: Puedes compartir el enlace y otros podrán instalarla
4. **Offline First**: Después de instalar, funciona incluso sin internet

---

## 📞 Soporte

Si tienes problemas con la instalación:

1. Verifica que estés usando HTTPS
2. Limpia caché del navegador
3. Intenta en modo incógnito
4. Actualiza tu navegador a la última versión
5. Consulta los logs en DevTools (F12) → Console

---

## ✨ ¡Disfruta de Index App como PWA!

Tu portal de aplicaciones ahora está disponible como una app nativa en todos tus dispositivos.

**URL**: https://mc-s3rv3r.ddns.net/apps/
