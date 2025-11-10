#!/bin/sh
# Script para inyectar variables de entorno en runtime
# Se ejecuta cuando el contenedor inicia

# Si API_URL no está definida, usar valor por defecto
if [ -z "$API_URL" ]; then
  echo "⚠️  API_URL no definida, usando valor por defecto"
  API_URL="https://northr3nd.duckdns.org/api"
fi

echo "🔧 Inyectando API_URL: $API_URL"

# Buscar y reemplazar en los archivos JavaScript compilados
# Reemplaza el placeholder __API_URL__ con el valor real
find /usr/share/nginx/html -type f -name '*.js' -exec sed -i "s|__API_URL__|$API_URL|g" {} \;

echo "✅ Variables de entorno inyectadas correctamente"

# Iniciar nginx
exec nginx -g 'daemon off;'
