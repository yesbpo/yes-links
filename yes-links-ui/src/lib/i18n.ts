export const i18n = {
  dashboard: {
    title: 'Panel de Enlaces',
    subtitle: 'Gestiona tus URLs cortas y rastrea el rendimiento.',
    overview: 'Resumen',
    createTitle: 'Crear Enlace',
    bulkTitle: 'Carga Masiva',
    recentTitle: 'Enlaces Recientes',
    loading: 'Iniciando sesión segura...',
    export: 'Exportar',
    exportSuccess: '¡Exportación iniciada con éxito!',
    noExportData: 'No hay datos para exportar',
    noExportRemediation: 'Intenta crear algunos enlaces primero.'
  },
  links: {
    targetUrl: 'URL de Destino',
    campaign: 'Campaña',
    campaignOptional: 'Campaña (Opcional)',
    tags: 'Etiquetas',
    tagsOptional: 'Etiquetas (Opcionales, separadas por coma)',
    createButton: 'Crear Enlace',
    creatingButton: 'Creando...',
    urlPlaceholder: 'https://ejemplo.com/promo',
    campaignPlaceholder: 'oferta-verano-2026',
    tagsPlaceholder: 'promo, social, ig',
    validation: {
      urlInvalid: 'Formato de URL inválido.',
      urlRemediation: 'Asegúrate de que comience con http:// o https:// y tenga un dominio válido.',
      urlRequired: 'La URL de destino es obligatoria.'
    },
    list: {
      loading: 'Cargando enlaces...',
      emptyTitle: 'No se encontraron enlaces',
      emptySubtitle: 'Comienza creando tu primer enlace corto para tu campaña.',
      createFirst: 'Crear tu primer enlace',
      errorTitle: 'Error al cargar los enlaces',
      errorSubtitle: 'Ocurrió un error inesperado al obtener los datos.',
      retry: 'Reintentar',
      edit: 'Editar',
      delete: 'Eliminar'
    }
  },
  bulk: {
    title: 'Cargar CSV',
    subtitle: 'Arrastra y suelta tu archivo aquí o haz clic para buscar',
    supported: 'SOPORTADO: .CSV',
    processing: 'Procesando {progress}%',
    uploading: 'Subiendo enlaces a tu campaña...',
    success: '¡{count} enlaces creados desde el CSV!',
    error: 'Error en la carga masiva',
    errorRemediation: 'Asegúrate de que tu CSV siga el formato requerido.'
  },
  analytics: {
    totalLinks: 'Total de Enlaces',
    totalClicks: 'Total de Clicks',
    topCampaign: 'Campaña Top',
    clicksOverTime: 'Clicks en el tiempo',
    noData: 'No hay datos de clicks disponibles para este periodo.',
    failed: 'Error al cargar analíticas'
  }
}
