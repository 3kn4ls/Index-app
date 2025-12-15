# Workflow de Release Automático con GitHub Actions + ArgoCD

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                      DESARROLLADOR                               │
│  ./release.sh patch "Fix bug"                                   │
│  (Único paso manual - ~10 segundos)                             │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   │ git push
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                             │
│  • Código fuente (src/)                                         │
│  • Manifiestos K8S (k8s/)                                       │
│  • VERSION file (1.0.1)                                         │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   │ GitHub Actions triggered
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                   GITHUB ACTIONS                                 │
│  1. Build multi-arch (amd64 + arm64)  [~5 min]                 │
│  2. Push to GHCR                       [~30 sec]               │
│  3. Trigger ArgoCD webhook             [instant]               │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌──────────────┐      ┌──────────────┐
│     GHCR     │      │    ARGOCD    │
│  (Registry)  │◄─────│   (GitOps)   │
└──────┬───────┘      └──────┬───────┘
       │                     │
       │ pull image          │ kubectl apply
       │                     │
       └──────────┬──────────┘
                  ▼
         ┌─────────────────┐
         │   K3S CLUSTER   │
         │  • Pull imagen  │
         │  • Update pods  │
         │  • Health check │
         └─────────────────┘
```

## Versionado Semántico

El formato es `MAJOR.MINOR.PATCH`:

| Tipo | Cambio | Comando | Ejemplo |
|------|--------|---------|---------|
| **PATCH** | Bug fixes | `./release.sh patch "Fix login"` | 1.0.0 → 1.0.1 |
| **MINOR** | Nueva feature | `./release.sh minor "Add dark mode"` | 1.0.0 → 1.1.0 |
| **MAJOR** | Breaking change | `./release.sh major "New API"` | 1.0.0 → 2.0.0 |

## Flujo de Trabajo Completo

### 1. Desarrollar código

```bash
cd /home/ecanals/ws/Index-app

# Hacer cambios en src/
vim src/app/components/header/header.component.ts

# (Opcional) Probar localmente
npm install
npm run build
```

### 2. Hacer release (ÚNICO paso manual)

```bash
./release.sh patch "Fix header navigation"
```

**Qué hace el script:**
1. ✅ Incrementa versión: 1.0.1 → 1.0.2
2. ✅ Actualiza `VERSION` file
3. ✅ Actualiza `k8s/deployment.yaml` → `image: ghcr.io/3kn4ls/index-app:v1.0.2`
4. ✅ Hace commit y push a GitHub
5. ✅ FIN (tú ya terminaste)

**Tiempo**: ~10 segundos

### 3. GitHub Actions (Automático)

GitHub detecta el push y ejecuta `.github/workflows/release.yml`:

```yaml
on:
  push:
    branches: [main]
    paths: ['VERSION', 'k8s/**', 'src/**']
```

**Pasos automáticos** (~5-6 minutos):

1. **Checkout** código
2. **Lee VERSION** → 1.0.2
3. **Build multi-arch**:
   ```bash
   docker buildx build --platform linux/amd64,linux/arm64 \
     -t ghcr.io/3kn4ls/index-app:v1.0.2 \
     -t ghcr.io/3kn4ls/index-app:latest \
     --push .
   ```
4. **Push a GHCR** (GitHub Container Registry)
5. **Webhook a ArgoCD** (opcional, si configurado)

**Monitorear**: https://github.com/3kn4ls/Index-app/actions

### 4. ArgoCD (Automático)

ArgoCD detecta cambio en `k8s/deployment.yaml`:

**Opción A: Con webhook** (instantáneo)
- GitHub Actions → webhook → ArgoCD → sync inmediato

**Opción B: Sin webhook** (~3 minutos)
- ArgoCD polling cada 3 min → detecta cambio → sync

**Acciones de ArgoCD**:
1. Compara estado de Git vs cluster
2. Detecta: `image: ghcr.io/3kn4ls/index-app:v1.0.2` (nuevo)
3. Ejecuta `kubectl apply -f k8s/`
4. Monitorea health de pods

**Monitorear**: https://northr3nd.duckdns.org/argocd

### 5. Kubernetes (Automático)

K3S actualiza los pods:

```bash
# Ver actualización en tiempo real
kubectl get pods -l app=index-app -w

