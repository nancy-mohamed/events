/* =========================================================
   Type distribution — horizontal bars (jQuery plugin)
   Usage:
     $('#el').typeDistribution({ items: [{ label, count, color }] });
   ========================================================= */
(function ($) {
  'use strict';

  function escapeHtml(text) {
    return $('<div>').text(text).html();
  }

  $.fn.typeDistribution = function (options) {
    var settings = $.extend({ items: [] }, options);

    var max = 0;
    $.each(settings.items, function (_, item) { max = Math.max(max, item.count); });

    return this.each(function () {
      var $root = $(this).empty().addClass('type-distribution');

      $.each(settings.items, function (_, item) {
        var width = max ? (item.count / max) * 100 : 0;
        // Keep tiny values visible as a full rounded pill
        var minWidth = item.count > 0 ? 'min-width:12px;' : '';

        $root.append(
          '<div class="type-distribution__row">' +
            '<span class="type-distribution__label text-truncate" title="' + escapeHtml(item.label) + '">' + escapeHtml(item.label) + '</span>' +
            '<div class="type-distribution__track" role="img" aria-label="' + escapeHtml(item.label) + ': ' + item.count + '">' +
              '<div class="type-distribution__bar" data-width="' + width + '" style="' + minWidth + 'background-color:' + item.color + '"></div>' +
            '</div>' +
            '<span class="type-distribution__count">' + item.count + '</span>' +
          '</div>'
        );
      });

      var $bars = $root.find('.type-distribution__bar');
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          $bars.each(function () {
            $(this).css('width', $(this).data('width') + '%');
          });
        });
      });
    });
  };
})(jQuery);
