# CLAUDE.md — Milo Paints

Guía de contexto para agentes (Cursor, Claude, etc.) que trabajen en este repo.
Leer esto **antes** de cambiar código. Complementa `.cursorrules`.

---

## Qué es este proyecto

Galería de arte online para **Milo** (artista plástico). Uso principal:

1. **Público** (`/galeria`, `/qr/[id]`): ver obras; cada pintura tiene un QR físico que apunta a su página.
2. **Admin** (`/admin/*`, también `/` si hay sesión): CRUD de pinturas, toggle vendido, ver/descargar QR.
3. El dueño es el artista (bajo tráfico, sin usuarios finales registrados).

Idioma de la UI y commits: **español**. Código: mixto (negocio en español, técnico en inglés).

---

## Stack actual (julio 2026)

| Capa | Tecnología |
|------|------------|
| Framework | Next.js App Router (v16), React 19, TypeScript strict |
| DB | **MongoDB Atlas** — DB `milo-paints`, colección `paintings` |
| Imágenes / QR assets | **Cloudinary** (`img-paints/`, `qrs-paints/`) |
| Auth admin | Cookie httpOnly + `ADMIN_PASSWORD` (custom, **no** Auth de terceros) |
| Estilos | Tailwind CSS 4 + patrones shadcn |
| Validación | Zod + React Hook Form |
| Deploy | Vercel |

**Histórico:** antes usaba Supabase (Postgres). Migrado a Mongo porque el free tier pausaba la BD. No reintroducir Supabase.

---

## Modelo de datos

Colección `paintings`. Identificadores:

- `_id`: ObjectId interno de Mongo (no usar en URLs).
- `id`: **UUID string** — identificador público. Usado en `/qr/[id]`, QRs impresos y Cloudinary (`qr-{id}.png`).

**Nunca regenerar ni reemplazar `id` de obras existentes** (rompe QRs físicos ya impresos/compartidos).

Campos relevantes: `name`, `description`, `price`, `width`/`height`/`depth`, `year`, `category`, `image_url`, `cloudinary_public_id`, `thumbnail_url`, `qr_code_url`, `sold`, `sold_at`, `created_at`, `updated_at`.

Tipos: `src/types/database.types.ts` (`Painting`, `PaintingDocument`, insert/update).  
CRUD: `src/lib/mongodb/paintings.ts`. Conexión: `src/lib/mongodb/client.ts`.

Al crear obras nuevas: `randomUUID()` para `id`.

---

## Rutas importantes

| Ruta | Rol |
|------|-----|
| `/` | Home “admin” (requiere cookie; si no → redirect `/galeria`) |
| `/galeria` | Galería pública |
| `/qr/[id]` | Detalle público de una obra (destino del QR) |
| `/admin`, `/admin/paintings`, `/admin/paintings/new`, `/admin/paintings/[id]`, `.../qr` | Panel |
| `/admin/login` | Login |
| `POST/PUT/DELETE /api/paintings*` | Mutaciones (Cloudinary + Mongo) |
| `PATCH /api/paintings/[id]/sold` | Toggle vendido |
| `POST /api/auth/login`, `POST /api/auth/logout` | Sesión |

Middleware: `src/middleware.ts` — hoy protege `/` y `/admin/*` **solo mirando si existe la cookie**. Las APIs **no** están en el matcher.

---

## Convenciones de código

- Server Components por defecto; `"use client"` solo si hace falta.
- Acceso a datos solo vía `src/lib/mongodb/*` (no queries sueltas en páginas).
- Imágenes de obras: preferir `object-contain` (no recortar). `object-cover` está vetado para obras en reglas del proyecto; el admin aún tiene deuda con `object-cover` en thumbs.
- No dejar `console.log` de debug en prod.
- Al cerrar un cambio: bump semver en `package.json` + entrada en `CHANGELOG.md` (español).
- Commits: `tipo: descripción` en español (`feat`, `fix`, `docs`, etc.).
- No commitear `.env`, CSV de exports, ni credenciales.

Variables de negocio: español (`pintura`, `precio`). Técnicas: inglés (`isLoading`, `formData`).

---

## Variables de entorno

Ver `.env.example`.

```
MONGODB_URI=
MONGODB_DB_NAME=milo-paints
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_APP_URL=          # base URL para links de QR
ADMIN_PASSWORD=
SESSION_SECRET=               # firma cookie admin (HMAC); fallback: ADMIN_PASSWORD
```

En Atlas: usuario app con **solo** `readWrite` sobre DB `milo-paints`. Network Access debe permitir Vercel (típicamente `0.0.0.0/0`).

---

## Flujos críticos

