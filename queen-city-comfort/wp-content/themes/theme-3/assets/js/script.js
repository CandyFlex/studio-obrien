// Set Cookie for closing the mobile footer promo
var setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
};

var getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
};

/* Set scrolling parameters for showing and hiding mobile header on scroll */
(function () {
    let prevScroll = 0;

    function isScrollingDown(current, prev) {
        if (current > prev) {
            return true;
        }
        return false;
    }

    function isAtTop(mobileHeaderHeight, offset) {
        if (
            document.body.scrollTop > mobileHeaderHeight + offset ||
            document.documentElement.scrollTop > mobileHeaderHeight + offset
        ) {
            return false;
        }
        return true;
    }

    function mobileHeaderScrollHandler() {
        const currentScrollPosition = window.pageYOffset;
        const mobileHeader = document.getElementById("js-mobile-sticky-header");
        if (mobileHeader) {
            const mobileHeaderHeight = mobileHeader.offsetHeight;

            if (!isAtTop(mobileHeaderHeight, 300)) {
                if (!isScrollingDown(currentScrollPosition, prevScroll)) {
                    mobileHeader.classList.remove("hide-mobile-header");
                }
                if (isScrollingDown(currentScrollPosition, prevScroll)) {
                    mobileHeader.classList.add("hide-mobile-header");
                }
            }
        }
        prevScroll = currentScrollPosition;
    }
    window.addEventListener("scroll", mobileHeaderScrollHandler);
})();

