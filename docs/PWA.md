# PWA - Progressive Web App

## ✨ Características

Milo Paints ahora es una **Progressive Web App (PWA)**, lo que significa que:

- ✅ Se puede instalar en dispositivos móviles y de escritorio
- ✅ Funciona offline (caché básico)
- ✅ Experiencia similar a una app nativa
- ✅ Iconos adaptados para iOS y Android
- ✅ Splash screens automáticos

## 📱 Cómo instalar la PWA

### En Android (Chrome/Edge):

1. Abre el sitio web en Chrome o Edge
2. Toca el menú (tres puntos) → "Agregar a pantalla de inicio" o "Instalar aplicación"
3. Sigue las instrucciones en pantalla
4. La app aparecerá en tu pantalla de inicio

### En iOS (Safari):

1. Abre el sitio web en Safari
2. Toca el botón de compartir (cuadrado con flecha hacia arriba)
3. Desplázate y toca "Agregar a pantalla de inicio"
4. Personaliza el nombre si lo deseas y toca "Agregar"
5. La app aparecerá en tu pantalla de inicio

### En Desktop (Chrome/Edge):

1. Abre el sitio web en Chrome o Edge
2. Busca el ícono de instalación en la barra de direcciones (computadora con flecha)
3. Haz clic en "Instalar"
4. La app se abrirá en su propia ventana

## 🔧 Archivos de configuración

### Manifest (`/public/site.webmanifest`)

Contiene la configuración de la PWA:
- Nombre de la aplicación
- Iconos (192x192 y 512x512)
- Colores de tema
- Modo de visualización (standalone)
- Orientación preferida

### Service Worker (`/public/sw.js`)

Maneja el funcionamiento offline:
- Estrategia "Network First, fallback a Cache"
- Cachea páginas principales (`/`, `/galeria`)
- Actualiza el caché automáticamente

### Componente de registro (`/src/components/PWARegister.tsx`)

Registra el Service Worker solo en producción.

## 🎨 Iconos incluidos

- `favicon.ico` - Favicon tradicional
- `favicon.svg` - Favicon vectorial (navegadores modernos)
- `favicon-96x96.png` - Favicon en resolución estándar
- `apple-touch-icon.png` - Icono para iOS (180x180)
- `web-app-manifest-192x192.png` - Icono para Android (192x192)
- `web-app-manifest-512x512.png` - Icono para Android alta resolución (512x512)

## 🚀 Testing

Para probar la PWA localmente:

1. Haz un build de producción: `npm run build`
2. Inicia el servidor: `npm start`
3. Abre en navegador: `http://localhost:3000`
4. Abre DevTools → Application → Service Workers para verificar el registro
5. Abre DevTools → Application → Manifest para verificar el manifest

## 📊 Lighthouse

Para verificar que la PWA cumple con los estándares:

1. Abre Chrome DevTools
2. Ve a la pestaña "Lighthouse"
3. Selecciona "Progressive Web App"
4. Haz clic en "Analyze page load"

Debería obtener un puntaje alto (90+) en PWA.

## ⚙️ Configuración en Next.js

La configuración de headers para PWA está en `next.config.ts`:

- Headers para el Service Worker con cache control
- Content-Type correcto para el manifest
- Service-Worker-Allowed header para permitir el scope completo

## 🔄 Actualizaciones

El Service Worker se actualiza automáticamente cuando:
- Cambias el código del Service Worker (`sw.js`)
- El usuario vuelve a visitar el sitio

El caché se limpia automáticamente si la versión del Service Worker cambia.
