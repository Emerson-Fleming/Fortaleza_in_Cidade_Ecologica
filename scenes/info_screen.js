class info_screen {
    constructor() {
        let backgroundImg;
        let assetPath = 'assets/';
        let font;
        let selectedOption = 0; // 0: INTRODUCING OUR STARS, 1: HOW TO PLAY, 2: START GAME
        let buttons = [];

        this.setup = function () {
            this.preload();
            textFont(font);

            // Initialize button positions
            buttons = [
                { label: 'INTRODUCING\nOUR STARS', x: width / 8, y: height / 3, index: 0 },
                { label: 'HOW TO PLAY', x: width / 8, y: height / 2, index: 1 },
                { label: 'START GAME', x: width / 8, y: height * 2 / 3, index: 2 }
            ];
        }

        this.preload = function () {
            backgroundImg = loadImage(assetPath + 'background.png');
            font = loadFont(assetPath + 'fonts/PressStart2P.ttf');
        }

        this.draw = function () {
            background(backgroundImg);
            this.drawOptionsMenu();
        }

        this.drawOptionsMenu = function () {
            textFont(font);
            textSize(24);

            for (let btn of buttons) {
                if (btn.index === selectedOption) {
                    fill(0, 176, 0); // #00b000 when selected
                } else {
                    fill(255); // white when not selected
                }
                text(btn.label, btn.x, btn.y);
            }
        }

        this.mouseClicked = function () {
            for (let btn of buttons) {
                // Get text bounds for hit detection
                textFont(font);
                textSize(24);

                let btnTextWidth = textWidth(btn.label);
                let textHeight = 24 * 3; // approximate height for multiline text

                if (mouseX > btn.x &&
                    mouseX < btn.x + btnTextWidth &&
                    mouseY > btn.y - textHeight / 2 &&
                    mouseY < btn.y + textHeight / 2) {
                    selectedOption = btn.index;
                    if(selectedOption === 2) {
                        this.sceneManager.showScene(game_screen);
                    }
                    break;
                }
            }
        }

        this.drawOurStars = function () {

        }

        this.drawHowToPlay = function () {
        }
    }
}