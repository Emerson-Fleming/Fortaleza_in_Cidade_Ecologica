class game_screen {
    constructor() {
        let i = 0;
        let t = 2000; // 2 seconds per image

        this.setup = function () {
            loadTrees();
            this.updateImage();
        }

        this.draw = function () {
            background(0);
            // Use the global streetImages array preloaded in sketch.js
            if (streetImages[i]) {
                imageMode(CORNER);
                let scale = min(width / streetImages[i].width, height / streetImages[i].height);
                image(streetImages[i], 0, 0, streetImages[i].width * scale, streetImages[i].height * scale);
                filter(GRAY);
                this.drawTreeButtons();
            }
        }

        this.updateImage = function () {
            if (i < streetImages.length) {
                i++;
                setTimeout(() => this.updateImage(), t);
            } else {
                i = 0;
                this.sceneManager.showScene(title_screen);
            }
        }

        this.drawTreeButtons = function () {
            image(carnaubaBtn, 1 * (streetImages[i].width / 8) - 200, streetImages[i].height - 200);
            image(cajueiroBtn, 2 * (streetImages[i].width / 8) - 200, streetImages[i].height - 200);
            image(juazeiroBtn, 3 * (streetImages[i].width / 8) - 200, streetImages[i].height - 200);
            image(jucaBtn, 4 * (streetImages[i].width / 8) - 200, streetImages[i].height - 200);
            image(mororoBtn, 5 * (streetImages[i].width / 8) - 200, streetImages[i].height - 200);
            image(oitiBtn, 6 * (streetImages[i].width / 8) - 200, streetImages[i].height - 200);
        }

        function plantTree() {
            //load points for tree planting from annotations.json
            loadJSON('assets/annotations.json', (data) => {
                let annotations = data.annotations;
                let points = annotations[streetImages[i].name]
                if (point) {
                    // Plant the tree at the specified location
                    image(carnaubaImg, point.x, point.y);
                }
            });
        }
    }
}