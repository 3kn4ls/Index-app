# Próximos Pasos - Setup Completo

## Estado Actual

✅ **Configuración completada:**
- GitHub Actions workflow creado (`.github/workflows/release.yml`)
- `release.sh` actualizado para nuevo flujo
- `deployment.yaml` configurado para GHCR
- Documentación completa creada

⏳ **Pendiente:**
- Hacer commit de los cambios
- Configurar acceso a GHCR
- Probar el flujo completo

## Pasos para Completar el Setup

### 1. Commit y Push de los Cambios

```bash
cd /home/ecanals/ws/Index-app

# Ver cambios
git status

# Agregar todos los archivos nuevos/modificados
git add .github/ \
        release.sh \
        k8s/deployment.yaml \
        SETUP_GITHUB_ACTIONS.md \
        REPLICAR_A_OTROS_PROYECTOS.md \
        RELEASE_WORKFLOW.md \
        NEXT_STEPS.md

# Commit
git commit -m "feat: Add GitHub Actions for automated deployment

- Add GitHub Actions workflow for multi-arch builds
- Update release.sh for simplified deployment
- Configure deployment to use GHCR
- Add comprehensive documentation

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push a GitHub
git push origin main
```

**IMPORTANTE**: Este push **NO** disparará el workflow todavía porque los cambios son en `.github/`, `SETUP_GITHUB_ACTIONS.md`, etc., pero NO en `VERSION` ni en `src/`.

### 2. Configurar Acceso a GHCR

Después del primer build, la imagen estará en GHCR pero será **privada** por defecto.

#### Opción A: Hacer la imagen pública (RECOMENDADO)

1. Espera a que GitHub Actions haga el primer build (ver paso 3)
2. Ve a: https://github.com/3kn4ls?tab=packages
3. Click en el paquete `index-app`
4. Click en "Package settings" (esquina superior derecha)
5. Scroll abajo → "Change package visibility"
6. Selecciona "Public"
7. Confirma escribiendo el nombre del paquete

**Ventaja**: K3S puede hacer pull sin autenticación

#### Opción B: Configurar imagePullSecret (si quieres mantenerlo privado)

```bash
# 1. Crear Personal Access Token en GitHub
# https://github.com/settings/tokens
# Scope requerido: read:packages

# 2. Crear secret en K3S
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=3kn4ls \
  --docker-password=TU_GITHUB_TOKEN \
  --docker-email=tu@email.com \
  -n default

# 3. Actualizar deployment.yaml
# Agregar después de spec.template.spec:
#   imagePullSecrets:
#     - name: ghcr-secret

# 4. Commit y push
git add k8s/deployment.yaml
git commit -m "feat: Add imagePullSecret for private GHCR"
git push
```

### 3. Primer Release de Prueba

Una vez hayas hecho push de los cambios:

```bash
cd /home/ecanals/ws/Index-app

# Hacer un release de prueba
./release.sh patch "Test GitHub Actions deployment"
```

**Qué esperar:**

1. **Script se ejecuta** (~10 segundos):
   - Versión: 1.0.1 → 1.0.2
   - Actualiza VERSION y deployment.yaml
   - Commit y push a GitHub

2. **GitHub Actions se dispara** (~5-6 minutos):
   - Monitorear en: https://github.com/3kn4ls/Index-app/actions
   - Build multi-arch (amd64 + arm64)
   - Push a GHCR

3. **Primera vez**: Necesitarás hacer la imagen pública (ver paso 2)

4. **ArgoCD sincroniza** (~3 minutos o instantáneo con webhook):
   - Monitorear en: https://northr3nd.duckdns.org/argocd
   - Detecta cambio en deployment.yaml
   - Aplica cambios

5. **K3S actualiza pods**:
   ```bash
   # Ver en tiempo real
   kubectl get pods -l app=index-app -w
   ```

### 4. Verificar que Funciona

```bash
# Ver imagen desplegada
kubectl get deployment index-app -o jsonpath='{.spec.template.spec.containers[0].image}'
# Debería mostrar: ghcr.io/3kn4ls/index-app:v1.0.2

# Ver pods corriendo
kubectl get pods -l app=index-app

# Probar la app
curl https://mc-s3rv3r.ddns.net/apps/
# O abrir en navegador
```

