# Replicar GitHub Actions a Otros Proyectos

Una vez que Index-app funcione correctamente, puedes replicar el mismo sistema a los otros 5 proyectos.

## Proyectos a Migrar

1. **ssh-mobile** → https://github.com/3kn4ls/ssh-mobile
2. **home-manager** (blinds-control) → https://github.com/3kn4ls/home-manager
3. **gestion-herencia** → https://github.com/3kn4ls/gestion-herencia
4. **k3s-monitoring** → https://github.com/3kn4ls/k3s-monitoring
5. **mangos-classic** (admin-panel) → https://github.com/3kn4ls/mangos-classic

## Plantilla de Migración

### Paso 1: Copiar GitHub Actions Workflow

```bash
# Para cada proyecto
PROJECT="ssh-mobile"  # Cambiar según proyecto

cd /home/ecanals/ws/$PROJECT

# Crear estructura
mkdir -p .github/workflows

# Copiar workflow de Index-app como base
cp /home/ecanals/ws/Index-app/.github/workflows/release.yml \
   .github/workflows/release.yml

# Editar para ajustar el nombre del proyecto
sed -i "s/index-app/${PROJECT}/g" .github/workflows/release.yml
```

### Paso 2: Actualizar deployment.yaml

```bash
# Verificar estructura actual
cat k8s/deployment.yaml | grep "image:"

# Actualizar imagen
# Ejemplo para ssh-mobile:
# Antes: image: localhost:5000/ssh-mobile-backend:latest
# Ahora: image: ghcr.io/3kn4ls/ssh-mobile-backend:v1.0.0
```

### Paso 3: Actualizar release.sh

```bash
# Copiar nuevo release.sh de Index-app
cp /home/ecanals/ws/Index-app/release.sh release.sh

# Ajustar variables para el proyecto
# IMAGE_NAME="ssh-mobile-backend"  # según corresponda
```

### Paso 4: Commit y push

```bash
git add .github/ k8s/ release.sh
git commit -m "feat: Add GitHub Actions for automated deployment"
git push origin main
```

## Particularidades por Proyecto

### ssh-mobile (Proyecto multi-imagen)

Este proyecto tiene **2 imágenes**: backend y frontend.

**Opción A: Un workflow, dos builds**

`.github/workflows/release.yml`:
```yaml
jobs:
  build-backend:
    # ... build ssh-mobile-backend

  build-frontend:
    # ... build ssh-mobile-frontend
    needs: build-backend
```

**Opción B: Dos workflows separados**

- `.github/workflows/backend-release.yml`
- `.github/workflows/frontend-release.yml`

**Deployments a actualizar**:
- `k8s/backend-deployment.yaml`
- `k8s/frontend-deployment.yaml`

**release.sh**: Necesita actualizar ambos deployments

```bash
sed -i "s|image: .*/ssh-mobile-backend:v.*|image: ghcr.io/3kn4ls/ssh-mobile-backend:v${NEW_VERSION}|g" k8s/backend-deployment.yaml
sed -i "s|image: .*/ssh-mobile-frontend:v.*|image: ghcr.io/3kn4ls/ssh-mobile-frontend:v${NEW_VERSION}|g" k8s/frontend-deployment.yaml
```

### home-manager / blinds-control

**Particularidad**: La aplicación en ArgoCD se llama `blinds-control` pero el repo es `home-manager`.

**Actualizar workflow**:
```yaml
- name: Trigger ArgoCD Sync
  run: |
    curl -X POST "${ARGOCD_SERVER}/api/v1/applications/blinds-control/sync"
```

### mangos-classic / admin-panel

**Particularidad**: El repo es `mangos-classic` pero la app de ArgoCD es `admin-panel`.

**Path en ArgoCD**: `kubernetes/admin-panel`

**Workflow trigger**:
```yaml
on:
  push:
    paths:
      - 'VERSION'
      - 'kubernetes/admin-panel/**'
```

### gestion-herencia

Tiene un subdirectorio `angular-catastro` con su propio deploy.sh.

**Estructura**:
```
gestion-herencia/
├── deploy.sh                    # Deploy principal
├── angular-catastro/
│   └── deploy.sh               # Deploy del frontend
└── k8s/                        # Manifiestos compartidos
```

**Decisión**: ¿Un workflow o dos?
- Opción A: Workflow único que construye todo
- Opción B: Workflows separados por componente

### k3s-monitoring

Proyecto de monitoring (Prometheus, Grafana).

**Particularidad**: Probablemente no requiera builds frecuentes.

**Opción**: Workflow más simple, solo para actualizar configuraciones.

## Script de Migración Automatizado

Puedes usar este script para automatizar la migración:

