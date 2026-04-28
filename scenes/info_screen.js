class info_screen {
    constructor() {
        let selectedOption = 0; // 0: INTRODUCING OUR STARS, 1: HOW TO PLAY, 2: START GAME
        let buttons = [];
        let selectedTree = null; // holds the clicked tree object when viewing detail

        // Helper function for word-wrapping text (q5.js compatibility)
        const wrapText = function (txt, x, y, maxWidth, lineHeight) {
            let words = txt.split(' ');
            let line = '';
            let yPos = y;

            for (let i = 0; i < words.length; i++) {
                let testLine = line + words[i] + ' ';
                let testWidth = textWidth(testLine);

                if (testWidth > maxWidth && i > 0) {
                    text(line, x, yPos);
                    line = words[i] + ' ';
                    yPos += lineHeight;
                } else {
                    line = testLine;
                }
            }
            text(line, x, yPos);
        };

        // Helper to calculate number of lines for wrapped text
        const countLines = function (txt, maxWidth) {
            let words = txt.split(' ');
            let line = '';
            let lines = 1;

            for (let i = 0; i < words.length; i++) {
                let testLine = line + words[i] + ' ';
                let testWidth = textWidth(testLine);

                if (testWidth > maxWidth && i > 0) {
                    line = words[i] + ' ';
                    lines++;
                } else {
                    line = testLine;
                }
            }
            return lines;
        };

        this.setup = function () {
            // Initialize button positions
            buttons = [
                { label: 'INTRODUCING\nOUR STARS', x: width / 10, y: height * 2 / 7, index: 0 },
                { label: 'HOW TO PLAY', x: width / 10, y: height * 3 / 7, index: 1 },
                { label: 'START GAME', x: width / 10, y: height * 4 / 7, index: 2 },
                { label: '<<<', x: width / 10, y: height * 5 / 7, index: 3 }
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
            textFont(bodyFont);
            textSize(40);
            textAlign(LEFT, TOP);
            let lineHeight = 30;

            for (let btn of buttons) {
                if (btn.index === selectedOption) {
                    fill(0, 176, 0); // #00b000 when selected
                } else {
                    fill(255); // white when not selected
                }
                let lines = btn.label.split('\n');
                for (let j = 0; j < lines.length; j++) {
                    text(lines[j], btn.x, btn.y + j * lineHeight);
                }
            }
        }

        this.mouseClicked = function () {
            // Check option menu buttons
            for (let btn of buttons) {
                textFont(bodyFont);
                textSize(40);
                let lineHeight = 30;
                let lines = btn.label.split('\n');
                let btnTextWidth = Math.max(...lines.map(l => textWidth(l)));
                let btnTextHeight = (lines.length - 1) * lineHeight + 40;

                if (mouseX > btn.x &&
                    mouseX < btn.x + btnTextWidth &&
                    mouseY > btn.y &&
                    mouseY < btn.y + btnTextHeight) {
                    selectedOption = btn.index;
                    selectedTree = null; // reset tree detail when switching tabs
                    if (selectedOption === 2) {
                        this.sceneManager.showScene(game_screen);
                        selectedOption = 0; // reset to first tab when coming back from game
                    }
                    if (selectedOption === 3) {
                        this.sceneManager.showScene(title_screen);
                        selectedOption = 0; // reset to first tab when coming back from title
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

                for (let i = 0; i < trees.length; i++) {
                    let row = floor(i / cols);
                    let col = i % cols;
                    let x = gridStartX + col * cellW;
                    let y = gridStartY + row * cellH;

                    if (mouseX > x && mouseX < x + imgSize &&
                        mouseY > y && mouseY < y + imgSize) {
                        selectedTree = trees[i];
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

            for (let i = 0; i < trees.length; i++) {
                let row = floor(i / cols);
                let col = i % cols;
                let x = gridStartX + col * cellW;
                let y = gridStartY + row * cellH;

                image(trees[i].menuImg(), x, y, imgSize, imgSize);
                textSize(48);
                textFont(headingFont);
                fill(255);
                text(trees[i].type, x + imgSize / 2, y + imgSize + 10);
            }
            pop();
        }

        this.drawHowToPlay = function () {
            push();

            // Calculate horizontal positioning to match tree grid area
            let imgSize = menuMororo.width;
            let paddingX = 80;
            let cols = 3;
            let cellW = imgSize + paddingX;
            let gridAreaStartX = width * 0.3;
            let gridAreaWidth = width * 2 / 3;
            let gridTotalW = cols * cellW - paddingX;
            let boxX = gridAreaStartX + (gridAreaWidth - gridTotalW) / 2;
            let boxW = gridTotalW;

            let howToPlayText = "consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna uti aliqua. Ut enim ad minim veniam quis nostrud exercitation cillum dolore eu fugiat nulla pariatur cillum dolore eu ugiat. consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna uti aliqua. Ut enim ad minim veniam quis nostrud exercitation cillum dolore eu fugiat nulla pariatur cillum dolore eu ugiat.consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna uti aliqua.";

            textFont(bodyFont);
            textSize(36);
            let lineHeight = 60;
            let numLines = countLines(howToPlayText, boxW);
            let totalTextHeight = numLines * lineHeight;
            let startY = (height - totalTextHeight) / 2;

            textAlign(LEFT, TOP);
            fill(255);
            wrapText(howToPlayText, boxX, startY, boxW, lineHeight);

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
            let maxImgSize = boxH * 0.7;
            let treeImg = selectedTree.img();
            let aspectRatio = treeImg.width / treeImg.height;
            let detailImgW, detailImgH;

            if (aspectRatio >= 1) {
                // Wider than tall - constrain by width
                detailImgW = maxImgSize;
                detailImgH = maxImgSize / aspectRatio;
            } else {
                // Taller than wide - constrain by height
                detailImgH = maxImgSize;
                detailImgW = maxImgSize * aspectRatio;
            }

            let imgX = boxX;
            let imgY = boxY + (boxH - detailImgH) / 2;
            imageMode(CORNER);
            image(treeImg, imgX, imgY, detailImgW, detailImgH);

            // Right side: title then description
            let textX = boxX + detailImgW + 40;
            let textW = boxW - detailImgW - 40;

            
            textAlign(LEFT, TOP);

            textFont(headingFont);
            fill(255);
            textSize(60);
            text(selectedTree.type, textX, imgY + 48);

            textFont(bodyFont);
            fill(255);
            textSize(28);
            wrapText(selectedTree.desc(), textX, imgY + 48 + 60, textW, 40);

            pop();
        }
    }
}