# Eventos:
# 1. Terminating (pods viejos)
# 2. ContainerCreating (nuevos pods)
# 3. Running (nuevos pods listos)
# 4. Terminating complete (viejos eliminados)
```

**Rolling update**:
- 2 réplicas configuradas
- Update strategy: RollingUpdate
- maxUnavailable: 1
- Zero downtime

### 6. Verificación

```bash
# Ver versión desplegada
kubectl get deployment index-app -o jsonpath='{.spec.template.spec.containers[0].image}'
# Output: ghcr.io/3kn4ls/index-app:v1.0.2

# Ver pods corriendo
kubectl get pods -l app=index-app

# Ver logs
kubectl logs -l app=index-app --tail=50

# Acceder a la app
open https://mc-s3rv3r.ddns.net/apps/
```

## Ejemplos de Uso

### Ejemplo 1: Corrección de bug

```bash
# 1. Haces el fix en el código
vim src/app/services/auth.service.ts

# 2. Release
./release.sh patch "Fix authentication timeout"

# 3. Esperar ~5-6 minutos
# GitHub Actions build → GHCR → ArgoCD → K8S

# 4. Verificar
curl https://mc-s3rv3r.ddns.net/apps/
```

**Versión**: 1.2.3 → 1.2.4

### Ejemplo 2: Nueva funcionalidad

```bash
# 1. Implementas dark mode
vim src/app/components/theme-switcher/...

# 2. Release
./release.sh minor "Add dark mode toggle"

# 3. Automático en ~6 min
# La app ahora tiene dark mode
```

**Versión**: 1.2.4 → 1.3.0

### Ejemplo 3: Cambio mayor

```bash
# 1. Migras a nueva API
vim src/app/services/api.service.ts

# 2. Release
./release.sh major "Migrate to v2 API"

# 3. Automático
```

**Versión**: 1.3.0 → 2.0.0

## Rollback Fácil

### Opción 1: Desde ArgoCD UI (RECOMENDADO)

1. Ve a https://northr3nd.duckdns.org/argocd
2. Click en aplicación "index-app"
3. Click en tab "History"
4. Selecciona versión anterior
5. Click "Rollback"
6. Confirmar

**Tiempo**: 30 segundos (3 clicks)

### Opción 2: Git Revert

```bash
cd /home/ecanals/ws/Index-app

# Ver historial
git log --oneline | grep "release:"

# Revertir último commit
git revert HEAD
git push

# ArgoCD sincroniza automáticamente
```

**Tiempo**: 1 minuto + sync de ArgoCD

### Opción 3: Editar deployment.yaml

```bash
# Cambiar manualmente la versión
vim k8s/deployment.yaml
# Cambiar: image: ghcr.io/3kn4ls/index-app:v1.0.3
# Por:     image: ghcr.io/3kn4ls/index-app:v1.0.2

git add k8s/deployment.yaml
git commit -m "rollback: Revert to v1.0.2"
git push
```

## Monitoreo del Despliegue

### GitHub Actions

```bash
# Ver workflow corriendo
open https://github.com/3kn4ls/Index-app/actions

# Ver logs en tiempo real desde CLI (requiere gh cli)
gh run watch

# Ver última run
gh run view --log
```

### ArgoCD

```bash
# CLI
kubectl get application index-app -n argocd

# Ver sincronización
kubectl get application index-app -n argocd -o jsonpath='{.status.sync.status}'

# Ver health
kubectl get application index-app -n argocd -o jsonpath='{.status.health.status}'

# UI (recomendado)
open https://northr3nd.duckdns.org/argocd
```

### Kubernetes

```bash
# Ver pods actualizándose
kubectl get pods -l app=index-app -w

# Ver eventos del deployment
kubectl describe deployment index-app

# Ver rollout status
kubectl rollout status deployment index-app

# Ver historial de rollouts
kubectl rollout history deployment index-app
```

## Ver Versión Actual

```bash
# Versión en VERSION file
cat VERSION

# Versión desplegada en K8S
kubectl get deployment index-app -o jsonpath='{.spec.template.spec.containers[0].image}'

# Versión en ArgoCD
kubectl get application index-app -n argocd -o jsonpath='{.status.summary.images}'

# Todas las versiones disponibles en GHCR
open https://github.com/3kn4ls/Index-app/pkgs/container/index-app
```

## Comandos Útiles

### Forzar sincronización inmediata

```bash
# Desde CLI
kubectl patch application index-app -n argocd \
  -p '{"metadata": {"annotations": {"argocd.argoproj.io/refresh": "normal"}}}' \
  --type merge

