# Guía de Integración: `@yes/links-ui` en AppCenterFrontend

**Para:** Desarrolladores junior del equipo PUY  
**Fecha:** 2026-05-05  
**Versión del SDK:** Sprint 1 (v0.1.0-s1)  
**Stack objetivo:** Next.js (Pages Router), React 18, Redux Toolkit, MUI, TailwindCSS

---

## ¿Qué es `@yes/links-ui`?

`@yes/links-ui` es el SDK de gestión de links de Yes. Expone dos cosas:

1. **`YesLinksDashboard`** — componente React listo para usar. Lo montas en una página y te da lista de links, estadísticas y creación de links. Sin escribir fetch ni estado.
2. **Hooks individuales** — `useLinks` y `useStats` para construir UIs personalizadas dentro de páginas existentes.

El SDK consume la API interna de yes-links (`GET /links`, `GET /dashboard/summary`, `POST /links`). Tú solo le pasas el token JWT y la URL base.

---

## Índice

1. [Instalación](#1-instalación)
2. [Configurar variables de entorno](#2-configurar-variables-de-entorno)
3. [Registrar el Provider en `_app.js`](#3-registrar-el-provider-en-_appjs)
4. [Crear una página de Links](#4-crear-una-página-de-links)
5. [Modo multi-tenant: `clientScope`](#5-modo-multi-tenant-clientscope)
6. [Modo portal de cliente: `mode="external"`](#6-modo-portal-de-cliente-modeexternal)
7. [Uso avanzado: hooks directos](#7-uso-avanzado-hooks-directos)
8. [Integración con el Layout de PUY](#8-integración-con-el-layout-de-puy)
9. [Solución de problemas comunes](#9-solución-de-problemas-comunes)

---

## 1. Instalación

### Opción A — Desarrollo local (referencia directa al repo)

Mientras el paquete no está publicado en NPM, lo instalamos apuntando al directorio local:

```bash
# Desde la raíz de AppCenterFrontend
npm install ../../../yes-links/yes-links-ui
```

Esto agrega en tu `package.json`:

```json
"@yes/links-ui": "file:../../../yes-links/yes-links-ui"
```

### Opción B — Cuando esté publicado en NPM (producción)

```bash
npm install @yes/links-ui
```

### Importar estilos base

El SDK trae sus propios estilos (Tailwind compilado). Agrégalos **una sola vez** en `styles/globals.css`:

```css
/* styles/globals.css — ya existe, solo agrega esta línea al final */
@import "@yes/links-ui/dist/yes-links-ui.css";
```

> **¿Por qué en `globals.css` y no en `_app.js`?**  
> Porque en Next.js Pages Router las importaciones CSS desde `_app.js` solo admiten archivos CSS globales registrados así. Al ponerlo en `globals.css` funciona en todos los entornos (dev, build, test).

---

## 2. Configurar variables de entorno

Crea (o edita) `.env.local` en la raíz del proyecto:

```env
# .env.local
NEXT_PUBLIC_YES_LINKS_BASE_URL=http://localhost:8001
NEXT_PUBLIC_YES_LINKS_TOKEN=tu-jwt-aqui
```

**Reglas importantes:**

- Las variables con prefijo `NEXT_PUBLIC_` son accesibles en el navegador. Úsalo solo para la URL y tokens de lectura.
- **Nunca** pongas secretos de admin en variables `NEXT_PUBLIC_`. Si el token es un JWT de sesión de usuario, obtenerlo del contexto de auth es más seguro (ver sección 3).
- Agrega `.env.local` a `.gitignore` si no está ya.

---

## 3. Registrar el Provider en `_app.js`

El componente `YesLinksProvider` debe envolver toda la app (o al menos las páginas que usen el SDK). El lugar correcto es `pages/_app.js`.

Abre `pages/_app.js` y aplica este cambio:

```diff
 import '../styles/globals.css'
 import { persister, store } from "../store/store";
 import { PersistGate } from "redux-persist/integration/react";
 import { Provider } from "react-redux";
 import { SessionProvider } from "next-auth/react"
 import { UserProvider } from '../context/UserContext';
 import { ChatProvider } from '../context/ChatContext';
 import { MessageProvider } from '../context/MessageContext';
 import { ConversationsProvider } from '../context/ConversationsContext';
 import { NumberProvider } from '../context/NumberContext';
 import { HistorialProvider } from '../context/HistorialContext';
 import { StatusChatProvider } from '../context/StatusChatContext';
+import { YesLinksProvider } from '@yes/links-ui';

 function MyApp({ Component, pageProps }) {
   return (
     <UserProvider>
       <ChatProvider>
       <MessageProvider>
       <ConversationsProvider>
       <NumberProvider>
         <HistorialProvider>
         <StatusChatProvider>
+          <YesLinksProvider
+            token={process.env.NEXT_PUBLIC_YES_LINKS_TOKEN}
+            baseUrl={process.env.NEXT_PUBLIC_YES_LINKS_BASE_URL}
+          >
             <PersistGate loading={null} persistor={persister}>
               <Component {...pageProps} />
             </PersistGate>
+          </YesLinksProvider>
         </StatusChatProvider>
         </HistorialProvider>
       </NumberProvider>
       </ConversationsProvider>
       </MessageProvider>
       </ChatProvider>
     </UserProvider>
   )
 }

 export default MyApp
```

**¿Por qué dentro de `StatusChatProvider` pero fuera de `PersistGate`?**  
`YesLinksProvider` no necesita el estado de Redux, pero sí debe estar disponible antes de que `Component` se monte. Envolverlo fuera de `PersistGate` asegura que el SDK ya tiene contexto cuando el componente de página carga.

### Token dinámico desde sesión de usuario

Si el token JWT viene de la sesión de `next-auth`, no lo hardcodes en la variable de entorno. En cambio, léelo en `_app.js`:

```js
import { useSession } from 'next-auth/react';

function MyApp({ Component, pageProps }) {
  const { data: session } = useSession();
  const token = session?.accessToken ?? null;

  return (
    // ... providers anteriores ...
    <YesLinksProvider
      token={token}
      baseUrl={process.env.NEXT_PUBLIC_YES_LINKS_BASE_URL}
    >
      <PersistGate loading={null} persistor={persister}>
        <Component {...pageProps} />
      </PersistGate>
    </YesLinksProvider>
    // ...
  );
}
```

> Cuando `token` es `null` (usuario no autenticado), el SDK no hace peticiones a la API — simplemente no muestra datos. Esto es el comportamiento correcto.

---

## 4. Crear una página de Links

Crea el archivo `pages/yes-links.js`:

```jsx
// pages/yes-links.js
import Layout from '../components/Layout';
import { YesLinksDashboard } from '@yes/links-ui';

const YesLinksPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Gestión de Links
        </h1>

        {/*
          YesLinksDashboard se conecta solo.
          Lee token y baseUrl del YesLinksProvider que pusimos en _app.js.
          No necesitas pasar nada más para el caso básico.
        */}
        <YesLinksDashboard />
      </div>
    </Layout>
  );
};

export default YesLinksPage;
```

### Agregar el link en el Sidebar

En `components/Layout.jsx` (o el archivo de navegación que uses), agrega la ruta al sidebar:

```jsx
// Busca donde están los items de navegación y agrega:
{
  name: 'Links',
  href: '/yes-links',
  icon: LinkIcon,  // usa el ícono que prefieras de @heroicons/react
}
```

Con esto ya tienes un dashboard funcional que:

- Lista todos los links del sistema
- Muestra estadísticas KPI (total links, total clicks, tendencias)
- Permite crear nuevos links

---

## 5. Modo multi-tenant: `clientScope`

PUY maneja múltiples clientes. Cada cliente debe ver **solo sus propios links**. Para esto existe `clientScope`.

### ¿Qué hace `clientScope`?

Cuando pasas `clientScope`, el SDK agrega automáticamente parámetros de filtro a cada petición:

| Sin `clientScope` | Con `clientScope` |
|---|---|
| `GET /links` | `GET /links?campaign=agaval` |
| `GET /dashboard/summary` | `GET /dashboard/summary?campaign=agaval` |

### Cómo usarlo

Supón que el cliente actual es "Agaval" y su identificador de campaña es `"agaval"`. En la página:

```jsx
// pages/yes-links.js
import Layout from '../components/Layout';
import { YesLinksDashboard } from '@yes/links-ui';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const YesLinksPage = () => {
  // Lee el cliente actual desde el contexto de usuario de PUY
  const { state: userState } = useContext(UserContext);
  const campaignId = userState?.user?.campaign_id ?? null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Gestión de Links
        </h1>

        <YesLinksDashboard
          clientScope={campaignId ? { campaign: campaignId } : undefined}
        />
      </div>
    </Layout>
  );
};

export default YesLinksPage;
```

### Filtrar también por tags

Si un cliente tiene múltiples servicios (SMS, Voz, Email) identificados por tags:

```jsx
<YesLinksDashboard
  clientScope={{
    campaign: campaignId,
    tags: ['sms', 'whatsapp'],  // solo links de estos canales
  }}
/>
```

> **Nota técnica:** Los tags se envían como parámetros repetidos (`?tags[]=sms&tags[]=whatsapp`), sin doble codificación. El backend de yes-links los procesa correctamente.

---

## 6. Modo portal de cliente: `mode="external"`

Cuando el dashboard lo ve **el cliente final** (no el admin de PUY), no queremos que vea ni pueda editar el campo "Campaña" al crear un link — ese valor ya está determinado por su cuenta.

Usa `mode="external"` junto con `clientScope`:

```jsx
<YesLinksDashboard
  clientScope={{ campaign: campaignId }}
  mode="external"
/>
```

### Diferencias visuales entre `mode="internal"` y `mode="external"`

| Funcionalidad | `internal` (default) | `external` (portal de cliente) |
|---|---|---|
| Filtros de campaña/tags visibles | ✅ Sí | ❌ Ocultos |
| Campo "Campaña" en crear link | ✅ Editable | ❌ Oculto (se aplica automáticamente desde `clientScope`) |
| Campo "Tags" en crear link | ✅ Editable | ❌ Oculto (se aplica automáticamente desde `clientScope`) |
| Lista de links | ✅ Filtrada por scope | ✅ Filtrada por scope |
| Estadísticas | ✅ Del scope | ✅ Del scope |

### Ejemplo completo para portal de cliente

```jsx
// pages/portal/links.js — página que ve el cliente directamente
import { YesLinksDashboard } from '@yes/links-ui';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

const PortalLinksPage = () => {
  const { state } = useContext(UserContext);
  const campaignId = state?.user?.campaign_id;

  // Si el usuario no tiene campaign_id, no renderizamos el dashboard
  if (!campaignId) {
    return <p className="text-gray-500">Cargando...</p>;
  }

  return (
    <div className="p-6">
      <YesLinksDashboard
        clientScope={{ campaign: campaignId }}
        mode="external"
      />
    </div>
  );
};

export default PortalLinksPage;
```

---

## 7. Uso avanzado: hooks directos

Si necesitas mostrar datos de yes-links **dentro de una página existente** (por ejemplo, en `pages/dashboard.js` junto a los KPIs de SMS), usa los hooks en lugar del componente completo.

### `useLinks` — Lista de links

```jsx
import { useLinks } from '@yes/links-ui';

const MiComponente = ({ campaignId }) => {
  const { data, status, error } = useLinks({
    clientScope: { campaign: campaignId },
  });

  if (status === 'loading') return <p>Cargando links...</p>;
  if (status === 'error')   return <p>Error: {error?.message}</p>;

  return (
    <ul>
      {data?.items.map(link => (
        <li key={link.id}>
          <a href={link.target_url}>{link.short_code}</a>
        </li>
      ))}
    </ul>
  );
};
```

### `useStats` — Estadísticas KPI

```jsx
import { useStats } from '@yes/links-ui';

const EstadisticasLinks = ({ campaignId }) => {
  const { kpis, status } = useStats({
    clientScope: { campaign: campaignId },
  });

  if (status !== 'success') return null;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Total Links</p>
        <p className="text-2xl font-bold">{kpis.totalLinks}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Total Clicks</p>
        <p className="text-2xl font-bold">{kpis.totalClicks}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Clicks / Link</p>
        <p className="text-2xl font-bold">{kpis.avgClicksPerLink?.toFixed(1)}</p>
      </div>
    </div>
  );
};
```

### Integrar en `pages/dashboard.js`

```jsx
// Al inicio del archivo, agrega:
import { useStats } from '@yes/links-ui';

// Dentro del componente DashboardAgaval, agrega:
const { kpis: linksKpis, status: linksStatus } = useStats({
  clientScope: { campaign: 'agaval' },
});

// En el JSX, donde ya tienes los KPIs de SMS/Voz/Email, agrega:
{linksStatus === 'success' && (
  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
    <h3 className="font-semibold text-blue-800">Links cortos</h3>
    <p>{linksKpis.totalLinks} links · {linksKpis.totalClicks} clicks</p>
  </div>
)}
```

---

## 8. Integración con el Layout de PUY

El `Layout.jsx` de PUY ya maneja autenticación, sidebar y guards de sesión. Tu página de links solo necesita envolverse con él, como cualquier otra página.

### Patrón correcto

```jsx
// pages/yes-links.js
import Layout from '../components/Layout';
import { YesLinksDashboard } from '@yes/links-ui';

const YesLinksPage = () => (
  <Layout>
    {/* El Layout ya provee el sidebar, header y protección de ruta */}
    <YesLinksDashboard />
  </Layout>
);

export default YesLinksPage;
```

### Protección de ruta (si aplica)

Si la página de links debe ser solo para admins, usa el mismo patrón que las otras páginas protegidas de PUY. El SDK en sí no maneja auth — simplemente no fetcha datos si `token` es `null`.

---

## 9. Solución de problemas comunes

### El dashboard no muestra datos

**Verifica en este orden:**

1. ¿El `YesLinksProvider` está en `_app.js` envolviendo el árbol? ✅
2. ¿Las variables `NEXT_PUBLIC_YES_LINKS_BASE_URL` y `NEXT_PUBLIC_YES_LINKS_TOKEN` están definidas en `.env.local`? ✅
3. ¿El servidor de yes-links está corriendo en el puerto correcto? Prueba:
   ```bash
   curl http://localhost:8001/links
   ```
4. ¿Hay error de CORS? Abre el DevTools (F12 → Network) y busca errores en las peticiones a `localhost:8001`.

### Error: `Cannot find module '@yes/links-ui'`

El SDK no está instalado o la referencia `file:` no apunta al lugar correcto.

```bash
# Verifica la ruta relativa desde AppCenterFrontend hacia yes-links-ui
ls ../../../yes-links/yes-links-ui/dist/
# Si no existe la carpeta dist/, el SDK no está compilado. Compílalo:
cd ../../../yes-links/yes-links-ui && npm run build:lib
```

### Los estilos del dashboard se ven rotos

El CSS del SDK no está importado. Verifica que en `styles/globals.css` tienes:

```css
@import "@yes/links-ui/dist/yes-links-ui.css";
```

Si el archivo CSS no existe en `dist/`, re-compila el SDK con `npm run build:lib`.

### Los links no están filtrados por cliente

Estás usando `YesLinksDashboard` sin `clientScope`. Verifica que:

```jsx
// ❌ Incorrecto — muestra todos los links del sistema
<YesLinksDashboard />

// ✅ Correcto — muestra solo los links de este cliente
<YesLinksDashboard clientScope={{ campaign: campaignId }} />
```

### El campo "Campaña" aparece en el formulario de crear link (portal de cliente)

Olvidaste pasar `mode="external"`:

```jsx
// ✅
<YesLinksDashboard
  clientScope={{ campaign: campaignId }}
  mode="external"
/>
```

### TypeScript: error de tipos en `clientScope`

Si tu proyecto usa TypeScript (o si en el futuro migran), el tipo correcto es:

```ts
import type { ClientScope } from '@yes/links-ui';

const scope: ClientScope = {
  campaign: 'agaval',
  tags: ['sms'],
};
```

---

## Referencia rápida de props

### `<YesLinksProvider>`

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `token` | `string \| null` | ✅ | JWT de autenticación. `null` deshabilita los fetches. |
| `baseUrl` | `string` | ✅ | URL base de la API de yes-links, sin slash final. |

### `<YesLinksDashboard>`

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `clientScope` | `{ campaign?: string; tags?: string[] }` | `undefined` | Filtra todos los fetches al subset del cliente. |
| `mode` | `'internal' \| 'external'` | `'internal'` | `'external'` oculta campos de campaña/tags en la UI. |

### `useLinks(options)`

| Opción | Tipo | Descripción |
|--------|------|-------------|
| `clientScope` | `ClientScope` | Igual que en el componente. |
| `enabled` | `boolean` | `false` deshabilita el fetch. Útil para esperar que el usuario esté autenticado. |

### `useStats(options)`

| Opción | Tipo | Descripción |
|--------|------|-------------|
| `clientScope` | `ClientScope` | Filtra el endpoint `/dashboard/summary`. |
| `enabled` | `boolean` | Igual que en `useLinks`. |

---

## Checklist de integración

Antes de marcar la integración como completa, verifica:

- [ ] `@yes/links-ui` instalado y aparece en `package.json`
- [ ] CSS importado en `styles/globals.css`
- [ ] `YesLinksProvider` registrado en `pages/_app.js` con `token` y `baseUrl`
- [ ] Variables de entorno en `.env.local` (no commiteadas)
- [ ] Página `/yes-links` creada y accesible desde el sidebar
- [ ] `clientScope` pasado con el campaign_id del cliente activo
- [ ] `mode="external"` en vistas de portal de cliente final
- [ ] Probado en dev: lista de links, stats y crear link funcionan

---

*Generado por el equipo de plataforma Yes — Sprint 1 · 2026-05-05*
