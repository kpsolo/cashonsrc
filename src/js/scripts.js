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
    /*
        Шукаємо лінки у вказаному вузлі, перший лінк робимо активним.
        Тег 'href' кожного лінка містить ID відповідного елемента <div>, 
        наприклад: href='#whomakes' буде працювати з <div id="whomakes">.
        Також ID відповідає назві файлу з картинкою, наприклад: '#whomakes' == 'whomakes.jpg'.
        Тобто при натисканні на відповідний лінк відобразиться <div> з відповідним ID та 
        завантажиться файл з картинкою, що встановиться фоном для <div> сласу '.whomakes.photo'.'
    */
    var $active, $content, $links = $(this).find('a');

    $active = $($links.filter('[href="' + location.hash + '"]')[0] || $links[0]);
    $active.addClass('active');
    $content = $($active[0].hash);

    $links.not($active).each(function() {
        $(this.hash).hide();
    });

    var img = $active.attr("href");
    img = img.replace(/^#/, '');
    $('.whomakes > .photo').css("background-image", "url(/img/" + img + ".jpg)");

    $(this).on('click', 'a', function(e) {
        $active.removeClass('active');
        $content.hide();

        $active = $(this);
        $content = $(this.hash);

        var img = $active.attr("href");
        img = img.replace(/^#/, '');
        $('.whomakes > .photo').css("background-image", "url(/img/" + img + ".jpg)");
        $active.addClass('active');
        $content.show();

        e.preventDefault();
    });
});


$('ul.event-list').each(function() {
    /*
        Опрацьовуємо усі натискування на лінк вузла <ul> скласу '.event-list'.
        Усі дані конференцій зчитуємо з додаткових тегів вузла <a> та вставляємо у вузли <div> 
        відповідних класів. Назву картинки конференції беремо з тега 'href' і вставляємо у вузол <img>
        класу '.event-img' ('i-event-mbeach' == 'i-event-mbeach.jpg'). Якщо тег на початку містить 
        символ '#' значить конференція ще не відбулася і лінкк активний.
        Список додаткових тегів:
            loc - місце проведення;
            name - назва конференції;
            date - час проведення.
    */
    $(this).on('click', 'a', function(e) {
        $active = $(this);
        $content = $(this.hash);
        var img = $active.attr("href");
        if (!img.search('#')) {
            img = img.replace(/^#/, '');
            $('div.event-h1').text("-");
            $('div.event-h2').text("-");
            $('div.event-p').text("-");
            $('div.event-h1').text($active.attr("loc"));
            $('div.event-h2').text($active.attr("name"));
            $('div.event-p').text($active.attr("date"));
            $('.event-img > img').attr("src", "/img/" + img + ".jpg");
            $('.event-img > img').attr("alt", $active.attr("name"));
        }
        e.preventDefault();
    });
});