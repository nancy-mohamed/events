/* =========================================================
   Catalog — page behavior (dev/catalog.html)
   Cards are static HTML ([data-item]); this file filters, sorts,
   pages and selects them. Status badges come from
   <template id="statusBadge-*">.
   ========================================================= */
(function ($) {
  'use strict';

  var PAGE_SIZE = 9;

  var state = {
    type: $('#catalogTabs .catalog-tab.active').attr('data-type'),
    query: '',
    status: '',
    classification: '',
    sort: 'newest',
    page: 1
  };

  var $grid = $('#catalogGrid');

  /* ---------- Element helpers ---------- */
  function allItems() {
    return $grid.children('[data-item]');
  }

  function activeItems() {
    return allItems().not('[data-archived]');
  }

  function filteredItems() {
    return activeItems().filter(function () {
      var $item = $(this);
      return $item.attr('data-type') === state.type &&
        (!state.status || $item.attr('data-status') === state.status) &&
        (!state.classification || $item.attr('data-classification') === state.classification) &&
        App.matches($item, state.query);
    });
  }

  function selectedItems() {
    return activeItems().filter(function () {
      return $(this).find('.catalog-card__check').prop('checked');
    });
  }

  function setChecked($items, checked) {
    $items.find('.catalog-card__check').prop('checked', checked);
    $items.find('.catalog-card').toggleClass('is-selected', checked);
  }

  function setStatus($item, status) {
    $item.attr('data-status', status);
    $item.find('[data-status-badge]').replaceWith(App.fromTemplate('statusBadge-' + status));
  }

  /* ---------- Sorting: reorders the existing cards ---------- */
  function sortItems() {
    var items = allItems().get();
    items.sort(function (a, b) {
      var $a = $(a);
      var $b = $(b);
      switch (state.sort) {
        case 'price-desc': return Number($b.attr('data-price')) - Number($a.attr('data-price'));
        case 'price-asc': return Number($a.attr('data-price')) - Number($b.attr('data-price'));
        case 'name': return $a.find('.catalog-card__title').text().localeCompare($b.find('.catalog-card__title').text(), 'ar');
        default:
          return $b.attr('data-created').localeCompare($a.attr('data-created')) ||
            Number($b.attr('data-id')) - Number($a.attr('data-id'));
      }
    });
    $grid.prepend(items);
  }

  /* ---------- Render ---------- */
  function renderTabs() {
    $('#catalogTabs .catalog-tab').each(function () {
      var $tab = $(this);
      var type = $tab.attr('data-type');
      var active = type === state.type;
      $tab.toggleClass('active', active).attr('aria-selected', active);
      $tab.find('.catalog-tab__count').text(activeItems().filter('[data-type="' + type + '"]').length);
    });
  }

  function render() {
    var $filtered = filteredItems();
    var typeHasItems = activeItems().filter('[data-type="' + state.type + '"]').length > 0;

    allItems().addClass('d-none');
    var info = App.paginate($filtered, state.page, PAGE_SIZE);
    state.page = info.page;

    $grid.children('[data-empty="type"]').toggleClass('d-none', typeHasItems)
      .find('[data-empty-type]').text($('#catalogTabs [data-type="' + state.type + '"]').attr('data-label'));
    $grid.children('[data-empty="filter"]').toggleClass('d-none', !typeHasItems || info.total > 0);

    renderTabs();
    $('#catalogCount').text(info.total ? 'عرض ' + info.from + '–' + info.to + ' من ' + info.total + ' وحدة' : '');
    $('#catalogPagination').appPagination({
      page: info.page,
      pages: info.pages,
      onChange: function (page) {
        state.page = page;
        render();
        document.getElementById('catalogTabs').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    renderSelection();
  }

  function renderSelection() {
    var $selected = selectedItems();
    var $filtered = filteredItems();
    var count = $selected.length;
    var drafts = $selected.filter('[data-status="draft"]').length;
    var visibleSelected = $filtered.filter(function () { return $(this).find('.catalog-card__check').prop('checked'); }).length;

    $('#catalogBulk').toggleClass('d-none', !count).toggleClass('d-flex', !!count);
    $('#catalogBulkCount').text('تم تحديد ' + count + (count === 1 ? ' وحدة' : ' وحدات'));
    $('#catalogDraftCount').text(drafts);
    $('#btnSendReview').prop('disabled', !drafts).attr('title', drafts ? '' : 'لا توجد مسودات ضمن المحدد');

    $('#catalogSelectAll')
      .prop('checked', $filtered.length > 0 && visibleSelected === $filtered.length)
      .prop('indeterminate', visibleSelected > 0 && visibleSelected < $filtered.length)
      .prop('disabled', !$filtered.length);
  }

  /* ---------- Actions ---------- */
  function sendDraftsToReview() {
    selectedItems().filter('[data-status="draft"]').each(function () { setStatus($(this), 'ready'); });
    setChecked(allItems(), false);
    render();
  }

  function archiveSelected() {
    var $archived = selectedItems();
    $archived.attr('data-archived', '');
    setChecked($archived, false);
    render();
  }

  /* ---------- Bindings ---------- */
  function bind() {
    $('#catalogTabs').on('click', '[data-type]', function () {
      state.type = $(this).attr('data-type');
      state.page = 1;
      setChecked(allItems(), false);
      render();
    });

    var debounce;
    $('#catalogSearch').on('input', function () {
      var value = $.trim($(this).val());
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        state.query = value;
        state.page = 1;
        render();
      }, 200);
    });

    $(document).on('app:search', function (_, query) {
      $('#catalogSearch').val(query);
      state.query = query;
      state.page = 1;
      render();
    });

    $('#catalogStatus').on('change', function () { state.status = $(this).val(); state.page = 1; render(); });
    $('#catalogClassification').on('change', function () { state.classification = $(this).val(); state.page = 1; render(); });
    $('#catalogSort').on('change', function () {
      state.sort = $(this).val();
      state.page = 1;
      sortItems();
      render();
    });

    $grid.on('change', '.catalog-card__check', function () {
      $(this).closest('.catalog-card').toggleClass('is-selected', this.checked);
      renderSelection();
    });

    $('#btnResetFilters').on('click', function () {
      state.query = '';
      state.status = '';
      state.classification = '';
      $('#catalogSearch, #globalSearch').val('');
      $('#catalogStatus, #catalogClassification').val('');
      render();
    });

    $('#catalogSelectAll').on('change', function () {
      setChecked(filteredItems(), this.checked);
      renderSelection();
    });

    $('#btnClearSelection').on('click', function () {
      setChecked(allItems(), false);
      renderSelection();
    });
    $('#btnSendReview').on('click', sendDraftsToReview);

    var archiveModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('archiveModal'));
    $('#btnArchive').on('click', function () {
      var count = selectedItems().length;
      $('#archiveModalText').text('سيتم نقل ' + count + (count === 1 ? ' وحدة' : ' وحدات') + ' إلى الأرشيف وإخفاؤها من الكتالوج.');
      archiveModal.show();
    });
    $('#btnConfirmArchive').on('click', function () {
      archiveModal.hide();
      archiveSelected();
    });
  }

  $(function () {
    bind();
    render();
  });
})(jQuery);
