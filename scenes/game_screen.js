class game_screen {
    constructor() {
        let i = 0;
        let t = 2000; // 2 seconds per image
        let plantedTrees = []; // array of planted tree objects: {img, x, y}
        let annotations = null; // store loaded annotations

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

                // Draw planted trees on top (scaled to match the image)
                for (let tree of plantedTrees) {
                    imageMode(CENTER);
                    // Scale tree position relative to the scaled image dimensions
                    let treeX = tree.x * scale;
                    let treeY = tree.y * scale;
                    // Scale tree image size as well
                    let treeScale = scale * 0.3; // Adjust 0.3 to make trees bigger/smaller
                    image(tree.img, treeX, treeY, tree.img.width * treeScale, tree.img.height * treeScale);
                }

                this.drawTreeButtons(scale, scaledWidth, scaledHeight);
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

        this.drawTreeButtons = function (scale, scaledWidth, scaledHeight) {
            // Build buttons with scaled positions
            this.buttons = [
                { img: carnaubaBtn, tree: carnaubaImg, x: 1 * (scaledWidth / 8) - 200, y: scaledHeight - 200 },
                { img: cajueiroBtn, tree: cajueiroImg, x: 2 * (scaledWidth / 8) - 200, y: scaledHeight - 200 },
                { img: juazeiroBtn, tree: juazeiroImg, x: 3 * (scaledWidth / 8) - 200, y: scaledHeight - 200 },
                { img: jucaBtn, tree: jucaImg, x: 4 * (scaledWidth / 8) - 200, y: scaledHeight - 200 },
                { img: mororoBtn, tree: mororoImg, x: 5 * (scaledWidth / 8) - 200, y: scaledHeight - 200 },
                { img: oitiBtn, tree: oitiImg, x: 6 * (scaledWidth / 8) - 200, y: scaledHeight - 200 }
            ];

            for (let b of this.buttons) {
                image(b.img, b.x, b.y);
            }
        }

        this.mousePressed = function () {
            for (let b of this.buttons) {
                if (
                    mouseX > b.x &&
                    mouseX < b.x + b.img.width &&
                    mouseY > b.y &&
                    mouseY < b.y + b.img.height
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
                // Find the next available point (not already planted)
                let availablePoints = points.filter((p, idx) => !plantedTrees.some(t => t.pointIndex === idx));
                
                if (availablePoints.length === 0) {
                    print('All planting points used for this image');
                    return;
                }

                // Get the first available point (or use lowest Y value logic)
                let selectedPoint = availablePoints[0];
                
                // Store the planted tree with original coordinates (will be scaled in draw)
                plantedTrees.push({
                    img: button.tree,
                    x: selectedPoint.x,
                    y: selectedPoint.y,
                    pointIndex: points.indexOf(selectedPoint)
                });
                
                print('Planted tree at:', selectedPoint);
            } else {
                print('No planting points found for this image');
            }
        }
    }
}
