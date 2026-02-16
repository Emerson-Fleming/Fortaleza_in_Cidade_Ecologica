class info_screen {
    constructor() { 
        let backgroundImg;
        let assetPath = 'assets/';
        this.setup = function () {
            this.preload();
            textFont('Press Start 2P');
        }

        this.preload = function () {
            backgroundImg = loadImage(assetPath + 'background.png');
        }

        this.draw = function () {
            background(backgroundImg);
            this.drawOptionsMenu();
        }

        this.drawOptionsMenu = function () {
            text('INTRODUCING OUR STARS')
            text('HOW TO PLAY')
            text('START GAME')
        }

        this.drawOurStars = function () {
            
        }

        this.drawHowToPlay = function () {
        }
    }
}