# Testing y Deploy de PWA

## 🧪 Testing Local

### 1. Build de producción

La PWA solo funciona en modo producción (no en `npm run dev`):

```bash
npm run build
npm start
```

Abre `http://localhost:3000`

### 2. Verificar Service Worker

1. Abre Chrome DevTools (F12)
2. Ve a **Application** → **Service Workers**
3. Deberías ver `sw.js` registrado y activo
4. Estado: "activated and is running"

### 3. Verificar Manifest

1. En DevTools → **Application** → **Manifest**
2. Verificar:
   - ✅ Name: "Milo Paints | Galería de Arte"
   - ✅ Short name: "MiloPaints"
   - ✅ Start URL: "/"
   - ✅ Display: "standalone"
   - ✅ Theme color: "#3e3434"
   - ✅ Iconos cargados correctamente

### 4. Test de instalación

**Desktop (Chrome/Edge):**
- Deberías ver un ícono de instalación (➕) en la barra de direcciones
- Click → "Instalar"
- La app se abre en ventana propia

**Mobile (Chrome Android):**
- Menú (⋮) → "Agregar a pantalla de inicio"
- La app aparece como icono en home screen

### 5. Lighthouse Audit

1. DevTools → **Lighthouse**
2. Selecciona categorías:
   - ✅ Progressive Web App
   - ✅ Performance
   - ✅ Accessibility
3. "Analyze page load"

**Métricas esperadas:**
- PWA Score: 90+ (idealmente 100)
- Performance: 80+
- Accessibility: 90+

### 6. Test Offline

1. Con la app instalada o abierta
2. DevTools → **Network** → Throttling: "Offline"
3. Recargar página
4. Debería funcionar desde caché (páginas visitadas)

---

## 🚀 Deploy a Vercel

### Variables de entorno

Asegúrate de tener configuradas en Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
ADMIN_PASSWORD=...
```

### Deploy

```bash
# Si no tienes Vercel CLI instalado
npm i -g vercel

# Deploy
vercel
```

O simplemente push a la rama main si tienes GitHub conectado a Vercel.

### Post-deploy

1. Verifica que la app esté en producción
2. Abre en mobile y desktop
3. Test de instalación en ambos dispositivos
4. Lighthouse audit en producción

---

## 📱 Test en dispositivos reales

### iOS (Safari)

1. Abre el sitio en Safari
2. Botón compartir → "Agregar a pantalla de inicio"
3. Verificar:
   - ✅ Icono correcto (180x180 apple-touch-icon)
   - ✅ Nombre: "MiloPaints"
   - ✅ Se abre sin barra de Safari

### Android (Chrome)

1. Abre el sitio en Chrome
2. Banner de instalación debería aparecer automáticamente
   - O manualmente: Menú → "Instalar aplicación"
3. Verificar:
   - ✅ Icono correcto (192x192 y 512x512)
   - ✅ Splash screen al abrir
   - ✅ Se abre en modo standalone

---

## 🐛 Troubleshooting

### Service Worker no se registra

**Problema:** Console log "Error al registrar Service Worker"

**Solución:**
- Verifica que estés en producción (`npm run build && npm start`)
- HTTPS es requerido (localhost funciona sin HTTPS)
- Verifica que `/public/sw.js` existe

### Manifest no se carga

**Problema:** Error 404 al cargar manifest

**Solución:**
- Verifica que `/public/site.webmanifest` existe
- Verifica en DevTools → Network que se carga correctamente
- Tipo MIME debe ser `application/manifest+json`

### Iconos no se muestran

**Problema:** Iconos rotos o no aparecen

**Solución:**
- Verifica que todos los archivos PNG existen en `/public`
- Tamaños correctos: 192x192, 512x512, 180x180, 96x96
- Tipo MIME: `image/png`

### No aparece prompt de instalación

**Problema:** No sale el banner "Instalar app"

**Solución:**
- Solo aparece si cumple criterios PWA (Lighthouse score alto)
- Usuario no puede haber rechazado antes
- App no debe estar ya instalada
- Solo en Chrome/Edge (Safari es manual)

### Cache no funciona offline

**Problema:** App no funciona sin internet

**Solución:**
- Visita las páginas al menos una vez online
- Verifica en DevTools → Application → Cache Storage
- Debe haber un cache `milo-paints-v1` con contenido

---

## 🔄 Actualizar PWA después de deploy

Cuando hagas cambios en el código:

1. Incrementa la versión del cache en `sw.js`:
   ```js
   const CACHE_NAME = 'milo-paints-v2'; // v1 → v2
   ```

2. Deploy a producción

3. Los usuarios verán la actualización al:
   - Reabrir la app (service worker se actualiza en background)
   - O forzar actualización en DevTools → Application → Service Workers → "Update"

---

## 📊 Monitoreo

### Verificar adopción de PWA

En Google Analytics (si lo tienes):
- Eventos de instalación
- Usuarios en modo standalone vs browser
- Uso offline

### Metrics importantes

- % de usuarios que instalan la app
- Engagement de usuarios con app instalada vs browser
- Errores del service worker (consola de errores)

---

## 🔐 Seguridad

- ✅ Service Worker solo se registra en producción
- ✅ HTTPS requerido (excepto localhost)
- ✅ Same-origin policy aplicada
- ✅ No se cachean datos sensibles (solo páginas públicas)

---

## 📚 Recursos

- [Web.dev - PWA Checklist](https://web.dev/pwa-checklist/)
- [MDN - Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Next.js PWA Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps)
