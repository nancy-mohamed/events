/*-----------------------------------------------------------------------------------

    Theme Name: Archic - Construction and Architecture HTML Template
    Description: Construction and Architecture HTML Template
    Author: Website Design Templates
    Version: 2.0

    ---------------------------------- */

!(function (t) {
  "use strict";
  var n = t(window);
  function a() {
    var e, a;
    (e = t(".full-screen")),
      (a = n.height()),
      e.css("min-height", a),
      (e = t("header").height()),
      (a = t(".screen-height")),
      (e = n.height() - e),
      a.css("height", e);
  }
  t("#preloader").fadeOut("normall", function () {
    t(this).remove();
  }),
    n.on("scroll", function () {
      var e = n.scrollTop(),
        a = t(".navbar-brand img"),
        o = t(".navbar-brand.logodefault img");
      e <= 50
        ? (t("header").removeClass("scrollHeader").addClass("fixedHeader"),
          a.attr("src", "img/logo.png"))
        : (t("header").removeClass("fixedHeader").addClass("scrollHeader"),
          a.attr("src", "img/logo.png")),
        o.attr("src", "img/logo.png");
    }),
    n.on("scroll", function () {
      500 < t(this).scrollTop()
        ? t(".scroll-to-top").fadeIn(400)
        : t(".scroll-to-top").fadeOut(400);
    }),
    t(".scroll-to-top").on("click", function (e) {
      e.preventDefault(), t("html, body").animate({ scrollTop: 0 }, 600);
    }),
    t(".parallax,.bg-img").each(function (e) {
      t(this).attr("data-background") &&
        t(this).css(
          "background-image",
          "url(" + t(this).data("background") + ")"
        );
    }),
    t(".story-video").magnificPopup({ delegate: ".video", type: "iframe" }),
    t(".source-modal").magnificPopup({
      type: "inline",
      mainClass: "mfp-fade",
      removalDelay: 160,
    }),
    n.resize(function (e) {
      setTimeout(function () {
        a();
      }, 500),
        e.preventDefault();
    }),
    0 !== t(".copy-clipboard").length &&
      (new ClipboardJS(".copy-clipboard"),
      t(".copy-clipboard").on("click", function () {
        var e = t(this);
        e.text();
        e.text("Copied"),
          setTimeout(function () {
            e.text("Copy");
          }, 2e3);
      })),
    t(".vision-wrapper").on("mouseenter", function (e) {
      var a = t(this).data("background");
      t(".vision-changebg").animate({ opacity: 0.9 }, 50, function () {
        t(".vision-changebg").css("background-image", "url(" + a + ")");
      }),
        t(".vision-changebg").delay(50).animate({ opacity: 0.9 }, 50);
    }),
    a(),
    new WOW({
      boxClass: "wow",
      animateClass: "animated",
      offset: 0,
      mobile: !1,
      live: !0,
    }).init(),
    t(document).ready(function () {
      t(".portfolio-carousel").owlCarousel({
        loop: !0,
            responsiveClass: !0,
            autoplay: !1,
            autoplayTimeout: 5e3,
            smartSpeed: 1500,
            nav: !1,
            dots: !1,
            autoWidth: !1,
            center: !0,
            margin: 10,
            responsive: {
                0: {
                    items: 1
                },
                576: {
                    items: 2
                },
                768: {
                    items: 3
                },
                992: {
                    items: 3
                },
                1200: {
                    items: 5
                }
            },
      }),
     
      t(".products6-carousel").owlCarousel({
        loop: !0,
            responsiveClass: !0,
            autoplay: !1,
            autoplayTimeout: 5e3,
            smartSpeed: 1500,
            nav: !1,
            dots: !1,
            autoWidth: !1,
            center: !1,
            margin: 0,
            responsive: {
                0: {
                    items: 1
                },
                576: {
                    items: 2
                },
                768: {
                    items: 3
                },
                992: {
                    items: 3
                },
                1200: {
                    items: 5
                }
            },
      }),
        t(".products-carousel").owlCarousel({
          loop: !0,
          responsiveClass: !0,
          autoplay: !0,
          autoplayTimeout: 5e3,
          smartSpeed: 1500,
          nav: !1,
          dots: !1,
          center: !1,
          margin: 30,
          responsive: {
            0: { items: 1 },
            576: { items: 1 },
            768: { items: 2 },
            992: { items: 4 },
          },
        }),
        t(".products3-carousel").owlCarousel({
          loop: !0,
          responsiveClass: !0,
          autoplay: !0,
          autoplayTimeout: 5e3,
          smartSpeed: 1500,
          nav: !1,
          dots: !1,
          center: !1,
          margin: 30,
          responsive: {
            0: { items: 1 },
            576: { items: 1 },
            768: { items: 1 },
            992: { items: 3 },
          },
        }),
        t(".categories-carousel").owlCarousel({
          loop: !1,
          responsiveClass: !0,
          autoplay: !1,
          autoplayTimeout: 5e3,
          smartSpeed: 1500,
          nav: !1,
          dots: !1,
          center: !1,
          margin: 10,
          responsive: {
            0: { items: 2 },
            576: { items: 2 },
            768: { items: 4 },
            992: { items: 5 },
            1024: { items: 5 },
            1440: { items: 7 },
          },
        }),
        t(".client-style1").owlCarousel({
          loop: !0,
          nav: !1,
          dots: !1,
          autoplay: !0,
          smartSpeed: 1500,
          autoplayTimeout: 4e3,
          responsiveClass: !0,
          autoplayHoverPause: !1,
          responsive: {
            0: { items: 1, margin: 30 },
            481: { items: 2, margin: 15 },
            576: { items: 2, margin: 30 },
            768: { items: 3, margin: 30 },
            1600: { items: 3, margin: 80 },
          },
        }),
        t(".testimonial-carousel2").owlCarousel({
          loop: !0,
          responsiveClass: !0,
          nav: !0,
          navText: [
            "<span class='fa-solid fa-arrow-left-long'></span>",
            "<span class='fa-solid fa-arrow-right-long'></span>",
          ],
          dots: !1,
          margin: 50,
          center: !1,
          autoplay: !1,
          autoplayTimeout: 5e3,
          smartSpeed: 1500,
          items: 1,
        }),
        t(".vision-changebg").owlCarousel({
          loop: !0,
          responsiveClass: !0,
          center: !1,
          nav: !0,
          navText: [
            "<i class='ti-angle-left'></i>",
            "<i class='ti-angle-right'></i>",
          ],
          dots: !1,
          autoplay: !0,
          autoplayTimeout: 5e3,
          margin: 0,
          smartSpeed: 900,
          responsive: {
            0: { items: 1 },
            576: { items: 2 },
            992: { items: 4, loop: !1, nav: !1 },
          },
        }),
        t(".slider-fade").owlCarousel({
          items: 1,
          loop: !1,
          dots: !1,
          margin: 0,
          nav: !1,
          navText: [
            "<span class='ti-arrow-left'></span>",
            "<span class='ti-arrow-right'></span>",
          ],
          autoplay: !0,
          smartSpeed: 1500,
          mouseDrag: !1,
          animateIn: "fadeIn",
          animateOut: "fadeOut",
          responsive: { 992: { nav: !0 } },
        }),
        t(".owl-carousel").owlCarousel({
          items: 1,
          loop: !0,
          dots: !1,
          margin: 0,
          autoplay: !0,
          smartSpeed: 500,
        }),
        t(".slider-fade").on("changed.owl.carousel", function (e) {
          e = e.item.index - 2;
          t("span").removeClass("animated fadeInUp"),
            t("h1").removeClass("animated fadeInUp"),
            t("p").removeClass("animated fadeInUp"),
            t("a").removeClass("animated fadeInUp"),
            t(".owl-item")
              .not(".cloned")
              .eq(e)
              .find("span")
              .addClass("animated fadeInUp"),
            t(".owl-item")
              .not(".cloned")
              .eq(e)
              .find("h1")
              .addClass("animated fadeInUp"),
            t(".owl-item")
              .not(".cloned")
              .eq(e)
              .find("p")
              .addClass("animated fadeInUp"),
            t(".owl-item")
              .not(".cloned")
              .eq(e)
              .find("a")
              .addClass("animated fadeInUp");
        }),
        0 !== t(".horizontaltab").length &&
          t(".horizontaltab").easyResponsiveTabs({
            type: "default",
            width: "auto",
            fit: !0,
            tabidentify: "hor_1",
            activate: function (e) {
              var a = t(this),
                o = t("#nested-tabInfo");
              t("span", o).text(a.text()), o.show();
            },
          }),
        t(".countup").counterUp({ delay: 25, time: 2e3 }),
        t(".countdown").countdown({
          date: "01 Aug 2025 00:01:00",
          format: "on",
        }),
        t(".current-year").text(new Date().getFullYear());
    }),
    n.on("load", function () {
      t(".portfolio-gallery").lightGallery(),
        t(".portfolio-link").on("click", (e) => {
          e.stopPropagation();
        });
    });
    
})(jQuery);

$("#ab-slider").on("input change", (e) => {
  const sliderPos = e.target.value;
  // Update the width of the foreground image
  $(".foreground-img").css("width", `${sliderPos}%`);
  // Update the position of the slider button
  $(".ab-slider-button").css("left", `calc(${sliderPos}% - 18px)`);
});
