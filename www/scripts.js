var socket = io();

socket.on('list', function(data) {
    $('#alldivs').empty()

    for (let m of data) {
        console.log(m)
        if (m[1] == 'image') {
            var img = $('<img />').addClass("media").attr('src', '/media/' + m[0])
            $('<div>').addClass('carousel-cell').append(img).appendTo('#alldivs')
        } else if (m[1] == 'video') {
            var video = $('<video>').addClass("media")
            $('<source>').attr('src', '/media/' + m[0]).attr('type', 'video/mp4').appendTo(video)
            $('<div>').addClass('carousel-cell').append(video).appendTo('#alldivs')
        }

    }

    // $('#alldivs').slick({
    //     infinite: false,
    // });
    var carousel = $('.main-carousel').flickity({
        // options
        cellAlign: 'left',
        pageDots: true,
        contain: true,
        selectedAttraction: 0.1,
        friction: 0.8,
        // fade: true
    });

    carousel.on('change.flickity', function(event, index) {
        $('video').each((i, d) => {
            d.pause()
        })
        $('.carousel-cell.is-selected').find('video').each((i, d) => {
            console.log(d)
            d.play()
        })
    });

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
        location.reload();
    };

    function timerReset() {
        console.log("Reseting timer");
        clearTimeout(timer);
        timer = setTimeout(timerElapsed, 1 * 10 * 1000); // 1 mins
    }
};
// inactivityTime()