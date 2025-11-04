# Guía de Despliegue - Control de Persianas PWA

## 🚀 Despliegue Automático en Vercel con GitHub

### Paso 1: Subir el Código a GitHub

Si aún no has subido tu código a GitHub:

```bash
# Asegúrate de estar en la rama correcta
git branch

# Push tu código
git push origin main
```

### Paso 2: Conectar GitHub con Vercel

1. **Ve a [vercel.com](https://vercel.com)** y crea una cuenta o inicia sesión

2. **Haz clic en "Add New Project"**

3. **Importa tu repositorio de GitHub:**
   - Autoriza a Vercel para acceder a tus repositorios
   - Selecciona el repositorio de la aplicación
   - Haz clic en "Import"

4. **Configura el proyecto:**
   - **Framework Preset:** Vercel detectará automáticamente Angular
   - **Build Command:** `npm run build` (ya configurado en package.json)
   - **Output Directory:** `dist/blinds-control-app/browser`
   - **Install Command:** `npm install`

### Paso 3: Configurar Variables de Entorno

⚠️ **IMPORTANTE:** La app requiere la variable `API_URL` para funcionar con tu hardware IoT.

1. **En el panel de Vercel, ve a "Environment Variables"**

2. **Agrega las siguientes variables:**

   | Variable | Valor | Descripción |
   |----------|-------|-------------|
   | `API_URL` | `https://tu-api.com` | URL de tu API IoT (sin barra final) |

   **Ejemplo:**
   ```
   API_URL = https://iot.midominio.com
   ```

3. **Selecciona los entornos:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Guarda los cambios**

### Paso 4: Deploy

1. **Haz clic en "Deploy"**

2. **Vercel construirá y desplegará tu app automáticamente**
   - El proceso toma 2-3 minutos
   - Verás los logs en tiempo real

3. **Una vez completado, obtendrás:**
   - 🌐 URL de producción: `https://tu-app.vercel.app`
   - 📱 URL lista para instalar como PWA en Android

## 🔄 Despliegue Automático Continuo

Una vez conectado con GitHub, Vercel desplegará automáticamente:

### ✅ Cada Push a Main/Master
- **Producción:** Despliega a la URL principal
- **Automático:** Sin intervención manual
- **Build:** Ejecuta tests y build
- **Rollback:** Fácil reversión si hay errores

### ✅ Cada Pull Request
- **Preview:** Crea una URL única para cada PR
- **Testing:** Prueba cambios antes de mergear
- **Comentarios:** Vercel comenta en el PR con la URL de preview

### ✅ Cada Commit en Otras Ramas
- **Preview Deployment:** URL única por commit
- **Testing:** Ideal para feature branches

## 📊 Flujo de Trabajo Automático

```
┌──────────────┐
│  Git Push    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Vercel     │ ← Detecta cambio automáticamente
│   Trigger    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Install Deps │ npm install
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Set Env Vars │ scripts/set-env.js
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Build     │ ng build --production
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Deploy    │ ✅ Live en segundos
└──────────────┘
```

## 🔧 Configuración de la API

### Formato de Endpoints

La aplicación espera que tu API siga este formato:

```
${API_URL}/api/devices/${deviceId}/command/${command}
```

### Comandos Disponibles

| Comando | Endpoint Ejemplo | Descripción |
|---------|-----------------|-------------|
| `on` | `POST /api/devices/DOOR_001/command/on` | Sube la persiana (abre) |
| `off` | `POST /api/devices/DOOR_001/command/off` | Baja la persiana (cierra) |
| `stop` | `POST /api/devices/DOOR_001/command/stop` | Detiene el movimiento |

### Ejemplo de Llamada API

```bash
# Subir persiana
curl -X POST https://tu-api.com/api/devices/DOOR_001/command/on

# Bajar persiana
curl -X POST https://tu-api.com/api/devices/DOOR_001/command/off

# Detener persiana
curl -X POST https://tu-api.com/api/devices/DOOR_001/command/stop
```

### Respuesta Esperada (Opcional)

La API puede retornar cualquier respuesta. La app no depende del contenido de la respuesta, solo del código de estado HTTP:

- **200-299:** Comando ejecutado exitosamente
- **400-599:** Error (se muestra en consola pero no afecta la UI)

## 🔍 Modo Simulación vs Modo API

### Modo Simulación
- Se activa cuando `API_URL` **NO** está configurada
- Muestra advertencias en consola
- Simula movimiento localmente
- Ideal para desarrollo y demos

### Modo API
- Se activa cuando `API_URL` **SÍ** está configurada
- Envía comandos reales a tu hardware IoT
- Mantiene simulación visual para mejor UX
- Logs detallados de cada llamada

## 🎯 Verificar la Configuración

Una vez desplegada, verifica en la consola del navegador:

### Si API_URL está configurada:
```
✅ API configurada: https://tu-api.com
📤 Subiendo persiana: DOOR_001
🌐 Llamando API: https://tu-api.com/api/devices/DOOR_001/command/on
📥 Respuesta API: {...}
✅ Comando 'on' enviado exitosamente a DOOR_001
```

### Si API_URL NO está configurada:
```
⚠️ API_URL no configurada. Ejecutando en modo simulación.
📝 Configura API_URL en Vercel para usar la API real.
📤 Subiendo persiana: DOOR_001
```

## 🔄 Actualizar Variables de Entorno

Para cambiar la API_URL después del despliegue:

1. **Ve a tu proyecto en Vercel**
2. **Settings → Environment Variables**
3. **Edita el valor de `API_URL`**
4. **Redeploy:**
   - Opción 1: Haz un nuevo push a GitHub
   - Opción 2: En Vercel → Deployments → Redeploy

## 🌿 Branches y Entornos

### Producción (main/master)
```bash
git push origin main
# → Despliega a: https://tu-app.vercel.app
```

### Preview (otras ramas)
```bash
git checkout -b feature/nueva-funcionalidad
git push origin feature/nueva-funcionalidad
# → Despliega a: https://tu-app-xyz123.vercel.app
```

### Testing Local
```bash
# Configura API_URL local
export API_URL=http://localhost:3000

# O edita src/environments/environment.ts
npm start
```

## 📱 Instalar PWA después del Despliegue

1. **Abre la URL en Chrome Android**
   - Ejemplo: `https://tu-app.vercel.app`

2. **Instala la aplicación:**
   - Chrome mostrará banner "Agregar a la pantalla de inicio"
   - O menú (⋮) → "Instalar aplicación"

3. **Disfruta:**
   - App instalada sin barra del navegador
   - Funciona offline
   - Icono en pantalla de inicio

## 🔐 Variables de Entorno Adicionales (Opcional)

Si necesitas más configuración:

| Variable | Ejemplo | Uso |
|----------|---------|-----|
| `API_KEY` | `abc123...` | Autenticación con la API |
| `DEVICE_TIMEOUT` | `5000` | Timeout en ms para comandos |

Luego actualiza `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: '__API_URL__',
  apiKey: '__API_KEY__',
  deviceTimeout: Number('__DEVICE_TIMEOUT__') || 5000
};
```

Y actualiza `scripts/set-env.js` para reemplazar los nuevos placeholders.

## 🐛 Troubleshooting

### El deploy falla

**Problema:** Build error en Vercel

**Solución:**
```bash
# Prueba el build localmente primero
npm run build

# Si funciona local pero falla en Vercel:
# 1. Verifica que las variables de entorno estén configuradas
# 2. Revisa los logs de Vercel
# 3. Asegúrate de que package.json tiene todas las dependencias
```

### La API no se llama

**Problema:** Modo simulación activado

**Solución:**
1. Verifica que `API_URL` esté configurada en Vercel
2. Redespliega después de agregar la variable
3. Limpia cache del navegador
4. Revisa consola del navegador

### CORS errors

**Problema:** `Access-Control-Allow-Origin` error

**Solución:**
Tu API debe incluir headers CORS:

```javascript
// En tu backend
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

## 📞 Soporte

- **Logs de Build:** Vercel Dashboard → Deployments → [Tu deploy] → Logs
- **Logs de Runtime:** Consola del navegador (F12)
- **Rollback:** Vercel Dashboard → Deployments → [Deploy anterior] → Promote to Production

---

¡Tu app está lista para desplegarse automáticamente! 🎉
