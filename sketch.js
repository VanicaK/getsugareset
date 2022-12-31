//import { RecyclerViewBackedScrollViewBase } from "react-native";

var score = 0;
var gun, bluebubble, redbubble, bullet, backBoard;

var gunImg, bubbleImg, bulletImg, blastImg, backBoardImg;

var redBubbleGroup, blueBubbleGroup, bulletGroup;
var magSize = 10;
var reloading = false;
var database

var life = 3;
var score = 0;
var gameState = 1
var cooldown = 0;
var burst, burstImg;
var blast
var aizLife = 0;
var frameWait = 0
var scorename
var pl1, pl1n, pl2, pl2n, pl3, pl3n, pl4, pl4n, pl5, pl5n
var leading = 0

function preload() {
  gunImg = loadImage("josephTommyGun.png")
  blastImg = loadImage("blast.png")
  burstImg = loadImage("boom.png");


  aizen = loadImage("AIZEN.png")
  bulletImg = loadImage("bullet1.png")
  blueBubbleImg = loadImage("waterBubble.png")
  redBubbleImg = loadImage("redbubble.png")
  backBoardImg = loadImage("back.jpg")
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  database = firebase.database();

  backBoard = createSprite(50, height / 2, 50, height);
  backBoard.addImage(backBoardImg)

  gun = createSprite(100, height / 2, 50, 50);
  gun.addImage(gunImg)
  gun.scale = 0.2

  bulletGroup = createGroup();
  blueBubbleGroup = createGroup();
  redBubbleGroup = createGroup();
  aizenGroup = createGroup();

  heading = createElement("h1");
  scoreboard = createElement("h1");
  title = createElement("h1");
  xed = createElement("h2");
  mag = createElement("h2");
  tip = createElement("h3");
  boss = createElement("h1");
  loadCheck = createElement("h1")
  username = createInput("").attribute("placeholder", "Enter your name");
  ne = createElement("h1")
  tw = createElement("h1")
  th = createElement("h1")
  fo = createElement("h1")
  fi = createElement("h1")
  lead = createElement("h1")
}

