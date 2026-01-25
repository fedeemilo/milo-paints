# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [0.3.0] - 2026-01-25

### ✨ Added

- **Vista dual en admin dashboard**: Toggle para cambiar entre vista tabla y vista grilla
  - Vista tabla: compacta y tradicional para gestión rápida
  - Vista grilla: visual con cards que muestran imágenes grandes con object-cover
  - Metadata organizada: nombre, precio, categoría
  - Botones de acción (Editar, QR, Eliminar) bien visibles en cada card
  - Responsive: 1 col mobile, 2 tablet, 3 laptop, 4 desktop
- **Paginación mejorada**: 12 pinturas por página (antes 10)
  - Mantiene el modo de vista seleccionado al cambiar de página
  - Contador de registros mostrados
- **Estado visual mejorado en badges**:
  - Badge "DISPONIBLE" verde con ícono de carrito para pinturas disponibles
  - Badge "VENDIDO" amarillo con check para pinturas vendidas
  - Ambos badges son clickeables para cambiar estado rápidamente
- **Banner diagonal "Vendido"**: Indicador visual prominente sobre las imágenes
  - Se muestra en esquina superior derecha cuando la obra está vendida
  - Visible en galería pública y páginas de detalle QR
  - Color amarillo/amber con texto blanco en diagonal
  - Complementa el badge redondo para mayor visibilidad

### 🎨 UI/UX

- Hover effects en cards de grilla con scale en imagen
- Transiciones suaves entre estados
- Mejor accesibilidad con títulos descriptivos en botones
- Indicador visual claro y llamativo del estado de venta

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