/* Start jQuery */
$(document).ready(function () {
    // Activate cookie when mobile footer promo closes
    console.log(getCookie("closed"));
    if (getCookie("closed") == "closed") {
        $(".mobile-banner-promo--footer").hide();
    }

    // Click event to close mobile footer promo box
    $(".mobile-banner-promo__close").on("click", function () {
        $(".mobile-banner-promo--footer").remove();
        setCookie(
            "closed",
            "closed",
            1
        ); /* Sets cookie to expire after 24 hours */
    });

    document.addEventListener(
        "wpcf7mailsent",
        function (event) {
            location = "/thank-you";
        },
        false
    );

    /* Makes first coupon full width if there's only one coupon */
    if ($('[id^="coupon_"]').length > 1) {       
    } else {            
        $('#coupon_0').css('flex-basis', '100%');
    }

    // Shrink sticky header on scroll
    $(window).on("scroll load", function () {
        var scroll = $(window).scrollTop();
        if (scroll >= 1) {
            $(".header--sticky .header").addClass("smaller");
            $(".header--sticky").addClass("sticky-active");
        } else {
            $(".header--sticky .header").removeClass("smaller");
            $(".header--sticky").removeClass("sticky-active");
        }
    });

    /* Nav Menu Hamburger Toggle */
    $(".mobile-nav-name, #hamburger").on("click", function () {
        $(".js-hamburger").toggleClass("is-active");
        $(".nav").toggleClass("menu-active");
        $("body").toggleClass("no-scroll");
    });

    var mobileSubMenu = function () {
        var $menuIcon = $(".mobile-sticky-header .main-navigation > li.has-dropdown");

        $menuIcon.on("click", function (e) {
            $(this).toggleClass("active-child-menu");
        });
    };

    mobileSubMenu();

    (function ($) {
        /* This function fixes a bug with Select2 that causes the field to push itself up on the page on scroll */

        var Defaults = $.fn.select2.amd.require("select2/defaults");

        $.extend(Defaults.defaults, {
            dropdownPosition: "auto",
        });

        var AttachBody = $.fn.select2.amd.require(
            "select2/dropdown/attachBody"
        );

        var _positionDropdown = AttachBody.prototype._positionDropdown;

        AttachBody.prototype._positionDropdown = function () {
            var $window = $(window);

            var isCurrentlyAbove = this.$dropdown.hasClass(
                "select2-dropdown--above"
            );
            var isCurrentlyBelow = this.$dropdown.hasClass(
                "select2-dropdown--below"
            );

            var newDirection = null;

            var offset = this.$container.offset();

            offset.bottom = offset.top + this.$container.outerHeight(false);

            var container = {
                height: this.$container.outerHeight(false),
            };

            container.top = offset.top;
            container.bottom = offset.top + container.height;

            var dropdown = {
                height: this.$dropdown.outerHeight(false),
            };

            var viewport = {
                top: $window.scrollTop(),
                bottom: $window.scrollTop() + $window.height(),
            };

            var enoughRoomAbove = viewport.top < offset.top - dropdown.height;
            var enoughRoomBelow =
                viewport.bottom > offset.bottom + dropdown.height;

            var css = {
                left: offset.left,
                top: container.bottom,
            };

            // Determine what the parent element is to use for calciulating the offset
            var $offsetParent = this.$dropdownParent;

            // For statically positoned elements, we need to get the element
            // that is determining the offset
            if ($offsetParent.css("position") === "static") {
                $offsetParent = $offsetParent.offsetParent();
            }

            var parentOffset = $offsetParent.offset();

            css.top -= parentOffset.top;
            css.left -= parentOffset.left;

            var dropdownPositionOption = this.options.get("dropdownPosition");

            if (
                dropdownPositionOption === "above" ||
                dropdownPositionOption === "below"
            ) {
                newDirection = dropdownPositionOption;
            } else {
                if (!isCurrentlyAbove && !isCurrentlyBelow) {
                    newDirection = "below";
                }

                if (!enoughRoomBelow && enoughRoomAbove && !isCurrentlyAbove) {
                    newDirection = "above";
                } else if (
                    !enoughRoomAbove &&
                    enoughRoomBelow &&
                    isCurrentlyAbove
                ) {
                    newDirection = "below";
                }
            }

            if (
                newDirection == "above" ||
                (isCurrentlyAbove && newDirection !== "below")
            ) {
                css.top = container.top - parentOffset.top - dropdown.height;
            }

            if (newDirection != null) {
                this.$dropdown
                    .removeClass(
                        "select2-dropdown--below select2-dropdown--above"
                    )
                    .addClass("select2-dropdown--" + newDirection);
                this.$container
                    .removeClass(
                        "select2-container--below select2-container--above"
                    )
                    .addClass("select2-container--" + newDirection);
            }

            this.$dropdownContainer.css(css);
        };
    })(window.jQuery);

    $(document).on('gform_post_render', function(event, formId) {
        $('#gform_wrapper_' + formId + ' select').each(function() {
            $(this).select2({
                dropdownPosition: 'below',
                minimumResultsForSearch: -1
            });
        });
    });

    function blogOverlay() {
        $(".blog-contents h2").on("mouseover mouseout", function () {
            $(this)
                .parentsUntil(".blog-layout")
                .find(".blog-image--overlay")
                .toggleClass("active");
        });
        $(".blog-image--overlay").on("mouseover mouseout", function () {
            $(this).toggleClass("active");
            $(this)
                .parentsUntil(".blog-layout")
                .find(".blog-contents h2")
                .toggleClass("active");
        });
    }
    blogOverlay();

    (function($) { 
        /* 
        - Slick Carousel default settings, with responsive breakpoints
        - This should be used only as a starting point
        - Feel free to edit as needed
        - Thank you Drake for creating this template!
        */

        // Various Slick Carousel config settings
        var sliderOneSelector     = '.home-section-3__coupons';
        var sliderTwoSelector     = '.value-props-section__value-props';
        var sliderThreeSelector   = '.testimonials-slider';
        var sliderFourSelector   = '.home-section-11__associations-band';
        var staticMinBreakpoint   = 992;
        var sliderMaxBreakpoint   = staticMinBreakpoint - 1;

        // Slider One Settings - Edit as needed
        var sliderOneSettings = {        
            infinite: true,
            autoplay: true,        
            slidesToScroll: 1,        
            dots: false,
            arrows: true,        
            centerMode: true,        
            variableWidth: true,
            adaptiveHeight: false,        
            mobileFirst: true,
            responsive: [
                {
                    breakpoint: 767,
                    settings: {
                        centerMode: false,
                        slidesToShow: 2,
                    }
                },
                {
                    breakpoint: 1199,
                    settings: {
                        centerMode: true,
                        slidesToShow: 3,
                    }
                }
            ]
        };

        // Slider Two Settings - Edit as needed
        var sliderTwoSettings = {        
            infinite: true,
            autoplay: true,        
            slidesToScroll: 1,   
            dots: true,
            arrows: false,        
            centerMode: true,        
            variableWidth: true,
            adaptiveHeight: false,        
            mobileFirst: true,
            responsive: [
                {
                    breakpoint: sliderMaxBreakpoint,
                    settings: "unslick"
                }
            ]
        };

        // Slider Three Settings - Edit as needed
        var sliderThreeSettings = {        
            infinite: true,
            autoplay: true,        
            slidesToScroll: 1,
            dots: true,
            arrows: false,        
            centerMode: true,        
            variableWidth: false,
            adaptiveHeight: false,        
            mobileFirst: true
        };

        // Slider Four Settings - Edit as needed
        var sliderFourSettings = {        
            infinite: true,
            autoplay: true,        
            slidesToScroll: 1,     
            slidesToShow: 1,     
            dots: false,
            arrows: true,        
            centerMode: true,        
            variableWidth: true,
            adaptiveHeight: false,        
            mobileFirst: true,
            responsive: [
                {
                    breakpoint: 991,
                    settings: "unslick"
                }
            ]
        };

        // activate slick slider on document ready
        $( sliderOneSelector ).slick( sliderOneSettings );
        $( sliderTwoSelector ).slick( sliderTwoSettings );
        $( sliderThreeSelector ).slick( sliderThreeSettings );
        $( sliderFourSelector ).slick( sliderFourSettings );

        // re-activate slick slider on resize below staticMinBreakpoint viewport width
        $(window).on( 'resize', function(){
            if( $(window).width() < staticMinBreakpoint && !$( sliderOneSelector ).hasClass( 'slick-initialized' ) ){
                $( sliderOneSelector ).slick( sliderOneSettings );
            }
            if( $(window).width() < staticMinBreakpoint && !$( sliderTwoSelector ).hasClass( 'slick-initialized' ) ){
                $( sliderTwoSelector ).slick( sliderTwoSettings );
            }
            if( $(window).width() < staticMinBreakpoint && !$( sliderThreeSelector ).hasClass( 'slick-initialized' ) ){
                $( sliderThreeSelector ).slick( sliderThreeSettings );
            }
            if( $(window).width() < staticMinBreakpoint && !$( sliderFourSelector ).hasClass( 'slick-initialized' ) ){
                $( sliderFourSelector ).slick( sliderFourSettings );
            }
        });
    })(window.jQuery);

    if ($('.conversion-header__coupons-slider').length) {
        $('.conversion-header__coupons-slider').slick({
            infinite: true,
            autoplay: true,        
            slidesToScroll: 1,        
            dots: false,
            arrows: true,        
            centerMode: true,        
            variableWidth: true,
            adaptiveHeight: false,        
            mobileFirst: true,
            responsive: [
                {
                    breakpoint: 576,
                    settings: {
                        arrows: true,
                        dots: false
                    }
                }
            ]
        });
    }

    /* Adds/removes class if bio is expandable for Meet the Team page */
    var bioArray = $(".ryno-mtt__bio");
    function isLineClamped() {
        for (let i = 0; i < bioArray.length; ++i) {
            let bio = bioArray[i];
            let clampedHeight = bio.clientHeight;
            let unclampedHeight = bio.scrollHeight;

            if (clampedHeight < unclampedHeight) {
                $(bio)
                    .parents()
                    .addClass("ryno-mtt__info-container--collapsable");
            } else {
                $(bio)
                    .parents()
                    .removeClass("ryno-mtt__info-container--collapsable");
            }
        }
    }
    isLineClamped();
    $(window).resize(function () {
        isLineClamped();
    });

    // Accessibility: Handle keyboard events for buttons without href
    document.addEventListener('DOMContentLoaded', function() {
        // Handle Enter and Space key presses for buttons with role="button"
        document.addEventListener('keydown', function(e) {
            if (e.target.matches('.ryno-btn[role="button"]')) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.target.click();
                }
            }
        });
        
        // Handle Space key release to prevent page scroll
        document.addEventListener('keyup', function(e) {
            if (e.target.matches('.ryno-btn[role="button"]') && e.key === ' ') {
                e.preventDefault();
            }
        });
    });

    $('.service-area-toggle').on('click', function() {
        let $this = $(this);
        $(this).toggleClass('active');
        $(this).next('.service-areas-menu-container').slideToggle(300);
    });

    $('.read-more-toggle').on('click', function() {
        let $this = $(this);
        $this.text($this.text() === 'Read Less -' ? 'Read More +' : 'Read Less -');
        if($this.hasClass('active')) {
            $('html, body').animate({
                scrollTop: $('.home-section-2').offset().top - $('#header-one').outerHeight()
              }, 500);
        }
        $(this).toggleClass('active');
        $(this).prev('.the-content').slideToggle(300);
    });

    // Open the modal when the "Redeem Offer" button (or wherever the .open-popup class is) is clicked
    $('.home-section-3__coupon a.btn, .coupon .btn, .coupon-btn').on('click', function(e) {
        e.preventDefault();
        $('#gform_6').css('display', 'block');
        var couponId = $(this).data('coupon-id');
        var couponName = $(this).data('coupon-name');
        // update the coupon name gform field
        $('#field_6_22').empty().append(`<p><strong>${couponName}</strong></p>`); //emptys html div then appends coupon name
        $('#input_6_23').val(couponName); //target the hidden coupon name field on the Coupon Form
        $('.coupon-form-popup-overlay').css('visibility', 'visible');
    });

    (function ($) {

        function closeModal() {
            $('#gform_6').hide();
            $('.coupon-form-popup-overlay').css('visibility', 'hidden');
        }
        
        // Track where the pointer/mouse starts
        $(document).on('pointerdown mousedown touchstart', '.coupon-form-popup-overlay', function (e) {
            $(this).data('pressedOnBackdrop', e.target === this);
        });
        
        // Only close if the press started AND ended on the backdrop itself
        $(document).on('pointerup mouseup touchend', '.coupon-form-popup-overlay', function (e) {
            const pressed = $(this).data('pressedOnBackdrop');
            if (pressed && e.target === this) {
            closeModal();
            }
            $(this).removeData('pressedOnBackdrop');
        });
        
        // Close via the "X" button
        $(document).on('click', '.close-popup', function (e) {
            e.stopPropagation();
            closeModal();
        });
        
        // ✅ Refined propagation rules
        // - Prevent modal from closing when interacting inside the popup
        // - Allow the datepicker to handle its own outside-click logic so it can close normally
        $(document).on('pointerdown pointerup mousedown mouseup click touchstart touchend', function (e) {
            const $target = $(e.target);
        
            // If clicking inside the datepicker, let it handle its own behavior
            if ($target.closest('#ui-datepicker-div').length) return;
        
            // If clicking inside the popup content, block propagation to keep modal open
            if ($target.closest('.popup-content').length) {
            e.stopPropagation();
            }
        });
        
    })(jQuery);

    (function($){
        var overlaySel = '.coupon-form-popup-overlay:visible';
        
        // When focusing a date field INSIDE the overlay → move + center the calendar
        $(document).on('focus', overlaySel + ' input.datepicker, ' + overlaySel + ' .gfield_date input, ' + overlaySel + ' .gfield_datepicker input', function(){
            var inst = $.datepicker._getInst(this);
            if (!inst) return;
            inst.dpDiv.appendTo($(overlaySel)).addClass('is-centered-in-overlay');
            $(this).datepicker('show'); // ensure it opens after move
        });
        
        // When focusing a date field OUTSIDE the overlay → put calendar back under <body>
        $(document).on('focus', 'input.datepicker, .gfield_date input, .gfield_datepicker input', function(){
            if ($(this).closest(overlaySel).length) return; // handled above
            var inst = $.datepicker._getInst(this);
            if (!inst) return;
            inst.dpDiv.appendTo('body').removeClass('is-centered-in-overlay');
            // Normal behavior
        });
    })(jQuery);
});