### 5. (Opcional) Configurar Webhook para Sync Instantáneo

Si quieres sincronización instantánea en vez de esperar 3 minutos:

```bash
# 1. Generar token de ArgoCD
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d

# Guarda este password, lo necesitarás para la UI

# 2. Ve a ArgoCD UI
# https://northr3nd.duckdns.org/argocd
# Login: admin / <password del paso 1>

# 3. Ve a Settings → Accounts → admin
# 4. Click "Generate New Token"
# 5. Nombre: "github-actions"
# 6. Expiry: 1 year (o sin expiración)
# 7. Click "Generate"
# 8. COPIA EL TOKEN (solo se muestra una vez)

# 3. Agregar secrets a GitHub
# Ve a: https://github.com/3kn4ls/Index-app/settings/secrets/actions
# Agregar:
# - ARGOCD_SERVER: https://northr3nd.duckdns.org/argocd
# - ARGOCD_TOKEN: <token copiado en paso 2>
```

## Troubleshooting Primera Vez

### GitHub Actions falla

```bash
# Ver logs detallados
open https://github.com/3kn4ls/Index-app/actions

# Causas comunes:
# - Sintaxis en workflow YAML
# - Permisos de GHCR (se arregla en paso 2)
# - Dockerfile con errores
```

### ImagePullBackOff

```bash
kubectl describe pod <pod-name> | grep -A 10 Events

# Causa: Imagen privada en GHCR
# Solución: Hacer pública (paso 2A) o agregar imagePullSecret (paso 2B)
```

### ArgoCD no detecta cambios

```bash
# Forzar refresh
kubectl patch application index-app -n argocd \
  -p '{"metadata": {"annotations": {"argocd.argoproj.io/refresh": "hard"}}}' \
  --type merge

# O desde UI: App → Refresh → Hard Refresh
```

## Checklist Final

Usa esta checklist para verificar que todo funciona:

```
Setup Inicial:
□ Commit de archivos nuevos/modificados
□ Push a GitHub main
□ GitHub Actions workflow visible en GitHub

Primera Release:
□ ./release.sh patch "Test" ejecutado sin errores
□ GitHub Actions corriendo (ver en /actions)
□ Build completado exitosamente
□ Imagen visible en GHCR
□ Imagen hecha pública (o imagePullSecret configurado)

Deploy:
□ ArgoCD detectó cambio
□ ArgoCD status: Synced
□ Pods actualizándose (kubectl get pods -w)
□ Nuevos pods: Running
□ Health check: Passing
□ App accesible en browser

Verificación:
□ kubectl get deployment → imagen correcta (v1.0.2)
□ curl app funciona
□ Logs sin errores (kubectl logs)

Opcional:
□ GitHub Secrets configurados (ARGOCD_*)
□ Webhook funcionando (sync instantáneo)
```

## Después del Setup

Una vez funcione Index-app:

1. **Replicar a otros proyectos**: Ver `REPLICAR_A_OTROS_PROYECTOS.md`

2. **Uso diario**: Solo ejecutar:
   ```bash
   ./release.sh patch "Fix bug"
   # O
   ./release.sh minor "New feature"
   ```

3. **Monitoreo**:
   - GitHub Actions: https://github.com/3kn4ls/Index-app/actions
   - ArgoCD: https://northr3nd.duckdns.org/argocd
   - Kubernetes: `kubectl get pods -l app=index-app -w`

## Recursos

- **Setup detallado**: `SETUP_GITHUB_ACTIONS.md`
- **Workflow explicado**: `RELEASE_WORKFLOW.md`
- **Replicar a otros**: `REPLICAR_A_OTROS_PROYECTOS.md`
- **Estructura ArgoCD**: `/home/ecanals/ws/argocd/ESTRUCTURA_ACTUAL.md`
- **Opciones de automatización**: `/home/ecanals/ws/argocd/OPCIONES_AUTOMATIZACION.md`

## ¿Necesitas Ayuda?

Si algo no funciona:

1. Revisa logs en GitHub Actions
2. Revisa estado en ArgoCD UI
3. Usa `kubectl describe pod <pod>` para ver errores
4. Consulta sección Troubleshooting en `RELEASE_WORKFLOW.md`

---

**Siguiente paso inmediato**: Ejecutar los comandos del **Paso 1** para hacer commit y push.
