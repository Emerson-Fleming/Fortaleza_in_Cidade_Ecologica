class game_screen {
    constructor() {
        //create a global img variable
        let img;
        let i = 1;
        let photosPath = 'assets/photos/';

        //sets duration in milliseconds
        let t = 1000;

        this.setup = function () {
            this.addImg();
        }

        this.addImg = function () {
            //create an if statement
            if (i < 199) {
                i++;
            } else {
                i = 1;
            }

            //concatenate a string to add dog image name
            img = createImg(photosPath + "E_" + i + ".png");
            print(img)

            //remove the image, specify duration using t, declared at top
            setTimeout(this.imgRemove(), t);

            //keep cycling every second, specify duration using t, declared at top
            setTimeout(this.addImg(), t);
            print(i);
        }
        this.imgRemove = function () {
            //removes image
            img.remove();
        }
    }
}