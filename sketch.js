// create a variable called score and set value as 0
var score=0
// create a variable called gameState="PLAY"
var gameState="PLAY"

function preload(){
  // load images/animations/sounds
  bg_img=loadImage("images/bg 1.jpg")
  ironman_img=loadImage("images/ironman.png")
  rock_img=loadImage("images/Rock.png")
  coin_img=loadAnimation("images/coin 1.png","images/coin 2.png","images/coin 5.png","images/coin 7.png","images/coin 8.png")
  bomb_img=loadAnimation("images/bomb 1.png","images/bomb 2.png")
  coin_sound=loadSound("sounds/coinsound.mp3")
  explosion_sound=loadSound("sounds/explosion.mp3")
  restart_img=loadImage("images/restart.png")
}

function setup() {
  // set canvas width,height
  createCanvas(1350,720);
  
  // create groups to access each object
  rockGroup=new Group()
  coinGroup=new Group()
  bombGroup=new Group()
  // create a sprite bg and give coordinates,width,height,add images,scale,etc...
  bg=createSprite(675,675,1200,700)
  // add image to the bg so that the game would be interesting
  bg.addImage(bg_img)
  // scale the image
  bg.scale=2
  // create a sprite ironman and give coordinates,width,height,add images,scale,etc...
  ironman=createSprite(600,600,80,80)
  // add image to the ironman so that the game would be interesting
  ironman.addImage(ironman_img)
  // scale the image
  ironman.scale=0.25
  // debug=false to avoid the lines over the ironman 
  ironman.debug=false
  // setCollider for perfect collision
  ironman.setCollider("rectangle",0,0,480,1000)
  // create restart sprite
  restart=createSprite(660,320,80,80)
  // add image to restart so that the game would be interesting
  restart.addImage(restart_img)
  // scale the image
  restart.scale=0.8
}

