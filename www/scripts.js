var socket = io();

socket.on('list', function(data) {
    $('#alldivs').empty()

    for (let m of data) {
        console.log(m)
        if (m[1] == 'image') {
            var img = $('<img />').addClass("media").attr('src', '/media/' + m[0])
            $('<div>').append(img).appendTo('#alldivs')
        }

    }

    $('#alldivs').slick({
        infinite: false,
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