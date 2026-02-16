class info_screen {
    constructor() { 
        let backgroundImg;
        let assetPath = 'assets/';
        this.setup = function () {
            this.preload();
        }

        this.preload = function () {
            backgroundImg = loadImage(assetPath + 'background.png');
        }

        this.draw = function () {
            background(backgroundImg);
        }
    }
}