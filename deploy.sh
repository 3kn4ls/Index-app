#!/bin/bash

# Script de despliegue para k3s en Raspberry Pi 5
# Uso: ./deploy.sh [build|deploy|all]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
IMAGE_NAME="index-app"
IMAGE_TAG="latest"
NAMESPACE="default"

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Función para construir la imagen Docker
build_image() {
    print_message "Construyendo imagen Docker..."

    # Construir la imagen para ARM64 (Raspberry Pi 5)
    docker build \
        --platform linux/arm64 \
        -t ${IMAGE_NAME}:${IMAGE_TAG} \
        .

    if [ $? -eq 0 ]; then
        print_message "Imagen construida exitosamente: ${IMAGE_NAME}:${IMAGE_TAG}"
    else
        print_error "Error al construir la imagen"
        exit 1
    fi
}

# Función para importar la imagen a k3s
import_to_k3s() {
    print_message "Importando imagen a k3s..."

    # Guardar la imagen como tar
    docker save ${IMAGE_NAME}:${IMAGE_TAG} -o /tmp/${IMAGE_NAME}.tar

    # Importar a k3s (ctr es el runtime de k3s)
    sudo k3s ctr images import /tmp/${IMAGE_NAME}.tar

    # Limpiar archivo temporal
    rm /tmp/${IMAGE_NAME}.tar

    if [ $? -eq 0 ]; then
        print_message "Imagen importada exitosamente a k3s"
    else
        print_error "Error al importar la imagen a k3s"
        exit 1
    fi
}

# Función para desplegar en Kubernetes
deploy_k8s() {
    print_message "Desplegando en Kubernetes..."

    # Aplicar los manifiestos
    sudo kubectl apply -f k8s/deployment.yaml
    sudo kubectl apply -f k8s/service.yaml
    sudo kubectl apply -f k8s/ingress.yaml

    if [ $? -eq 0 ]; then
        print_message "Aplicación desplegada exitosamente"
        print_message "Esperando a que los pods estén listos..."
        sudo kubectl wait --for=condition=ready pod -l app=index-app --timeout=300s

        print_message ""
        print_message "Estado del despliegue:"
        sudo kubectl get pods -l app=index-app
        sudo kubectl get svc index-app
        sudo kubectl get ingress index-app

        print_message ""
        print_warning "Aplicación accesible en: https://mc-s3rv3r.ddns.net/apps/"
    else
        print_error "Error al desplegar la aplicación"
        exit 1
    fi
}

# Función para actualizar la aplicación (después de cambios en git)
update_app() {
    print_message "Actualizando aplicación..."

    # Construir nueva imagen
    build_image

    # Importar a k3s
    import_to_k3s

    # Reiniciar deployment para usar la nueva imagen
    print_message "Reiniciando pods para aplicar cambios..."
    sudo kubectl rollout restart deployment index-app

    # Esperar a que estén listos
    print_message "Esperando a que los pods estén listos..."
    sudo kubectl rollout status deployment index-app --timeout=300s

    print_message ""
    print_message "Estado actualizado:"
    sudo kubectl get pods -l app=index-app

    print_message ""
    print_message "✅ Aplicación actualizada exitosamente!"
    print_warning "Accede a: https://mc-s3rv3r.ddns.net/apps/"
    print_warning "Limpia la caché del navegador (Ctrl+Shift+R) para ver los cambios"
}

# Función para limpiar recursos
cleanup() {
    print_message "Eliminando recursos de Kubernetes..."
    sudo kubectl delete -f k8s/deployment.yaml --ignore-not-found=true
    sudo kubectl delete -f k8s/service.yaml --ignore-not-found=true
    sudo kubectl delete -f k8s/ingress.yaml --ignore-not-found=true
    print_message "Recursos eliminados"
}

# Función para mostrar logs
show_logs() {
    print_message "Mostrando logs de la aplicación..."
    sudo kubectl logs -l app=index-app --tail=100 -f
}

# Función para ver el estado
show_status() {
    print_message "Estado de la aplicación:"
    echo ""
    sudo kubectl get pods -l app=index-app
    echo ""
    sudo kubectl get svc index-app
    echo ""
    sudo kubectl get ingress index-app
}

# Menú principal
case "${1}" in
    build)
        build_image
        import_to_k3s
        ;;
    deploy)
        deploy_k8s
        ;;
    all)
        build_image
        import_to_k3s
        deploy_k8s
        ;;
    update)
        update_app
        ;;
    cleanup)
        cleanup
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    *)
        echo "Uso: $0 {build|deploy|all|update|status|logs|cleanup}"
        echo ""
        echo "Comandos:"
        echo "  update  - Actualizar app después de cambios (RECOMENDADO)"
        echo "  build   - Solo construir e importar imagen Docker"
        echo "  deploy  - Solo aplicar manifiestos k8s"
        echo "  all     - Construir, importar y desplegar (primera vez)"
        echo "  status  - Ver estado de la aplicación"
        echo "  logs    - Ver logs en tiempo real"
        echo "  cleanup - Eliminar completamente de k3s"
        echo ""
        echo "💡 Flujo típico después de cambios en git:"
        echo "   ./deploy.sh update"
        exit 1
        ;;
esac
