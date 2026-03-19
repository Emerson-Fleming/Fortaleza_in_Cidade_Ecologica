class podium_info_screen {
    constructor() {
        let data;
        let ignoreClicksUntil = 0;
        this.setup = function () {
            textFont(font);
        }

        this.enter = function () {
            data = this.sceneArgs;
            ignoreClicksUntil = Date.now() + 250;
        }

        this.draw = function () {
            imageMode(CORNER);
            background(backgroundImg);

            if (!data) {
                return;
            }

            imageMode(CENTER)
            image(data.tree_img, width / 4, height / 2 - 100);

            fill(255);
            textSize(24);
            textFont(font);
            textAlign(CENTER);
            text(`${data.type} x${data.count}`, 3 *width / 4, height / 2);
        }

        this.mouseClicked = function () {
            if (Date.now() < ignoreClicksUntil) {
                return;
            }
            this.sceneManager.showScene(title_screen);
        };
    }
}