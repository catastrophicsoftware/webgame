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

}

function create()
{
    this.socket = io();
}

function update()
{

}