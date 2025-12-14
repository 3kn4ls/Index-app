# Workflow de Release con ArgoCD

## Cómo funciona el nuevo sistema

### Antes (sin versionado)
- Usabas `image: index-app:latest`
- Cada cambio sobrescribía la misma imagen
- No podías hacer rollback fácilmente
- ArgoCD no detectaba cambios porque el manifest no cambiaba

### Ahora (con versionado semántico)
- Cada release tiene una versión única: `v1.0.0`, `v1.1.0`, etc.
- ArgoCD detecta cambios automáticamente
- Puedes hacer rollback a cualquier versión anterior
- Historial completo de deployments

## Versionado Semántico

El formato es `MAJOR.MINOR.PATCH`:

- **PATCH** (1.0.0 → 1.0.1): Corrección de bugs
- **MINOR** (1.0.0 → 1.1.0): Nueva funcionalidad compatible
- **MAJOR** (1.0.0 → 2.0.0): Cambios que rompen compatibilidad

## Flujo de trabajo

### 1. Desarrolla tu código normalmente

```bash
cd /home/ecanals/ws/Index-app

# Haz tus cambios en src/
# Prueba localmente si quieres
```

### 2. Haz release con el script

Para una **corrección de bugs** (patch):
```bash
./release.sh patch "Fix botón de login"
```

Para una **nueva funcionalidad** (minor):
```bash
./release.sh minor "Add modo oscuro"
```

Para un **cambio mayor** (major):
```bash
./release.sh major "Rediseño completo"
```

### 3. El script hace todo automáticamente

1. ✅ Incrementa la versión (1.0.0 → 1.0.1)
2. ✅ Construye imagen Docker `index-app:v1.0.1`
3. ✅ Importa imagen a k3s
4. ✅ Actualiza `k8s/deployment.yaml` con la nueva versión
5. ✅ Actualiza archivo `VERSION`
6. ✅ Hace commit y push a GitHub
7. ✅ ArgoCD detecta el cambio y despliega automáticamente

### 4. Monitorear el despliegue

```bash
# Ver estado de los pods
kubectl get pods -l app=index-app -w

# Ver el deployment
kubectl describe deployment index-app

# Ver logs
kubectl logs -l app=index-app -f

# O desde ArgoCD UI
# https://northr3nd.duckdns.org/argocd
```

## Ejemplos de uso

### Ejemplo 1: Fix de un bug
```bash
# Hiciste un cambio para corregir un error
./release.sh patch "Fix validación de formulario"

# Versión: 1.0.0 → 1.0.1
```

### Ejemplo 2: Nueva funcionalidad
```bash
# Añadiste una nueva sección
./release.sh minor "Add sección de estadísticas"

# Versión: 1.0.1 → 1.1.0
```

### Ejemplo 3: Cambio mayor
```bash
# Cambiaste la arquitectura completa
./release.sh major "Migración a nueva API"

# Versión: 1.1.0 → 2.0.0
```

## Rollback a versión anterior

Si algo sale mal, puedes volver a una versión anterior:

```bash
# Ver historial de versiones
git log --oneline | grep "release:"

# Opción 1: Editar manualmente deployment.yaml
# Cambiar: image: index-app:v1.2.0
# Por:     image: index-app:v1.1.0

git add k8s/deployment.yaml
git commit -m "rollback: Volver a v1.1.0"
git push

# Opción 2: Desde ArgoCD UI
# History → Seleccionar versión anterior → Sync
```

## Ver versión actual

```bash
# Ver versión en el archivo
cat VERSION

# Ver versión desplegada en k8s
kubectl get deployment index-app -o jsonpath='{.spec.template.spec.containers[0].image}'

# Ver todas las imágenes disponibles en k3s
sudo k3s crictl images | grep index-app
```

## Comandos útiles

```bash
# Ver estado de ArgoCD
kubectl get applications -n argocd

# Forzar sincronización inmediata desde CLI
kubectl patch application index-app -n argocd \
  -p '{"metadata": {"annotations": {"argocd.argoproj.io/refresh": "normal"}}}' \
  --type merge

# Ver diferencias entre Git y cluster
kubectl get application index-app -n argocd -o yaml | grep -A 10 "status:"
```

## Solución de problemas

### El deployment no se actualiza
1. Verifica que el push a Git fue exitoso: `git log -1`
2. Verifica estado de ArgoCD: `kubectl get application index-app -n argocd`
3. Fuerza refresh desde ArgoCD UI o con el comando de arriba

### Error al construir imagen
- Verifica que Docker esté corriendo: `docker ps`
- Verifica espacio en disco: `df -h`

### La imagen no se importa a k3s
- Verifica que k3s esté corriendo: `sudo systemctl status k3s`
- Verifica permisos: el script usa `sudo` para k3s ctr

## Notas importantes

- **ArgoCD sincroniza cada ~3 minutos**: Ten paciencia o fuerza el sync
- **Siempre commit antes de release**: El script verificará que no tengas cambios sin commit
- **El tag `latest` también se actualiza**: Por si lo necesitas para desarrollo local
- **Las versiones son incrementales**: No puedes saltar versiones

## Workflow antiguo vs nuevo

### Antiguo (manual)
```bash
./deploy.sh build          # Construir
kubectl rollout restart... # Forzar restart
# ArgoCD puede revertir cambios
```

### Nuevo (con ArgoCD)
```bash
./release.sh patch "mensaje"
# Todo automático, ArgoCD gestiona el despliegue
```