function draw() {
  background("#BDA297");

  heading.html("Life: " + life)
  heading.style('color:red');
  heading.position(150, 20)

  mag.html("Spritual Energy:" + magSize + "/10");
  mag.style('color:red');
  mag.position(150, 50)

  tip.html("hold " + "R" + " to charge. Release when fully charged");
  tip.style('color:red');
  tip.position(150, 75);

  xed.html("Xedbubble's");
  xed.style('color:green');
  xed.position(width / 2 - 25, 7.5)

  title.html("Getsuga Showdown!")
  title.style('color:green');
  title.position(width / 2 - 120, 20);

  scoreboard.html("Score: " + score)
  scoreboard.style('color:red');
  scoreboard.position(width - 200, 20)

  username.position(width / 2, height / 2)
  username.hide()

  if (aizLife > 0) {
    boss.html("BOSS:" + aizLife)
  } else {
    boss.html("BOSS: ???")
  }
  boss.style('color:red')
  boss.position(width - 200, 45)

  if (frameCount > frameWait + 29 && reloading) {
    loadCheck.html("FULLY CHARGED!")
    loadCheck.style('color:lime')
  }

  if (gameState === 1) {
    gun.y = mouseY;
    cooldown -= 1;

    if (frameCount % 80 === 0) {
      drawblueBubble();
    }

    if (frameCount % 100 === 0) {
      drawredBubble();
    }

    if (frameCount % 2000 === 0) {
      drawAizen();
    }
    if (keyDown("space")) {
      shootBullet();
    }


    /*if(keyDown("r")){
      if(magSize<10&&frameCount%6.5===0){
        reloading=true;
        magSize+=1;
      }
    }
    if(!keyDown("r")){
      reloading=false;
    }*/

    if (blueBubbleGroup.collide(backBoard)) {
      handleGameover(blueBubbleGroup);
    }
    if (redBubbleGroup.collide(backBoard)) {
      handleGameover(redBubbleGroup);
    }
    if (aizenGroup.collide(backBoard)) {
      gameState = 2
      aizenGroup.destroyEach()
    }


    redBubbleGroup.collide(bulletGroup, handleDestroy);
    blueBubbleGroup.collide(bulletGroup, handleDestroy);
    aizenGroup.isTouching(bulletGroup, handleDefeat);

    drawSprites();
  }
  if (gameState == 2) {
    username.show()

    database.ref("/").on("value", data => {
      var data = data.val();
      pl1 = data.one.PLACE
      pl1n = data.one.NAME
      pl2 = data.two.PLACE
      pl2n = data.two.NAME
      pl3 = data.three.PLACE
      pl3n = data.three.NAME
      pl4 = data.four.PLACE
      pl4n = data.four.NAME
      pl5 = data.five.PLACE
      pl5n = data.five.NAME



    })
    //console.log(pl1.PLACE)
  }



  if (gameState == 3) {
    //console.log(pl1n)
    if (score >= pl1 && leading==0) {
      database.ref("/").update({
        one:{ NAME: scorename, PLACE: score },
        two:{ NAME: pl1n, PLACE: pl1 },
        three:{ NAME: pl2n, PLACE: pl2 },
        four:{ NAME: pl3n, PLACE: pl3 },
        five:{ NAME: pl4n, PLACE: pl4 }
      })
      //database.ref('one').set({PLACE:score})
      //database.ref("two").set({ NAME: pl1n, PLACE: pl1 })
      //database.ref('two').set({PLACE:pl1})
      //database.ref("three").set({ NAME: pl2n, PLACE: pl2 })
      //database.ref('three').set({PLACE:pl2})
      //database.ref("four").set({ NAME: pl3n, PLACE: pl3 })
      //database.ref('four').set({PLACE:pl3})
      //database.ref("five").set({ NAME: pl4n, PLACE: pl4 })
      //database.ref('five').set({PLACE:pl4})
      ne.html("YOU : "+score)
      ne.style('color:white');
      ne.position(width / 2 - 100, 120)
      tw.html(pl1n + " : " + pl1)
      tw.style('color:silver');
      tw.position(width / 2 - 100, 160)
      th.html(pl2n +" : "+pl2)
      th.style('color:brown');
      th.position(width / 2 - 100, 200)
      fo.html(pl3n + " : " + pl3)
      fo.style('color:black');
      fo.position(width / 2 - 100, 240)
      fi.html(pl4n + " : " + pl4)
      fi.style('color:black');
      fi.position(width / 2 - 100, 280)
      leading=1
      
    } else if (score >= pl2 && leading==0) {
      //database.ref('two').set({ NAME: scorename, PLACE: score })
      //database.ref('two').set({PLACE:score})
      //database.ref('three').set({ NAME: pl2n, PLACE: pl2 })
      //database.ref('three').set({PLACE:pl2})
      //database.ref('four').set({ NAME: pl3n, PLACE: pl3 })
      //database.ref('four').set({PLACE:pl3})
      //database.ref('five').set({ NAME: pl4n, PLACE: pl4 })
      //database.ref('five').set({PLACE:pl4})
      database.ref("/").update({
        two:{ NAME: scorename, PLACE: score },
        three:{ NAME: pl2n, PLACE: pl2 },
        four:{ NAME: pl3n, PLACE: pl3 },
        five:{ NAME: pl4n, PLACE: pl4 }
      })
      ne.html(pl1n + " : " + pl1)
      ne.style('color:gold');
      ne.position(width / 2 - 100, 120)
      tw.html("YOU : "+score)
      tw.style('color:white');
      tw.position(width / 2 - 100, 160)
      th.html(pl2n +" : "+pl2)
      th.style('color:brown');
      th.position(width / 2 - 100, 200)
      fo.html(pl3n + " : " + pl3)
      fo.style('color:black');
      fo.position(width / 2 - 100, 240)
      fi.html(pl4n + " : " + pl4)
      fi.style('color:black');
      fi.position(width / 2 - 100, 280)
      leading=1
    } else if (score >= pl3 && leading==0) {
      //database.ref('three').set({ NAME: scorename, PLACE: score })
      //database.ref('three').set({PLACE:score})
      //database.ref('four').set({ NAME: pl3n, PLACE: pl3 })
      //database.ref('four').set({PLACE:pl3})
      //database.ref('five').set({ NAME: pl4n, PLACE: pl4 })
      //database.ref('five').set({PLACE:pl4})
      database.ref("/").update({
        three:{ NAME: scorename, PLACE: score },
        four:{ NAME: pl3n, PLACE: pl3 },
        five:{ NAME: pl4n, PLACE: pl4 }
      })
      ne.html(pl1n + " : " + pl1)
      ne.style('color:gold');
      ne.position(width / 2 - 100, 120)
      tw.html(pl2n + " : " + pl2)
      tw.style('color:silver');
      tw.position(width / 2 - 100, 160)
      th.html("YOU : "+ score)
      th.style('color:white');
      th.position(width / 2 - 100, 200)
      fo.html(pl3n + " : " + pl3)
      fo.style('color:black');
      fo.position(width / 2 - 100, 240)
      fi.html(pl4n + " : " + pl4)
      fi.style('color:black');
      fi.position(width / 2 - 100, 280)
      leading=1
    } else if (score >= pl4 && leading==0) {
      //database.ref('four').set({ NAME: scorename, PLACE: score })
      //database.ref('four').set({PLACE:score})
      //database.ref('five').set({ NAME: pl4n, PLACE: pl4 })
      //database.ref('five').set({PLACE:pl4})
      database.ref("/").update({
        four:{ NAME: scorename, PLACE: score },
        five:{ NAME: pl4n, PLACE: pl4 }
      })
      ne.html(pl1n + " : " + pl1)
      ne.style('color:gold');
      ne.position(width / 2 - 100, 120)
      tw.html(pl2n + " : " + pl2)
      tw.style('color:silver');
      tw.position(width / 2 - 100, 160)
      th.html(pl3n + " : " + pl3)
      th.style('color:brown');
      th.position(width / 2 - 100, 200)
      fo.html("YOU : "+score)
      fo.style('color:white');
      fo.position(width / 2 - 100, 240)
      fi.html(pl4n + " : " + pl4)
      fi.style('color:black');
      fi.position(width / 2 - 100, 280)
      leading=1
    } else if (score >= pl5 && leading==0) {
      //database.ref('five').set({ NAME: scorename, PLACE: score })
      //database.ref('five').set({PLACE:score})
      database.ref("/").update({
        five:{ NAME: scorename, PLACE: score }
      })
      ne.html(pl1n + ":" + pl1)
      ne.style('color:gold');
      ne.position(width / 2 - 100, 120)
      tw.html(pl2n + " : " + pl2)
      tw.style('color:silver');
      tw.position(width / 2 - 100, 160)
      th.html(pl3n + " : " + pl3)
      th.style('color:brown');
      th.position(width / 2 - 100, 200)
      fo.html(pl4n + " : " + pl4)
      fo.style('color:black');
      fo.position(width / 2 - 100, 240)
      fi.html("YOU : " + score)
      fi.style('color:white');
      fi.position(width / 2 - 100, 280)
      leading=1
    } else if(score<pl5) {
      ne.html(pl1n + " : " + pl1)
      ne.style('color:gold');
      ne.position(width / 2 - 100, 120)
      tw.html(pl2n + " : " + pl2)
      tw.style('color:silver');
      tw.position(width / 2 - 100, 160)
      th.html(pl3n + " : " + pl3)
      th.style('color:brown');
      th.position(width / 2 - 100, 200)
      fo.html(pl4n + " : " + pl4)
      fo.style('color:black');
      fo.position(width / 2 - 100, 240)
      fi.html(pl5n + " : " + pl5)
      fi.style('color:black');
      fi.position(width / 2 - 100, 280)
    }
    lead.html("LEADERBOARD")
    lead.style('color:lime');
    lead.position(width / 2 - 100, 80)
    text("Reload the page to play again!", width / 2, height - 200,);
    textSize(500);
  }
  if (gameState == 4) {
    
  }



}

