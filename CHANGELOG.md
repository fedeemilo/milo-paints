# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

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
