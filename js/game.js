var config = {
    type: Phaser.AUTO,
    parent: 'css-web-game',
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    } 
};
var game = new Phaser.Game(config);

function preload()
{
    this.load.image('player_sprite','assets/player.png');
    this.load.image('your_sprite','assets/your_player.png')
}

function create()
{
    var self = this;
    this.socket = io();
    this.otherPlayers = this.physics.add.group();


    this.socket.on('players',function(players)
    {
        Object.keys(players).forEach(function(id)
        {
            if(players[id].playerId === self.socket.id)
            {
                console.log("SPAWNED YOUR PLAYER!");
                addPlayer(self,players[id]);
            }
            else
            {
                console.log("SYNCING OTHER PLAYER...");
                addOtherPlayers(self,players[id]);
            }
        });
    });

    this.socket.on('new_player',function(playerInfo)
    {
        addOtherPlayers(self,playerInfo);
    });

    this.socket.on('disconnect',function(playerId)
    {
        self.otherPlayers.getChildren().forEach(function (otherPlayer)
        {
            if(playerId == otherPlayer.playerId)
            {
                otherPlayer.destroy();
            }
        });
    });


    this.socket.on('playerMoved', function (playerInfo)
    {
        self.otherPlayers.getChildren().forEach(function (otherPlayer)
        {
            if (playerInfo.playerId === otherPlayer.playerId)
            {
                otherPlayer.setRotation(playerInfo.rotation);
                otherPlayer.setPosition(playerInfo.x, playerInfo.y);
            }
        });
    });

    this.cursors = this.input.keyboard.createCursorKeys();
}

function update()
{
    if (this.ship)
    {
        if (this.cursors.left.isDown)
        {
          this.ship.setAngularVelocity(-150);
        }
        else if (this.cursors.right.isDown)
        {
          this.ship.setAngularVelocity(150);
        } 
        else 
        {
          this.ship.setAngularVelocity(0);
        }
      
        if (this.cursors.up.isDown) 
        {
          this.physics.velocityFromRotation(this.ship.rotation + 1.5, 100, this.ship.body.acceleration);
        } 
        else 
        {
          this.ship.setAcceleration(0);
        }
      
        //this.physics.world.wrap(this.ship, 5);
        //10-16-2022 0427 -- possible phaser version info, seemingly invalid function

        var x = this.ship.x;
        var y = this.ship.y;
        var r = this.ship.rotation;
        if (this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation))
        {
            this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation });
        }

        // save old position data
        this.ship.oldPosition = 
        {
            x: this.ship.x,
            y: this.ship.y,
            rotation: this.ship.rotation
        };
      }
}


function addPlayer(self,playerInfo)
{
    self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, 'your_sprite');
    if (playerInfo.team === 'blue')
    {
      self.ship.setTint(0x0000ff);
    }
    else
    {
      self.ship.setTint(0xff0000);

    }
    self.ship.setDrag(100);
    self.ship.setAngularDrag(100);
    self.ship.setMaxVelocity(200);
}


function addOtherPlayers(self, playerInfo)
{
    const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'player_sprite');

    if (playerInfo.team === 'blue')
    {
      otherPlayer.setTint(0x0000ff);
    } 
    else
    {
      otherPlayer.setTint(0xff0000);
    }

    otherPlayer.playerId = playerInfo.playerId;
    self.otherPlayers.add(otherPlayer);
  }