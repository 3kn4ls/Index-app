const fs = require('fs');
const path = require('path');

// Lee la variable de entorno API_URL
const apiUrl = process.env.API_URL || process.env.NG_APP_API_URL || '';

if (!apiUrl) {
  console.warn('⚠️  WARNING: API_URL no está configurada. La app usará el placeholder.');
  console.warn('   Configura API_URL en las variables de entorno de Vercel.');
} else {
  console.log('✅ API_URL configurada:', apiUrl);
}

// Ruta al archivo de environment de producción
const envFilePath = path.join(__dirname, '../src/environments/environment.prod.ts');

// Lee el contenido del archivo
let envFileContent = fs.readFileSync(envFilePath, 'utf8');

// Reemplaza el placeholder con la variable de entorno
envFileContent = envFileContent.replace('__API_URL__', apiUrl);

// Escribe el archivo actualizado
fs.writeFileSync(envFilePath, envFileContent, 'utf8');

console.log('✅ Environment file actualizado correctamente');
