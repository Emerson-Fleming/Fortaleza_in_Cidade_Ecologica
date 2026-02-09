class game_screen {
    constructor() {
        let i = 0;
        let t = 2000; // 2 seconds per image

        this.buttons = [];

        this.setup = function () {
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

                image(
                    streetImages[i],
                    0,
                    0,
                    streetImages[i].width * scale,
                    streetImages[i].height * scale
                );

                filter(GRAY);

                this.drawTreeButtons();
            }
        }

        this.updateImage = function () {
            if (i < streetImages.length - 1) {
                i++;
                setTimeout(() => this.updateImage(), t);
            } else {
                i = 0;
                this.sceneManager.showScene(title_screen);
            }
        }

        this.drawTreeButtons = function () {
            // build buttons once per image
            this.buttons = [
                { img: carnaubaBtn, tree: carnaubaImg, x: 1 * (streetImages[i].width / 8) - 200, y: streetImages[i].height - 200 },
                { img: cajueiroBtn, tree: cajueiroImg, x: 2 * (streetImages[i].width / 8) - 200, y: streetImages[i].height - 200 },
                { img: juazeiroBtn, tree: juazeiroImg, x: 3 * (streetImages[i].width / 8) - 200, y: streetImages[i].height - 200 },
                { img: jucaBtn, tree: jucaImg, x: 4 * (streetImages[i].width / 8) - 200, y: streetImages[i].height - 200 },
                { img: mororoBtn, tree: mororoImg, x: 5 * (streetImages[i].width / 8) - 200, y: streetImages[i].height - 200 },
                { img: oitiBtn, tree: oitiImg, x: 6 * (streetImages[i].width / 8) - 200, y: streetImages[i].height - 200 }
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
                    this.plantTree(b.tree);
                }
            }
        }

        this.plantTree = function (treeType) {
            loadJSON('assets/json/annotations.json', (data) => {
                let annotations = data.annotations;
                print(annotations);
                let points = annotations[streetImageNames[i]]; // Use streetImageNames to get the correct key
                print(points);

                if (points && points.length > 0) {
                    // find point with lowest Y value
                    let lowestPoint = points.reduce(
                        (lowest, p) => (p.y > lowest.y ? p : lowest),
                        points[0]
                    );

                    image(treeType, lowestPoint.x, lowestPoint.y);
                    print(treeType)
                    print(lowestPoint);
                }
            });
        }
    }
}
