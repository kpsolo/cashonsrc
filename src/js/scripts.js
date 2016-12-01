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

$('div.links').each(function() {
    var $active, $content, $links = $(this).find('a');

    $active = $($links.filter('[href="' + location.hash + '"]')[0] || $links[0]);
    $active.addClass('active');
    $content = $($active[0].hash);

    $links.not($active).each(function() {
        $(this.hash).hide();
    });

    var img = $active.attr("href");
    img = img.replace(/^#/, '');
    $('.whomakes > .photo').css("background-image", "url(img/" + img + ".jpg)");

    $(this).on('click', 'a', function(e) {
        $active.removeClass('active');
        $content.hide();

        $active = $(this);
        $content = $(this.hash);

        var img = $active.attr("href");
        img = img.replace(/^#/, '');
        $('.whomakes > .photo').css("background-image", "url(img/" + img + ".jpg)");
        $active.addClass('active');
        $content.show();

        e.preventDefault();
    });
});


$('ul.event-list').each(function() {
    var $active, $content, $links = $(this).find('a');
    var $items = $(this).find('li');
    var iCurrent = 0;
    currentDate = new Date();

    $.each($items, function(i) {
        var eventDate=new Date($($items[i]).attr("data-dateend"));
        if (currentDate.getTime()-eventDate.getTime()>0){
            $($items[i]).removeClass('e-next');
            $($items[i]).addClass('e-last');
            $content = $($items[i].hash);
            iCurrent = i+1;
        }
    });    

    if (iCurrent >= $($items).length) {iCurrent = 0;}
    $active = $($links.filter('[href="' + location.hash + '"]')[0] || $links[iCurrent]);
    $active.addClass('active');
    $content = $($active[0].hash);

    $links.not($active).each(function() {
        $(this.hash).hide();
    });

    $(this).on('click', 'a', function(e) {
        $active.removeClass('active');
        $content.hide();

        $active = $(this);
        $content = $(this.hash);

        $active.addClass('active');
        $content.show();

        e.preventDefault();
    });
});

$(document).ready(function(){
  $(".submenu a").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
        window.location.hash = hash;
      });
    }
  });
});
