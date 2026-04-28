class podium_info_screen {
    constructor() {
        let data;
        let treeData;
        let allCounts = [];
        let shadowScore = 0;
        let ignoreClicksUntil = 0;

        //total planted trees
        let totalPlanted = data ? data.count : 0;
        let totalPlantedOiti = data && data.type === 'Oiti' ? data.count : 0;
        let totalPlantedJuca = data && data.type === 'Jucá' ? data.count : 0;
        let totalPlantedJuazeiro = data && data.type === 'Juazeiro' ? data.count : 0;
        let totalPlantedCajueiro = data && data.type === 'Cajueiro' ? data.count : 0;
        let totalPlantedCarnauba = data && data.type === 'Carnaúba' ? data.count : 0;
        let totalPlantedMororo = data && data.type === 'Mororó' ? data.count : 0;

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

        this.enter = function () {
            const args = this.sceneArgs;
            data = args.tree || args;
            allCounts = args.allCounts || [];
            // Look up full tree data from global trees array
            treeData = data ? trees.find(t => t.type === data.type) : null;
            // Compute shadow coefficient score
            const totalPossiblePoints = args.totalPossiblePoints || 0;
            const weightedSum = allCounts.reduce((s, c) => {
                const treeInfo = trees.find(tr => tr.type === c.type);
                return s + c.count * (treeInfo ? treeInfo.shadowCoefficient : 0);
            }, 0);
            shadowScore = totalPossiblePoints > 0 ? weightedSum / totalPossiblePoints : 0;
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
            let maxImgSize = boxH * 0.8;
            let treeImg = treeData.img();
            let aspectRatio = treeImg.width / treeImg.height;
            let imgW, imgH;
            
            if (aspectRatio >= 1) {
                // Wider than tall - constrain by width
                imgW = maxImgSize;
                imgH = maxImgSize / aspectRatio;
            } else {
                // Taller than wide - constrain by height
                imgH = maxImgSize;
                imgW = maxImgSize * aspectRatio;
            }
            
            let imgX = boxX;
            let imgY = boxY + (boxH - imgH) / 2;
            imageMode(CORNER);
            image(treeImg, imgX, imgY, imgW, imgH);

            // Right side: title and description
            let textX = boxX + imgW + 60;
            let textW = boxW - imgW - 60;

            //textFont(bodyFont);
            textAlign(LEFT, TOP);

            // Title
            fill(255);
            textSize(60);
            textFont(headingFont);
            text(treeData.type, textX, imgY + 20);

            // Count subtitle
            fill(0, 176, 0);
            textSize(36);
            textFont(headingFont);
            text(`Planted: ${data.count}`, textX, imgY + 80);

            // Shadow coefficient score
            fill(255, 200, 0);
            textSize(36);
            textFont(headingFont);
            text(`Shadow Score: ${nf(shadowScore, 1, 2)}`, textX, imgY + 130);

            // Description
            fill(255);
            textSize(36);
            textFont(descriptionFont);
            wrapText(treeData.desc(), textX, imgY + 190, textW, 40);

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