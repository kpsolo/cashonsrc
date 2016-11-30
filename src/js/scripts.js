$(function() {

    var header = $(".home-scroll");
    if ($(window).scrollTop() > 0) {
        header.addClass("home-scroll-active");
    }
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();

        if (scroll > 0) {
            header.addClass("home-scroll-active");
        } else {
            header.removeClass("home-scroll-active");
        }
    });

});
