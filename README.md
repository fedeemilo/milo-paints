# 🎨 Milo Paints

Galería de arte online para exhibir y gestionar pinturas originales. Cada obra cuenta con un código QR único que permite a los visitantes acceder a información detallada escaneando desde su teléfono.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)

---

## ✨ Características

- **Galería pública** - Visualización elegante de todas las obras disponibles
- **Páginas de detalle** - Cada pintura tiene su propia página con información completa
- **Sistema de QR** - Códigos QR generados automáticamente para cada obra
- **Panel de administración** - CRUD completo para gestionar el catálogo
- **Estado de venta** - Marcar obras como vendidas con indicador visual
- **Responsive** - Diseño adaptado a móviles y escritorio

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **Next.js 15** | Framework React con App Router |
| **TypeScript** | Tipado estático |
| **Tailwind CSS** | Estilos utilitarios |
| **Shadcn/ui** | Componentes UI |
| **Supabase** | Base de datos PostgreSQL |
| **Cloudinary** | Almacenamiento de imágenes |
| **Zod** | Validación de schemas |

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Cloudinary](https://cloudinary.com)

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/milo-paints.git
cd milo-paints
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Copiar el archivo de ejemplo y completar con tus credenciales:

```bash
cp .env.example .env.local
```

4. **Crear la tabla en Supabase**

Ejecutar en el SQL Editor de Supabase:

```sql
CREATE TABLE paintings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  qr_code_url TEXT,
  price DECIMAL(10,2),
  width DECIMAL(10,2),
  height DECIMAL(10,2),
  depth DECIMAL(10,2),
  year INTEGER,
  category VARCHAR(100),
  sold BOOLEAN DEFAULT FALSE,
  sold_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar lectura pública
ALTER TABLE paintings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de pinturas"
ON paintings FOR SELECT
TO public
USING (true);
```

5. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── admin/           # Panel de administración
│   ├── api/             # API routes
│   ├── galeria/         # Galería pública
│   └── qr/[id]/         # Páginas de detalle (QR)
├── components/
│   ├── admin/           # Componentes del admin
│   ├── gallery/         # Componentes públicos
│   └── ui/              # Componentes base
├── lib/
│   ├── supabase/        # Clientes de BD
│   ├── cloudinary/      # Config de imágenes
│   └── validations/     # Schemas Zod
└── types/               # Tipos TypeScript
```

---

## 🔐 Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo backend) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Nombre del cloud en Cloudinary |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary |
| `NEXT_PUBLIC_APP_URL` | URL de la aplicación |
| `ADMIN_PASSWORD` | Contraseña del panel admin |

---

## 📜 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Iniciar en producción
npm run lint     # Verificar código
```

---

## 🌐 Deploy

El proyecto está optimizado para deploy en **Vercel**:

1. Conectar el repositorio de GitHub
2. Configurar las variables de entorno
3. Deploy automático con cada push a `main`

---

## 📝 Licencia

Este proyecto es privado y de uso personal.

---

<p align="center">
  Hecho con ❤️ por <a href="https://fedmilo.com">fedmilo</a>
</p>