function drawblueBubble() {
  bluebubble = createSprite(width - 5, random(50, height - 50), 40, 40);
  bluebubble.addImage(blueBubbleImg);
  bluebubble.scale = 0.3;
  bluebubble.velocityX = -8 - 1.5 * (score / 10);
  bluebubble.lifetime = 400;
  blueBubbleGroup.add(bluebubble);
}
function drawredBubble() {
  redbubble = createSprite(width - 5, random(50, height - 50), 40, 40);
  redbubble.addImage(redBubbleImg);
  redbubble.scale = 0.15;
  redbubble.velocityX = -8 - 1.5 * (score / 10);
  redbubble.lifetime = 400;
  redBubbleGroup.add(redbubble);
}
function drawAizen() {
  aizLife = 5
  aizboss = createSprite(width - 5, height / 2, 80, 120)
  aizboss.addImage(aizen)
  aizboss.scale = 0.5
  aizboss.velocityX = -8 - 1.5 * (score / 7)
  aizboss.lifetime = 400
  aizenGroup.add(aizboss)
}

function shootBullet() {
  if (magSize > 0 && reloading == false) {
    if (cooldown < 0) {
      bullet = createSprite(150, width / 2, 50, 20)
      bullet.y = gun.y + 15
      bullet.addImage(bulletImg)
      bullet.scale = 0.12
      bullet.velocityX = 7 + 1.5 * (score / 10);
      bulletGroup.add(bullet);
      magSize -= 1;
      cooldown = 2;
    }
  }
}

