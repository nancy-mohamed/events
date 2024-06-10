
$(document).ready(function () {
  // Replace 'path/to/your/pdf_file.pdf' with the actual path or URL of the PDF file
  // var pdfPath = 'assets/images/test.pdf';
  // $('.pdf-icon').click(function () {
  //   window.open(pdfPath, '_blank');
  // });

  //start fullscreen

  var elem = document.documentElement;

  $.fn.openFullscreen = function () {
    let open = $('.full-screen-open');
    let close = $('.full-screen-close');

    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
      close.addClass('d-block').removeClass('d-none');
      open.addClass('d-none');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
        console.log('working');
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
      close.removeClass('d-block');
      open.removeClass('d-none');
      close.addClass('d-none');
      open.addClass('d-block');
    }
  };
  $('.fullscreen-btn').on('click', function () {
    $(this).openFullscreen();
  });
  //end fullscreen

  // start rating
  $(".my-rating").starRating({
    totalStars: 5,
    starSize: 35,
    emptyColor: 'lightgray',
    disableAfterRate: false,
    ratedColors: ['#f6b11e', '#ffa700', '#f6b11e', '#f6b11e', '#f6b11e'],
    initialRating: 0,
    strokeWidth: 0,

    useGradient: false,
    minRating: 1,
    callback: function (currentRating, $el) {
      alert('rated ' + currentRating);
      console.log('DOM element ', $el);
    }
  });
  // end rating

  // start select2
  $('.select2').select2();
  // end select2


  // start path card
  // $('.patch-content').hide();
  // $('#confirm_attend').click(function () {
  //     $(".card-attend-event").fadeOut(500, function () {
  //         $(".patch-content").fadeIn(500);
  //     });
  // });
  // end path card

 
});