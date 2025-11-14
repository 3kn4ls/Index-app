#!/bin/bash

# Script para generar iconos PWA desde el SVG
# Requiere ImageMagick (convert) o inkscape

echo "Generando iconos PWA..."

SIZES=(72 96 128 144 152 192 384 512)
SVG_FILE="public/favicon.svg"
OUTPUT_DIR="public"

# Verificar si existe convert (ImageMagick)
if command -v convert &> /dev/null; then
    echo "Usando ImageMagick..."
    for size in "${SIZES[@]}"; do
        echo "Generando icon-${size}x${size}.png..."
        convert -background none -resize ${size}x${size} "$SVG_FILE" "${OUTPUT_DIR}/icon-${size}x${size}.png"
    done

    # Generar favicon.ico (múltiples tamaños)
    echo "Generando favicon.ico..."
    convert -background none \
        \( -clone 0 -resize 16x16 \) \
        \( -clone 0 -resize 32x32 \) \
        \( -clone 0 -resize 48x48 \) \
        \( -clone 0 -resize 64x64 \) \
        -delete 0 "$SVG_FILE" "${OUTPUT_DIR}/favicon.ico"

elif command -v inkscape &> /dev/null; then
    echo "Usando Inkscape..."
    for size in "${SIZES[@]}"; do
        echo "Generando icon-${size}x${size}.png..."
        inkscape -w $size -h $size "$SVG_FILE" -o "${OUTPUT_DIR}/icon-${size}x${size}.png"
    done

    echo "Generando favicon.ico manualmente..."
    inkscape -w 64 -h 64 "$SVG_FILE" -o "${OUTPUT_DIR}/favicon-64.png"
    convert "${OUTPUT_DIR}/favicon-64.png" "${OUTPUT_DIR}/favicon.ico"
    rm "${OUTPUT_DIR}/favicon-64.png"

else
    echo "ERROR: Se requiere ImageMagick (convert) o Inkscape"
    echo ""
    echo "Instala con:"
    echo "  sudo apt-get install imagemagick"
    echo "  o"
    echo "  sudo apt-get install inkscape"
    exit 1
fi

echo ""
echo "✅ Iconos generados exitosamente en ${OUTPUT_DIR}/"
echo ""
echo "Archivos creados:"
for size in "${SIZES[@]}"; do
    echo "  - icon-${size}x${size}.png"
done
echo "  - favicon.ico"
