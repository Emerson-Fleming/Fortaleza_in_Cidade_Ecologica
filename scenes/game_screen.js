class game_screen {
    constructor() {
        let i = 0;
        let t = 3000; // 3 seconds per image
        let plantedTrees = [];
        let annotations = null;
        let buttonsInitialized = false;
        let carnaubaCount = 0, cajueiroCount = 0, juazeiroCount = 0, jucaCount = 0, mororoCount = 0, oitiCount = 0;
        let paused = false;
        let pauseImg, playImg;
        let pauseBtn = { x: 0, y: 0, width: 0, height: 0 };
        let pendingTimeout = null;

        // Pause menu options
        const pauseMenuItems = [
            { label: 'RESUME',         action: 'resume' },
            { label: 'TITLE SCREEN',   action: 'title'  },
            { label: 'END GAME',       action: 'end'    }
        ];
        let pauseMenuRects = []; // computed hit areas

        this.buttons = [];

        this.setup = function () {
            loadJSON('assets/json/annotations.json', (data) => {
                annotations = data.annotations;
            });
            pauseImg = loadImage('assets/game_screen/pause.png');
            playImg = loadImage('assets/game_screen/pause.png'); // replaced below if a play asset exists
            textFont('Press Start 2P');
            this.updateImage();
        }

        this.draw = function () {
            background(0);
            const footerHeight = 184;
            const footerStartY = height - footerHeight;

            if (!buttonsInitialized) {
                const buttonSize = 160;
                const padding = 20;
                const totalButtonWidth = (6 * (buttonSize + padding)) - padding;
                const startX = (width - totalButtonWidth) / 2;
                const buttonY = footerStartY + (footerHeight - buttonSize) / 2;

                this.buttons = [
                    { img: carnaubaBtn, tree: carnaubaImg, x: startX + (0 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .3 },
                    { img: cajueiroBtn, tree: cajueiroImg, x: startX + (1 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .5 },
                    { img: juazeiroBtn, tree: juazeiroImg, x: startX + (2 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .5 },
                    { img: jucaBtn, tree: jucaImg, x: startX + (3 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .5 },
                    { img: mororoBtn, tree: mororoImg, x: startX + (4 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .4 },
                    { img: oitiBtn, tree: oitiImg, x: startX + (5 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .5 }
                ];

                // Pause button: left side of footer
                const btnSize = 80;
                pauseBtn = {
                    x: 40,
                    y: footerStartY + (footerHeight - btnSize) / 2,
                    width: btnSize,
                    height: btnSize
                };

                buttonsInitialized = true;
            }

            if (streetImages[i]) {
                imageMode(CORNER);
                let scale = min(
                    width / streetImages[i].width,
                    height / streetImages[i].height
                );
                image(streetImages[i], 0, 0);
                filter(GRAY);
                for (let tree of plantedTrees.sort((a, b) => a.y - b.y)) {
                    imageMode(CENTER);
                    let minTreeScale = -0.5 * scale;
                    let maxTreeScale = 0.8 * scale;
                    let treeScale = map(tree.y, 0, streetImages[i].height, minTreeScale, maxTreeScale);
                    let treeX = (tree.x * scale);
                    let treeY = (tree.y * scale) - (tree.offset * tree.img.height * treeScale);
                    image(tree.img, treeX, treeY, tree.img.width * treeScale, tree.img.height * treeScale);
                }
                this.drawTreeButtons(footerStartY);

                if (paused) {
                    this.drawPauseMenu();
                }
            }
        }

        this.updateImage = function () {
            plantedTrees = [];
            if (i < streetImages.length - 1) {
                i++;
                pendingTimeout = setTimeout(() => this.updateImage(), t);
            } else {
                i = 0;
                this.sceneManager.showScene(podium_screen, this.getWinningTrees());
            }
        }

        this.drawTreeButtons = function (footerStartY) {
            fill(0);
            rect(0, footerStartY, width, height - footerStartY);

            // Draw pause/play button on the left
            imageMode(CORNER);
            if (pauseImg) {
                if (paused) {
                    // Draw a simple play triangle when paused
                    fill(255);
                    noStroke();
                    triangle(
                        pauseBtn.x + pauseBtn.width * 0.2, pauseBtn.y + pauseBtn.height * 0.1,
                        pauseBtn.x + pauseBtn.width * 0.2, pauseBtn.y + pauseBtn.height * 0.9,
                        pauseBtn.x + pauseBtn.width * 0.9, pauseBtn.y + pauseBtn.height * 0.5
                    );
                } else {
                    image(pauseImg, pauseBtn.x, pauseBtn.y, pauseBtn.width, pauseBtn.height);
                }
            }

            for (let b of this.buttons) {
                imageMode(CORNER);
                image(b.img, b.x, b.y, b.width, b.height);
            }
        }

        this.drawPauseMenu = function () {
            push();

            // Dim the screen
            fill(0, 0, 0, 160);
            noStroke();
            rect(0, 0, width, height);

            // Menu box
            const boxW = 600;
            const boxH = 420;
            const boxX = (width - boxW) / 2;
            const boxY = (height - boxH) / 2;

            fill(20);
            stroke(255);
            strokeWeight(3);
            rect(boxX, boxY, boxW, boxH);

            // Title
            noStroke();
            fill(255);
            textFont(font);
            textSize(32);
            textAlign(CENTER);
            text('PAUSED', width / 2, boxY + 78);

            // Menu items
            pauseMenuRects = [];
            const itemH = 60;
            const itemSpacing = 24;
            const startY = boxY + 130;

            for (let idx = 0; idx < pauseMenuItems.length; idx++) {
                const item = pauseMenuItems[idx];
                const itemY = startY + idx * (itemH + itemSpacing);
                const itemX = boxX + 60;
                const itemW = boxW - 120;

                pauseMenuRects.push({ x: itemX, y: itemY, w: itemW, h: itemH, action: item.action });

                // Highlight on hover
                const hovered = mouseX > itemX && mouseX < itemX + itemW &&
                                 mouseY > itemY && mouseY < itemY + itemH;

                if (hovered) {
                    fill(0, 176, 0);
                } else {
                    fill(50);
                }
                noStroke();
                rect(itemX, itemY, itemW, itemH);

                fill(255);
                textSize(22);
                textAlign(CENTER);
                text(item.label, itemX + itemW / 2, itemY + 39);
            }

            pop();
        }

        this.mousePressed = function () {
            // If paused, check pause menu item clicks first
            if (paused) {
                for (let r of pauseMenuRects) {
                    if (mouseX > r.x && mouseX < r.x + r.w &&
                        mouseY > r.y && mouseY < r.y + r.h) {
                        if (r.action === 'resume') {
                            paused = false;
                            pendingTimeout = setTimeout(() => this.updateImage(), t);
                        } else if (r.action === 'title') {
                            clearTimeout(pendingTimeout);
                            paused = false;
                            this.sceneManager.showScene(title_screen);
                        } else if (r.action === 'end') {
                            clearTimeout(pendingTimeout);
                            paused = false;
                            this.sceneManager.showScene(podium_screen, this.getWinningTrees());
                        }
                        return;
                    }
                }

                // Also allow clicking the pause button itself to resume
                if (mouseX > pauseBtn.x && mouseX < pauseBtn.x + pauseBtn.width &&
                    mouseY > pauseBtn.y && mouseY < pauseBtn.y + pauseBtn.height) {
                    paused = false;
                    pendingTimeout = setTimeout(() => this.updateImage(), t);
                }
                return;
            }

            // Check pause button when not paused
            if (mouseX > pauseBtn.x && mouseX < pauseBtn.x + pauseBtn.width &&
                mouseY > pauseBtn.y && mouseY < pauseBtn.y + pauseBtn.height) {
                paused = true;
                clearTimeout(pendingTimeout);
                return;
            }

            // Tree planting
            for (let b of this.buttons) {
                if (
                    mouseX > b.x &&
                    mouseX < b.x + b.width &&
                    mouseY > b.y &&
                    mouseY < b.y + b.height
                ) {
                    this.plantTree(b);
                }
            }
        }

        this.plantTree = function (button) {
            if (!annotations) {
                return;
            }

            let points = annotations[streetImageNames[i]];

            if (points && points.length > 0) {
                let availablePoints = points.filter((p, idx) => !plantedTrees.some(t => t.pointIndex === idx));
                if (availablePoints.length === 0) {
                    return;
                }
                let highestPoint = availablePoints.reduce(
                    (highest, p) => (p.y < highest.y ? p : highest),
                    availablePoints[0]
                );
                plantedTrees.push({
                    img: button.tree,
                    x: highestPoint.x,
                    y: highestPoint.y,
                    offset: button.offset,
                    pointIndex: points.indexOf(highestPoint)
                });
                this.countTrees(button.tree);
            }
        };

        this.countTrees = function (tree) {
            switch (tree) {
                case carnaubaImg:
                    carnaubaCount++;
                    break;
                case cajueiroImg:
                    cajueiroCount++;
                    break;
                case juazeiroImg:
                    juazeiroCount++;
                    break;
                case jucaImg:
                    jucaCount++;
                    break;
                case mororoImg:
                    mororoCount++;
                    break;
                case oitiImg:
                    oitiCount++;
                    break;
            }
        }

        this.getWinningTrees = function () {
            const counts = [
                { type: 'Carnauba', tree_img: menuCarnauba, count: carnaubaCount },
                { type: 'Cajueiro', tree_img: menuCajueiro, count: cajueiroCount },
                { type: 'Juazeiro', tree_img: menuJuazeiro, count: juazeiroCount },
                { type: 'Juca', tree_img: menuJuca, count: jucaCount },
                { type: 'Mororo', tree_img: menuMororo, count: mororoCount },
                { type: 'Oiti', tree_img: menuOiti, count: oitiCount }
            ];
            print(counts)

            //sort counts by count descending
            counts.sort((a, b) => b.count - a.count);

            return counts.slice(0, 3);
        }
    }
}
