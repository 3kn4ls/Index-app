# Guía de Compilación y Despliegue - Index App

Esta guía te ayudará a compilar y desplegar la aplicación Index App en tu cluster k3s de Raspberry Pi 5.

## Tabla de Contenidos
- [Requisitos Previos](#requisitos-previos)
- [Arquitectura de la Aplicación](#arquitectura-de-la-aplicación)
- [Opción 1: Despliegue Automatizado](#opción-1-despliegue-automatizado)
- [Opción 2: Despliegue Manual](#opción-2-despliegue-manual)
- [Configuración](#configuración)
- [Verificación](#verificación)
- [Troubleshooting](#troubleshooting)
- [Mantenimiento](#mantenimiento)

---

## Requisitos Previos

### En tu Raspberry Pi 5

1. **Sistema Operativo**: Raspberry Pi OS (64-bit) o Ubuntu Server 22.04 ARM64
2. **k3s instalado y funcionando**
   ```bash
   # Verificar instalación de k3s
   sudo k3s kubectl get nodes
   ```

3. **Docker instalado**
   ```bash
   # Verificar instalación de Docker
   docker --version
   ```

4. **kubectl configurado**
   ```bash
   # Verificar kubectl
   kubectl version
   ```

### Recursos Mínimos Recomendados
- RAM: 2GB disponible
- CPU: 2 cores
- Almacenamiento: 5GB disponible

---

## Arquitectura de la Aplicación

```
┌─────────────────────────────────────────┐
│           Internet/Red Local            │
└─────────────────┬───────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │  Traefik       │  (Ingress Controller de k3s)
         │  Ingress       │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │   Service      │  (ClusterIP)
         │  index-app     │
         └────────┬───────┘
                  │
      ┌───────────┴───────────┐
      │                       │
      ▼                       ▼
┌──────────┐           ┌──────────┐
│   Pod 1  │           │   Pod 2  │  (2 réplicas)
│ Nginx +  │           │ Nginx +  │
│ Angular  │           │ Angular  │
└──────────┘           └──────────┘
```

### Componentes

1. **Aplicación Angular**: Frontend SPA que lee un JSON con las aplicaciones
2. **Nginx**: Servidor web que sirve los archivos estáticos
3. **Docker**: Contenerización de la aplicación
4. **k3s/Kubernetes**: Orquestación de contenedores

---

## Opción 1: Despliegue Automatizado

### Paso 1: Clonar el Repositorio (si aplica)

```bash
# Si ya tienes el código localmente, ve al directorio
cd /path/to/Index-app
```

### Paso 2: Ejecutar el Script de Despliegue

```bash
# Despliegue completo (construcción + importación + despliegue)
./deploy.sh all
```

El script realizará automáticamente:
1. Construcción de la imagen Docker para ARM64
2. Importación de la imagen a k3s
3. Despliegue de los manifiestos de Kubernetes
4. Verificación del estado

### Comandos Adicionales del Script

```bash
# Solo construir la imagen
./deploy.sh build

# Solo desplegar (si la imagen ya existe)
./deploy.sh deploy

# Ver logs de la aplicación
./deploy.sh logs

# Limpiar todos los recursos
./deploy.sh cleanup
```

---

## Opción 2: Despliegue Manual

### Paso 1: Construcción de la Imagen Docker

```bash
# Construir la imagen para ARM64 (arquitectura de Raspberry Pi 5)
docker build --platform linux/arm64 -t index-app:latest .
```

### Paso 2: Importar la Imagen a k3s

```bash
# Exportar la imagen Docker
docker save index-app:latest -o index-app.tar

# Importar a k3s
sudo k3s ctr images import index-app.tar

# Verificar que la imagen está disponible
sudo k3s ctr images list | grep index-app

# Limpiar archivo temporal
rm index-app.tar
```

### Paso 3: Desplegar en Kubernetes

```bash
# Aplicar los manifiestos de Kubernetes
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

### Paso 4: Verificar el Despliegue

```bash
# Ver el estado de los pods
kubectl get pods -l app=index-app

# Ver el servicio
kubectl get svc index-app

# Ver el ingress
kubectl get ingress index-app

# Ver logs en tiempo real
kubectl logs -l app=index-app -f
```

---

## Configuración

### 1. Configurar el Dominio

Necesitas configurar cómo accederás a la aplicación:

#### Opción A: Usando /etc/hosts (Más simple, solo para pruebas locales)

```bash
# En tu máquina local (no en la Raspberry Pi)
# Obtén la IP de tu Raspberry Pi
# Ejemplo: 192.168.1.100

# Edita /etc/hosts (Linux/Mac) o C:\Windows\System32\drivers\etc\hosts (Windows)
sudo nano /etc/hosts

# Agrega esta línea (reemplaza con tu IP)
192.168.1.100  index-app.local
```

#### Opción B: Usando DNS Local o Router

Configura tu router o servidor DNS para resolver `index-app.local` a la IP de tu Raspberry Pi.

### 2. Configurar el Ingress (Opcional)

Si quieres usar un dominio diferente, edita el archivo `k8s/ingress.yaml`:

```yaml
spec:
  rules:
  - host: mi-dominio.ejemplo.com  # Cambiar aquí
    http:
      paths:
      - path: /
```

Luego, vuelve a aplicar:
```bash
kubectl apply -f k8s/ingress.yaml
```

### 3. Personalizar las Aplicaciones

Para modificar las aplicaciones que se muestran, edita el archivo:

```bash
nano public/assets/data/apps.json
```

Formato del JSON:
```json
{
  "apps": [
    {
      "code": "001",
      "name": "Nombre de la App",
      "url": "https://ejemplo.com",
      "logo": "assets/images/logo.svg",
      "description": "Descripción breve",
      "category": "Categoría"
    }
  ]
}
```

Después de modificar, reconstruye y redesplega:
```bash
./deploy.sh all
```

---

## Verificación

### 1. Verificar que los Pods están Corriendo

```bash
kubectl get pods -l app=index-app

# Deberías ver algo como:
# NAME                         READY   STATUS    RESTARTS   AGE
# index-app-xxxxxxxxx-xxxxx    1/1     Running   0          2m
# index-app-xxxxxxxxx-xxxxx    1/1     Running   0          2m
```

### 2. Verificar el Servicio

```bash
kubectl get svc index-app

# Deberías ver:
# NAME        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
# index-app   ClusterIP   10.43.xxx.xxx   <none>        80/TCP    2m
```

### 3. Verificar el Ingress

```bash
kubectl get ingress index-app

# Deberías ver:
# NAME        CLASS     HOSTS              ADDRESS         PORTS   AGE
# index-app   traefik   index-app.local   192.168.1.100   80      2m
```

### 4. Probar desde el Navegador

Abre tu navegador y ve a:
```
http://index-app.local
```

Deberías ver la aplicación con las tarjetas de las aplicaciones.

---

## Troubleshooting

### Los Pods no Inician

```bash
# Ver los eventos del pod
kubectl describe pod -l app=index-app

# Ver logs detallados
kubectl logs -l app=index-app --previous
```

Soluciones comunes:
- Verificar que la imagen se importó correctamente: `sudo k3s ctr images list | grep index-app`
- Verificar recursos disponibles: `kubectl top nodes`

### No Puedo Acceder a la Aplicación

1. **Verificar que k3s Traefik está corriendo**:
   ```bash
   kubectl get pods -n kube-system | grep traefik
   ```

2. **Verificar que el Ingress está configurado**:
   ```bash
   kubectl describe ingress index-app
   ```

3. **Verificar conectividad**:
   ```bash
   # Desde otro pod en el cluster
   kubectl run curl-test --image=curlimages/curl -it --rm -- curl http://index-app
   ```

4. **Verificar /etc/hosts**:
   ```bash
   # En tu máquina local
   ping index-app.local
   ```

### La Aplicación no Muestra las Apps

1. **Verificar que el JSON existe**:
   ```bash
   # Entrar al pod
   kubectl exec -it <pod-name> -- ls -la /usr/share/nginx/html/assets/data/
   ```

2. **Ver logs del navegador**:
   Abre las DevTools (F12) y revisa la consola

3. **Verificar configuración de Nginx**:
   ```bash
   kubectl exec -it <pod-name> -- cat /etc/nginx/nginx.conf
   ```

### Error de Recursos Insuficientes

Si ves errores de `Insufficient memory` o `Insufficient cpu`:

```bash
# Editar deployment para reducir recursos
kubectl edit deployment index-app

# Reducir requests/limits en el spec
resources:
  requests:
    memory: "32Mi"
    cpu: "25m"
  limits:
    memory: "64Mi"
    cpu: "100m"
```

---

## Mantenimiento

### Actualizar la Aplicación

```bash
# 1. Hacer cambios en el código

# 2. Reconstruir y redesplegar
./deploy.sh all

# Alternativamente, hacer rolling update
kubectl rollout restart deployment index-app
```

### Ver Logs

```bash
# Logs en tiempo real
./deploy.sh logs

# O manualmente
kubectl logs -l app=index-app -f --tail=100
```

### Escalar la Aplicación

```bash
# Aumentar a 3 réplicas
kubectl scale deployment index-app --replicas=3

# Reducir a 1 réplica
kubectl scale deployment index-app --replicas=1
```

### Backup del Estado

```bash
# Exportar manifiestos actuales
kubectl get deployment index-app -o yaml > backup-deployment.yaml
kubectl get service index-app -o yaml > backup-service.yaml
kubectl get ingress index-app -o yaml > backup-ingress.yaml
```

### Eliminar la Aplicación

```bash
# Usando el script
./deploy.sh cleanup

# O manualmente
kubectl delete -f k8s/
```

### Monitoreo de Recursos

```bash
# Ver uso de recursos
kubectl top pods -l app=index-app

# Ver eventos
kubectl get events --sort-by='.lastTimestamp' | grep index-app
```

---

## Acceso desde Fuera de la Red Local

### Opción 1: Port Forward de Router

1. Configura port forward en tu router:
   - Puerto externo: 80 (o el que prefieras)
   - Puerto interno: 80
   - IP: IP de tu Raspberry Pi

2. Usa tu IP pública o dominio

### Opción 2: Cloudflare Tunnel (Recomendado)

```bash
# Instalar cloudflared
# Seguir guía: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/

# Crear tunnel
cloudflared tunnel create index-app

# Configurar tunnel para apuntar a index-app.local:80
```

### Opción 3: Tailscale (VPN Mesh)

```bash
# Instalar Tailscale en Raspberry Pi
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up

# Acceder desde cualquier dispositivo con Tailscale usando la IP de Tailscale
```

---

## Comandos Útiles de Referencia

```bash
# Estado general
kubectl get all -l app=index-app

# Describe todos los recursos
kubectl describe deployment index-app
kubectl describe service index-app
kubectl describe ingress index-app

# Shell interactivo en un pod
kubectl exec -it <pod-name> -- /bin/sh

# Ver configuración de k3s
sudo systemctl status k3s

# Reiniciar k3s
sudo systemctl restart k3s

# Ver imágenes en k3s
sudo k3s ctr images list

# Limpiar imágenes no usadas
sudo k3s ctr images prune
```

---

## Estructura del Proyecto

```
Index-app/
├── src/                      # Código fuente Angular
│   ├── app/
│   │   ├── models/          # Modelos de datos
│   │   ├── services/        # Servicios
│   │   ├── app.ts           # Componente principal
│   │   ├── app.html         # Template
│   │   └── app.scss         # Estilos
│   └── ...
├── public/
│   └── assets/
│       ├── data/
│       │   └── apps.json    # Configuración de apps
│       └── images/          # Logos de apps
├── k8s/                     # Manifiestos de Kubernetes
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
├── Dockerfile              # Multi-stage build
├── nginx.conf              # Configuración de Nginx
├── deploy.sh               # Script de despliegue
└── DEPLOYMENT_GUIDE.md     # Esta guía
```

---

## Soporte y Recursos

- **Documentación de k3s**: https://docs.k3s.io
- **Documentación de Angular**: https://angular.dev
- **Documentación de Kubernetes**: https://kubernetes.io/docs
- **Docker para ARM**: https://docs.docker.com/build/building/multi-platform/

---

¡Listo! Tu aplicación Index App debería estar corriendo en tu cluster k3s de Raspberry Pi 5.

Para cualquier problema, revisa la sección de [Troubleshooting](#troubleshooting) o consulta los logs con `./deploy.sh logs`.
