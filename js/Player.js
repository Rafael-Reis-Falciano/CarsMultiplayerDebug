class Player 
{

  constructor() 
  {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.rank = 0;
    this.score = 0;
    this.fuel = 200;
    this.life = 200;
  }

  updatePlayer(count)
  {
    database.ref("/").update({
      playerCount: count
    });    
  }

  getPlayerCount()
  {
    var playerCountRef = database.ref("playerCount");
    playerCountRef.on("value", data=>{
      playerCount = data.val();
    });
  }

  addPlayer()
  {
    var playerIndex = "players/player" + this.index;
    console.log(this.index);
    console.log(playerIndex);
    
    if(this.index === 1)
    {
      this.positionX = width/2 - 100;
    }
    else 
    {
      this.positionX = width/2 + 100;
    }

    database.ref(playerIndex).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score,
    })
  }

  static getPlayerInfo(){
     var playerInfo = database.ref("players");
     playerInfo.on("value", data =>{
       allPlayers = data.val();
     });
  }

  update(){
    var playerIndex = "players/player" + this.index;
    database.ref(playerIndex).update({
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score,
      life: this.life,
    })
  }

  getDistance(){
    var playerDistance = database.ref("players/player" + this.index);
    playerDistance.on("value",data =>{
      var data = data.val();
      this.positionX = data.positionX;
      this.positionY = data.positionY;
    })
  }

  getCarsAtEnd() 
  { database.ref("carsAtEnd").on("value",data => {
    this.rank= data.val();
  }); } 

  static updateCarsAtEnd(rank) 
  { database.ref("/").update({
    carsAtEnd: rank }); 
  } 



  
}


