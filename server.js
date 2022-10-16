var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};


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
        delete players[socket.id]
        io.emit('disconnect',socket.id);
    });

    // when a player moves, update the player data
    socket.on('playerMovement', function (movementData)
    {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        players[socket.id].rotation = movementData.rotation;
        // emit a message to all players about the player that moved
        socket.broadcast.emit('playerMoved', players[socket.id]);
    });

    var playerTeam = (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue';
    console.log("PLAYER TEAM: " + playerTeam);

    players[socket.id] = {
        rotation: 0,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        team: playerTeam
    };

    socket.emit('players',players);
    socket.broadcast.emit('new_player',players[socket.id]);
});


server.listen(8080, function ()
{
    console.log(`Listening on: ${server.address().port}`);
});