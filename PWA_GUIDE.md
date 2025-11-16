# Guía de PWA y Actualizaciones - Index App

## 📱 Configuración PWA Correcta

### Manifest Correcto
- **Archivo**: `public/manifest.json` ✅
- **Scope**: `/apps/`
- **Start URL**: `/apps/`

### Archivos Críticos
```
public/
├── manifest.json          ← Manifest correcto (con scope /apps/)
├── logo.svg              ← Logo profesional
├── icon-*.png            ← Iconos en todos los tamaños
└── favicon.ico           ← Favicon

src/
├── index.html            ← Referencia a manifest.json
└── app/
    ├── app.config.ts     ← Service Worker configurado
    └── services/
        └── update.service.ts ← Detección de actualizaciones

ngsw-config.json          ← Configuración del Service Worker
angular.json              ← baseHref: "/apps/" configurado
```

## 🔄 Sistema de Actualizaciones

### Cómo Funciona

1. **Verificación automática cada 10 segundos**
2. **Detección inmediata al abrir la app**
3. **Notificación visual cuando hay actualización**
4. **Un click para actualizar**

### Logs en Consola

Abre DevTools (F12) → Console para ver:

```
✅ Service Worker habilitado y activo
✓ App actualizada (verificado)
🔄 Nueva versión detectada!
🎉 Nueva versión lista para instalar!
```

## 🛠️ Solución de Problemas de Caché

### Opción 1: Limpiar Caché del Navegador (Usuario Final)

**Chrome/Edge:**
1. F12 → Application → Storage
2. Click en "Clear site data"
3. Recargar (Ctrl+Shift+R)

**Firefox:**
1. F12 → Storage → Service Workers
2. Click "Unregister"
3. Recargar (Ctrl+Shift+R)

**Safari:**
1. Develop → Empty Caches
2. Recargar (Cmd+Shift+R)

### Opción 2: Forzar Actualización del Service Worker

En la consola del navegador:

```javascript
// Desregistrar Service Worker
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
    console.log('✅ Service Worker desregistrado');
  }
});

// Limpiar todos los cachés
caches.keys().then(function(names) {
  for (let name of names) {
    caches.delete(name);
    console.log('✅ Caché eliminado:', name);
  }
});

// Recargar
location.reload(true);
```

### Opción 3: Modo Incógnito (Pruebas)

Abre la app en modo incógnito para probar sin caché:
- Chrome/Edge: Ctrl+Shift+N
- Firefox: Ctrl+Shift+P
- Safari: Cmd+Shift+N

## 🚀 Despliegue de Nueva Versión

### Proceso Recomendado

1. **Hacer cambios en el código**

2. **Commit y push**
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   git push
   ```

3. **Rebuild en Raspberry Pi**
   ```bash
   cd Index-app
   git pull
   ./deploy.sh all
   ```

4. **Verificación**
   - El nuevo build genera un nuevo hash del Service Worker
   - Los usuarios verán la notificación de actualización automáticamente
   - Logs en consola confirmarán la nueva versión

## 📊 Estrategia de Caché Actual

### App Shell (Prefetch)
- `index.html`, CSS, JS → Se cachean inmediatamente
- **updateMode: prefetch** → Se actualizan en background

### Assets (Lazy + Prefetch)
- Imágenes, SVG → Se cachean cuando se usan
- Se actualizan en background

### Data (Freshness)
- `/assets/data/apps.json`
- **strategy: freshness** → Siempre intenta red primero
- **maxAge: 5 minutos** → Caché expira rápido
- **timeout: 5 segundos** → Si la red falla, usa caché

## 🔍 Verificar que PWA Funciona

### Checklist

1. **Service Worker Registrado**
   ```
   F12 → Application → Service Workers
   Debería mostrar: "ngsw-worker.js" - Activated
   ```

2. **Manifest Cargado**
   ```
   F12 → Application → Manifest
   Debería mostrar: manifest.json con scope /apps/
   ```

3. **Instalación Disponible**
   - Chrome: Icono de instalación en barra de URL
   - Mobile: Banner "Agregar a pantalla de inicio"

4. **Actualizaciones Funcionando**
   ```
   Hacer cambio → Deploy → Esperar 10-60 segundos
   Ver notificación de actualización
   ```

## 🐛 Debugging

### Service Worker no se registra

```bash
# Verificar que el build incluye SW
ls dist/index-app/browser/ngsw-worker.js

# Verificar configuración
cat angular.json | grep serviceWorker
# Debe mostrar: "serviceWorker": "ngsw-config.json"
```

### Actualización no aparece

1. **Verificar hash del SW**
   ```
   F12 → Application → Service Workers
   Ver "ngsw.json?ngsw-cache-bust=..."
   El hash debe cambiar con cada build
   ```

2. **Forzar verificación manual**
   ```javascript
   // En consola
   navigator.serviceWorker.ready.then(registration => {
     registration.update();
   });
   ```

3. **Ver logs del UpdateService**
   ```
   F12 → Console
   Buscar: "✅ Service Worker habilitado"
   Cada 10s: "✓ App actualizada"
   ```

### Cache muy persistente

```javascript
// Script de emergencia (pegar en consola)
async function hardReset() {
  // 1. Desregistrar SW
  const registrations = await navigator.serviceWorker.getRegistrations();
  for(let registration of registrations) {
    await registration.unregister();
  }

  // 2. Limpiar cachés
  const names = await caches.keys();
  for(let name of names) {
    await caches.delete(name);
  }

  // 3. Limpiar storage
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    localStorage.clear();
    sessionStorage.clear();
  }

  console.log('✅ Reset completo');

  // 4. Recargar
  location.href = location.href;
}

hardReset();
```

## 📈 Mejores Prácticas

### Despliegue

1. **Siempre rebuilder después de cambios**
2. **Verificar en modo incógnito primero**
3. **Comunicar a usuarios que actualicen**
4. **Monitorear logs de consola**

### Desarrollo

1. **Desarrollo local**: SW deshabilitado (isDevMode())
2. **Testing**: Usar modo incógnito
3. **Production**: SW habilitado automáticamente

### Versioning

Cada build de producción genera:
- Nuevo hash de ngsw.json
- Nueva versión del Service Worker
- Los usuarios reciben notificación automática

## 🎯 Resumen

✅ **Manifest correcto**: `manifest.json` con scope `/apps/`
✅ **Service Worker**: Configurado para actualizaciones cada 10s
✅ **Caché inteligente**: Freshness para datos, prefetch para app
✅ **Notificación automática**: UI elegante cuando hay actualización
✅ **Logs claros**: Emojis y mensajes descriptivos en consola

Si después de seguir esta guía sigues teniendo problemas de caché, usa el "hardReset()" de la sección de debugging.
