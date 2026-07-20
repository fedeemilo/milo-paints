# 🎨 Milo Paints

Galería de arte online para exhibir y gestionar pinturas originales. Cada obra cuenta con un código QR único que permite a los visitantes acceder a información detallada escaneando desde su teléfono.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)

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
| **MongoDB Atlas** | Base de datos |
| **Cloudinary** | Almacenamiento de imágenes |
| **Zod** | Validación de schemas |

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- Cluster en [MongoDB Atlas](https://www.mongodb.com/atlas)
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

```bash
cp .env.example .env.local
```

Completar `MONGODB_URI`, `MONGODB_DB_NAME` y el resto según `.env.example`.

4. **Base de datos**

Crear en Atlas la DB `milo-paints` y la colección `paintings`.  
Cada documento usa un campo `id` (UUID string) como identificador público para URLs `/qr/[id]` y códigos QR. El `_id` de Mongo es interno.

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
│   ├── mongodb/         # Cliente y CRUD de pinturas
│   ├── cloudinary/      # Config de imágenes
│   └── validations/     # Schemas Zod
└── types/               # Tipos TypeScript
```

---

## 🔐 Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `MONGODB_URI` | Connection string de MongoDB Atlas |
| `MONGODB_DB_NAME` | Nombre de la base (default: `milo-paints`) |
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

Deploy en [Vercel](https://vercel.com). Configurar las mismas variables de entorno en el dashboard del proyecto.
