class game_screen {
    constructor() {
        let i = 0;
        let t = 2000; // 2 seconds per image
        let plantedTrees = []; // array of planted tree objects: {img, x, y}
        let annotations = null; // store loaded annotations
        let buttonsInitialized = false; // flag to initialize buttons once

        this.buttons = [];

        this.setup = function () {
            // Load annotations once at setup
            loadJSON('assets/json/annotations.json', (data) => {
                annotations = data.annotations;
                print('Annotations loaded:', annotations);
            });

            this.updateImage();
        }

        this.draw = function () {
            background(0);

            // Initialize buttons once on first draw (when canvas dimensions are stable)
            if (!buttonsInitialized) {
                const footerHeight = 250;
                const buttonSize = 200;
                const padding = 20;
                const totalButtonWidth = (6 * (buttonSize + padding)) - padding;
                const startX = (width - totalButtonWidth) / 2;
                const footerStartY = height - footerHeight;
                const buttonY = footerStartY + (footerHeight - buttonSize) / 2;

                this.buttons = [
                    { img: carnaubaBtn, tree: carnaubaImg, x: startX + (0 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .3 },
                    { img: cajueiroBtn, tree: cajueiroImg, x: startX + (1 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .5 },
                    { img: juazeiroBtn, tree: juazeiroImg, x: startX + (2 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .5 },
                    { img: jucaBtn, tree: jucaImg, x: startX + (3 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .5 },
                    { img: mororoBtn, tree: mororoImg, x: startX + (4 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .4 },
                    { img: oitiBtn, tree: oitiImg, x: startX + (5 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .5 }
                ];
                buttonsInitialized = true;
            }

            if (streetImages[i]) {
                imageMode(CORNER);

                let scale = min(
                    width / streetImages[i].width,
                    height / streetImages[i].height
                );

                let scaledWidth = streetImages[i].width * scale;
                let scaledHeight = streetImages[i].height * scale;

                // Draw street image
                image(
                    streetImages[i],
                    0,
                    0,
                    scaledWidth,
                    scaledHeight
                );

                filter(GRAY);

                // Draw available planting points as green dots
                if (annotations) {
                    let points = annotations[streetImageNames[i]];
                    if (points && points.length > 0) {
                        for (let p of points) {
                            // Check if this point has already been planted
                            let isPlanted = plantedTrees.some(t => t.x === p.x && t.y === p.y);

                            if (!isPlanted) {
                                fill(0, 255, 0); // Green
                                noStroke();
                                circle(p.x * scale, p.y * scale, 10); // 10px diameter dot
                            }
                        }
                    }
                }

                // Draw planted trees on top (scaled to match the image)
                for (let tree of plantedTrees) {
                    imageMode(CENTER);
                    // Scale tree position relative to the scaled image dimensions
                    let treeScale = scale * 0.3; // Adjust 0.3 to make trees bigger/smaller
                    let treeX = (tree.x * scale);
                    let treeY = (tree.y * scale) - (tree.offset * tree.img.height * treeScale);
                    image(tree.img, treeX, treeY, tree.img.width * treeScale, tree.img.height * treeScale);
                }

                const footerHeight = 250;
                const footerStartY = height - footerHeight;
                this.drawTreeButtons(footerStartY);
            }
        }

        this.updateImage = function () {
            plantedTrees = []; // reset planted trees for new image
            if (i < streetImages.length - 1) {
                i++;
                setTimeout(() => this.updateImage(), t);
            } else {
                i = 0;
                this.sceneManager.showScene(title_screen);
            }
        }

        this.drawTreeButtons = function (footerStartY) {
            const buttonSize = 150;

            // Draw semi-transparent background for footer
            fill(0);
            rect(0, footerStartY, width, height - footerStartY);

            // Just draw the buttons - don't recalculate positions
            for (let b of this.buttons) {
                imageMode(CORNER);
                image(b.img, b.x, b.y, b.width, b.height);
            }
        }

        this.mousePressed = function () {
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
                print('Annotations not loaded yet');
                return;
            }

            let points = annotations[streetImageNames[i]]; // Use streetImageNames to get the correct key
            print('Points for', streetImageNames[i], ':', points);

            if (points && points.length > 0) {
                let availablePoints = points.filter((p, idx) => !plantedTrees.some(t => t.pointIndex === idx));
                if (availablePoints.length === 0) {
                    print('All planting points used for this image');
                    return;
                }
                // find point with lowest Y value
                let lowestPoint = availablePoints.reduce(
                    (lowest, p) => (p.y > lowest.y ? p : lowest),
                    availablePoints[0]
                );
                plantedTrees.push({
                    img: button.tree,
                    x: lowestPoint.x,
                    y: lowestPoint.y,
                    offset: button.offset,
                    pointIndex: points.indexOf(lowestPoint)
                });
                print(button);
            }
        };
    }
}
