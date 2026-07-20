# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [0.5.2] - 2026-07-20

### 🐛 Fixed / Security

- **Auth en APIs de pinturas**: middleware + `requireAdminApi` en GET/POST/PUT/DELETE/PATCH de `/api/paintings*`
  - Causa: las mutaciones eran públicas; cualquiera podía crear/editar/borrar obras
- **Cookie de sesión firmada (HMAC-SHA256)** con expiración 7 días
  - Causa: bastaba con inventar cualquier valor de cookie para pasar el middleware
  - Nuevo: `SESSION_SECRET` (fallback local: `ADMIN_PASSWORD`)
- **Mailto en página QR**: el subject ahora interpola el nombre de la obra
  - Causa: string JSX estática con `${painting.name}` literal

---

## [0.5.1] - 2026-07-20

### ✨ Added

- **`CLAUDE.md`**: guía de contexto para agentes (stack, modelo de datos, auth, rutas, backlog conocido)
- `.gitignore`: ignorar CSV de exports y `.env*.local`

### 🎨 Changed

- Documentación alineada post-migración a MongoDB Atlas

---

## [0.5.0] - 2026-07-20

### ✨ Changed

- **Migración de Supabase (Postgres) a MongoDB Atlas**
  - Causa: el plan free de Supabase pausaba la BD por bajo tráfico
  - Nueva capa de datos en `src/lib/mongodb/` (cliente + CRUD de pinturas)
  - El identificador público sigue siendo el UUID en el campo `id` (los QR/URLs no cambian)
  - `_id` de Mongo es ObjectId interno; las queries usan `id`
  - Variables de entorno: `MONGODB_URI` y `MONGODB_DB_NAME` (reemplazan las de Supabase)

### 🗑️ Removed

- Dependencias `@supabase/ssr` y `@supabase/supabase-js`
- Clientes en `src/lib/supabase/`

---

## [0.4.1] - 2026-01-26

### ✨ Added

- **Información de contacto para compra**: Sección de contacto en página de detalle de obra
  - Box destacado con email del artista (guillemilo@gmail.com)
  - Botón de email con subject pre-llenado con el nombre de la obra
  - Solo visible en obras disponibles (no vendidas)
  - Diseño elegante con fondo sutil y borde de acento
  - Call-to-action claro para consultas sobre compra, envío y métodos de pago

### 🐛 Fixed

- Corrección de clase CSS `bg-gradient-to-r` a `bg-linear-to-r` (Tailwind v4)
  - Aplicado en banner diagonal de "Vendido"
  - En componente `PaintingCard` y página de detalle QR

### 🎨 UI/UX

- Mejor flujo de compra: usuarios ahora saben cómo contactar al artista
- Información de contacto visible y accesible sin interrumpir la experiencia visual

---

## [0.4.0] - 2026-01-26

### ✨ Added

- **Progressive Web App (PWA)**: La aplicación ahora puede instalarse como app nativa
  - Configuración completa de manifest (`/public/site.webmanifest`)
  - Service Worker implementado con estrategia "Network First, fallback a Cache"
  - Iconos optimizados para Android (192x192, 512x512) y iOS (180x180 apple-touch-icon)
  - Meta tags para compatibilidad con iOS y Android
  - Soporte para instalación desde navegador (Chrome, Edge, Safari)
  - Funcionalidad offline básica (cachea páginas principales)
- **Iconos completos para PWA**:
  - `favicon.ico`, `favicon.svg`, `favicon-96x96.png` - Navegadores
  - `apple-touch-icon.png` - iOS Safari
  - `web-app-manifest-192x192.png` y `web-app-manifest-512x512.png` - Android
- **Documentación PWA**: Guía completa en `/docs/PWA.md` con:
  - Instrucciones de instalación para Android, iOS y Desktop
  - Explicación de archivos y configuración
  - Cómo testear la PWA localmente
  - Guía de Lighthouse para verificar estándares

### 🔧 Technical

- Componente `PWARegister` para registro automático del Service Worker en producción
- Headers HTTP configurados en `next.config.ts` para Service Worker y manifest
- Metadata extendida en layout con iconos y configuración Apple Web App
- Service Worker con caché inteligente y limpieza automática de versiones antiguas

### 🎨 UI/UX

