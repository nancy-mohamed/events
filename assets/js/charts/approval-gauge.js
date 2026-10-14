/* =========================================================
   Approval gauge — semicircle gauge (jQuery plugin)
   Usage:
     $('#el').approvalGauge({ approved: 92, total: 139 });
   ========================================================= */
(function ($) {
  'use strict';

  var ARC = 'M14 76 A56 56 0 0 1 126 76';

  $.fn.approvalGauge = function (options) {
    var settings = $.extend({
      approved: 0,
      total: 0,
      approvedLabel: 'معتمد',
      pendingLabel: 'قيد التصميم'
    }, options);

    var percent = settings.total ? Math.round((settings.approved / settings.total) * 100) : 0;
    var pending = Math.max(settings.total - settings.approved, 0);

    return this.each(function () {
      var $root = $(this).empty().addClass('approval-gauge');

      var svg =
        '<svg class="approval-gauge__svg" viewBox="0 0 140 84" role="img" aria-label="نسبة الاعتماد ' + percent + '%">' +
          '<path class="approval-gauge__track" d="' + ARC + '"></path>' +
          '<path class="approval-gauge__value" d="' + ARC + '" pathLength="100"></path>' +
          '<text class="approval-gauge__percent" x="70" y="62" text-anchor="middle">' + percent + '%</text>' +
          '<text class="approval-gauge__caption" x="70" y="78" text-anchor="middle">' + settings.approvedLabel + '</text>' +
        '</svg>';

      var stats =
        '<div class="approval-gauge__stats d-flex justify-content-around text-center border-top pt-2 mt-2">' +
          '<div><div class="approval-gauge__stat approval-gauge__stat--approved">' + settings.approved + '</div>' +
          '<div class="small text-body-secondary">' + settings.approvedLabel + '</div></div>' +
          '<div><div class="approval-gauge__stat">' + pending + '</div>' +
          '<div class="small text-body-secondary">' + settings.pendingLabel + '</div></div>' +
        '</div>';

      $root.append(svg, stats);

      // Animate after first paint
      var $value = $root.find('.approval-gauge__value');
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          $value.css('stroke-dasharray', percent + ' 100');
        });
      });
    });
  };
})(jQuery);
