/* =========================================================
   Departments page — search over the cards, and the side
   panel that lists the clicked department's pages.
   Deep link: departments.html#exec opens that department.
   ========================================================= */
(function ($) {
  'use strict';

  var panelEl = document.getElementById('deptPanel');
  var $panel = $(panelEl);
  var colorClass = '';

  function openDepartment($card) {
    var $head = $card.find('.card-body');

    $panel.removeClass(colorClass);
    colorClass = ($card.attr('class').match(/dept--\w+/) || [''])[0];
    $panel.addClass(colorClass);

    $('#deptPanelTitle').text($head.find('.dept-card__title').text());
    $panel.find('[data-panel-desc]').text($head.find('.dept-card__desc').text());
    $panel.find('[data-panel-icon]').empty().append($head.find('.dept-tile i').clone());

    var tpl = $card.siblings('template[data-dept-pages]')[0];
    $panel.find('[data-panel-pages]').empty().append($(tpl.content.firstElementChild.cloneNode(true)).children());

    var href = $card.attr('data-dept-href');
    $panel.find('[data-panel-enter]').attr('href', href || '#').toggleClass('d-none', !href);

    bootstrap.Offcanvas.getOrCreateInstance(panelEl).show();
  }

  function filter(query) {
    var $cards = $('[data-dept-card]');
    var shown = 0;
    $cards.each(function () {
      var match = App.matches($(this), query);
      $(this).toggleClass('d-none', !match);
      if (match) { shown++; }
    });
    $('#deptEmpty').toggleClass('d-none', shown > 0);
  }

  function openFromHash() {
    var id = location.hash.slice(1);
    var $card = id ? $('.dept-card[data-dept="' + id + '"]') : $();
    if ($card.length) { openDepartment($card); }
  }

  $(function () {
    $('#deptGrid').on('click', '.dept-card', function (e) {
      e.preventDefault();
      history.replaceState(null, '', '#' + $(this).attr('data-dept'));
      openDepartment($(this));
    });

    panelEl.addEventListener('hidden.bs.offcanvas', function () {
      history.replaceState(null, '', location.pathname);
    });

    $('#deptSearch').on('input', function () { filter($.trim($(this).val())); });
    $(document).on('app:search', function (e, value) {
      $('#deptSearch').val(value);
      filter(value);
    });

    $(window).on('hashchange', openFromHash);
    openFromHash();
  });
})(jQuery);
