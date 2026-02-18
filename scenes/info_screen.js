class info_screen {
    constructor() {
        let assetPath = 'assets/';
        let menuTreePath = assetPath + 'menu_trees/';
        let selectedOption = 0; // 0: INTRODUCING OUR STARS, 1: HOW TO PLAY, 2: START GAME
        let buttons = [];

        this.setup = function () {
            // Initialize button positions
            buttons = [
                { label: 'INTRODUCING\nOUR STARS', x: width / 8, y: height / 3, index: 0 },
                { label: 'HOW TO PLAY', x: width / 8, y: height / 2, index: 1 },
                { label: 'START GAME', x: width / 8, y: height * 2 / 3, index: 2 }
            ];
        }

        this.draw = function () {
            background(backgroundImg);
            this.drawOptionsMenu();
            //this.drawTreeSelection();
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

        this.drawTreeSelection = function () {
            imageMode(CENTER);
            let treeOptions = [
                { img: menuMororo, label: 'Mororò' },
                { img: menuCarnauba, label: 'Carnaúba' },
                { img: menuJuazeiro, label: 'Juazeiro' },
                { img: menuCajueiro, label: 'Cajueiro' },
                { img: menuJuca, label: 'Juca' },
                { img: menuOiti, label: 'Oiti' }
            ];
            //next to the options menu, display the tree options in a 2x3 grid, with the names right below each tree
            let gridX = width / 2;
            let gridY = height / 3;
            let spacingX = 150;
            let spacingY = 150;

            for (let i = 0; i < treeOptions.length; i++) {
                let row = floor(i / 3);
                let col = i % 3;
                let x = gridX + col * spacingX - spacingX;
                let y = gridY + row * spacingY - spacingY / 2;

                image(treeOptions[i].img, x, y, 100, 100);
                textSize(16);
                fill(255);
                textAlign(CENTER, TOP);
                text(treeOptions[i].label, x, y + 50);
            }
            pop();
        }

        this.drawHowToPlay = function () {
        }
    }
}