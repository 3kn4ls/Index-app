# 🔧 Configuración de API - Guía Rápida

## ⚠️ Problema: Solo veo logs, no se llaman los endpoints

Si al usar la app solo ves logs en consola pero no se hacen llamadas HTTP reales, es porque estás en **modo simulación**.

## ✅ Solución: Configurar API_URL

### Opción 1: Desarrollo Local

1. **Crea un archivo `.env` en la raíz del proyecto:**
   ```bash
   cp .env.example .env
   ```

2. **Edita `.env` y configura tu API_URL:**
   ```bash
   API_URL=http://localhost:3000
   # O tu URL de API real
   # API_URL=https://tu-api-iot.com
   ```

3. **Ejecuta el build:**
   ```bash
   npm run build
   ```

4. **O para desarrollo, edita directamente** `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000' // Tu URL local
   };
   ```

### Opción 2: Producción en Vercel

1. **Ve a tu proyecto en [vercel.com](https://vercel.com)**

2. **Settings → Environment Variables**

3. **Agrega:**
   - Variable: `API_URL`
   - Value: `https://tu-api-iot.com`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

4. **Redeploy o push para activar**

## 🔍 Verificar Configuración

Abre la consola del navegador (F12) y busca estos mensajes:

### ✅ Modo API Activo (Correcto)
```
✅ API configurada: https://tu-api-iot.com
📤 Subiendo persiana: DOOR_001
🌐 Llamando API: https://tu-api-iot.com/api/devices/DOOR_001/command/on
📥 Respuesta API: {...}
✅ Comando 'on' enviado exitosamente a DOOR_001
```

### ⚠️ Modo Simulación (Sin API_URL)
```
⚠️ API_URL no configurada. Ejecutando en modo simulación.
📝 Configura API_URL en Vercel para usar la API real.
📤 Subiendo persiana: DOOR_001
```

## 🎯 Formato de Endpoints

La app hace llamadas POST a estos endpoints:

```
POST ${API_URL}/api/devices/${deviceId}/command/on
POST ${API_URL}/api/devices/${deviceId}/command/off
POST ${API_URL}/api/devices/${deviceId}/command/stop
```

**Ejemplos reales:**
```bash
# Subir persiana
curl -X POST https://tu-api.com/api/devices/DOOR_001/command/on

# Bajar persiana
curl -X POST https://tu-api.com/api/devices/DOOR_001/command/off

# Detener
curl -X POST https://tu-api.com/api/devices/DOOR_001/command/stop
```

## 🐛 Troubleshooting

### Problema: Veo "⚠️ API_URL no configurada"

**Solución:** Configura API_URL según las instrucciones arriba.

### Problema: Veo llamadas pero error de CORS

**Solución:** Tu API debe incluir headers CORS:
```javascript
// En tu backend
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

### Problema: Veo llamadas pero error 404

**Solución:** Verifica que tu API esté corriendo y que las rutas coincidan:
- `${API_URL}/api/devices/${deviceId}/command/on`
- `${API_URL}/api/devices/${deviceId}/command/off`
- `${API_URL}/api/devices/${deviceId}/command/stop`

### Problema: Error de red o timeout

**Solución:**
1. Verifica que tu API esté accesible desde internet (si está en Vercel)
2. Verifica que la URL no tenga barra final: `https://api.com` ✅ vs `https://api.com/` ❌
3. Revisa los logs de tu API para ver si recibe las peticiones

## 🔄 Flujo Completo

```
Usuario hace clic → Angular → HTTP POST → Tu API → Hardware IoT
                          ↓
                    [Simulación visual local para UX]
```

La simulación visual es solo para mejorar la experiencia de usuario. Las llamadas HTTP son reales y se hacen en paralelo.

## 📞 Verificar en Red

Abre DevTools (F12) → Network → XHR

Deberías ver peticiones POST a:
```
https://tu-api.com/api/devices/DOOR_001/command/on
https://tu-api.com/api/devices/DOOR_001/command/off
https://tu-api.com/api/devices/DOOR_001/command/stop
```

Si NO ves estas peticiones, entonces API_URL no está configurada.

---

¿Necesitas ayuda? Revisa la consola del navegador y busca los mensajes de warning o error.
