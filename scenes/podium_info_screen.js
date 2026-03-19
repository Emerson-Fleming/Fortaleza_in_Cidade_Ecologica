class podium_info_screen {
    constructor() {
        let assetPath = 'assets/';
        let data;
        this.setup = function () {
            this.preload();
            data = this.sceneArgs;
            print(data)
            textFont(font);
        }

        this.preload = function () {
            
        }

        this.draw = function () {
            background(backgroundImg);
            imageMode(CENTER)

            image(data.tree_img, width / 2, height / 2 - 100);

            fill(255);
            textSize(24);
            textFont(font);
            textAlign(CENTER);
            text(`${data.type} x${data.count}`, width / 2, height / 2 + 300);
        }

        this.mouseClicked = function () {
            this.sceneManager.showScene(title_screen);
        };
    }
}