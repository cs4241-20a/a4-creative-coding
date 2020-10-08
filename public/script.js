

var config = {
  type: Phaser.AUTO,
  backgroundColor: 'green',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent:"gameDiv",
    width: 800,
    height: 600

  },
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 300},
        debug: false
    }
},
  
  scene: {
      preload: preload,
      create: create,
      update: update
  },
};

var musicMuted = false;
var helpTextVisible = true;
var currentBackground = 0;
var currentVolume = 2;
var score = 0;
var lastScore = 0;
var alive = true;

var game = new Phaser.Game(config);


function preload ()
{
  this.load.image('settings','assets/settings.png');
  this.load.image('sky', 'assets/background.png');
  this.load.image('mute','assets/mute.png');
  this.load.image('unmute','assets/unmute.png');
  this.load.spritesheet('playerShip','assets/Lightning.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('playerShipDead','assets/LightningOnFire.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('rock','assets/spritesheetRock.png', { frameWidth: 32, frameHeight: 32 });
  this.load.audio('background',['assets/backgroundMusic.wav'])
  this.load.image('changeBackground','assets/changeBackground.png');
  this.load.image('winBackground','assets/winBackground.png');
  this.load.image('forestBackground','assets/forestBackground.png');
  this.load.image('restart','assets/restart.png');
  this.load.image('plus','assets/plus.png');
  this.load.image('minus','assets/minus.png');
  this.load.image('killzone','assets/killzone.png');
  this.load.image('play','assets/play.png');
}

function create ()
{

  var music = this.sound.add('background',{loop:true});
  music.setDetune(500)
  music.setVolume(currentVolume);
  music.play()



  var backgroundSky = this.add.image(400, 300, 'sky');

  var muteButton = this.add.image(750,30, 'mute');

  setUpDefaultButton(muteButton, function action(){
    console.log("clicked mute button")
    if(musicMuted){
      music.resume();
      muteButton.setTexture('mute');
      musicMuted = false;
    }else{
      music.pause();
      muteButton.setTexture('unmute');
      musicMuted = true;
    }
  })
  
  scoreText = this.add.text(30,30, "Score: "+score)

  helpText = this.add.text(50, 50, 'Use Arrow Keys <- -> to move the ship and avoid the falling rocks\nSelect the bar button on the right to hide this documentation\nPress "BG" to change background\nPress the reset button to reset the game\nPress the + and - to adjust volume\nPRESS PLAY TO START!', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

  var helpButton = this.add.image(700,30, 'settings');
  setUpDefaultButton(helpButton, function action(){
    console.log("clicked hide help text button")
    if(helpTextVisible){
      console.log("hiding help text");
      helpText.visible = false;
      helpTextVisible = false;
    }else{
      console.log("Help text visible again")
      helpText.visible = true;
      helpTextVisible = true;
    }
  })
 
  
  var changeBackground = this.add.image(650,30, 'changeBackground');
  setUpDefaultButton(changeBackground, function action(){
    switch(currentBackground){
      case 0:
        currentBackground = 1;
        backgroundSky.setTexture('winBackground')
        break;
      case 1:
        currentBackground = 2;
        backgroundSky.setTexture('forestBackground');
        break;
      case 2:
        currentBackground = 0;
        backgroundSky.setTexture('sky')
        break;
    }
  })
  
  var restartButton = this.add.image(600,30, 'restart');
  var game = this;
  setUpDefaultButton(restartButton, function action(){

    game.registry.destroy();
    music.stop();
    game.events.off();
    game.scene.restart()
    musicMuted = false;
    helpTextVisible = true;
    currentBackground = 0;
    currentVolume = 2;
    alive=true;
    if(score > lastScore){
      lastScore = score;
    }
    
    score = 0;
  
  })
  
  var volumePlus = this.add.image(500, 30, 'plus');
  setUpDefaultButton(volumePlus, function action(){
    if(currentVolume> 10){
      currentVolume = 10;
    }else{
      currentVolume++
    }
    music.setVolume(currentVolume);
  })

  var volumeMinus = this.add.image(550, 30, 'minus');
  setUpDefaultButton(volumeMinus, function action(){
    if(currentVolume< 0){
      currentVolume = 0;
    }else{
      currentVolume--
    }
    music.setVolume(currentVolume);
  })




  this.anims.create({
    key : 'fall',
    frames:this.anims.generateFrameNumbers('rock',{start:0,end:3}),
    frameRate:10,
    repeat: -1
  })

  
  
  spawnTimer = game.time.addEvent({
    delay: 100,
    callback: spawnRocks,
    callbackScope: this,
    loop:true
  })
  spawnTimer.paused = true;
  
  var playButton = this.add.image(450,30,'play');
  setUpDefaultButton(playButton, function action(){
    spawnTimer.paused = false;
    playButton.visible = false;
  })



  player = this.physics.add.sprite(400, 550, 'playerShip');
  player.setCollideWorldBounds(true);
  player.body.setGravityY(-300);



  this.anims.create({
    key : 'left',
    frames:this.anims.generateFrameNumbers('playerShip',{start:0,end:3}),
    frameRate:10,
    repeat: -1
  })

  this.anims.create({
    key: 'turn',
    frames:this.anims.generateFrameNumbers('playerShip',{start:0,end:3}),
    frameRate: 10,
    repeat: -1
});

  this.anims.create({
    key : 'right',
    frames:this.anims.generateFrameNumbers('playerShip',{start:0,end:3}),
    frameRate:10,
    repeat: -1
  })







  this.anims.create({
    key : 'leftDead',
    frames:this.anims.generateFrameNumbers('playerShipDead',{start:0,end:3}),
    frameRate:10,
    repeat: -1
  })

  this.anims.create({
    key: 'turnDead',
    frames:this.anims.generateFrameNumbers('playerShipDead',{start:0,end:3}),
    frameRate: 10,
    repeat: -1
});

  this.anims.create({
    key : 'rightDead',
    frames:this.anims.generateFrameNumbers('playerShipDead',{start:0,end:3}),
    frameRate:10,
    repeat: -1
  })

  
  cursors = this.input.keyboard.createCursorKeys();

  killzone = this.physics.add.staticGroup();
  killzone.create(400,700,'killzone');


  fallingRocks = this.physics.add.group();
  fallingRocks.playAnimation('fall',true);



  this.physics.add.overlap(fallingRocks,killzone, removeOutOFBoundsRock);
  this.physics.add.overlap(player,fallingRocks, gameOver);

  fallingRocks.playAnimation('fall');

  lastText = this.add.text(30,575, "High Score: " + lastScore);
  
  gameOverText = this.add.text(400,300, "");
}

function update ()
{
  

  if (cursors.left.isDown)
{
    player.setVelocityX(-160);
    if(alive){
      player.anims.play('left', true);
    }else{
      player.anims.play('leftDead',true);
    }
    
}
else if (cursors.right.isDown)
{
    player.setVelocityX(160);

    if(alive){
      player.anims.play('right', true);
    }else{
      player.anims.play('rightDead',true);
    }
}
else
{
    player.setVelocityX(0);

    if(alive){
      player.anims.play('turn', true);
    }else{
      player.anims.play('turnDead',true);
    }
    
    
}

}

function onObjectClicked(pointer, gameObject){
  console.log("clicked mute")
  music.pause();
}


function setUpDefaultButton(button, action){
  button.setScale(0.5)
  button.setInteractive();

  button.on('pointerdown',action);
  button.on('pointerover', function(pointer, gameObject){
    button.setTint(0xf0ff00);
  })
  button.on('pointerout', function(pointer, gameObject){
    button.setTint(0xffffff);
  })

}

function removeOutOFBoundsRock(fallingRock, killzone){
  
  fallingRocks.remove(fallingRock, true, true)
  if(alive){
    score++
    if(score>lastScore){
      lastScore = score;
      lastText.setText("High Score: " + lastScore);
    }
  }
  scoreText.setText("Score: " + score)
}

function gameOver(player,fallingRocks){
  console.log("gameover");
  alive = false;
  gameOverText.setText("GAME OVER\nYour score was " + score + "\nPress reset to play again")
  spawnTimer.remove();


}

function spawnRocks(){
  var spawnPosX = Phaser.Math.Between(15, 800-16);
  fallingRocks.create(spawnPosX,-15,'rock')
  fallingRocks.playAnimation('fall',true);
}