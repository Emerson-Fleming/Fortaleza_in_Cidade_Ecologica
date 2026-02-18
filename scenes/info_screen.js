class info_screen {
    constructor() {
        let assetPath = 'assets/';
        let menuTreePath = assetPath + 'menu_trees/';
        let selectedOption = 0; // 0: INTRODUCING OUR STARS, 1: HOW TO PLAY, 2: START GAME
        let buttons = [];
        let selectedTree = null; // holds the clicked tree object when viewing detail

        const treeOptions = [
            { img: () => menuMororo, label: 'Mororò', description: 'This key Caatinga species is popular know as pata-de-vaca (cow\'s foot), with a light, sparse crown, and it\'s a “biological barometer,” sprouting after heavy rains. It\'s a beautiful ornamental tree, and more, due to its high adaptability, mororó plant is used in revegetation projects for eroded soil!' },
            { img: () => menuCarnauba, label: 'Carnaúba', description: 'Get to know Carnaúba, the “tree of life” that is the symbol of Ceará. Pictured in the state flag, it\'s endemic to the Caatinga, and can reach 15 m in height! From its leaves, we can extract wax that is widely used in global cosmetic, food, pharma, and even tech industries. Their deep and beautiful roots resist drought and salinity, preventing erosion.' },
            { img: () => menuJuazeiro, label: 'Juazeiro', description: 'Named from the indigenous Tupi for “yellow fruit,” this evergreen tree has a dense crown and deep roots. It has medicinal bark and leaves that are used to treat wounds and fevers. It cools cities, shelters wildlife, and aids land recovery, working with the aid of bees. It\'s a symbol of resistance from the Sertão and can live up to 100 years!' },
            { img: () => menuCajueiro, label: 'Cajueiro', description: 'Native to Brazil, the cashew tree thrives in full sun and deep soils. It yields 20 to 60 fruits per harvest, is of significant socioeconomic importance to the country\'s northeast, and all parts of the fruit are widely used, not just the nut! Get to know the world\’s largest Cajueiro that spreads 8,500 m² in Natal, at Rio Grande do Norte.' },
            { img: () => menuJuca, label: 'Jucá', description: 'Jucá is also called pau-ferro (ironwood)or ybyraitá in Tupi, and it\'s known for its dense, durable, and resistant wood, with beautiful marble-like trunks ranging from dark green to white and grey blotches. This medium-to-large native tree offers shade and resilience, with non-aggressive roots. In addition, Jucá teas and infusions are used in popular culture to treat infections and wounds.' },
            { img: () => menuOiti, label: 'Oiti', description: 'A medium-to-large evergreen tree with a dense, rounded crown, reaching up to 20m in height. Its velvety leaves reduce water loss in hot weather, and it produces small, sweet yellow fruits loved by humans and birds. It\'s also resistant to pollution! ' }
        ];

        this.setup = function () {
            // Initialize button positions
            buttons = [
                { label: 'INTRODUCING\nOUR STARS', x: width / 10, y: height / 3, index: 0 },
                { label: 'HOW TO PLAY', x: width / 10, y: height / 2, index: 1 },
                { label: 'START GAME', x: width / 10, y: height * 2 / 3, index: 2 }
            ];
        }

        this.draw = function () {
            background(backgroundImg);
            this.drawOptionsMenu();
            if (selectedOption === 0) {
                if (selectedTree !== null) {
                    this.drawTreeDetail();
                } else {
                    this.drawTreeSelection();
                }
            } else if (selectedOption === 1) {
                this.drawHowToPlay();
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
            // Check option menu buttons
            for (let btn of buttons) {
                textFont(font);
                textSize(24);

                let btnTextWidth = textWidth(btn.label);
                let textHeight = 24 * 3;

                if (mouseX > btn.x &&
                    mouseX < btn.x + btnTextWidth &&
                    mouseY > btn.y - textHeight / 2 &&
                    mouseY < btn.y + textHeight / 2) {
                    selectedOption = btn.index;
                    selectedTree = null; // reset tree detail when switching tabs
                    if (selectedOption === 2) {
                        this.sceneManager.showScene(game_screen);
                    }
                    return;
                }
            }

            // Check tree grid clicks when on Introducing Our Stars
            if (selectedOption === 0 && selectedTree === null) {
                let imgSize = menuMororo.width;
                let labelHeight = 50;
                let paddingX = 80;
                let paddingY = 70;
                let cols = 3;
                let cellW = imgSize + paddingX;
                let cellH = imgSize + labelHeight + paddingY;
                let gridAreaStartX = width * 0.25;
                let gridAreaWidth = width * 2 / 3;
                let gridTotalW = cols * cellW - paddingX;
                let gridStartX = gridAreaStartX + (gridAreaWidth - gridTotalW) / 2;
                let gridStartY = height / 2 - cellH;

                for (let i = 0; i < treeOptions.length; i++) {
                    let row = floor(i / cols);
                    let col = i % cols;
                    let x = gridStartX + col * cellW;
                    let y = gridStartY + row * cellH;

                    if (mouseX > x && mouseX < x + imgSize &&
                        mouseY > y && mouseY < y + imgSize) {
                        selectedTree = treeOptions[i];
                        return;
                    }
                }
            }

            // Click anywhere to go back from tree detail
            if (selectedOption === 0 && selectedTree !== null) {
                selectedTree = null;
            }
        }

        this.drawTreeSelection = function () {
            push();
            imageMode(CORNER);
            textAlign(CENTER, TOP);

            let imgSize = menuMororo.width;
            let labelHeight = 50;
            let paddingX = 80;
            let paddingY = 70;
            let cols = 3;
            let cellW = imgSize + paddingX;
            let cellH = imgSize + labelHeight + paddingY;

            // The options menu occupies ~1/3 of the screen, so the grid starts at 1/3 and spans 2/3
            let gridAreaStartX = width * .25;
            let gridAreaWidth = width * 2 / 3;
            let gridTotalW = cols * cellW - paddingX;
            let gridStartX = gridAreaStartX + (gridAreaWidth - gridTotalW) / 2;
            let gridStartY = height / 2 - cellH;

            for (let i = 0; i < treeOptions.length; i++) {
                let row = floor(i / cols);
                let col = i % cols;
                let x = gridStartX + col * cellW;
                let y = gridStartY + row * cellH;

                image(treeOptions[i].img(), x, y, imgSize, imgSize);
                textSize(24);
                fill(255);
                text(treeOptions[i].label, x + imgSize / 2, y + imgSize + 10);
            }
            pop();
        }

        this.drawHowToPlay = function () {
            push();

            // Match the same area as the tree grid
            let imgSize = menuMororo.width;
            let labelHeight = 50;
            let paddingX = 80;
            let paddingY = 70;
            let cols = 3;
            let rows = 2;
            let cellW = imgSize + paddingX;
            let cellH = imgSize + labelHeight + paddingY;
            let gridAreaStartX = width * 0.3;
            let gridAreaWidth = width * 2 / 3;
            let gridTotalW = cols * cellW - paddingX;
            let boxX = gridAreaStartX + (gridAreaWidth - gridTotalW) / 2;
            let boxY = height / 2 - cellH;
            let boxW = gridTotalW;
            let boxH = rows * cellH - paddingY;

            let howToPlayText = "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna uti aliqua. Ut enim ad minim veniam quis nostrud exercitation cillum dolore eu fugiat nulla pariatur cillum dolore eu ugiat. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna uti aliqua. Ut enim ad minim veniam quis nostrud exercitation cillum dolore eu fugiat nulla pariatur cillum dolore eu ugiat.consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna uti aliqua.";

            textFont(font);
            textSize(24);
            textAlign(LEFT, CENTER);
            textWrap(WORD);
            fill(255);
            textLeading(50);
            text(howToPlayText, boxX, boxY, boxW, boxH);

            pop();
        }

        this.drawTreeDetail = function () {
            push();

            // Use the same grid area bounds as drawTreeSelection
            let imgSize = menuMororo.width;
            let labelHeight = 50;
            let paddingX = 80;
            let paddingY = 70;
            let cols = 3;
            let rows = 2;
            let cellW = imgSize + paddingX;
            let cellH = imgSize + labelHeight + paddingY;
            let gridAreaStartX = width * 0.25;
            let gridAreaWidth = width * 2 / 3;
            let gridTotalW = cols * cellW - paddingX;
            let boxX = gridAreaStartX + (gridAreaWidth - gridTotalW) / 2;
            let boxY = height / 2 - cellH;
            let boxW = gridTotalW;
            let boxH = rows * cellH - paddingY;

            // Left side: tree image, centered vertically in the box
            let detailImgSize = boxH * 0.7;
            let imgX = boxX;
            let imgY = boxY + (boxH - detailImgSize) / 2;
            imageMode(CORNER);
            image(selectedTree.img(), imgX, imgY, detailImgSize, detailImgSize);

            // Right side: title then description
            let textX = boxX + detailImgSize + 40;
            let textW = boxW - detailImgSize - 40;

            textFont(font);
            textAlign(LEFT, CENTER);
            textWrap(WORD);

            fill(255);
            textSize(28);
            text(selectedTree.label, textX, imgY + 48, textW);

            fill(255);
            textSize(18);
            textLeading(40);
            text(selectedTree.description, textX, imgY + 28 + 20, textW, boxH - 80);

            // Back hint
            textSize(14);
            fill(180);
            textAlign(LEFT, BOTTOM);
            text('< click anywhere to go back', boxX, boxY + boxH);

            pop();
        }
    }
}