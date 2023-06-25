class GridObject {
  #backgroundsprites = ["🌳", "🌲", "🌴", "🌵"];

  constructor(sprite, type = "undiscovered") {
    if (!sprite) {
      const randomIndex = Math.floor(
        Math.random() * this.#backgroundsprites.length
      );
      this.sprite = this.#backgroundsprites[randomIndex];
    } else {
      this.sprite = sprite;
    }

    this.type = type; 
  }

  describe() {
    let random = Math.random();
    if (random < 0.33) {
      console.log("Safe Zone");
    } else if (random < 0.66) {
      console.log("These surrownding look familiar");
    } else {
      console.log("There's not much here  ");
    }
  }
}

export { GridObject };
