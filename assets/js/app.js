/* =========================================================
   App — shared shell (every page)
   Behavior only: all markup lives in the HTML pages.
   Exposes window.App helpers for page scripts.
   ========================================================= */
(function ($) {
  'use strict';

  var THEME_KEY = 'app-theme';
  var numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

  /* Clone the first element of a <template id="..."> as a jQuery object. */
  function fromTemplate(id) {
    var tpl = document.getElementById(id);
    return $(tpl.content.firstElementChild.cloneNode(true));
  }

  function todayIso() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* ---------- Paging over existing elements ----------
     Shows one page of $items (hides the rest with Bootstrap's d-none). */
  function paginate($items, page, pageSize) {
    var total = $items.length;
    var pages = Math.max(Math.ceil(total / pageSize), 1);
    page = Math.min(Math.max(page, 1), pages);
    var start = (page - 1) * pageSize;

    $items.each(function (i) {
      $(this).toggleClass('d-none', i < start || i >= start + pageSize);
    });

    return {
      page: page,
      pages: pages,
      total: total,
      from: total ? start + 1 : 0,
      to: Math.min(start + pageSize, total)
    };
  }

  /* ---------- Pagination control (jQuery plugin) ----------
     $('#ul').appPagination({ page: 1, pages: 9, onChange: fn });
     Builds items from #pageItemTemplate / #pageGapTemplate / #pagePrevTemplate / #pageNextTemplate. */
  $.fn.appPagination = function (options) {
    var settings = $.extend({ page: 1, pages: 1, onChange: $.noop }, options);
    var current = settings.page;
    var pages = settings.pages;

    function pageItem(page, active) {
      var $li = fromTemplate('pageItemTemplate');
      var $link = $li.find('.page-link').text(page).attr('data-page', page);
      if (active) { $li.addClass('active'); $link.attr('aria-current', 'page'); }
      return $li;
    }

    function arrow(templateId, page, disabled) {
      var $li = fromTemplate(templateId);
      $li.toggleClass('disabled', disabled).find('.page-link').attr('data-page', page);
      return $li;
    }

    var numbers = [];
    for (var p = 1; p <= pages; p++) {
      if (p === 1 || p === pages || Math.abs(p - current) <= 1) { numbers.push(p); }
    }

    return this.each(function () {
      var $ul = $(this).empty();
      $ul.append(arrow('pagePrevTemplate', current - 1, current === 1));
      $.each(numbers, function (i, n) {
        if (i > 0 && n - numbers[i - 1] > 1) { $ul.append(fromTemplate('pageGapTemplate')); }
        $ul.append(pageItem(n, n === current));
      });
      $ul.append(arrow('pageNextTemplate', current + 1, current === pages));
      $ul.closest('nav').toggle(pages > 1);

      $ul.off('click.appPagination').on('click.appPagination', '.page-link[data-page]', function (e) {
        e.preventDefault();
        if ($(this).parent().is('.disabled, .active')) { return; }
        settings.onChange(Number($(this).attr('data-page')));
      });
    });
  };

  /* ---------- Text search over [data-search] elements ---------- */
  function matches($el, query) {
    if (!query) { return true; }
    var text = $el.find('[data-search]').addBack('[data-search]').map(function () {
      return $(this).text();
    }).get().join(' ').toLowerCase();
    return text.indexOf(query.toLowerCase()) !== -1;
  }

  /* ---------- Header ---------- */
  function bindSidebarToggle() {
    var sidebar = document.getElementById('appSidebar');
    var desktop = window.matchMedia('(min-width: 992px)');

    $('#btnSidebar').on('click', function () {
      if (desktop.matches) {
        $('body').toggleClass('sidebar-collapsed');
      } else {
        bootstrap.Offcanvas.getOrCreateInstance(sidebar).toggle();
      }
    });
  }

  /* Header search broadcasts `app:search` — each page decides what to filter. */
  function bindSearch() {
    var debounce;

    $('#btnSearch').on('shown.bs.dropdown', function () {
      $('#globalSearch').trigger('focus');
    });

    $('#globalSearch').on('input', function () {
      var value = $.trim($(this).val());
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        $(document).trigger('app:search', [value]);
      }, 200);
    }).on('keydown', function (e) {
      if (e.key !== 'Enter') { return; }
      e.preventDefault();
      bootstrap.Dropdown.getOrCreateInstance(document.getElementById('btnSearch')).hide();
      var target = document.querySelector('[data-search-target]');
      if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  }

  /* Buttons outside a tab bar that open a tab: <button data-show-tab="#tab-id">
     (the tab trigger may be hidden, e.g. edit / analysis / preview screens) */
  function bindTabLinks() {
    $(document).on('click', '[data-show-tab]', function (e) {
      e.preventDefault();
      var trigger = document.querySelector($(this).attr('data-show-tab'));
      if (!trigger) { return; }
      bootstrap.Tab.getOrCreateInstance(trigger).show();
      var tabsCard = trigger.closest('.card');
      if (tabsCard) { tabsCard.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });

    /* Design-only forms: keep the page from reloading on submit */
    $(document).on('submit', 'form[data-static-form]', function (e) {
      e.preventDefault();
    });
  }

  function applyThemeIcon() {
    var dark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    $('#btnTheme')
      .attr('aria-label', dark ? 'الوضع الفاتح' : 'الوضع الداكن')
      .find('i').toggleClass('ph-moon', !dark).toggleClass('ph-sun', dark);
  }

  function bindTheme() {
    applyThemeIcon();
    $('#btnTheme').on('click', function () {
      var next = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-bs-theme', next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyThemeIcon();
    });
  }

  function bindFullscreen() {
    $('#btnFullscreen').on('click', function () {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen && document.exitFullscreen();
      }
    });

    $(document).on('fullscreenchange', function () {
      $('#btnFullscreen i')
        .toggleClass('ph-corners-out', !document.fullscreenElement)
        .toggleClass('ph-corners-in', !!document.fullscreenElement);
    });
  }

  window.App = {
    numberFormat: numberFormat,
    fromTemplate: fromTemplate,
    todayIso: todayIso,
    paginate: paginate,
    matches: matches
  };

  $(function () {
    bindSidebarToggle();
    bindSearch();
    bindTabLinks();
    bindTheme();
    bindFullscreen();
    $('#footerYear').text(new Date().getFullYear());
  });
})(jQuery);
