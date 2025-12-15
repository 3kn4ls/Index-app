# Setup de GitHub Actions para Index-app

Este documento explica cómo configurar GitHub Actions + GHCR + ArgoCD para despliegues automáticos.

## Cambios Realizados

### 1. GitHub Actions Workflow
- **Archivo**: `.github/workflows/release.yml`
- **Trigger**: Push a `main` cuando cambian `VERSION`, `k8s/**` o código fuente
- **Acciones**:
  - Build multi-arch (amd64 + arm64)
  - Push a GitHub Container Registry (GHCR)
  - Trigger sync de ArgoCD (opcional)

### 2. Deployment actualizado
- **Archivo**: `k8s/deployment.yaml`
- **Cambio**: `image: ghcr.io/3kn4ls/index-app:v1.0.1`
- **Pull Policy**: `Always` (para detectar nuevas versiones)

### 3. Release Script simplificado
- **Archivo**: `release.sh`
- **Ya NO hace**:
  - ❌ Build de Docker localmente
  - ❌ Import a k3s con `ctr`
- **Solo hace**:
  - ✅ Actualizar VERSION
  - ✅ Actualizar deployment.yaml
  - ✅ Commit y push a GitHub
  - ✅ GitHub Actions hace el resto

## Configuración Requerida

### Paso 1: Hacer públicas las GitHub Container Registry images

Las imágenes en GHCR por defecto son privadas. Tienes dos opciones:

#### Opción A: Hacer el paquete público (RECOMENDADO para este caso)

1. Ve a GitHub → https://github.com/3kn4ls?tab=packages
2. Encuentra el paquete `index-app` (después del primer build)
3. Click en el paquete → Package settings
4. Scroll abajo → "Change visibility" → "Public"

**Ventajas**: No requiere configurar imagePullSecrets en K3S

#### Opción B: Mantener privado y configurar imagePullSecret

```bash
# Crear Personal Access Token en GitHub
# Settings → Developer settings → Personal access tokens → Tokens (classic)
# Scope: read:packages

# Crear secret en K3S
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=3kn4ls \
  --docker-password=YOUR_GITHUB_TOKEN \
  --docker-email=your@email.com \
  -n default

# Actualizar deployment.yaml
spec:
  template:
    spec:
      imagePullSecrets:
        - name: ghcr-secret
      containers:
      - name: index-app
        image: ghcr.io/3kn4ls/index-app:v1.0.1
```

### Paso 2: Configurar GitHub Secrets (OPCIONAL - Para Webhook)

Si quieres sincronización instantánea con ArgoCD:

1. **Generar token de ArgoCD**:
```bash
# Opción 1: Desde CLI
kubectl port-forward svc/argocd-server -n argocd 8080:443 &
argocd login localhost:8080
argocd account generate-token --account admin

# Opción 2: Desde la Raspberry Pi directamente
# Obtener password de admin
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Luego crear un token desde la UI de ArgoCD:
# https://northr3nd.duckdns.org/argocd
# Settings → Accounts → admin → Generate New Token
```

2. **Agregar secrets a GitHub**:
   - Ve a: https://github.com/3kn4ls/Index-app/settings/secrets/actions
   - Click "New repository secret"

   Agregar estos dos secrets:

   - **ARGOCD_SERVER**: `https://northr3nd.duckdns.org/argocd`
   - **ARGOCD_TOKEN**: `<token generado en paso 1>`

**NOTA**: Si no configuras estos secrets, ArgoCD sincronizará automáticamente en ~3 minutos (polling), sin el webhook.

### Paso 3: Actualizar aplicación de ArgoCD (Ya está configurado)

La app de ArgoCD ya está configurada para monitorizar el repositorio:

```bash
kubectl get application index-app -n argocd
```

Si no ves la aplicación:

```bash
cd /home/ecanals/ws/argocd
kubectl apply -f index-app.yaml
```

## Flujo de Trabajo Final

### Usuario ejecuta (ÚNICO paso manual):
```bash
cd /home/ecanals/ws/Index-app
./release.sh patch "Fix navigation bug"
```

### Automático (GitHub Actions):
```
1. Commit detectado por GitHub
2. GitHub Actions triggered
3. Build multi-arch (amd64 + arm64) en ~5 min
4. Push a ghcr.io/3kn4ls/index-app:v1.0.2
5. (Opcional) Webhook a ArgoCD → Sync inmediato
6. ArgoCD detecta cambio en deployment.yaml
7. kubectl apply → Pods se actualizan
8. ✅ Deploy completado
```