function draw() {
  // restart button visiblity is false
  restart.visible=false
  // first condition is gameState=="PLAY"
  if(gameState=="PLAY"){
    // to move the ironman up,down,left,right create if condition and add properties
    if(keyDown("up")){
      ironman.y=ironman.y-8
    }
    if(keyDown("down")){
      ironman.y=ironman.y+8
    }
    if(keyDown("right")){
      ironman.x=ironman.x+8
    }
    if(keyDown("left")){
      ironman.x=ironman.x-8
    }
    bg.velocityY=20
    // the loaded bg image is small so that only once the image will move and stop, so to avoid that we give correct coordinates to make the image look like its moving 
    if(bg.y>400){
      bg.y=50
    }
    // call generateRocks function to generate rocks
    generateRocks()
    for(let i=0;i<rockGroup.length;i++){
      // creating a temp_rock to access each rock
      temp_rock=rockGroup.get(i)
      if(ironman.isTouching(temp_rock)){
        // if ironman isTouching temp_rock, ironman will collide with rock
        ironman.collide(temp_rock)
        ironman.velocityY=-0.1
      }
    }
    // call generateCoins function to generate coins
    generateCoins()
    for(let i=0;i<coinGroup.length;i++){
      // creating a temp_coin to access each coin
      temp_coin=coinGroup.get(i)
      if(ironman.isTouching(temp_coin)){
        // when ironman isTouching coin, coin_sound will be played
        coin_sound.play()
        // when ironman isTouching coin, coin wil be destroyed
        temp_coin.destroy()
        // when ironman isTouching coin, score will be increased by 10
        score=score+10
      }
    }
    // call generateBombs function to generate bombs
    generateBombs()
    for(let i=0;i<bombGroup.length;i++){
      // creating a temp_bomb to access each bomb
      temp_bomb=bombGroup.get(i)
      if(ironman.isTouching(temp_bomb)){
        // when ironman isTouching bomb, explosion_sound will be played
        explosion_sound.play()
        // when ironman isTouching bomb, bomb wil be destroyed
        temp_bomb.destroy()
        // when ironman isTouching bomb, score wil be decreased by 5
        score=score-5
        // when ironman isTouching bomb, ironman size will be reduced by 0.08
        ironman.scale=ironman.scale-0.08
        // if ironman's size is less than 0.01 or score is less than -10, game is over
        if(ironman.scale<0.01 || score<=-10){
          // ironman should disappear so visibility equal to false
          ironman.visible=false
          gameState="END"
        }
      }
    }
  }
  // if ironman is destroyed gameState="PLAY" changes to gameState="END"
  // second condition is gameState=="END"
  else if(gameState=="END"){
    // when gameState=="END" the game is completed so every object's velocity becomes 0 and object get destroyed
    bg.velocityY=0
    ironman.velocityY=0
    coin.velocityY=0
    rock.velocityY=0
    bomb.velocityY=0
    coin.destroy()
    rock.destroy()
    bomb.destroy()
    // when game is over restart button should appear so visibility equal to true
    restart.visible=true
    if(mousePressedOver(restart)){
      restartGame()
    }
  }
  drawSprites();
  // create text in drawSprites and add textsize,fill,position
  textSize(26);
  fill("red")
  text("SCORE: "+score,575,25)
}
// create a function called generateRocks to generate rocks at randoms spots and give them velocity,etc...
function generateRocks(){
  // if frameCount is divisible by 90, then rock will be spawned
  if(frameCount%90==0){
    // create rock sprite
    rock=createSprite(random(28,1180),random(5,250),100,30)
    // add image to the rock so that the game would be interesting
    rock.addImage(rock_img)
    // debug=false to avoid the lines over the rock
    rock.debug=false
    // setCollider for perfect collision
    rock.setCollider("rectangle",0,0,790,410)
    // scale the Image
    rock.scale=0.25
    // add velocity
    rock.velocityY=12
    // add rock in rockGroup
    rockGroup.add(rock)
    // give lifetime to the rock, to avoid memory loss 
    rock.lifetime=1200
  }
}
// create a function called generateCoins to generate coins at randoms spots and give them velocity,etc...
function generateCoins(){
  // if frameCount is divisible by 65, then coin will be spawned
  if(frameCount%65==0){
    // create coin sprite
    coin=createSprite(random(28,1180),random(5,250),80,80)
    // add animation to the coin so that the game would be interesting
    coin.addAnimation("coin",coin_img)
    // debug=false to avoid the lines over the coin
    coin.debug=false
    // setCollider for perfect collision
    coin.setCollider("circle",0,0,55)
    // scale the Image
    coin.scale=0.7
    // add velocity
    coin.velocityY=12
    // add coin in coinGroup
    coinGroup.add(coin)
    // give lifetime to the coin, to avoid memory loss 
    coin.lifetime=1200
  }
}
// create a function called generateBombs to generate bombs at randoms spots and give them velocity,etc...
function generateBombs(){
  // if frameCount is divisible by 97, then bomb will be spawned
  if(frameCount%97==0){
    // create bomb sprite
    bomb=createSprite(random(33,1180),random(5,250),80,80)
    // add animation to the bomb so that the game would be interesting
    bomb.addAnimation("bomb",bomb_img)
    // scale the Image
    bomb.scale=0.43
    // debug=false to avoid the lines over the bomb
    bomb.debug=false
    // setCollider for perfect collision
    bomb.setCollider("circle",10,20,100)
    // add velocity
    bomb.velocityY=12
    // add bomb in bombGroup
    bombGroup.add(bomb)
    // give lifetime to the bomb, to avoid memory loss 
    bomb.lifetime=1200
  }
}
// create a function called restartGame
function restartGame(){
  // set gameState as play
  gameState="PLAY"
  // restart button visibility equal to false
  restart.visible=false
  // ironman visibility equal to false
  ironman.visible=true
  // ironman will be scaled to normal size
  ironman.scale=0.25
  // coinGroup will be destroyed
  coinGroup.destroyEach()
  // rockGroup will be destroyed
  rockGroup.destroyEach()
  // bombGroup will be destroyed
  bombGroup.destroyEach()
  // ironmaan x is 600
  ironman.x=600
  // ironman y is 600
  ironman.y=600
  // score reset to 0
  score=0
}