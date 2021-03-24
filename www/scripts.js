function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}


// Prevent ZOOM
document.addEventListener('touchmove', e => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false })


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

        // Push accueil slide
        var img = $('<img />').addClass("media").attr('src', '/media/accueil.jpg')
        $('<div>').addClass('carousel-cell').append(img).appendTo(gallery)

        // Fill with media
        for (let m of data[lang]) {
            console.log(m)
            if (m[1] == 'image') {
                var img = $('<img />').addClass("media").attr('src', '/media/' + lang + '/' + m[0])
                $('<div>').addClass('carousel-cell').append(img).appendTo(gallery)
            } else if (m[1] == 'video') {

                // Video
                var video = $('<video>').addClass("media")
                $('<source>').attr('src', '/media/' + lang + '/' + m[0]).attr('type', 'video/mp4').appendTo(video)

                // Progress bar
                var progressbar = $('<div>').addClass('bar')
                var progress = $('<div>').addClass('progress').append(progressbar)
                $('<div>').addClass('carousel-cell').append(video).append(progress).appendTo(gallery)



                video.on('ended', () => {
                    setTimeout(() => { $('.main-carousel.is-active').flickity('next') }, 300)
                })

                var lastTime = (new Date()).getTime();
                video.on('timeupdate', () => {
                    var now = (new Date()).getTime()
                    const percent = (video[0].currentTime / video[0].duration) * 100
                    progressbar.finish()
                    progressbar.animate({ 'width': percent + '%' }, now - lastTime, 'linear')
                    lastTime = now
                });
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


            // VIDEO playback
            $('video').each((i, d) => {
                d.pause()
                d.currentTime = 0
            })
            $('.carousel-cell.is-selected').find('video').each((i, d) => {
                d.play()
            })

            // Hide NEXT on first
            if (index > 0) $('.flickity-prev-next-button.next').show()
            else $('.flickity-prev-next-button.next').hide()

            // Hide PREV on second
            if (index > 1) $('.flickity-prev-next-button.previous').show()
            else $('.flickity-prev-next-button.previous').hide()

            // CLOSE
            $('.flickity-prev-next-button.next:disabled').prop('disabled', false)

            $('.close').unbind()

            var flkty = $(this).data('flickity')
            if (flkty.selectedIndex == flkty.cells.length - 1) $('.flickity-prev-next-button.next').addClass('close')
            else $('.flickity-prev-next-button.next').removeClass('close')
            console.log(flkty.selectedIndex, flkty.cells.length - 1)

            $('.close').on('click', function(e) {
                $('.main-carousel').flickity('select', 0)
                $('.close').unbind()
                $('.debug').append('select 0 : ' + e.type + ' <br\>');
            });
        });


    }


    // Add menu to first media of each gallery
    $('.main-carousel').get().forEach(function(entry, index, array) {
        var menu = $('<div>').addClass('lang-menu') //.appendTo(accueil)

        for (let lang in data) {
            // remove x_ 
            let l = lang
            if (isNumeric(l.split('_')[0])) l = l.split('_')[1]

            // Lang btn
            $('<div>').addClass('lang-item').html(l).appendTo(menu).on('click', (e) => {

                //$('.flickity-prev-next-button.next').hide()

                var target = $('.carousel-' + l.replace(' ', ''))

                console.log(l)

                $('.main-carousel').hide().removeClass('is-active')
                target.show().addClass('is-active')
                target.flickity('select', 1)

                // if (target.hasClass('is-active')) {
                //     target.flickity('select', 1)
                //     $('.debug').append('select 1 : ' + e.type + ' <br\>')
                // } else {
                //     $('.lang-menu').hide()
                //     $('.main-carousel').hide().removeClass('is-active')
                //     target.show().addClass('is-active')
                //     setTimeout(() => {
                //         target.flickity('select', 1)
                //         $('.lang-menu').show()
                //     }, 2000)
                // }

            })
        }

        $(entry).find('.carousel-cell').first().append(menu)
    });

    $('.main-carousel').hide().removeClass('is-active')
    $('.main-carousel').first().show().addClass('is-active')
    $('.flickity-prev-next-button').hide()



});


var inactivityTime = function() {
    var timer;

    window.onload = timerReset;
    document.onkeypress = timerReset;
    document.onmousedown = timerReset;
    document.ontouchstart = timerReset;
    document.onclick = timerReset;
    document.onscroll = timerReset;
    document.onkeypress = timerReset;

    function timerElapsed() {
        console.log("Timer elapsed");
        $('.main-carousel').flickity('select', 0)
    };

    function timerReset(e) {
        // console.log("Reseting timer");
        // $('.debug').append('Timer reset : ' + e.type + ' <br\>');
        clearTimeout(timer);
        timer = setTimeout(timerElapsed, 1 * 60 * 1000); // 1 mins
    }
};
inactivityTime()