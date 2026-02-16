class podium_screen {
    constructor() { 
        let backgroundImg;
        let podiumImg;
        let assetPath = 'assets/';
        let podiumPath = 'podium_screen/'
        this.setup = function () {
            this.preload();
            textFont('Press Start 2P');
        }

        this.preload = function () {
            backgroundImg = loadImage(assetPath + 'background.png');
            podiumImg = loadImage(assetPath + podiumPath + 'podium.png');
        }

        this.draw = function () {
            imageMode(CORNER);
            background(backgroundImg);

            imageMode(CENTER)
            image(podiumImg, width / 2, height / 2);
        }
    }
}