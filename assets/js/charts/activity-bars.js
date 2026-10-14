/* =========================================================
   Activity bars — daily attempts for the last N days (jQuery plugin)
   Each bar stacks passed (green) over failed (navy).
   Usage:
     $('#el').activityBars({ endDate: '2026-10-05', days: 30,
       entries: [{ date: '2026-10-04', passed: false }, ...] });
   ========================================================= */
(function ($) {
  'use strict';

  function isoDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function shortLabel(iso) {
    var parts = iso.split('-');
    return Number(parts[2]) + '/' + Number(parts[1]);
  }

  $.fn.activityBars = function (options) {
    var settings = $.extend({ endDate: null, days: 30, entries: [] }, options);
    var end = settings.endDate ? new Date(settings.endDate + 'T00:00:00') : new Date();

    var buckets = [];
    var index = {};
    for (var i = settings.days - 1; i >= 0; i--) {
      var d = new Date(end);
      d.setDate(end.getDate() - i);
      var key = isoDate(d);
      index[key] = buckets.length;
      buckets.push({ date: key, total: 0, passed: 0 });
    }

    $.each(settings.entries, function (_, e) {
      var b = buckets[index[e.date]];
      if (!b) { return; }
      b.total += 1;
      if (e.passed) { b.passed += 1; }
    });

    var max = 0;
    $.each(buckets, function (_, b) { max = Math.max(max, b.total); });
    var totalAttempts = 0;
    var totalPassed = 0;
    $.each(buckets, function (_, b) { totalAttempts += b.total; totalPassed += b.passed; });

    return this.each(function () {
      var $root = $(this).empty().addClass('activity-bars');

      var bars = $.map(buckets, function (b) {
        var h = max ? (b.total / max) * 100 : 0;
        var passedShare = b.total ? (b.passed / b.total) * 100 : 0;
        var label = shortLabel(b.date) + ': ' + b.total + ' محاولة · ' + b.passed + ' ناجح';
        return (
          '<div class="activity-bars__col" title="' + label + '">' +
            '<div class="activity-bars__bar' + (b.total ? '' : ' is-empty') + '" style="height:' + (b.total ? Math.max(h, 8) : 4) + '%">' +
              (b.total ? '<span class="activity-bars__passed" style="height:' + passedShare + '%"></span>' : '') +
            '</div>' +
          '</div>'
        );
      }).join('');

      $root.append(
        '<div class="activity-bars__plot" role="img" aria-label="' + totalAttempts + ' محاولة و' + totalPassed + ' ناجح خلال آخر ' + settings.days + ' يومًا">' + bars + '</div>' +
        '<div class="activity-bars__axis d-flex justify-content-between">' +
          '<span>' + shortLabel(buckets[0].date) + '</span>' +
          '<span>' + shortLabel(buckets[buckets.length - 1].date) + '</span>' +
        '</div>' +
        '<div class="activity-bars__legend d-flex gap-3 mt-2">' +
          '<span class="d-flex align-items-center gap-1"><span class="activity-bars__swatch activity-bars__swatch--failed"></span>محاولات</span>' +
          '<span class="d-flex align-items-center gap-1"><span class="activity-bars__swatch activity-bars__swatch--passed"></span>ناجح</span>' +
        '</div>'
      );
    });
  };
})(jQuery);
