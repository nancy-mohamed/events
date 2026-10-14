/* =========================================================
   Stages stepper — development pipeline (jQuery plugin)
   Usage:
     $('#el').stagesStepper({ steps: [{ label, count, icon, variant, cta }] });
   variant: cyan | warning | green
   ========================================================= */
(function ($) {
  'use strict';

  function escapeHtml(text) {
    return $('<div>').text(text).html();
  }

  $.fn.stagesStepper = function (options) {
    var settings = $.extend({ steps: [] }, options);

    return this.each(function () {
      var $root = $(this).empty().addClass('stages-stepper d-flex align-items-start');

      $.each(settings.steps, function (index, step) {
        if (index > 0) {
          var done = step.variant === 'green';
          $root.append('<div class="stages-stepper__line' + (done ? ' stages-stepper__line--done' : '') + '" aria-hidden="true"></div>');
        }

        var cta = step.cta
          ? '<a href="' + escapeHtml(step.cta.href) + '" class="badge rounded-pill stages-stepper__cta text-decoration-none mt-1">' + escapeHtml(step.cta.label) + '</a>'
          : '';

        $root.append(
          '<div class="stages-stepper__step text-center">' +
            '<span class="stages-stepper__icon stages-stepper__icon--' + step.variant + (step.cta ? ' stages-stepper__icon--attention' : '') + '">' +
              '<i class="ph-duotone ' + step.icon + '"></i>' +
            '</span>' +
            '<div class="stages-stepper__count">' + step.count + '</div>' +
            '<div class="stages-stepper__label small">' + escapeHtml(step.label) + '</div>' +
            cta +
          '</div>'
        );
      });
    });
  };
})(jQuery);
