class game_screen {
    constructor() {
        let carnaubaImg, cajueiroImg, juazeiroImg, jucaImg, mororoImg, oitiImg;
        let carnaubaBtn, cajueiroBtn, juazeiroBtn, jucaBtn, mororoBtn, oitiBtn;
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
                imageMode(CENTER);
                let scale = min(width / streetImages[i].width, height / streetImages[i].height);
                image(streetImages[i], width / 2, height / 2, streetImages[i].width * scale, streetImages[i].height * scale);
                filter(GRAY);
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

        function loadTrees() {
            carnaubaImg = loadImage('assets/trees/Carnauba_1000_FINAL.png');
            cajueiroImg = loadImage('assets/trees/Cajueiro_1000_FINAL.png');
            juazeiroImg = loadImage('assets/trees/Juazeiro_1000_FINAL.png');
            jucaImg = loadImage('assets/trees/Juca_1000_FINAL.png');
            mororoImg = loadImage('assets/trees/Mororo_1000_FINAL.png');
            oitiImg = loadImage('assets/trees/Oiti_1000_FINAL.png');
        }

        function drawTreeButtons() {
            carnaubaBtn = createButton('Carnauba');
            cajueiroBtn = createButton('Cajueiro');
            juazeiroBtn = createButton('Juazeiro');
            jucaBtn = createButton('Juca');
            mororoBtn = createButton('Mororo');
            oitiBtn = createButton('Oiti');
        }
    }
}