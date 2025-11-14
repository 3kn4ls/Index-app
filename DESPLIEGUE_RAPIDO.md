# Guía de Despliegue Rápido - Index App

## 🚀 Flujo de Trabajo Recomendado

### Después de Hacer Cambios en Git

```bash
# 1. Haz tus cambios en el código
# 2. Actualiza la aplicación en k3s
./deploy.sh update
```

¡Eso es todo! El script se encargará de:
- ✅ Construir la nueva imagen Docker
- ✅ Importarla a k3s
- ✅ Reiniciar los pods con la nueva versión
- ✅ Esperar a que estén listos

---

## 📋 Comandos Disponibles

### `./deploy.sh update` (⭐ MÁS USADO)
**Usa este comando después de hacer cambios en el código**

Actualiza la aplicación desplegada con tus últimos cambios.

```bash
./deploy.sh update
```

---

### `./deploy.sh status`
**Ver el estado actual de la aplicación**

```bash
./deploy.sh status
```

Muestra:
- Estado de los pods
- Información del servicio
- Configuración del ingress

---

### `./deploy.sh logs`
**Ver logs en tiempo real**

```bash
./deploy.sh logs
```

Útil para:
- Depurar problemas
- Ver requests HTTP
- Monitorear la aplicación

Presiona `Ctrl+C` para salir.

---

### `./deploy.sh all`
**Despliegue completo (solo primera vez)**

```bash
./deploy.sh all
```

Usa este comando solo la primera vez o si eliminaste completamente la aplicación.

---

### `./deploy.sh cleanup`
**Eliminar la aplicación de k3s**

```bash
./deploy.sh cleanup
```

⚠️ Esto eliminará todos los recursos de k3s (deployment, service, ingress).

---

## 🔄 Flujo Completo de Desarrollo

### 1. Hacer Cambios en el Código

```bash
# Editar archivos
nano src/app/app.ts
nano public/assets/data/apps.json
# etc...
```

### 2. (Opcional) Commit en Git

```bash
git add .
git commit -m "feat: descripción de los cambios"
git push
```

### 3. Desplegar Cambios

```bash
./deploy.sh update
```

### 4. Verificar en el Navegador

- URL: `https://mc-s3rv3r.ddns.net/apps/`
- Limpia caché: `Ctrl + Shift + R` (Chrome/Edge) o `Cmd + Shift + R` (Mac)

---

## 🛠️ Comandos Útiles de Kubernetes

### Ver pods en ejecución
```bash
sudo kubectl get pods -l app=index-app
```

### Ver logs de un pod específico
```bash
sudo kubectl logs <nombre-del-pod>
```

### Ver detalles de un pod
```bash
sudo kubectl describe pod <nombre-del-pod>
```

### Entrar a un pod (debug)
```bash
sudo kubectl exec -it deployment/index-app -- /bin/sh
```

### Ver todos los recursos de la app
```bash
sudo kubectl get all -l app=index-app
```

### Escalar réplicas
```bash
# Aumentar a 3 réplicas
sudo kubectl scale deployment index-app --replicas=3

# Reducir a 1 réplica
sudo kubectl scale deployment index-app --replicas=1
```

### Reiniciar pods manualmente
```bash
sudo kubectl rollout restart deployment index-app
```

### Ver historial de despliegues
```bash
sudo kubectl rollout history deployment index-app
```

---

## 📝 Personalizar las Aplicaciones

Para modificar las aplicaciones que se muestran:

1. **Edita el archivo JSON**
   ```bash
   nano public/assets/data/apps.json
   ```

2. **Agrega/modifica aplicaciones**
   ```json
   {
     "code": "013",
     "name": "Mi App",
     "url": "https://miapp.com",
     "logo": "assets/images/miapp.svg",
     "description": "Descripción de mi app",
     "category": "Mi Categoría"
   }
   ```

3. **(Opcional) Agrega logos personalizados**
   - Coloca archivos SVG en `public/assets/images/`

4. **Despliega los cambios**
   ```bash
   ./deploy.sh update
   ```

---

## 🔍 Troubleshooting

### Los cambios no se ven en el navegador
1. Limpia la caché: `Ctrl + Shift + R`
2. Verifica que los pods se actualizaron: `./deploy.sh status`
3. Revisa los logs: `./deploy.sh logs`

### Error al construir la imagen
```bash
# Verifica que Docker esté corriendo
docker ps

# Limpia imágenes antiguas
docker system prune -a
```

### Pods no inician
```bash
# Ver detalles del error
sudo kubectl describe pod -l app=index-app

# Ver logs del pod
sudo kubectl logs -l app=index-app --previous
```

### No puedo acceder a la aplicación
1. Verifica que el ingress esté configurado:
   ```bash
   sudo kubectl get ingress index-app
   ```

2. Verifica conectividad interna:
   ```bash
   sudo kubectl run curl-test --image=curlimages/curl -i --rm --restart=Never -- curl -I http://index-app/apps/
   ```

---

## 📊 Información de Recursos

### Recursos Asignados por Pod
- **CPU Request**: 50m (0.05 cores)
- **CPU Limit**: 200m (0.2 cores)
- **Memory Request**: 64Mi
- **Memory Limit**: 128Mi

### Réplicas Actuales
- **Pods**: 2 réplicas (alta disponibilidad)

Para modificar estos valores, edita `k8s/deployment.yaml` y ejecuta `./deploy.sh update`.

---

## 🌐 Acceso a la Aplicación

- **URL**: https://mc-s3rv3r.ddns.net/apps/
- **HTTP**: ✅ Soportado
- **HTTPS**: ✅ Soportado

---

## 💡 Consejos

1. **Usa `./deploy.sh update`** para todos tus despliegues después del inicial
2. **Monitorea con `./deploy.sh logs`** cuando hagas cambios importantes
3. **Verifica el estado con `./deploy.sh status`** si algo no funciona
4. **Limpia la caché del navegador** después de cada update
5. **Mantén 2 réplicas** para alta disponibilidad

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs: `./deploy.sh logs`
2. Verifica el estado: `./deploy.sh status`
3. Consulta la [Guía Completa de Despliegue](DEPLOYMENT_GUIDE.md)

---

**¡Listo para desarrollar!** 🎉

Recuerda: después de cada cambio, simplemente ejecuta `./deploy.sh update`