function handleBubbleCollision(bubbleGroup) {
  if (life > 0) {
    score = score + 1;
  }

  //blast = createSprite(bullet.x + 60, bullet.y, 50, 50);
  //blast.addImage(blastImg)

  //  blast= sprite(bullet.x+60, bullet.y, 50,50);
  // blast.addImage(blastImg)

  //  blast= createSprite(bullet.x+60, bullet.y, 50,50);
  // blast.addImage(blastImg)

  //  blast= createSprite(bullet.x+60, bullet.y, 50,50);
  // image(blastImg)


  //blast.scale = 0.3
  //blast.life = 20
  bulletGroup.destroyEach()
  bubbleGroup.destroyEach()
}

function handleGameover(bubbleGroup) {

  life = life - 1;
  bubbleGroup.destroyEach();


  if (life === 0 && gameState == 1) {
    gameState = 2


  }

}

function handleDefeat(bullet, aizen) {
  aizen.destroy()
  if (aizLife > 1) {
    aizLife -= 1
  }
  else if (aizLife === 1) {
    score += 10
    bullet.destroy()
    explode(aizen.x, aizen.y)
  }
}

function handleDestroy(bullet, bubble) {
  bubble.destroy();
  bullet.destroy();
  score = score + 2;
  /*blast = createSprite(bullet.x + 60, bullet.y, 50, 50);
  blast.addImage(blastImg);
  blast.scale = 0.3
  blast.life = 20*/
  explode(bubble.x, bubble.y)
}
function explode(x, y) {
  burst = createSprite(x, y, 20, 20);
  burst.addImage(burstImg);
  burst.scale = 0.1
  burst.life = 20;
}

function keyPressed() {

  if (keyCode === 82) {
    // create an arrow object and add into an array ; set its angle same as angle of playerArcher
    magSize = 0
    frameWait = frameCount
    loadCheck.html("CHARGING");
    loadCheck.style('color:orange');
    loadCheck.position(150, 90);
    reloading = true
  }
  if (keyCode === 13) {
    if (gameState == 2) {
      scorename = username.value()
      username.hide()
      gameState = 3
    }
  }
}

function keyReleased() {
  if (keyCode === 82) {
    if (frameCount > frameWait + 30)
      magSize = 10
    loadCheck.html("")
    reloading = false
  }
}