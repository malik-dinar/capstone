import { GridObject } from "./GridObject.js";
import { EnemyObject } from "./EnemyObject.js";
import { ItemObject } from "./ItemObject.js";
import { Player } from "./Player.js";
import { promptPlayerForDirection } from "./playerPrompt.js";

class Grid {
    #currentObject;

  constructor(width, height, playerStartX = 0, playerStartY = height-1) {
    this.width = width;
    this.height = height;
    this.playerX = playerStartX;
    this.playerY = playerStartY;
    this.player = new Player("Abin karu" , { attack : 10, defense: 5, hp: 20 })

    this.grid = [];

    for (let row = 0; row < height; row++) {
      let thisRow = [];
      for (let col = 0; col < width; col++) {
        thisRow.push(new GridObject());
      }
      this.grid.push(thisRow);
    }

    this.grid[height - 1][0] = new GridObject("🐵", "player");
    this.grid[0][width - 1] = new GridObject("⭐", "win");

    this.startGame()

  }

  async startGame(){
    while(this.player.getStats().hp > 0){
        this.displayGrid();
        const response = await promptPlayerForDirection();
        
        switch (response) {
            case "Up" :{
                this.movePlayerUp()
                break;
            }
            case "Down":{
                this.movePlayerDown()
                break;
            }case "Right":{
                this.movePlayerRight();
                break;
            }
            case "Left":{
                this.movePlayerLeft()
                break
            }
        }

        console.log("...................................");
    }
  }

  displayGrid() {
    this.player.describe()
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        process.stdout.write(this.grid[row][col].sprite + " ");
        process.stdout.write("\t");
      }
      process.stdout.write("\n");
    }
  }

  generateGridObject(){
    const random = Math.random();
    let object;

    if(random < 0.15){
        object = new ItemObject("⚔️",{
            name: "Sword",
            attack: 3,
            defense: 1,
            hp: 0
        })
    } else if(random < 0.35) {
        object = new EnemyObject("🕷️",{
            name: "Spider",
            attack: 6,
            defense: 5,
            hp: 1
        })
    } else {
        object = new GridObject("👣", "discovered")
    }

    return object
  }

  executeTurn(){
    if(this.grid[this.playerY][this.playerX].type === 'win'){
        console.log(` 🎉Congrats you reached the end of the game 🏆`);
        process.exit()
    }

    if(this.#currentObject.type === 'discovered'){
        this.#currentObject.describe()
        return
    }

    if(this.#currentObject.type === 'item'){
        this.#currentObject.describe()
        const itemStats = this.#currentObject.getStats();
        this.player.addTostats(itemStats);
        return
    }

    this.#currentObject.describe()
    const enemyStats = this.#currentObject.getStats();
    const enemyName = this.#currentObject.getName();
    const playerStats = this.player.getStats();

    
    console.log(playerStats,enemyStats);
    console.log(enemyStats.hp);

    if(enemyStats.defense > playerStats.defense){
        console.log(`You lose - ${enemyName} was to powerfool`);
        process.exit()
    }

    let totalPlayerDamage = 0;
    while(enemyStats.hp > 0){

        const enemyDamageTurn = playerStats.attack - enemyStats.defense
        const playerDamageTurn = enemyStats.attack - enemyStats.defense

        if(enemyDamageTurn > 0){
            enemyStats.hp -= enemyDamageTurn
        }
        if(playerDamageTurn > 0){
            playerStats.hp -= playerDamageTurn
            totalPlayerDamage += playerDamageTurn
        }

        if(playerStats.hp <= 0){
            console.log(
                "Congratulations, you've achieved the esteemed title of 'Master of Failing'! Don't worry, we won't tell anyone 😂."
            );
            process.exit();
        }

        this.player.addTostats({hp : -totalPlayerDamage });
        console.log(`You defeated the ${enemyName}! Your updated stats`);
        this.player.describe();

    }
  }


  movePlayerRight(){
    // check if the player is on rigth edge of the map
    if(this.playerX === this.width-1 ){
        console.log("Cannot move right. ");
        return;
    }

    // set our currrent spot to be discocvered
    this.grid[this.playerY][this.playerX] = new GridObject("👣", "discovered");  
    // move the player to right
    this.playerX += 1;

    // check if your moving to has been discovered
    if(this.grid[this.playerY][this.playerX].type === 'discovered'){
        this.grid[this.playerY][this.playerX].describe()
        this.grid[this.playerY][this.playerX] = new GridObject("🐵");
        return
    }

    //discovering a new place
    this.#currentObject = this.generateGridObject();
    this.executeTurn()
    this.grid[this.playerY][this.playerX] = new GridObject("🐵");
  }


  movePlayerLeft(){
    if(this.playerX === 0 ){
        console.log("Cannot move left. ");
        return;
    }

    this.grid[this.playerY][this.playerX] = new GridObject("👣", "discovered");  
    this.playerX -= 1;

    if(this.grid[this.playerY][this.playerX].type === 'discovered'){

        this.grid[this.playerY][this.playerX].describe()
        this.grid[this.playerY][this.playerX] = new GridObject("🐵");
        return
    }

    this.#currentObject = this.generateGridObject();
    this.executeTurn()

    this.grid[this.playerY][this.playerX] = new GridObject("🐵");
  }

  movePlayerUp(){
    if(this.playerY === 0 ){
        console.log("Cannot move Up. ");
        return;
    }

    this.grid[this.playerY][this.playerX] = new GridObject("👣", "discovered");  
    this.playerY -= 1;

    if(this.grid[this.playerY][this.playerX].type === 'discovered'){
        this.grid[this.playerY][this.playerX].describe()
        this.grid[this.playerY][this.playerX] = new GridObject("🐵");
        return
    }

    this.#currentObject = this.generateGridObject();
    this.executeTurn()
    this.grid[this.playerY][this.playerX] = new GridObject("🐵");
  }

  movePlayerDown(){
    if(this.playerY === this.height-1 ){
        console.log("Cannot move Down. ");
        return;
    }

    this.grid[this.playerY][this.playerX] = new GridObject("👣", "discovered");  
    this.playerY += 1;

    if(this.grid[this.playerY][this.playerX].type === 'discovered'){
        this.grid[this.playerY][this.playerX].describe()
        this.grid[this.playerY][this.playerX] = new GridObject("🐵");
        return
    }

    this.#currentObject = this.generateGridObject();
    this.executeTurn()
    this.grid[this.playerY][this.playerX] = new GridObject("🐵");
  }

}

new Grid(10, 10);