- Color de tema unificado (#3e3434) para barra de estado en mobile
- Experiencia de app nativa con modo "standalone" (sin barra de navegador)
- Orientación portrait por defecto en dispositivos móviles
- Splash screens automáticos generados por el SO

---

## [0.3.0] - 2026-01-25

### ✨ Added

- **Vista dual en admin dashboard**: Toggle para cambiar entre vista tabla y vista grilla
  - Vista tabla: compacta y tradicional para gestión rápida
  - Vista grilla: visual con cards que muestran imágenes grandes con object-cover
  - Metadata organizada: nombre, precio, categoría
  - Botones de acción (Editar, QR, Eliminar) bien visibles en cada card
  - Responsive: 1 col mobile, 2 tablet, 3 laptop, 4 desktop
- **Paginación mejorada**: 12 pinturas por página (ajustado de 10)
  - Mantiene el modo de vista seleccionado al cambiar de página
  - Contador de registros mostrados
- **Estado visual mejorado en badges**:
  - Badge "DISPONIBLE" verde con ícono de carrito para pinturas disponibles
  - Badge "VENDIDO" removido - reemplazado por banner diagonal exclusivo
- **Banner diagonal "Vendido" premium**: Indicador visual elegante y prominente
  - Se muestra en esquina superior derecha cuando la obra está vendida
  - Visible en galería pública y páginas de detalle QR
  - Gradiente amber con sombras profundas y tipografía bold
  - Reemplaza completamente al badge redondo para mayor impacto visual
- **Precio oculto en obras vendidas**: Mayor claridad y profesionalismo
  - El precio no se muestra cuando una pintura está vendida
  - Aplica en galería pública y página de detalle
  - Elimina confusión sobre disponibilidad

### 🎨 UI/UX

- Hover effects en cards de grilla con scale en imagen
- Transiciones suaves entre estados
- Mejor accesibilidad con títulos descriptivos en botones
- Indicador visual claro del estado de venta sin información redundante
- Diseño más limpio y enfocado en obras disponibles

---

## [0.2.0] - 2026-01-25

### ✨ Added

- **Estado de vendido mejorado**: Implementación completa del sistema de pinturas vendidas
  - Badge "VENDIDO" visible en galería pública y páginas de detalle
  - Toggle en admin dashboard para marcar/desmarcar como vendido
  - Precio tachado y en gris para obras vendidas
  - Columnas `sold` y `sold_at` en base de datos
- **Botón de acceso al dashboard**: Header público muestra botón para ir al admin cuando estás logueado
  - Detección server-side de sesión activa
  - Acceso rápido al panel desde cualquier página pública
- **Responsive admin dashboard**: Panel de administración optimizado para mobile
  - Hamburger menu en mobile
  - Sidebar overlay con backdrop
  - Footer de navegación siempre visible
  - Sin scroll horizontal en ningún dispositivo
- **Navegación mejorada para admin**:
  - Imágenes clickeables en tabla del dashboard que llevan a vista pública de la pintura
  - Botón "Volver" condicional: lleva al dashboard si sos admin, a la galería si sos visitante
- **Paginación en tabla de pinturas**: 20 pinturas por página con navegación anterior/siguiente
- **Mejoras de tipado**: Resolución de errores TypeScript en API routes

### 🔧 Fixed

- Corrección de overflow horizontal en admin y páginas públicas
- Mejora en la inferencia de tipos de Supabase
- Ajustes de padding y márgenes para mejor visualización en mobile

### 📝 Technical

- SQL migration para agregar campos `sold` y `sold_at`
- Componente `PublicHeader` convertido a Server Component
- Mejoras en el layout responsive del admin

---

## [0.1.0] - 2026-01-24

### ✨ Added

- **Galería pública**: Vista de todas las pinturas disponibles
- **Página de detalle por QR**: Cada pintura tiene una URL única accesible via código QR
- **Panel de administración**: CRUD completo de pinturas
  - Crear, editar y eliminar pinturas
  - Subida de imágenes a Cloudinary
  - Generación automática de códigos QR
  - Descarga de QR en formato PNG y SVG
- **Sistema de autenticación**: Protección del panel admin con contraseña
- **Estado de venta**: Marcar/desmarcar pinturas como vendidas
- **Responsive design**: Adaptado a mobile y desktop
- **Migración de datos**: Script para importar pinturas desde backup JSON

### 🎨 Stack técnico

- Next.js 15 con App Router
- TypeScript en modo estricto
- Supabase (PostgreSQL) para base de datos
- Cloudinary para almacenamiento de imágenes
- Tailwind CSS + Shadcn/ui para estilos
- Zod + React Hook Form para validaciones
