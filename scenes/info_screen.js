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
            if (selectedOption === 0) {
                this.drawTreeSelection();
            }
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
                    if (selectedOption === 2) {
                        this.sceneManager.showScene(game_screen);
                    }
                    break;
                }
            }
        }

        this.drawTreeSelection = function () {
            push();
            imageMode(CORNER);
            textAlign(CENTER, TOP);

            let treeOptions = [
                { img: menuMororo, label: 'Mororò' },
                { img: menuCarnauba, label: 'Carnaúba' },
                { img: menuJuazeiro, label: 'Juazeiro' },
                { img: menuCajueiro, label: 'Cajueiro' },
                { img: menuJuca, label: 'Juca' },
                { img: menuOiti, label: 'Oiti' }
            ];

            let imgSize = menuMororo.width;
            let labelHeight = 50;
            let paddingX = 80;
            let paddingY = 70;
            let cols = 3;
            let cellW = imgSize + paddingX;
            let cellH = imgSize + labelHeight + paddingY;

            // The options menu occupies ~1/3 of the screen, so the grid starts at 1/3 and spans 2/3
            let gridAreaStartX = width * .3;
            let gridAreaWidth = width * 2 / 3;
            let gridTotalW = cols * cellW - paddingX;
            let gridStartX = gridAreaStartX + (gridAreaWidth - gridTotalW) / 2;
            let gridStartY = height / 2 - cellH;

            for (let i = 0; i < treeOptions.length; i++) {
                let row = floor(i / cols);
                let col = i % cols;
                let x = gridStartX + col * cellW;
                let y = gridStartY + row * cellH;

                image(treeOptions[i].img, x, y, imgSize, imgSize);
                textSize(24);
                fill(255);
                text(treeOptions[i].label, x + imgSize / 2, y + imgSize + 10);
            }
            pop();
        }

        this.drawHowToPlay = function () {
        }
    }
}