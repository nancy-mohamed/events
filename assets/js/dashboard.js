/* =========================================================
   Dashboard — page behavior (index.html)
   Markup is static HTML; this file only filters/pages it.
   Charts still render from assets/js/data.js.
   ========================================================= */
(function ($) {
  'use strict';

  var data = window.DashboardData;
  var PAGE_SIZE = 5;

  /* ---------- Charts ---------- */
  function renderCharts() {
    $('#chartApprovalGauge').approvalGauge(data.approval);
    $('#chartStagesStepper').stagesStepper({ steps: data.stages });
    $('#chartTypeDistribution').typeDistribution({ items: data.types });
    $('#chartClassification').classificationBar({
      total: data.approval.total,
      segments: data.classification
    });
  }

  /* ---------- Smart alerts: show / hide the extra items ---------- */
  function bindAlerts() {
    var expanded = false;
    $('#alertsToggle').on('click', function () {
      expanded = !expanded;
      $('#alertsList [data-extra]').toggleClass('d-none', !expanded);
      $(this).text(expanded ? 'عرض أقل' : 'عرض الكل');
    });
  }

  /* ---------- Units table ---------- */
  var tableState = { type: '', query: '', page: 1 };

  function renderTable() {
    var $rows = $('#unitsTableBody tr[data-type]');
    var $visible = $rows.filter(function () {
      var $row = $(this);
      return (!tableState.type || $row.attr('data-type') === tableState.type) && App.matches($row, tableState.query);
    });

    $rows.addClass('d-none');
    var info = App.paginate($visible, tableState.page, PAGE_SIZE);
    tableState.page = info.page;

    $('#unitsTableBody [data-empty]').toggleClass('d-none', info.total > 0);
    $('#unitsCount').text(info.total
      ? 'عرض ' + info.from + '–' + info.to + ' من ' + info.total + ' وحدة'
      : 'لا توجد نتائج');
    $('#unitsPagination').appPagination({
      page: info.page,
      pages: info.pages,
      onChange: function (page) {
        tableState.page = page;
        renderTable();
      }
    });
  }

  function bindTable() {
    $('#unitsTypeMenu').on('click', '[data-type]', function (e) {
      e.preventDefault();
      $('#unitsTypeMenu .dropdown-item').removeClass('active');
      $(this).addClass('active');
      tableState.type = $(this).attr('data-type');
      tableState.page = 1;
      $('#unitsFilterLabel').text(tableState.type || 'الكل');
      renderTable();
    });

    $(document).on('app:search', function (_, query) {
      tableState.query = query;
      tableState.page = 1;
      renderTable();
    });
  }

  $(function () {
    renderCharts();
    bindAlerts();
    renderTable();
    bindTable();
  });
})(jQuery);
