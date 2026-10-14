/* =========================================================
   Classification bar — stacked share bar + legend (jQuery plugin)
   Units not covered by any segment are shown as "unclassified".
   Usage:
     $('#el').classificationBar({ total: 139, segments: [{ label, count, color }] });
   ========================================================= */
(function ($) {
  'use strict';

  function escapeHtml(text) {
    return $('<div>').text(text).html();
  }

  $.fn.classificationBar = function (options) {
    var settings = $.extend({
      total: 0,
      segments: [],
      unclassifiedLabel: 'غير مصنّف',
      unclassifiedHint: 'تحتاج تصنيف',
      minLabelPercent: 12
    }, options);

    var classified = 0;
    $.each(settings.segments, function (_, s) { classified += s.count; });
    var total = Math.max(settings.total, classified);
    var unclassified = total - classified;

    function percentOf(count) {
      return total ? Math.round((count / total) * 100) : 0;
    }

    return this.each(function () {
      var $root = $(this).empty().addClass('classification-bar');
      var $bar = $('<div class="classification-bar__track d-flex mb-2" role="img"></div>');
      var $legend = $('<ul class="list-unstyled mb-0"></ul>');
      var aria = [];

      $.each(settings.segments, function (_, s) {
        var pct = percentOf(s.count);
        aria.push(s.label + ' ' + s.count);
        $bar.append(
          '<div class="classification-bar__segment" style="flex-grow:' + s.count + ';background-color:' + s.color + '">' +
            (pct >= settings.minLabelPercent ? pct + '%' : '') +
          '</div>'
        );
        $legend.append(
          '<li class="classification-bar__item d-flex justify-content-between align-items-center py-1">' +
            '<span class="d-flex align-items-center gap-2"><span class="classification-bar__swatch" style="background-color:' + s.color + '"></span>' + escapeHtml(s.label) + '</span>' +
            '<span class="classification-bar__value" title="' + pct + '%">' + s.count + '</span>' +
          '</li>'
        );
      });

      if (unclassified > 0) {
        aria.push(settings.unclassifiedLabel + ' ' + unclassified);
        $bar.append('<div class="classification-bar__segment classification-bar__segment--empty" style="flex-grow:' + unclassified + '"></div>');
        $legend.append(
          '<li class="classification-bar__item d-flex justify-content-between align-items-center py-1">' +
            '<span class="d-flex align-items-center gap-2"><span class="classification-bar__swatch classification-bar__swatch--empty"></span>' + escapeHtml(settings.unclassifiedLabel) + '</span>' +
            '<span class="badge rounded-pill classification-bar__hint">' + unclassified + ' ' + escapeHtml(settings.unclassifiedHint) + '</span>' +
          '</li>'
        );
      }

      $bar.attr('aria-label', aria.join('، '));
      $root.append($bar, $legend);
    });
  };
})(jQuery);
