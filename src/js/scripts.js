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

var modal = document.getElementById('myModal');
var btn = document.getElementById("btn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
