class title_screen {
  constructor() {
    let titleScreenImg;
    let startGameImg;
    let startBlink = 0;
    let assetPath = 'assets/title_screen/';

    this.setup = function () {
      this.preload();
    };

    this.preload = function () {
      titleScreenImg = loadImage(assetPath + 'title_screen.png');
      startGameImg = loadImage(assetPath + 'start_game.png');
    }

    this.windowResized = function () {
      resizeCanvas(windowWidth, windowHeight);
    };

    this.draw = function () {
      background(titleScreenImg);
      imageMode(CORNER);
      this.drawStartText();
    };

    this.drawStartText = function () {
      startBlink = (startBlink + 0.04) % (TWO_PI);
      let visible = sin(startBlink) > 0.2;
      if (visible) {
        push();
        textAlign(CENTER, CENTER);

        if (startGameImg) {
          // Draw the image, scaled to a reasonable size
          imageMode(CENTER);
          let btnWidth = min(width * 0.25, 300);
          let btnHeight = btnWidth * (startGameImg.height / startGameImg.width);
          image(startGameImg, width / 2, height * 0.65 + 10, btnWidth, btnHeight);
        } else {
          // Fallback: draw text if image not available
          textSize(16);
          fill(240);
          noStroke();
          text('START GAME', width / 2, height * 0.6 + 10);
        }
        pop();
      }
    };

    this.mouseClicked = function () {
      this.sceneManager.showScene(podium_screen);
    };

    this.keyPressed = function () {
      this.sceneManager.showScene(podium_screen);
    };
  }
}