# O hard refresh
kubectl patch application index-app -n argocd \
  -p '{"metadata": {"annotations": {"argocd.argoproj.io/refresh": "hard"}}}' \
  --type merge
```

### Ver diferencias entre Git y cluster

```bash
# Desde ArgoCD UI
# App Details → App Diff

# Desde CLI
kubectl get application index-app -n argocd -o yaml | grep -A 20 "status:"
```

### Pausar auto-sync temporalmente

```bash
# Deshabilitar auto-sync
kubectl patch application index-app -n argocd \
  --type merge \
  -p '{"spec":{"syncPolicy":{"automated":null}}}'

# Re-habilitar
kubectl patch application index-app -n argocd \
  --type merge \
  -p '{"spec":{"syncPolicy":{"automated":{"prune":true,"selfHeal":true}}}}'
```

## Troubleshooting

### GitHub Actions falla

```bash
# Ver logs
open https://github.com/3kn4ls/Index-app/actions

# Causas comunes:
# - Error en Dockerfile
# - Tests fallan (si los hay)
# - Permisos de GHCR
# - Falta de espacio en runners
```

### ImagePullBackOff en K8S

```bash
kubectl describe pod <pod-name>

# Causas:
# - Imagen no es pública en GHCR
# - Falta imagePullSecret
# - Tag de imagen incorrecto

# Solución:
# 1. Hacer imagen pública en GHCR
# 2. O configurar imagePullSecret (ver SETUP_GITHUB_ACTIONS.md)
```

### ArgoCD no sincroniza

```bash
# Ver estado
kubectl get application index-app -n argocd

# Verificar que detectó cambios
kubectl describe application index-app -n argocd

# Forzar refresh
kubectl patch application index-app -n argocd \
  -p '{"metadata": {"annotations": {"argocd.argoproj.io/refresh": "hard"}}}' \
  --type merge
```

### Pods no se actualizan

```bash
# Verificar imagen en deployment
kubectl get deployment index-app -o yaml | grep image:

# Verificar rollout status
kubectl rollout status deployment index-app

# Ver eventos
kubectl get events --sort-by='.lastTimestamp' | grep index-app

# Forzar recreación
kubectl rollout restart deployment index-app
```

## Comparación: Antes vs Ahora

### Workflow Antiguo (deploy.sh)

```
Desarrollar → ./deploy.sh update
              ↓
    Build local en Raspberry Pi (~15 min)
              ↓
    Import a k3s (sudo ctr)
              ↓
    kubectl rollout restart
              ↓
    ArgoCD detecta drift → self-heal revierte cambios ❌
```

**Problemas**:
- ❌ Lento (builds ARM64)
- ❌ Manual
- ❌ ArgoCD revertía cambios
- ❌ No versionado
- ❌ Difícil hacer rollback

### Workflow Nuevo (release.sh + GitHub Actions)

```
Desarrollar → ./release.sh patch "msg" (10 seg)
              ↓
    GitHub Actions build (~5 min)
              ↓
    Push a GHCR
              ↓
    Git push → ArgoCD detecta → sync automático ✅
```

**Ventajas**:
- ✅ Rápido (build en nube)
- ✅ 1 solo comando
- ✅ Versionado semántico
- ✅ Rollback con 1 click
- ✅ ArgoCD alineado con Git
- ✅ Multi-arch automático
- ✅ No consume recursos locales
- ✅ Funciona desde cualquier lugar

## Tiempo Total

| Acción | Antes | Ahora |
|--------|-------|-------|
| **Comando manual** | `./deploy.sh update` | `./release.sh patch "msg"` |
| **Tiempo de ejecución** | ~15 min | ~10 seg |
| **Build** | Local (lento) | GitHub (rápido) |
| **Deploy total** | ~20 min | ~6 min (automático) |
| **Rollback** | Manual, ~10 min | 1 click, ~1 min |

## Próximos Pasos

1. ✅ **Probar flujo completo** con Index-app
2. **Configurar GitHub Secrets** (opcional, para webhook)
3. **Hacer imagen pública** en GHCR
4. **Replicar a otros 5 proyectos** (ver REPLICAR_A_OTROS_PROYECTOS.md)

---

**¿Preguntas?** Consulta:
- `SETUP_GITHUB_ACTIONS.md` - Setup inicial
- `REPLICAR_A_OTROS_PROYECTOS.md` - Migrar otros proyectos
- `/home/ecanals/ws/argocd/ESTRUCTURA_ACTUAL.md` - Documentación ArgoCD
