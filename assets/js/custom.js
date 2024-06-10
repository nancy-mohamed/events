(function () {
    "use strict";

    /* page loader */

    function hideLoader() {
        const loader = document.getElementById("loader");
        loader.classList.add("d-none")
    }

    window.addEventListener("load", hideLoader);

    /* page loader */



        /* header theme toggle */
        function toggleTheme() {
            let html = document.querySelector('html');
            if (html.getAttribute('data-theme-mode') === "dark") {
                html.setAttribute('data-theme-mode', 'light');
                html.setAttribute('data-header-styles', 'gradient');
                html.setAttribute('data-menu-styles', 'dark');
                html.removeAttribute('data-bg-theme');
                html.removeAttribute('data-default-header-styles');
                if (!localStorage.getItem("primaryRGB")) {
                    html.setAttribute("style", "");
                  }
                if (document.querySelector("#switcher-canvas")) {
                document.querySelector('#switcher-light-theme').checked = true;
                document.querySelector('#switcher-menu-light').checked = true;
                }
                document.querySelector('html').style.removeProperty('--body-bg-rgb', localStorage.bodyBgRGB);
                html.style.removeProperty('--light-rgb');
                html.style.removeProperty('--form-control-bg');
                html.style.removeProperty('--input-border');
    
                if (document.querySelector("#switcher-canvas")) {
                document.querySelector('#switcher-header-gradient').checked = true;
                document.querySelector('#switcher-menu-light').checked = true;
                document.querySelector('#switcher-light-theme').checked = true;
                document.querySelector("#switcher-background4").checked = false;
                document.querySelector("#switcher-background3").checked = false;
                document.querySelector("#switcher-background2").checked = false;
                document.querySelector("#switcher-background1").checked = false;
                document.querySelector("#switcher-background").checked = false;
                }
                localStorage.removeItem("velvetdarktheme");
                localStorage.removeItem("velvetMenu");
                localStorage.removeItem("velvetHeader");
                localStorage.removeItem("velvetDefaultHeader");
                localStorage.removeItem("bodylightRGB");
                localStorage.removeItem("bodyBgRGB");
                if (localStorage.getItem("velvetlayout") == "horizontal") {
                    html.setAttribute("data-menu-styles", "gradient");
                }
                html.setAttribute("data-header-styles", "gradient");
            } else {
                html.setAttribute('data-theme-mode', 'dark');
                html.setAttribute('data-header-styles', 'gradient');
                html.setAttribute('data-menu-styles', 'dark');
                html.removeAttribute('data-default-header-styles');
                if (!localStorage.getItem("primaryRGB")) {
                    html.setAttribute("style", "");
                  }
                if (document.querySelector("#switcher-canvas")) {
                document.querySelector('#switcher-dark-theme').checked = true;
                document.querySelector('#switcher-menu-dark').checked = true;
                document.querySelector('#switcher-header-gradient').checked = true;
                document.querySelector('#switcher-menu-dark').checked = true;
                document.querySelector('#switcher-header-dark').checked = true;
                document.querySelector('#switcher-dark-theme').checked = true;
                document.querySelector("#switcher-background4").checked = false
                document.querySelector("#switcher-background3").checked = false
                document.querySelector("#switcher-background2").checked = false
                document.querySelector("#switcher-background1").checked = false
                document.querySelector("#switcher-background").checked = false
                }
                localStorage.setItem("velvetdarktheme", "true");
                localStorage.setItem("velvetMenu", "dark");
                localStorage.setItem("velvetHeader", "gradient");
                localStorage.removeItem("velvetDefaultHeader");
                localStorage.removeItem("bodylightRGB");
                localStorage.removeItem("bodyBgRGB");
            }
        }
        let layoutSetting = document.querySelector(".layout-setting")
        layoutSetting.addEventListener("click", toggleTheme);
        /* header theme toggle */

        


//         let endDateElm = "15 August 2024 12:01 am"
// let countDownItem = Array.from(document.querySelectorAll('.count_down'))

// function countDown() {
//     let endDate = new Date(endDateElm);
//     let newDate = new Date();
//     let dateDiff = (endDate - newDate) / 1000
//     if (dateDiff > 0) {
//         let day = Math.floor(dateDiff / 3600 / 24)
//         let hour = Math.floor(dateDiff / 3600) % 24
//         let min = Math.floor(dateDiff / 60) % 60
//         let sec = Math.floor(dateDiff % 60)
//         countDownItem[0].textContent = day
//         countDownItem[1].textContent = hour
//         countDownItem[2].textContent = min
//         countDownItem[3].textContent = sec
//     } else {
//         clearInterval(stop)
//     }
// }
// let stop = setInterval(() => {
//     countDown();
// }, 1000);



})();



(function () {
    'use strict';

    let loadFile = function (event) {
        var reader = new FileReader();
        reader.onload = function () {
            var output = document.getElementById('photo');
            if (event.target.files[0].type.match('image.*')) {
                output.src = reader.result;
            } else {
                event.target.value = '';
                alert('please select a valid image');
            }
        };
        if(event.target.files[0]){
            reader.readAsDataURL(event.target.files[0]);
        }

    };


    // for profile photo update
    let ProfileChange = document.querySelector('#profile-change');
    ProfileChange.addEventListener('change', loadFile);

})();

(function () {
    "use strict"


    // for publish date picker
    flatpickr(".date", {});


   

})();

// start file upload 

$(function () {
    // Initially hide the file details and remove buttons
    $(".file-details").hide();
    $(".remove-file").hide();
  
    $(".fileupload").change(function (event) {
      var file = event.target.files[0];
      var fileName = file.name;
      var fileSize = (file.size / 1024).toFixed(2) + ' KB'; // size in KB
      
      var fileWrapper = $(this).closest('.custom-file-wrp');
      fileWrapper.find(".file-details").show();
      fileWrapper.find(".filename").text(fileName);
      fileWrapper.find(".filesize").text(fileSize);
      fileWrapper.find(".custom-file").hide();
      fileWrapper.find(".remove-file").show();
    });
  
    $(".remove-file").click(function () {
      var fileWrapper = $(this).closest('.custom-file-wrp');
      fileWrapper.find(".file-details").hide();
      fileWrapper.find(".filename").text("");
      fileWrapper.find(".filesize").text("");
      fileWrapper.find(".custom-file").show();
      fileWrapper.find(".remove-file").hide();
      fileWrapper.find(".fileupload").val(''); // reset the file input
    });
  });
  // end file upload 

  