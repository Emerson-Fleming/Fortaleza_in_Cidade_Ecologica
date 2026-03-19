class podium_info_screen {
    constructor() {
        let data;
        let treeData;
        let ignoreClicksUntil = 0;

        // Helper function for word-wrapping text
        const wrapText = function(txt, x, y, maxWidth, lineHeight) {
            let words = txt.split(' ');
            let line = '';
            let yPos = y;
            
            for (let i = 0; i < words.length; i++) {
                let testLine = line + words[i] + ' ';
                let testWidth = textWidth(testLine);
                
                if (testWidth > maxWidth && i > 0) {
                    text(line, x, yPos);
                    line = words[i] + ' ';
                    yPos += lineHeight;
                } else {
                    line = testLine;
                }
            }
            text(line, x, yPos);
        };

        this.setup = function () {
            textFont(font);
        }

        this.enter = function () {
            data = this.sceneArgs;
            // Look up full tree data from global trees array
            treeData = data ? trees.find(t => t.type === data.type) : null;
            ignoreClicksUntil = Date.now() + 250;
        }

        this.draw = function () {
            imageMode(CORNER);
            background(backgroundImg);

            if (!data || !treeData) {
                return;
            }

            push();

            // Layout dimensions
            let boxW = width * 0.8;
            let boxH = height * 0.7;
            let boxX = (width - boxW) / 2;
            let boxY = (height - boxH) / 2;

            // Left side: tree image
            let imgSize = boxH * 0.8;
            let imgX = boxX;
            let imgY = boxY + (boxH - imgSize) / 2;
            imageMode(CORNER);
            image(treeData.img(), imgX, imgY, imgSize, imgSize);

            // Right side: title and description
            let textX = boxX + imgSize + 60;
            let textW = boxW - imgSize - 60;

            textFont(font);
            textAlign(LEFT, TOP);

            // Title
            fill(255);
            textSize(36);
            text(treeData.type, textX, imgY + 20);

            // Count subtitle
            fill(0, 176, 0);
            textSize(24);
            text(`Planted: ${data.count}`, textX, imgY + 80);

            // Description
            fill(255);
            textSize(18);
            wrapText(treeData.desc(), textX, imgY + 140, textW, 40);

            pop();
        }

        this.mouseClicked = function () {
            if (Date.now() < ignoreClicksUntil) {
                return;
            }
            this.sceneManager.showScene(title_screen);
        };
    }
}