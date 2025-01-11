/*global $, window, WOW*/

$(function () {
    
    "use strict";
    
    var win = $(window),
	    nav = $(".vertical-nav"),
        progressCheck = false;
		
    /*========== Loading  ==========*/
    $('.preloader').delay(200).addClass('hide').fadeOut(700, function () {
        $(this).remove();
    });
	/*========== Color Switcher  ==========*/
    $(".switch-button").on("click", function () {
        $(this).addClass("hide");
        $(".switched-styles").addClass("show");
    });
    
    $(".switched-styles .hide-button").on("click", function () {
        $(this).parent().removeClass("show");
        $(".switch-button").removeClass("hide");
    });
    
    $(".switched-styles ul li").on("click", function () {
        $("link[href*='color']").attr("href", "css/main/skins/" + $(this).data('color') + "_color.css");
    });
    
    /*========== Active Menu  ==========*/
    $(".vertical-nav .toggle-menu").on("click", function () {
        nav.toggleClass("menu-active");
    });
	
	/*========== Typed  ==========*/
    $(".home .home-intro p span").typed({
        strings: ["Designer.", "Designer."],
        cursorChar: "",
        typeSpeed: 70,
        loop: true,
        backSpeed: 20
    });
    
    /*========== Smooth Scroll  ==========*/
    $(".vertical-nav .mini-menu > ul li a").on("click", function (e) {
        e.preventDefault();
		var selector = $(this);
		selector.addClass("active").parent().siblings("li").find("a").removeClass("active");
		$(selector.attr('href')).addClass('active').siblings("section").removeClass('active');
    });
	
	/*========== Skills Progress  ==========*/
    function skillsPogress() {
        $(".progress-container").each(function () {
            var progressBar = $(this).find(".progress-bar");
            progressBar.css("width", progressBar.attr("aria-valuenow") + "%");
        });
    }
    
    if (!progressCheck && $("#about").scrollTop() >= $(".skills").offset().top + 300) {
        skillsPogress();
        progressCheck = true;
    }
    
    $("#about").on("scroll", function () {
        
        if (!progressCheck && $("#about").scrollTop() >= $(".skills").offset().top + 300) {
            skillsPogress();
            progressCheck = true;
        }
        
    });
	
    /*========== Start Magnigic Popup Js ==========*/
    if ($('.portfolio-content .item')[0]) {

        $('.portfolio-content .item').magnificPopup({
            delegate: '.icon-img',
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    }
	
	/*========== Ajax Contact Form  ==========*/
	$('.contact-form').on("submit", function () {
		
		var myForm = $(this),
			data = {};
		
		myForm.find('[name]').each(function() {
			
			var that = $(this),
				name = that.attr('name'),
				value = that.val();
			
			data[name] = value; 
			
		});
		
		$.ajax({
			
			url: myForm.attr('action'),
			type: myForm.attr('method'),
			data: data,
			success: function (response) {
				
				if (response == "success") {
								
					$(".contact-form").find(".form-message").addClass("success");
					$(".form-message span").text("Message Sent!");
					
				} else {
					
					$(".contact-form").find(".form-message").addClass("error");
					$(".form-message span").text("Error Sending!");
					
				}
			}
			
		});
		
		return false;
		
	});
});
