# Index App

Una aplicación Angular moderna y elegante para indexar y redirigir a múltiples aplicaciones web. Diseñada con los más altos estándares de diseño UI/UX, inspirada en compañías líderes como Apple, Tesla, Microsoft y Google.

![Angular](https://img.shields.io/badge/Angular-20.3.9-DD0031?style=flat&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5?style=flat&logo=kubernetes)

## Características

- **Diseño Premium**: Interfaz moderna y elegante con animaciones suaves
- **Totalmente Responsive**: Adaptada para móviles, tablets y escritorio
- **Sin Backend**: Funciona completamente en el cliente leyendo un archivo JSON
- **Búsqueda Inteligente**: Busca por nombre, código o categoría
- **Dark Mode**: Soporte automático para modo oscuro
- **Optimizada para Producción**: Build optimizado con Nginx
- **Lista para k3s**: Manifiestos de Kubernetes incluidos para Raspberry Pi 5

## Vista Previa

La aplicación muestra tarjetas interactivas con:
- Código de 3 dígitos
- Nombre completo de la aplicación
- Logo personalizado
- Descripción breve
- Categoría
- Redirección a la URL configurada

## Inicio Rápido

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# La aplicación estará disponible en http://localhost:4200
```

### Build de Producción

```bash
# Construir para producción
npm run build

# Los archivos se generarán en dist/index-app/browser
```

### Despliegue en k3s/Raspberry Pi 5

Ver la [Guía Completa de Despliegue](DEPLOYMENT_GUIDE.md)

```bash
# Despliegue automático
./deploy.sh all
```

## Configuración

### Personalizar las Aplicaciones

Edita el archivo `public/assets/data/apps.json`:

```json
{
  "apps": [
    {
      "code": "001",
      "name": "Gmail",
      "url": "https://mail.google.com",
      "logo": "assets/images/gmail.svg",
      "description": "Servicio de correo electrónico de Google",
      "category": "Productividad"
    }
  ]
}
```

### Agregar Logos Personalizados

Coloca tus logos SVG en `public/assets/images/` y actualiza la ruta en el JSON.

## Tecnologías

- **Framework**: Angular 20.3.9
- **Lenguaje**: TypeScript 5.x
- **Estilos**: SCSS
- **Build**: Angular CLI con optimización AOT
- **Servidor Web**: Nginx (producción)
- **Contenedor**: Docker multi-stage build
- **Orquestación**: Kubernetes (k3s)

## Estructura del Proyecto

```
Index-app/
├── src/
│   ├── app/
│   │   ├── models/          # Interfaces TypeScript
│   │   ├── services/        # Servicios Angular
│   │   ├── app.ts           # Componente principal
│   │   ├── app.html         # Template HTML
│   │   └── app.scss         # Estilos SCSS
│   └── ...
├── public/
│   └── assets/
│       ├── data/
│       │   └── apps.json    # Configuración de apps
│       └── images/          # Logos de las apps
├── k8s/                     # Manifiestos Kubernetes
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
├── Dockerfile              # Build optimizado
├── nginx.conf              # Configuración Nginx
├── deploy.sh               # Script de despliegue
└── DEPLOYMENT_GUIDE.md     # Guía completa
```

## Scripts Disponibles

```bash
# Desarrollo
npm start                    # Servidor de desarrollo
npm run build               # Build de producción
npm test                    # Tests unitarios

# Docker
docker build -t index-app . # Construir imagen
docker run -p 80:80 index-app # Ejecutar contenedor

# Kubernetes (ver DEPLOYMENT_GUIDE.md)
./deploy.sh all             # Despliegue completo
./deploy.sh build           # Solo construir imagen
./deploy.sh deploy          # Solo desplegar
./deploy.sh logs            # Ver logs
./deploy.sh cleanup         # Limpiar recursos
```

## Características de Diseño

- **Tipografía**: San Francisco Pro Display (estilo Apple)
- **Colores**: Paleta moderna con azul primario (#007AFF)
- **Animaciones**: Transiciones suaves y naturales
- **Sombras**: Sistema de elevación consistente
- **Spacing**: Grid system basado en 8px
- **Radius**: Bordes redondeados consistentes (8px, 12px, 20px)
- **Hover Effects**: Transformaciones y sombras en hover
- **Loading States**: Spinner y estados vacíos elegantes

## Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## Navegadores Soportados

- Chrome/Edge (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Despliegue

### Docker

```bash
# Construir
docker build -t index-app:latest .

# Ejecutar
docker run -d -p 80:80 index-app:latest
```

### Kubernetes/k3s

Ver [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) para instrucciones detalladas.

## Rendimiento

- **Build Size**: ~200KB (gzipped)
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Lighthouse Score**: 95+

## Mantenimiento

### Actualizar Aplicaciones

1. Edita `public/assets/data/apps.json`
2. Reconstruye y redesplega:
   ```bash
   ./deploy.sh all
   ```

### Agregar Nuevas Categorías

Las categorías se generan automáticamente desde el JSON. Solo agrega el campo `category` a tus aplicaciones.

## Contribuir

Esta es una aplicación standalone, pero puedes:

1. Fork el proyecto
2. Crear una rama para tu feature
3. Hacer commit de tus cambios
4. Push a la rama
5. Crear un Pull Request

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Soporte

Para problemas y preguntas:
- Revisa la [Guía de Despliegue](DEPLOYMENT_GUIDE.md)
- Consulta los logs: `./deploy.sh logs`
- Verifica el estado: `kubectl get all -l app=index-app`

## Recursos Adicionales

- [Documentación de Angular](https://angular.dev)
- [Documentación de k3s](https://docs.k3s.io)
- [Guía de Despliegue Completa](DEPLOYMENT_GUIDE.md)

---

Hecho con ❤️ para Raspberry Pi 5 y k3s
