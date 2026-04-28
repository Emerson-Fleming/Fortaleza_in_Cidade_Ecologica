class game_screen {
    constructor() {
        let i = 0;
        let t = 3000; // 3 seconds per image
        let plantedTrees = [];
        let annotations = null;
        let buttonsInitialized = false;
        let treeCounts = {};
        let paused = false;
        let pauseBtn = { x: 0, y: 0, width: 0, height: 0 };
        let pendingTimeout = null;
        let gameStartMillis = 0;
        let pausedAt = 0;
        let totalPausedMs = 0;

        // Pause menu options
        const pauseMenuItems = [
            { label: 'RESUME', action: 'resume' },
            { label: 'END GAME', action: 'end' }
        ];
        let pauseMenuRects = []; // computed hit areas

        this.buttons = [];

        this.setup = function () {
            loadJSON('assets/json/annotations.json', (data) => {
                annotations = data.annotations;
            });
            textFont('Press Start 2P');
        }

        this.enter = function () {
            this.resetGameState();
        }

        this.resetGameState = function () {
            clearTimeout(pendingTimeout);
            pendingTimeout = null;
            i = 0;
            plantedTrees = [];
            treeCounts = {};
            for (let tree of trees) {
                treeCounts[tree.type] = 0;
            }
            paused = false;
            pauseMenuRects = [];
            gameStartMillis = millis();
            pausedAt = 0;
            totalPausedMs = 0;

            if (streetImages.length > 0) {
                pendingTimeout = setTimeout(() => this.updateImage(), t);
            }
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

                this.buttons = trees.map((tree, idx) => ({
                    type: tree.type,
                    img: tree.btn(),
                    tree: tree.img(),
                    x: startX + (idx * (buttonSize + padding)),
                    y: buttonY,
                    width: buttonSize,
                    height: buttonSize,
                    offset: tree.offset
                }));

                // Pause button: left side of footer
                pauseBtn = {
                    x: 100,
                    y: footerStartY + (footerHeight - pauseImg.height) / 2,
                    width: pauseImg.width,
                    height: pauseImg.height
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
                pendingTimeout = null;
                i = 0;
                this.sceneManager.showScene(podium_screen, this.getWinningTrees());
            }
        }

        this.drawTreeButtons = function (footerStartY) {
            fill(0);
            rect(0, footerStartY, width, height - footerStartY);

            // Draw pause button on the left
            imageMode(CORNER);
            image(pauseImg, pauseBtn.x, pauseBtn.y, pauseBtn.width, pauseBtn.height);

            for (let b of this.buttons) {
                imageMode(CORNER);
                image(b.img, b.x, b.y, b.width, b.height);
            }

            // Draw countdown timer in bottom right (symmetrical to pause button)
            const totalMs = streetImages.length * t;
            const pauseOffset = paused ? (millis() - pausedAt) : 0;
            const elapsed = millis() - gameStartMillis - totalPausedMs - pauseOffset;
            const remaining = max(0, totalMs - elapsed);
            const totalSecs = floor(remaining / 1000);
            const mins = floor(totalSecs / 60);
            const secs = totalSecs % 60;
            const timeStr = nf(mins, 2) + ':' + nf(secs, 2);
            push();
            textFont(headingFont);
            textSize(48);
            textAlign(RIGHT, CENTER);
            fill(255);
            noStroke();
            text(timeStr, width - 100, pauseBtn.y + pauseBtn.height / 2);
            pop();
        }

        this.drawPauseMenu = function () {
            push();

            // Dim the screen
            fill(0, 0, 0, 160);
            noStroke();
            rect(0, 0, width, height);

            // Menu box
            const boxW = 600;
            const boxH = 300;
            const boxX = (width - boxW) / 2;
            const boxY = (height - boxH) / 2;

            fill(20);
            stroke(255);
            strokeWeight(3);
            rect(boxX, boxY, boxW, boxH);

            // Title
            noStroke();
            fill(255);
            textFont(headingFont);
            textSize(48);
            textAlign(CENTER, CENTER);
            text('PAUSED', width / 2, boxY + boxH / 4);

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
                textSize(32);
                textAlign(CENTER, CENTER);
                text(item.label, itemX + itemW / 2, itemY + itemH / 2);
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
                            totalPausedMs += millis() - pausedAt;
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
                    totalPausedMs += millis() - pausedAt;
                    paused = false;
                    pendingTimeout = setTimeout(() => this.updateImage(), t);
                }
                return;
            }

            // Check pause button when not paused
            if (mouseX > pauseBtn.x && mouseX < pauseBtn.x + pauseBtn.width &&
                mouseY > pauseBtn.y && mouseY < pauseBtn.y + pauseBtn.height) {
                paused = true;
                pausedAt = millis();
                clearTimeout(pendingTimeout);
                return;
            }

            // Tree planting
            for (let b of this.buttons) {
                if (
                    (mouseX > b.x &&
                    mouseX < b.x + b.width &&
                    mouseY > b.y &&
                    mouseY < b.y + b.height)
                ) {
                    this.plantTree(b);
                }
            }
        }

        this.keyPressed = function () {
            if (paused) return;
            const idx = '123456'.indexOf(key);
            if (idx !== -1 && idx < this.buttons.length) {
                this.plantTree(this.buttons[idx]);
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
                this.countTrees(button.type);
            }
        };

        this.countTrees = function (treeType) {
            if (treeCounts[treeType] !== undefined) {
                treeCounts[treeType]++;
            }
        }

        this.getWinningTrees = function () {
            const counts = trees.map(tree => ({
                type: tree.type,
                tree_img: tree.menuImg(),
                count: treeCounts[tree.type] || 0
            }));
            print(counts)

            //sort counts by count descending
            counts.sort((a, b) => b.count - a.count);

            const totalAnnotationPoints = annotations
                ? Object.values(annotations).reduce((s, pts) => s + pts.length, 0)
                : 0;
            const maxShadowCoefficient = Math.max(...trees.map(tr => tr.shadowCoefficient));
            const totalPossiblePoints = totalAnnotationPoints * maxShadowCoefficient;

            return { counts, totalPossiblePoints };
        }
    }
}
