var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount, gameState;
var allPlayers, car1, car1Img, car2, car2Img, pistaImg;
var cars = [];

var moedas, combustiveis, moedasImg, combustivelImg;
var obstacle1Image, obstacle2Image, obstaculos;

function preload() 
{
  backgroundImage = loadImage("./assets/planodefundo.png");
  car1Img = loadImage("assets/car1.png");
  car2Img = loadImage("assets/car2.png");
  pistaImg = loadImage("assets/track.jpg");
  moedasImg = loadImage("assets/goldCoin.png");
  combustivelImg = loadImage("assets/fuel.png");
  obstacle1Image = loadImage("assets/obstacle1.png");
  obstacle2Image = loadImage("assets/obstacle2.png");

}

function setup() 
{
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() 
{
  background(backgroundImage);

  if(playerCount === 2)
  {
    game.updateGame(1)
  }

  if(gameState === 1)
  {
    //chamada da função de alteração de tela 
    game.play();

  }

}

function windowResized() 
{
  resizeCanvas(windowWidth, windowHeight);
}
