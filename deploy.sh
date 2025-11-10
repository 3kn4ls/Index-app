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
    kubectl apply -f k8s/deployment.yaml
    kubectl apply -f k8s/service.yaml
    kubectl apply -f k8s/ingress.yaml

    if [ $? -eq 0 ]; then
        print_message "Aplicación desplegada exitosamente"
        print_message "Esperando a que los pods estén listos..."
        kubectl wait --for=condition=ready pod -l app=index-app --timeout=300s

        print_message ""
        print_message "Estado del despliegue:"
        kubectl get pods -l app=index-app
        kubectl get svc index-app
        kubectl get ingress index-app

        print_message ""
        print_warning "Para acceder a la aplicación:"
        print_warning "1. Agrega '192.168.x.x index-app.local' a /etc/hosts (reemplaza con la IP de tu Raspberry Pi)"
        print_warning "2. Accede a http://index-app.local en tu navegador"
    else
        print_error "Error al desplegar la aplicación"
        exit 1
    fi
}

# Función para limpiar recursos
cleanup() {
    print_message "Eliminando recursos de Kubernetes..."
    kubectl delete -f k8s/deployment.yaml --ignore-not-found=true
    kubectl delete -f k8s/service.yaml --ignore-not-found=true
    kubectl delete -f k8s/ingress.yaml --ignore-not-found=true
    print_message "Recursos eliminados"
}

# Función para mostrar logs
show_logs() {
    print_message "Mostrando logs de la aplicación..."
    kubectl logs -l app=index-app --tail=100 -f
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
    cleanup)
        cleanup
        ;;
    logs)
        show_logs
        ;;
    *)
        echo "Uso: $0 {build|deploy|all|cleanup|logs}"
        echo ""
        echo "Comandos:"
        echo "  build   - Construir e importar la imagen Docker"
        echo "  deploy  - Desplegar la aplicación en k3s"
        echo "  all     - Construir, importar y desplegar"
        echo "  cleanup - Eliminar recursos de k3s"
        echo "  logs    - Mostrar logs de la aplicación"
        exit 1
        ;;
esac
