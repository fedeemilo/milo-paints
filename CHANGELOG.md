# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

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
