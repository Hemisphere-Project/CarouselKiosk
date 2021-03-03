function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}


var socket = io();

socket.on('tree', function(data) {
    $('#mainframe').empty()

    // Accueil
    var accueil = $('<div>').addClass('accueil').appendTo('#mainframe')



    for (let lang in data) {

        // remove x_ 
        let l = lang
        if (isNumeric(l.split('_')[0])) l = l.split('_')[1]

        // Carousel
        let gallery = $('<div>').addClass('main-carousel carousel-' + l.replace(' ', '')).appendTo('#mainframe')



        // Fill with media
        for (let m of data[lang]) {
            console.log(m)
            if (m[1] == 'image') {
                var img = $('<img />').addClass("media").attr('src', '/media/' + lang + '/' + m[0])
                $('<div>').addClass('carousel-cell').append(img).appendTo(gallery)
            } else if (m[1] == 'video') {
                var video = $('<video>').addClass("media")
                $('<source>').attr('src', '/media/' + lang + '/' + m[0]).attr('type', 'video/mp4').appendTo(video)
                $('<div>').addClass('carousel-cell').append(video).appendTo(gallery)

                video.on('ended', () => {
                    setTimeout(() => { $('.main-carousel.is-active').flickity('next') }, 300)
                })
            }
        }

        var carousel = $('.main-carousel').flickity({
            // options
            cellAlign: 'left',
            pageDots: false,
            contain: true,
            selectedAttraction: 0.1,
            friction: 0.8,
            // fade: true
        });

        carousel.on('change.flickity', function(event, index) {
            $('video').each((i, d) => {
                d.pause()
                d.currentTime = 0
            })
            $('.carousel-cell.is-selected').find('video').each((i, d) => {
                d.play()
            })
        });

    }


    // Add menu to first media of each gallery
    $('.main-carousel').get().forEach(function(entry, index, array) {
        var menu = $('<div>').addClass('lang-menu').appendTo(accueil)

        for (let lang in data) {
            // remove x_ 
            let l = lang
            if (isNumeric(l.split('_')[0])) l = l.split('_')[1]

            // Lang btn
            $('<div>').addClass('lang-item').html(l).appendTo(menu).on('click touchstart', () => {
                $('.main-carousel').hide().removeClass('is-active')
                $('.carousel-' + l.replace(' ', '')).show().flickity('select', 1).addClass('is-active')
            })
        }

        $(entry).find('.carousel-cell').first().append(menu)
    });

    $('.main-carousel').hide().removeClass('is-active')
    $('.main-carousel').first().show().addClass('is-active')

});


var inactivityTime = function() {
    var timer;

    window.onload = timerReset;
    document.onkeypress = timerReset;
    document.onmousemove = timerReset;
    document.onmousedown = timerReset;
    document.ontouchstart = timerReset;
    document.onclick = timerReset;
    document.onscroll = timerReset;
    document.onkeypress = timerReset;

    function timerElapsed() {
        console.log("Timer elapsed");
        $('.main-carousel').flickity('select', 0)
    };

    function timerReset() {
        // console.log("Reseting timer");
        clearTimeout(timer);
        timer = setTimeout(timerElapsed, 1 * 60 * 1000); // 1 mins
    }
};
inactivityTime()