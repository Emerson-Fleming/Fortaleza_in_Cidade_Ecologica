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

        this.draw = function () {
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