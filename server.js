var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const fs = require('fs')
const os = require('os')

// Media
var mediapath = "/data/media" //+ os.hostname()
var ext_images = ['jpg', 'jpeg', 'png', 'gif']
var ext_videos = ['mp4']

function mediaList() {
    var liste = []
    fs.readdirSync(mediapath)
        .filter(f => !fs.lstatSync(mediapath + '/' + f).isDirectory())
        .filter(f => !f.startsWith('.'))
        .forEach(f => {
            var ext = f.replace(/.*\./, '').toLowerCase();
            if (ext_images.indexOf(ext) >= 0) liste.push([f, 'image'])
            else if (ext_videos.indexOf(ext) >= 0) liste.push([f, 'video'])
        })
    return liste
}

// Server
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/www/index.html');
});
app.use(express.static(__dirname + '/www'))
app.use('/media', express.static(mediapath))

// Socketio
io.on('connection', (socket) => {
    console.log('a user connected');

    // Send list
    socket.emit('list', mediaList())

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Go
http.listen(5000, () => {
    console.log('listening on *:5000');
});