### Crear pintura
1. Validar con Zod (`createPaintingSchema`).
2. Subir imagen a Cloudinary → `image_url` + `cloudinary_public_id` + thumbnail.
3. Insert en Mongo con UUID nuevo.
4. Generar QR (lib `qrcode`) apuntando a `{APP_URL}/qr/{id}` → subir PNG a Cloudinary → update `qr_code_url`.

### Editar / borrar
- Edit: opcional reemplazo de imagen (borrar public_id anterior en Cloudinary).
- Delete: borrar doc Mongo + imagen Cloudinary + QR Cloudinary (`milo-paints/qrs-paints/qr-{id}`).

### Vendido
- Toggle `sold` + `sold_at` (Date o null). UI: banner “VENDIDO”; en detalle público se oculta precio/CTA de compra.

---

## Auth — estado y riesgos

- Login compara password con `ADMIN_PASSWORD`.
- Cookie `milo-admin-session`: token **firmado HMAC-SHA256** (`admin:<expiresAt>` + firma), expira a 7 días.
- Secreto: `SESSION_SECRET` (recomendado en prod) o fallback `ADMIN_PASSWORD`.
- Validación en:
  - `verifySessionToken` (Edge-safe, usado por middleware)
  - `isAuthenticated` / `requireAdminApi` (route handlers)
- Middleware matcher incluye `/api/paintings/:path*` → 401 sin sesión válida.

Al tocar auth: mantener defense in depth (middleware **y** check en handlers). No volver a cookies sin firma.

---

## Qué no hacer

- No migrar de nuevo a Postgres/Supabase/Neon free “porque es SQL” sin pedido explícito (el problema era el auto-pause).
- No cambiar `_id` ObjectId por UUID ni al revés en docs existentes; el contrato público es el campo `id`.
- No usar `object-cover` en imágenes de obras (recorta la pintura).
- No agregar docs markdown no pedidos (excepto actualizar este archivo / CHANGELOG cuando corresponda).
- No inventar features grandes (filtros, e-commerce, multi-usuario) sin que el usuario lo pida: el producto es deliberadamente chico.

---

## Backlog conocido (post-migración Mongo)

Priorizado; no implementar todo de golpe sin acuerdo:

### P0 — Seguridad / bugs
1. ~~Auth real en mutaciones `/api/paintings*` + matcher middleware.~~ ✅ 0.5.2
2. ~~Cookie firmada (HMAC) con secreto; validar valor, no solo existencia.~~ ✅ 0.5.2
3. ~~Fix mailto en página QR (`encodeURIComponent` + template).~~ ✅ 0.5.2

### P1 — Datos / PWA
4. ~~Índice único Mongo `{ id: 1 }` e índice `{ created_at: -1 }`.~~ ✅ 0.5.3
5. ~~PWA: `start_url` → `/galeria`; no cachear `/api/*` en el service worker.~~ ✅ 0.5.3
6. ~~Al borrar pintura, destruir también el QR en Cloudinary.~~ ✅ 0.5.3

### P2 — UX / higiene
7. ~~Admin thumbs: `object-contain` en lugar de `object-cover`.~~ ✅ 0.5.4
8. ~~Cards vendidas sin precio/año: copy “Vendido”.~~ ✅ 0.5.4
9. ~~Rate-limit en login; no filtrar detalles de error al cliente.~~ ✅ 0.5.4
10. ~~`.gitignore` CSV; limpiar `console.log` PWA; `price ?? null`.~~ ✅ 0.5.4 / 0.5.1

### P3 — Performance / navegación (radar)
11. Navegación admin se siente “trabada” (delay al ir Dashboard → Pinturas). Evaluar:
    - Transiciones inmediatas + loading UI (`loading.tsx` / spinner en layout)
    - Prefetch de links de Next (ya suele estar; verificar)
    - Cache de datos server (revalidate / unstable_cache) o capa cliente (React Query) si aporta
    - No sobre-ingenierizar: app chica, priorizar percepción de velocidad en admin

---

## Archivos ancla (mapa rápido)

```
src/lib/mongodb/client.ts      # conexión singleton
src/lib/mongodb/paintings.ts   # CRUD + serialize
src/lib/auth/session.ts        # cookie / password
src/lib/cloudinary/upload.ts   # upload / delete / thumbnails
src/lib/qr/generate.ts         # buffer QR + URL pública
src/lib/validations/painting.ts
src/middleware.ts
src/types/database.types.ts
.cursorrules                   # reglas del proyecto (español)
CHANGELOG.md                   # historial de versiones
```

---

## Cómo trabajar en este repo

1. Leer este archivo + `.cursorrules`.
2. Cambios chicos y enfocados; no refactors colaterales.
3. Probar mentalmente: galería pública, `/qr/[id]`, admin CRUD, toggle sold, QRs existentes.
4. Versionar + CHANGELOG al terminar.
5. No commit/push sin pedido explícito del usuario.
