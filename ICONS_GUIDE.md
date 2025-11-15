# Guía de Generación de Iconos PWA

El logo principal está en `public/logo.svg` con un diseño profesional y moderno.

## Generar Iconos PNG

Para generar todos los tamaños de iconos necesarios desde el SVG, puedes usar una de estas opciones:

### Opción 1: Usando ImageMagick (Linux/macOS/Windows)

```bash
# Instalar ImageMagick si no lo tienes
# Ubuntu/Debian: sudo apt-get install imagemagick
# macOS: brew install imagemagick
# Windows: descargar desde https://imagemagick.org

cd public

# Generar todos los tamaños
convert logo.svg -resize 72x72 icon-72x72.png
convert logo.svg -resize 96x96 icon-96x96.png
convert logo.svg -resize 128x128 icon-128x128.png
convert logo.svg -resize 144x144 icon-144x144.png
convert logo.svg -resize 152x152 icon-152x152.png
convert logo.svg -resize 192x192 icon-192x192.png
convert logo.svg -resize 384x384 icon-384x384.png
convert logo.svg -resize 512x512 icon-512x512.png

# Generar favicon
convert logo.svg -resize 32x32 favicon.ico
```

### Opción 2: Usando Inkscape (Más preciso para SVG)

```bash
# Instalar Inkscape
# Ubuntu/Debian: sudo apt-get install inkscape
# macOS: brew install inkscape
# Windows: descargar desde https://inkscape.org

cd public

# Generar todos los tamaños
inkscape logo.svg --export-filename=icon-72x72.png --export-width=72 --export-height=72
inkscape logo.svg --export-filename=icon-96x96.png --export-width=96 --export-height=96
inkscape logo.svg --export-filename=icon-128x128.png --export-width=128 --export-height=128
inkscape logo.svg --export-filename=icon-144x144.png --export-width=144 --export-height=144
inkscape logo.svg --export-filename=icon-152x152.png --export-width=152 --export-height=152
inkscape logo.svg --export-filename=icon-192x192.png --export-width=192 --export-height=192
inkscape logo.svg --export-filename=icon-384x384.png --export-width=384 --export-height=384
inkscape logo.svg --export-filename=icon-512x512.png --export-width=512 --export-height=512
```

### Opción 3: Herramientas Online

1. **PWA Asset Generator**: https://www.pwabuilder.com/imageGenerator
   - Sube `logo.svg`
   - Descarga todos los iconos generados
   - Copia los archivos a la carpeta `public/`

2. **Favicon Generator**: https://realfavicongenerator.net/
   - Sube `logo.svg`
   - Genera todos los tamaños y el favicon.ico
   - Descarga y extrae en `public/`

## Script Automático

También puedes usar este script de Node.js:

```bash
npm install --save-dev sharp-cli

# Crear script package.json
npm run generate-icons
```

```json
// Agregar a package.json
"scripts": {
  "generate-icons": "node scripts/generate-icons.js"
}
```

```javascript
// scripts/generate-icons.js
const sharp = require('sharp');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  sharp('public/logo.svg')
    .resize(size, size)
    .png()
    .toFile(`public/icon-${size}x${size}.png`)
    .then(() => console.log(`Generated icon-${size}x${size}.png`))
    .catch(err => console.error(err));
});

// Favicon
sharp('public/logo.svg')
  .resize(32, 32)
  .toFile('public/favicon.ico')
  .then(() => console.log('Generated favicon.ico'))
  .catch(err => console.error(err));
```

## Verificar Iconos

Después de generar los iconos, verifica que existan todos estos archivos en `public/`:

- ✅ logo.svg (logo principal)
- ✅ icon-72x72.png
- ✅ icon-96x96.png
- ✅ icon-128x128.png
- ✅ icon-144x144.png
- ✅ icon-152x152.png
- ✅ icon-192x192.png (mínimo para PWA)
- ✅ icon-384x384.png
- ✅ icon-512x512.png (recomendado para PWA)
- ✅ favicon.ico

## Rebuilder y Redesplegar

```bash
# Después de generar los iconos
./deploy.sh all
```

La PWA ahora usará tu logo profesional en todos los dispositivos.
