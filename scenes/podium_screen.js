class podium_screen {
    constructor() {
        //let backgroundImg;
        let podiumImg;
        let firstPlace, secondPlace, thirdPlace;
        let assetPath = 'assets/';
        let podiumPath = 'podium_screen/'
        let data;
        let ignoreClicksUntil = 0;
        //let font;
        this.setup = function () {
            this.preload();
            textFont(font);
        }

        this.enter = function () {
            data = this.sceneArgs;
            firstPlace = data && data[0] ? data[0] : null;
            secondPlace = data && data[1] ? data[1] : null;
            thirdPlace = data && data[2] ? data[2] : null;
            ignoreClicksUntil = Date.now() + 250;
        }

        this.preload = function () {
            //backgroundImg = loadImage(assetPath + 'background.png');
            podiumImg = loadImage(assetPath + podiumPath + 'podium.png');
            //font = loadFont(assetPath + 'fonts/PressStart2P.ttf');
        }

        this.draw = function () {
            imageMode(CORNER);
            background(backgroundImg);

            if (!data || !firstPlace || !secondPlace || !thirdPlace) {
                return;
            }

            imageMode(CENTER)
            image(podiumImg, width / 2, height / 2);

            //wip: gotta get the photos to line up with the podium
            // imageMode(CENTER);
            // image(firstPlace.tree_img, (width * .3) + 50, (height / 2) - 150);
            // image(secondPlace.tree_img, (width * .5) + 50, (height / 2) - 100);
            // image(thirdPlace.tree_img, (width * .7) + 25, (height / 2) - 50);

            // Display counts on podium
            fill(255);
            textSize(24);
            textFont(font);
            textAlign(CENTER);
            text(`${firstPlace.type} x${firstPlace.count}`, (width * .3) + 50, (height / 2) + 300);
            textAlign(CENTER);
            text(`${secondPlace.type} x${secondPlace.count}`, (width * .5) + 50, (height / 2) + 300);
            textAlign(CENTER);
            text(`${thirdPlace.type} x${thirdPlace.count}`, (width * .7) + 25, (height / 2) + 300);
        }

        this.mouseClicked = function () {
            if (Date.now() < ignoreClicksUntil) {
                return;
            }
            this.sceneManager.showScene(podium_info_screen, firstPlace);
        };
    }
}