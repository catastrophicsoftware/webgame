var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname));

app.get('/', function (req, res)
{
    res.sendFile('/index.html');
});

io.on('connection', function (socket)
{
    console.log('USER CONNECTED!');
    socket.on('disconnect', function()
    {
        console.log('USER DISCONNECTED!');
    });
});


server.listen(8080, function ()
{
    console.log(`Listening on: ${server.address().port}`);
});