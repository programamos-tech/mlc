# Configuración para Vercel

## Variables de Entorno (EmailJS)

Como este es un sitio estático, las variables de entorno de Vercel no se pueden usar directamente en el cliente. Debes crear el archivo `config/config.emailjs.js` manualmente después del deploy.

### Opción 1: Crear el archivo manualmente en Vercel (Recomendado)

1. Después del deploy en Vercel, ve a la pestaña **"Files"** o **"Deployments"**
2. Busca la carpeta `config/` en el proyecto
3. Crea el archivo `config.emailjs.js` con el siguiente contenido:

```javascript
// Configuración de EmailJS
// Este archivo contiene las credenciales de EmailJS
// IMPORTANTE: Este archivo NO debe subirse a Git (está en .gitignore)

const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'KBF7JW_p7_vAFXvia', // Public Key de EmailJS
    SERVICE_ID: 'service_p3bze6h', // Service ID de Gmail
    TEMPLATE_ID: 'template_7vwex1a' // Template ID del correo de bienvenida
};
```

### Opción 2: Usar Variables de Entorno con Script de Build

Si prefieres usar variables de entorno de Vercel, necesitarías:

1. **Agregar estas variables en Vercel:**
   - `EMAILJS_PUBLIC_KEY` = `KBF7JW_p7_vAFXvia`
   - `EMAILJS_SERVICE_ID` = `service_p3bze6h`
   - `EMAILJS_TEMPLATE_ID` = `template_7vwex1a`

2. **Crear un script de build** que genere el archivo `config/config.emailjs.js` desde las variables de entorno.

**Nota:** Como este proyecto es estático sin proceso de build, la **Opción 1 es más simple y recomendada**.

## Estructura del Proyecto

El proyecto está organizado en las siguientes carpetas:

```
martha-contreras-website/
├── images/              # Todas las imágenes
├── config/              # Configuración (EmailJS)
├── data/                # Datos JSON (blogs.json)
├── index.html           # Página principal
├── admin.html           # Panel de administración
└── ...
```

## Archivos Importantes

- `config/config.emailjs.js` - **DEBE crearse manualmente en Vercel** (no está en Git por seguridad)
- `data/blogs.json` - Contiene los posts del blog (sí está en Git)

## Verificación Post-Deploy

Después del deploy, verifica que:
1. ✅ El archivo `config/config.emailjs.js` existe
2. ✅ Las imágenes se cargan correctamente desde `/images/`
3. ✅ El blog carga correctamente desde `/data/blogs.json`
4. ✅ El formulario de newsletter envía correos correctamente

