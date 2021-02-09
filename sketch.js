//Create variables here
var dog,happyDog;
var garden,washRoom,bedRoom;
var database;
var foodS,foodStock;
var fedTime,lastFed,feed,addFood;

function preload(){
  dog=loadImage("images/Dog.png");
  happyDog=loadImage("images/Happy.png");
  garden=loadImage("images/Garden.png");
  washRoom=loadImage("images/Wash Room.png");
  LivingRoom=loadImage("images/Living Room.png");
  bedRoom=loadImage("images/Bed Room.png");
	//load images here
}

function setup() {
  createCanvas(1000, 500);
  database=firebase.database();
  foodObj=new Food();
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  fedTime=database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })


  d1=createSprite(800,200,150,150);
  d1.addImage(dog);
  d1.scale=0.15;
 
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {  

  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("playing");
    foodObj.Garden();
  }else if(currentTime==(lastFed+2)){
    update("sleeping");
    foodObj.BedRoom();
  }else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
    update("bathing");
    foodObj.WashRoom();
  }else{
    update("hungry");
    foodObj.display();
  }

  if(gameState!="hungry"){
    feed.hide();
    addFood.hide();
    d1.remove();
  }else{
    feed.show();
    addFood.show();
    d1.addImage(dog);
  }
  drawSprites();
}
  function readStock(data){
    foodS=data.val();
    foodObj.updateFoodStock(foodS);
  }
  function feedDog(){
    d1.addImage(happyDog);
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
        feedTime:hour(),
        gameState:'hungry'

    })
  }
  function addFoods(){
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
  }
  function update(state){
    database.ref('/').update({
      gameState:state
  })
 // drawSprites();
}