**Tiempo total**: ~5-6 minutos (totalmente automático)

## Testing del Setup

### Test 1: Verificar que GitHub Actions funciona

1. Hacer un cambio dummy:
```bash
cd /home/ecanals/ws/Index-app
echo "# Test" >> README.md
git add README.md
git commit -m "test: Trigger GitHub Actions"
git push
```

2. Ver en GitHub:
   - https://github.com/3kn4ls/Index-app/actions
   - Debería ver el workflow corriendo

3. Verificar imagen en GHCR:
   - https://github.com/3kn4ls/Index-app/pkgs/container/index-app

### Test 2: Release completo

```bash
cd /home/ecanals/ws/Index-app
./release.sh patch "Test automated deployment"
```

Monitorear:
```bash
# Ver el workflow en GitHub
open https://github.com/3kn4ls/Index-app/actions

# Ver ArgoCD
open https://northr3nd.duckdns.org/argocd

# Ver pods actualizándose
kubectl get pods -l app=index-app -w
```

## Rollback

### Método 1: Desde ArgoCD UI (RECOMENDADO)

1. Ve a https://northr3nd.duckdns.org/argocd
2. Click en "index-app"
3. Click en "History"
4. Selecciona la versión anterior
5. Click "Rollback"

### Método 2: Git Revert

```bash
cd /home/ecanals/ws/Index-app

# Ver historial
git log --oneline | grep "release:"

# Revertir último release
git revert HEAD
git push

# ArgoCD sincronizará automáticamente
```

### Método 3: Manual (cambiar deployment.yaml)

```bash
# Editar deployment.yaml y cambiar la versión
image: ghcr.io/3kn4ls/index-app:v1.0.1  # versión anterior

git add k8s/deployment.yaml
git commit -m "rollback: Revert to v1.0.1"
git push
```

## Ventajas del Nuevo Sistema

✅ **1 solo paso manual**: `./release.sh patch "mensaje"`
✅ **Build rápido**: 5 min en GitHub vs 15 min local
✅ **Multi-arch**: amd64 y arm64 automático
✅ **Versionado**: Cada release tiene su versión
✅ **Rollback fácil**: 1 click en ArgoCD UI
✅ **Auditable**: Todo en Git
✅ **No consume recursos locales**: Build en la nube
✅ **Funciona desde cualquier lugar**: Solo necesitas Git

## Comparación: Antes vs Ahora

### Antes (deploy.sh)
```bash
./deploy.sh update         # ~15 minutos
# Build local en Raspberry Pi (lento)
# Import manual a k3s
# ArgoCD podía revertir cambios
```

### Ahora (release.sh + GitHub Actions)
```bash
./release.sh patch "msg"   # ~6 minutos (automático)
# Build en GitHub (rápido)
# Push a GHCR
# ArgoCD sincroniza automáticamente
# Git es la fuente de verdad
```

## Troubleshooting

### GitHub Actions falla en build

- Ver logs en: https://github.com/3kn4ls/Index-app/actions
- Verificar que el Dockerfile es válido
- Verificar permisos de GHCR (debe ser público o configurar imagePullSecret)

### K3S no puede hacer pull de la imagen

```bash
# Error: ImagePullBackOff

# Solución 1: Hacer la imagen pública en GHCR
# Solución 2: Configurar imagePullSecret (ver arriba)

# Verificar
kubectl describe pod <pod-name>
```

### ArgoCD no detecta cambios

```bash
# Verificar que deployment.yaml cambió
git log -1 --name-only

# Forzar refresh
kubectl patch application index-app -n argocd \
  -p '{"metadata": {"annotations": {"argocd.argoproj.io/refresh": "normal"}}}' \
  --type merge

# O desde UI: Refresh → Hard Refresh
```

### Build es lento en GitHub Actions

- Primera build: ~8-10 min (sin cache)
- Builds subsecuentes: ~4-5 min (con cache)
- Cache se gestiona automáticamente

## Próximos Pasos

Una vez funcione Index-app, replicar a los otros 5 proyectos:

1. ssh-mobile
2. home-manager (blinds-control)
3. gestion-herencia
4. k3s-monitoring
5. mangos-classic (admin-panel)

Ver: `REPLICAR_A_OTROS_PROYECTOS.md`
