class podium_info_screen {
    constructor() {
        let assetPath = 'assets/';
        let data;
        let ignoreClicksUntil = 0;
        this.setup = function () {
            this.preload();
            textFont(font);
        }

        this.enter = function () {
            data = this.sceneArgs;
            ignoreClicksUntil = Date.now() + 250;
        }

        this.preload = function () {
            
        }


        // this.draw = function () {
        //     imageMode(CORNER);
        //     background(backgroundImg);

        //     if (!data || !firstPlace || !secondPlace || !thirdPlace) {
        //         return;
        //     }

        //     imageMode(CENTER)
        //     image(podiumImg, width / 2, height / 2);

        //     //wip: gotta get the photos to line up with the podium
        //     // imageMode(CENTER);
        //     // image(firstPlace.tree_img, (width * .3) + 50, (height / 2) - 150);
        //     // image(secondPlace.tree_img, (width * .5) + 50, (height / 2) - 100);
        //     // image(thirdPlace.tree_img, (width * .7) + 25, (height / 2) - 50);

        //     // Display counts on podium
        //     fill(255);
        //     textSize(24);
        //     textFont(font);
        //     textAlign(CENTER);
        //     text(`${firstPlace.type} x${firstPlace.count}`, (width * .3) + 50, (height / 2) + 300);
        //     textAlign(CENTER);
        //     text(`${secondPlace.type} x${secondPlace.count}`, (width * .5) + 50, (height / 2) + 300);
        //     textAlign(CENTER);
        //     text(`${thirdPlace.type} x${thirdPlace.count}`, (width * .7) + 25, (height / 2) + 300);
        // }
        this.draw = function () {
            imageMode(CORNER);
            background(backgroundImg);

            if (!data) {
                return;
            }

            imageMode(CENTER)
            image(data.tree_img, width / 2, height / 2 - 100);

            fill(255);
            textSize(24);
            textFont(font);
            textAlign(CENTER);
            text(`${data.type} x${data.count}`, width / 2, height / 2 + 300);
        }

        this.mouseClicked = function () {
            if (Date.now() < ignoreClicksUntil) {
                return;
            }
            this.sceneManager.showScene(title_screen);
        };
    }
}