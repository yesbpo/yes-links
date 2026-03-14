# YES LINKS UI: Plan Maestro de Industrialización (High Fidelity)

## 🎯 Objetivo
Transformar el paquete `@yes/links-ui` en una librería de componentes de clase mundial ("Stripe/Linear level") basada en la referencia de Figma, asegurando simetría, minimalismo corporativo y contratos de datos ultra-eficientes.

---

## 🏗️ Fase 1: ADN Visual y Tokens de Alta Fidelidad
*Objetivo: Establecer el sistema de diseño inmutable y libre de hardcoding.*

### Tarea 1.1: Transcripción de Tokens Figma-to-Code
- **Planning:** Mapear `Figma reference/src/styles/theme.css` a nuestro `src/app/globals.css`. [DONE]
- **Red:** Crear test en `tokens.test.ts` que valide la existencia de variables de elevación, glassmorphism y rejilla de 8px. [DONE]
- **Green:** Implementar los tokens en el bloque `.yes-link-root`. [DONE]
- **Optimize:** Usar funciones de color dinámicas de Tailwind 4 para variantes de opacidad. [DONE]
- **Validate:** Captura de pantalla con Playwright comparando el color de superficie contra la referencia. [DONE]

---

## 🧩 Fase 2: Componentes Atómicos Resilientes
*Objetivo: Replicar la geometría de Figma con lógica de estado industrial.*

### Tarea 2.1: RemediationToast (El pilar de Resiliencia) [DONE]
- **Planning:** Diseñar la lógica para toasts con barra de progreso y botones de acción rápida.
- **Red:** Test de integración (`RemediationToast.test.tsx`) verificado.
- **Green:** Implementado usando `sonner` y diseño personalizado basado en `remediation-toast.tsx` de Figma.
- **Optimize:** Refactorizado a un patrón de "Actionable Notification" con soporte para `progressLabel` e internacionalización.
- **Observability:** Integrado con Pino y OTel traces.
- **Validate:** Storybook stories creadas y funcionales.

### Tarea 2.2: LinkCard (Polimorfismo Grid/List) [DONE]
- **Planning:** Implementar la tarjeta interactiva con sparklines (minicharts) y estados de hover.
- **Red:** Test unitario (`LinkCard.test.tsx`) verificado.
- **Green:** Implementado con motor de Sparkline SVG nativo (ligero) y Tailwind 4 para transiciones.
- **Optimize:** Soporte para `viewMode="grid" | "list"`, `sparkline_data` dinámico y persistencia de "Copy to Clipboard".
- **Validate:** Integración completa en `Dashboard` y `LinkList`.

---

## 📡 Fase 3: Capa de Datos y Contratos de Filtrado
*Objetivo: Implementar la eficiencia de "fetch-only-needed".*

### Tarea 3.1: Hook `useLinks` con Contrato de Filtrado [DONE]
- **Planning:** Definir el contrato `GET /links?tags=...&campaign=...&limit=...`.
- **Red:** Test de hook (`useLinks.test.ts`) verificando límites de 20 registros y `x-request-id`.
- **Green:** Implementado hook nativo con `AbortController` para cancelación de peticiones redundantes.
- **Optimize:** Manejo de estados `idle | loading | success | error` y propagación de telemetría.
- **Validate:** Auditoría de red (`network-audit.spec.ts`) confirmando cumplimiento de contrato.

### Tarea 3.2: FilterBar Flotante (Search & Pill Dropdowns) [DONE]
- **Planning:** Crear el bar de filtros con pills expansibles para Tags y Campañas.
- **Red:** Test unitario (`FilterBar.test.tsx`) cubriendo búsqueda debounced y dropdowns.
- **Green:** Implementado `FilterBar.tsx` con diseño flotante, backdrop-blur y menús contextuales.
- **Optimize:** Debounce de 500ms implementado para búsqueda y filtros de tags/campaign.
- **Validate:** Integración verificada en el Dashboard principal.

---

## 📊 Fase 4: Dashboards de Analíticas (High-End)
*Objetivo: Ensamblar la experiencia final de usuario de negocio.*

### Tarea 4.1: Widgets de KPI y Tendencias [DONE]
- **Planning:** Diseñar los tiles de KPI con tendencias porcentuales y gráficos de área.
- **Red:** Test unitarios (`KPIStats.test.tsx`, `PerformanceTrends.test.tsx`) verificados.
- **Green:** Implementado `KPIStats.tsx` con 4 métricas clave y tendencias dinámicas. Implementado `PerformanceTrends.tsx` con motor de Area Chart SVG (dual path).
- **Optimize:** Uso de gradientes lineales nativos y rejillas punteadas para estética Stripe/Linear.
- **Validate:** Integración en el dashboard principal con hidratación de datos mock realistas.

---

## ✅ Fase 5: Auditoría Constitucional y Empaquetado
*Objetivo: Certificar la entrega para consumo externo.*

### Tarea 5.1: Build & Type Safety Validation
- **Planning:** Verificar la integridad de los archivos `.d.ts`.
- **Verify:** Ejecutar `npm run build:lib`.
- **Audit:** Revisar cumplimiento de las 7 reglas de la Constitución.
- **Closure:** Actualizar `README.md` con ejemplos de uso del nuevo `Filter Contract`.
