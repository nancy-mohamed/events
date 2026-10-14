/* =========================================================
   Dashboard chart data — read by the chart plugins in dashboard.js.
   Everything else on the page is static HTML.
   ========================================================= */
window.DashboardData = {
  approval: { approved: 92, total: 139 },

  stages: [
    {
      key: 'draft',
      label: 'مسودة',
      count: 46,
      icon: 'ph-pencil-simple-line',
      variant: 'cyan'
    },
    {
      key: 'ready',
      label: 'جاهز للاعتماد',
      count: 1,
      icon: 'ph-hourglass-medium',
      variant: 'warning',
      cta: {
        label: 'راجعه الآن',
        href: '#'
      }
    },
    {
      key: 'approved',
      label: 'معتمد',
      count: 92,
      icon: 'ph-check',
      variant: 'green'
    }
  ],

  types: [
    {
      label: 'برنامج فردي',
      count: 115,
      color: 'var(--chart-1)'
    },
    {
      label: 'مسار تدريبي',
      count: 16,
      color: 'var(--chart-2)'
    },
    {
      label: 'استشارة / إرشاد',
      count: 4,
      color: 'var(--chart-3)'
    },
    {
      label: 'ورشة عمل',
      count: 3,
      color: 'var(--chart-3)'
    },
    {
      label: 'شهادة احترافية',
      count: 1,
      color: 'var(--chart-4)'
    }
  ],

  classification: [
    {
      label: 'تطويري',
      count: 83,
      color: 'var(--chart-1)'
    },
    {
      label: 'تأهيلي',
      count: 39,
      color: 'var(--chart-3)'
    }
  ]
};
