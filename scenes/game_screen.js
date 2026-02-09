class game_screen {
    constructor() {
        //create a global img variable
        let img;
        let i = 1;
        let photosPath = 'assets/photos/';

        //sets duration in milliseconds
        let t = 2000;

        this.setup = function () {
            this.loadImg();
        }

        this.draw = function () {
            background(0);
            if (img) {
                imageMode(TOP);
                // Scale image to fit canvas while maintaining aspect ratio
                let scale = min(width / img.width, height / img.height);
                image(img, width / 2, height / 2, img.width * scale, img.height * scale);
            }
        }

        this.loadImg = function () {
            //create an if statement
            if (i < 198) {
                i++;
            } else {
                this.sceneManager.showScene(title_screen);
                return;
            }

            img = loadImage(photosPath + "E_" + i + ".png", 
                () => {
                    // Image loaded successfully
                    print(i);
                },
                () => {
                    // Image failed to load
                    print("Failed to load image " + i);
                }
            );

            //keep cycling every 2 seconds
            setTimeout(() => this.loadImg(), t);
        }
    }
}