```bash
#!/bin/bash

# migrate-to-github-actions.sh
# Uso: ./migrate-to-github-actions.sh <proyecto>

PROJECT=$1

if [ -z "$PROJECT" ]; then
    echo "Uso: $0 <proyecto>"
    echo "Ejemplo: $0 ssh-mobile"
    exit 1
fi

echo "Migrando $PROJECT a GitHub Actions..."

cd /home/ecanals/ws/$PROJECT

# 1. Crear estructura
mkdir -p .github/workflows

# 2. Copiar workflow base
cp /home/ecanals/ws/Index-app/.github/workflows/release.yml \
   .github/workflows/release.yml

# 3. Ajustar nombre del proyecto
sed -i "s/index-app/${PROJECT}/g" .github/workflows/release.yml

# 4. Copiar nuevo release.sh
cp /home/ecanals/ws/Index-app/release.sh release.sh.new

echo ""
echo "✅ Archivos copiados"
echo ""
echo "⚠️  PASOS MANUALES REQUERIDOS:"
echo ""
echo "1. Revisar y ajustar .github/workflows/release.yml"
echo "   - Verificar nombre de imagen"
echo "   - Verificar paths de trigger"
echo ""
echo "2. Revisar y ajustar release.sh.new"
echo "   - Actualizar IMAGE_NAME"
echo "   - Actualizar DEPLOYMENT_FILE paths"
echo ""
echo "3. Actualizar k8s/deployment.yaml"
echo "   - Cambiar image a ghcr.io/3kn4ls/${PROJECT}:vX.Y.Z"
echo "   - Cambiar imagePullPolicy a Always"
echo ""
echo "4. Commit y push"
echo "   git add .github/ release.sh.new k8s/"
echo "   git commit -m 'feat: Add GitHub Actions'"
echo "   git push"
echo ""
```

Guardar como `/home/ecanals/ws/migrate-to-github-actions.sh`.

## Orden Recomendado de Migración

Migrar en este orden (de más simple a más complejo):

1. **Index-app** ✅ (Ya hecho - Piloto)
2. **k3s-monitoring** (Simple, sin builds frecuentes)
3. **home-manager** (Simple, una imagen)
4. **gestion-herencia** (Media complejidad)
5. **mangos-classic** (Media, estructura diferente)
6. **ssh-mobile** (Más complejo, dos imágenes)

## Checklist por Proyecto

Copiar y completar para cada proyecto:

```
Proyecto: ___________________

□ Crear .github/workflows/release.yml
□ Actualizar IMAGE_NAME en workflow
□ Ajustar paths de trigger
□ Actualizar k8s/deployment.yaml → imagen GHCR
□ Actualizar imagePullPolicy → Always
□ Crear/actualizar release.sh
□ Verificar VERSION file existe
□ Commit y push
□ Verificar GitHub Actions corre
□ Hacer imagen pública en GHCR
□ Probar release con ./release.sh patch "Test"
□ Verificar ArgoCD sincroniza
□ Verificar pods se actualizan
□ Documentar particularidades
```

## Configuración Global de GitHub Secrets

Si quieres webhooks de ArgoCD para todos los proyectos:

### Opción 1: Organization Secret (Si tienes GitHub Pro/Team)

Crear un secret a nivel de organización que todos los repos puedan usar.

### Opción 2: Secret por repositorio

Agregar los mismos secrets a cada repo:
- `ARGOCD_SERVER`
- `ARGOCD_TOKEN`

## Monitoreo Multi-Proyecto

Una vez migrados todos:

```bash
# Ver todos los workflows en GitHub
for repo in Index-app ssh-mobile home-manager gestion-herencia k3s-monitoring mangos-classic; do
    echo "=== $repo ==="
    open "https://github.com/3kn4ls/$repo/actions"
done

# Ver todas las apps en ArgoCD
kubectl get applications -n argocd
```

## Troubleshooting Común

### Error: workflow no se dispara

- Verificar que `.github/workflows/release.yml` existe en la rama `main`
- Verificar paths en el trigger
- Ver en GitHub → Actions → "There are no workflows"

### Error: permission denied en GHCR

- Hacer el paquete público en GHCR
- O configurar imagePullSecret

### Error: build falla

- Verificar que Dockerfile existe y es válido
- Verificar que context es correcto

## Tiempo Estimado

Por proyecto (después del piloto):
- **Simple**: 30-45 min
- **Medio**: 1-1.5 horas
- **Complejo**: 2 horas

**Total**: ~8-10 horas para migrar los 6 proyectos

## Beneficios Finales

Una vez migrados todos:

✅ **1 comando** para deployar cualquier proyecto
✅ **Versionado consistente** en todos los proyectos
✅ **Rollback fácil** en todos
✅ **Builds rápidos** en la nube
✅ **No carga en Raspberry Pi**
✅ **Monitoreo centralizado** en GitHub + ArgoCD
