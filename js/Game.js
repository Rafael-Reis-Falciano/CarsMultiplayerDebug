class Game 
{
  
  constructor() 
  {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leaderboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
  }

  start() 
  {
    if(gameState === 0)
    {
      form = new Form();
      form.display();
      player = new Player();
      playerCount = player.getPlayerCount();

      //criar os sprites
      car1 = createSprite(width/2 - 50, height - 100);
      car1.addImage("car1", car1Img);
      car1.scale = 0.07;

      car2 = createSprite(width/2 + 100, height - 100);
      car2.addImage("car2", car2Img);
      car2.scale = 0.07;

      cars = [car1, car2];


      moedas = new Group();
      combustiveis = new Group();
      obstaculos = new Group();

      var obstaclesPositions = [
        { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
        { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
        { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
        { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
        { x: width / 2, y: height - 2800, image: obstacle2Image },
        { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
        { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
        { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
        { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
        { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
        { x: width / 2, y: height - 5300, image: obstacle1Image },
        { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
      ];

      //adiciona moedas, combustível e obstáculos
      this.addSprites(moedas, 100, moedasImg, 0.09);
      this.addSprites(combustiveis, 100, combustivelImg, 0.02);
      this.addSprites(obstaculos,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions);
    }

  }

  getState()
  {
    var gameStateRef = database.ref("gameState"); //faltou "" no gameState do BD
    gameStateRef.on("value", function(data){
      gameState = data.val();
    });
  }

  updateGame(state)
  {
    database.ref("/").update({
      gameState: state
    });
  }

  botaoReset(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsAtEnd: 0
      });
      window.location.reload();
    });
  }

  
  play()
  {
    this.telajogo();
    this.botaoReset();

    //chamada da função de informações do jogador
    Player.getPlayerInfo();
    player.getCarsAtEnd();

    if(allPlayers !== undefined){
      image(pistaImg, 0, -height*6, width, height*6);
      
      //chamada para exibir o placar
      //this.showLeaderboard();

      //indice da matriz
      var index = 0;
      for(var plr in allPlayers)
      {
        index = index + 1;

        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;
        cars[index-1].position.x = x;
      cars[index-1].position.y = y;

      //destacar o player
      if(index === player.index){
      stroke(10);
      fill("red");
      ellipse(x,y,60,60);

      //chamada das funções de combustivel e moeda
      this.combustivel(index);
      this.moeda(index);

      //alterar a posição da camera do jogo na direção y
      camera.position.y = cars[index-1].position.y;
      }
    }

    //inteligencia artificial
    /*if(this.playerMoving){
      player.positionY += 10;
      player.update();
    }*/

    //controle do player
    this.playerControl(); 

    //linha de chegada 
    const chegada = -height*6 + 100;
    console.log(player.positionY);
    if(player.positionY < chegada)
    { 
    console.log("entrou");
    gameState = 2; 
    player.rank +=1; 
    Player.updateCarsAtEnd(player.rank);
    player.update();
    this.showRank(); 
    }
    
    //desenha os sprites
    drawSprites();
  }
  }

  telajogo(){
    form.hide();
    form.titleImg.position(40,50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reiniciar o Jogo");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width/2 + 200, 100);

    this.leaderboardTitle.html("Placar");
    this.leaderboardTitle.class("resetText");
    this.leaderboardTitle.position(width/3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width/3 - 60, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width/3 - 60, 130);
  }

  //movimentação dos jogadores
  playerControl(){

    if(keyIsDown(UP_ARROW)){
      this.playerMoving = true;
      player.positionY += 10;
      player.update();
    }

    if(keyIsDown(LEFT_ARROW) && player.positionX > width/3 - 50){
      player.positionX -= 5;
      player.update();
    }

    if(keyIsDown(RIGHT_ARROW) && player.positionX < width/2 - 300){
      player.positionX += 5;
      player.update();
    }
  }

  //exibir o placar com as informações atualizadas
  showLeaderboard(){
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if(
    (players[0].rank === 0 && players[1].rank === 0)  ||
    players[0].rank === 1)
    {
      leader1 = players[0].rank + "&emsp;" 
      + players[0].name + "&emsp;" + players[0].score;

      leader2 = players[1].rank + "&emsp;" 
      + players[1].name + "&emsp;" + players[1].score;
    }

    if(players[1].rank === 1){
      leader1 = players[1].rank + "&emsp;" 
      + players[1].name + "&emsp;" + players[1].score;

      leader2 = players[0].rank + "&emsp;" 
      + players[0].name + "&emsp;" + players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  addSprites(group, number, image, scale, positions=[])
  {
    for(var i = 0; i < number; i++)
    {
      var x,y;

      if(positions.length>0)
      {
        x = positions[i].x;
        y = positions[i].y;
        image = positions[i].image;
      }
      else
      {
        x = random(width/2 + 150, width/2 - 150);
        y = random(-height*4.5, height - 400);
      }

      var sprite = createSprite(x, y);
      sprite.addImage(image);
      sprite.scale = scale;
      group.add(sprite);

    }
  }

  combustivel(index){
    cars[index-1].overlap(combustiveis,function(collector,collected){
      if(player.fuel < 200)
      {
        player.fuel += 50;
      }
      collected.remove();
    });
  }

  moeda(index){
    cars[index-1].overlap(moedas,function(collector,collected){
      
      player.score += 10;
      player.update();
    
      collected.remove();
    });
  }

  showRank()
  { 
    swal ({ 
    title: `Incrível! ${"\n"}Rank${"\n"}${player.rank}`,
    text: "Você venceu!",
    imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
    imageSize: "100x100", 
    confirmButtonText: "Ok" }) 
  }

  gameOver()
  { 
    swal ({ 
    title: `fim de jogo`,
    text: "você perdeu",
    imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
    imageSize: "100x100", 
    confirmButtonText: "Ok" }) 
  }










}


