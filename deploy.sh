#!/bin/bash

# Script de compilación y despliegue para k3s
# Este script compila la aplicación Angular, construye la imagen Docker,
# la sube al registro local y despliega en k3s

set -e  # Salir si cualquier comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Despliegue de Blinds Control App${NC}"
echo -e "${GREEN}========================================${NC}"

# 1. Configuración por defecto
API_URL="${API_URL:-https://northr3nd.duckdns.org/api}"

# 2. Cargar variables de entorno si existe .env
if [ -f .env ]; then
    echo -e "\n${YELLOW}[1/6] Cargando configuración desde .env...${NC}"
    source .env
else
    echo -e "\n${YELLOW}[1/6] Usando configuración por defecto...${NC}"
fi
echo "API_URL: $API_URL"

# 3. Construir la imagen Docker
echo -e "\n${YELLOW}[2/6] Construyendo imagen Docker...${NC}"
docker build \
    --build-arg API_URL=$API_URL \
    --platform linux/arm64 \
    -t blinds-control-app:latest \
    -f Dockerfile \
    .

echo -e "${GREEN}✓ Imagen construida exitosamente${NC}"

# 4. Etiquetar para el registro local
echo -e "\n${YELLOW}[3/6] Etiquetando imagen para registro local...${NC}"
docker tag blinds-control-app:latest localhost:5000/blinds-control-app:latest
echo -e "${GREEN}✓ Imagen etiquetada${NC}"

# 5. Subir al registro local de k3s
echo -e "\n${YELLOW}[4/6] Subiendo imagen al registro local...${NC}"
docker push localhost:5000/blinds-control-app:latest
echo -e "${GREEN}✓ Imagen subida al registro${NC}"

# 6. Aplicar manifiestos de Kubernetes
echo -e "\n${YELLOW}[5/6] Aplicando manifiestos de Kubernetes...${NC}"
sudo kubectl apply -f k8s/all-in-one.yaml
echo -e "${GREEN}✓ Manifiestos aplicados${NC}"

# 7. Reiniciar el deployment para forzar pull de la nueva imagen
echo -e "\n${YELLOW}[6/6] Reiniciando deployment...${NC}"
sudo kubectl rollout restart deployment/blinds-control-app -n default
echo -e "${GREEN}✓ Deployment reiniciado${NC}"

# 8. Esperar a que el rollout se complete
echo -e "\n${YELLOW}Esperando a que el deployment esté listo...${NC}"
sudo kubectl rollout status deployment/blinds-control-app -n default --timeout=300s

# 9. Mostrar información del deployment
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  Despliegue completado exitosamente${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "\n${YELLOW}Estado de los pods:${NC}"
sudo kubectl get pods -n default -l app=blinds-control

echo -e "\n${YELLOW}Servicio:${NC}"
sudo kubectl get service blinds-control-service -n default

echo -e "\n${GREEN}La aplicación está disponible en:${NC}"
echo -e "https://northr3nd.duckdns.org/blinds-control/"
echo -e "\nLa API está disponible en:"
echo -e "https://northr3nd.duckdns.org/api/"
echo -e "\nPara ver los logs: kubectl logs -f -l app=blinds-control -n default"
