class game_screen {
    constructor() {
        let i = 0;
        let t = 3000; // 3 seconds per image
        let plantedTrees = [];
        let annotations = null;
        let buttonsInitialized = false;
        let carnaubaCount = 0, cajueiroCount = 0, juazeiroCount = 0, jucaCount = 0, mororoCount = 0, oitiCount = 0;

        this.buttons = [];

        this.setup = function () {
            loadJSON('assets/json/annotations.json', (data) => {
                annotations = data.annotations;
            });
            textFont('Press Start 2P');
            this.updateImage();
        }

        this.draw = function () {
            background(0);
            const footerHeight = 184;
            const footerStartY = height - footerHeight;

            if (!buttonsInitialized) {
                const buttonSize = 160;
                const padding = 20;
                const totalButtonWidth = (6 * (buttonSize + padding)) - padding;
                const startX = (width - totalButtonWidth) / 2;
                const buttonY = footerStartY + (footerHeight - buttonSize) / 2;

                this.buttons = [
                    { img: carnaubaBtn, tree: carnaubaImg, x: startX + (0 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .3 },
                    { img: cajueiroBtn, tree: cajueiroImg, x: startX + (1 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .5 },
                    { img: juazeiroBtn, tree: juazeiroImg, x: startX + (2 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .5 },
                    { img: jucaBtn, tree: jucaImg, x: startX + (3 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .5 },
                    { img: mororoBtn, tree: mororoImg, x: startX + (4 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .4 },
                    { img: oitiBtn, tree: oitiImg, x: startX + (5 * (buttonSize + padding)), y: buttonY, width: buttonSize, height: buttonSize, offset: .5 }
                ];
                buttonsInitialized = true;
            }

            if (streetImages[i]) {
                imageMode(CORNER);

                let scale = min(
                    width / streetImages[i].width,
                    height / streetImages[i].height
                );
                image(
                    streetImages[i],
                    0,
                    0
                );
                filter(GRAY);
                for (let tree of plantedTrees.sort((a, b) => a.y - b.y)) {
                    imageMode(CENTER);
                    let minTreeScale = -0.5 * scale;
                    let maxTreeScale = 0.8 * scale;

                    let treeScale = map(
                        tree.y,
                        0,
                        streetImages[i].height,
                        minTreeScale,
                        maxTreeScale
                    );
                    let treeX = (tree.x * scale);
                    let treeY = (tree.y * scale) - (tree.offset * tree.img.height * treeScale);
                    image(tree.img, treeX, treeY, tree.img.width * treeScale, tree.img.height * treeScale);
                }

                this.drawTreeButtons(footerStartY);
            }
        }

        this.updateImage = function () {
            plantedTrees = [];
            if (i < streetImages.length - 1) {
                i++;
                setTimeout(() => this.updateImage(), t);
            } else {
                i = 0;
                this.sceneManager.showScene(podium_screen, this.getWinningTrees());
            }
        }

        this.drawTreeButtons = function (footerStartY) {
            fill(0);
            rect(0, footerStartY, width, height - footerStartY);

            for (let b of this.buttons) {
                imageMode(CORNER);
                image(b.img, b.x, b.y, b.width, b.height);
            }
        }

        this.mousePressed = function () {
            for (let b of this.buttons) {
                if (
                    mouseX > b.x &&
                    mouseX < b.x + b.width &&
                    mouseY > b.y &&
                    mouseY < b.y + b.height
                ) {
                    this.plantTree(b);
                }
            }
        }

        this.plantTree = function (button) {
            if (!annotations) {
                return;
            }

            let points = annotations[streetImageNames[i]];

            if (points && points.length > 0) {
                let availablePoints = points.filter((p, idx) => !plantedTrees.some(t => t.pointIndex === idx));
                if (availablePoints.length === 0) {
                    return;
                }
                let highestPoint = availablePoints.reduce(
                    (highest, p) => (p.y < highest.y ? p : highest),
                    availablePoints[0]
                );
                plantedTrees.push({
                    img: button.tree,
                    x: highestPoint.x,
                    y: highestPoint.y,
                    offset: button.offset,
                    pointIndex: points.indexOf(highestPoint)
                });
                this.countTrees(button.tree);
            }
        };

        this.countTrees = function (tree) {
            switch (tree) {
                case carnaubaImg:
                    carnaubaCount++;
                    break;
                case cajueiroImg:
                    cajueiroCount++;
                    break;
                case juazeiroImg:
                    juazeiroCount++;
                    break;
                case jucaImg:
                    jucaCount++;
                    break;
                case mororoImg:
                    mororoCount++;
                    break;
                case oitiImg:
                    oitiCount++;
                    break;
            }
        }

        this.getWinningTrees = function () {
            const counts = [
                { type: 'Carnauba', tree_img: menuCarnauba, count: carnaubaCount },
                { type: 'Cajueiro', tree_img: menuCajueiro, count: cajueiroCount },
                { type: 'Juazeiro', tree_img: menuJuazeiro, count: juazeiroCount },
                { type: 'Juca', tree_img: menuJuca, count: jucaCount },
                { type: 'Mororo', tree_img: menuMororo, count: mororoCount },
                { type: 'Oiti', tree_img: menuOiti, count: oitiCount }
            ];
            print(counts)

            //sort counts by count descending
            counts.sort((a, b) => b.count - a.count);

            return counts.slice(0, 3);
        }
    }
}
