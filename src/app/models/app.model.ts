export interface AppInfo {
  code: string;          // Código de 3 dígitos
  name: string;          // Nombre completo de la aplicación
  url: string;           // URL para redirigir
  logo: string;          // Ruta de la imagen del logo
  description?: string;  // Descripción opcional
  category?: string;     // Categoría opcional
}
