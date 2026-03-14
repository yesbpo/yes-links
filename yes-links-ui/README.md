# @yes/links-ui SDK

El SDK de **YES LINKS** es una librería de componentes React diseñada para integrarse en cualquier aplicación del ecosistema Yes. Permite gestionar enlaces cortos, monitorear campañas y visualizar analíticas con un enfoque en **resiliencia**, **observabilidad** y **cero conflictos de estilo**.

## 1. Instalación

```bash
npm install @yes/links-ui
```

## 2. Uso Básico

El SDK utiliza el patrón de **Provider** para gestionar la autenticación, el tema visual y la telemetría.

```tsx
import { YesLinksProvider, YesLinksDashboard } from '@yes/links-ui';
import '@yes/links-ui/dist/style.css';

function App() {
  const auth = {
    token: "tu-jwt-token",
    tenantId: "yes-marketing"
  };

  const myTheme = {
    colors: {
      primary: "#0070f3",
      background: "#ffffff"
    },
    radius: "8px"
  };

  return (
    <YesLinksProvider token={auth.token} theme={myTheme}>
      <YesLinksDashboard />
    </YesLinksProvider>
  );
}
```

## 3. Constitución de Ingeniería (Reglas Inmutables)

Este SDK cumple estrictamente con los 7 pilares de Yes:

1. **Reproducibilidad:** Entorno de desarrollo basado en Docker.
2. **Pruebas Obligatorias:** Cobertura del 100% en lógica de negocio y estados de UI.
3. **Observabilidad:** Emite trazas OpenTelemetry y logs JSON estructurados al `stdout` del host.
4. **Arquitectura Definida:** Estructura de paquetes estandarizada.
5. **Deployment Reproducible:** Build optimizado para ESM y UMD.
6. **Contrato de Endpoint:** Validación de datos mediante Zod.
7. **Emisión de Eventos:** Emite eventos universales como `ui.link_created.v1`.

## 4. Personalización (Cero Hardcoding)

El SDK utiliza un sistema de **Tokens** basado en variables CSS con el prefijo `yes-link-`. Esto garantiza que los estilos no colisionen con tu aplicación host.

### Tokens Disponibles:
- `colors.primary`: Color de marca principal.
- `colors.destructive`: Color para acciones críticas (eliminar).
- `colors.warning` / `colors.info`: Estados semánticos.
- `radius`: Radio de borde global para coherencia visual.

## 5. Resiliencia y UX (Actionable Remediation)

Esta librería implementa el patrón de **Acciones Correctivas** en cada fallo.

### Uso de RemediationToast
```tsx
import { useNotification } from '@yes/links-ui';

const { error } = useNotification();

error({
  title: 'Fallo de Carga',
  message: 'El archivo CSV contiene datos inválidos en la fila 14.',
  remediation: 'Verifica que el short_code no esté duplicado y reintenta.',
  onRetry: () => handleRetry()
});
```

### Componentes de Alta Fidelidad
- `LinkCard`: Tarjeta polimórfica (Grid/List) con sparklines SVG integrados.
- `FilterBar`: Barra flotante con dropdowns de tags/campañas y búsqueda debounced.
- `PerformanceTrends`: Gráficos de área de alta resolución para tendencias de clics.

---
© 2026 Yes Engineering Constitution. Todos los derechos reservados.
