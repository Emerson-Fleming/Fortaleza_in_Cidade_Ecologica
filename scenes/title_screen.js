class title_screen {
  constructor() {
    let stars = [];
    let starImg;
    let logoImg;
    let leafImg;
    let skylineImg;
    let bgImg;
    let startGameImg;
    let skyline = [];
    let scene = 'title';
    let startBlink = 0;
    let assetPath = 'assets/title_screen/';

    this.setup = function () {
      this.preload();
      this.initStars();
      this.initSkyline();
    };

    this.preload = function () {
      bgImg = loadImage(assetPath + 'background.png');
      starImg = loadImage(assetPath + 'star.png');
      logoImg = loadImage(assetPath + 'logo.png');
      leafImg = loadImage(assetPath + 'leaf.png');
      skylineImg = loadImage(assetPath + 'city_skyline.png');
      startGameImg = loadImage(assetPath + 'start_game.png');
    }

    this.windowResized = function () {
      resizeCanvas(windowWidth, windowHeight);
      this.initSkyline();
    };

    this.draw = function () {
      background(bgImg);
      imageMode(CORNER);
      this.drawStars();
      this.drawLeaf();
      this.drawRibbon();
      this.drawMainTitle();
      this.drawStartText();
    };

    this.initStars = function () {
      stars = [];
      let count = Math.floor(width / 60) + 30;
      // helper to test overlap with existing stars
      function overlaps(x, y, r, list) {
        for (let s of list) {
          let minDist = (r + s.r) + 20; // increased padding (20px)
          if (dist(x, y, s.x, s.y) < minDist) return true;
        }
        return false;
      }

      for (let i = 0; i < count; i++) {
        let r = random(2, 18);
        let attempts = 0;
        let maxAttempts = 200;
        let px, py;
        do {
          px = random(r, width - r);
          py = random(r, height * 0.6 - r);
          attempts++;
        } while (overlaps(px, py, r, stars) && attempts < maxAttempts);

        // if we failed to find a non-overlapping spot after many attempts, accept the last position
        stars.push({
          x: px,
          y: py,
          r: r,
          // pulse: each star has a phase and a pulse speed so they fade independently
          phase: random(TWO_PI),
          pulseSpeed: random(0.6, 1.6)
        });
      }
    };

    this.initSkyline = function () {
      skyline = [];
      let cols = 60;
      let w = width / cols;
      for (let i = 0; i < cols; i++) {
        let h = random(0.06, 0.18) * height; // reduced from 0.08-0.28
        if (i % 7 === 0) h *= random(1.0, 1.4); // reduced from 1.0-1.6
        skyline.push({
          x: i * w,
          w: w,
          h: h,
          windowCounter: 0, // frame counter for window state changes
          windowOn: random() > 0.5, // randomly start on or off
          windowYPositions: [] // store fixed Y positions for this building's windows
        });
        // pre-generate window Y positions
        for (let wx = 0; wx < 6; wx++) {
          skyline[i].windowYPositions.push(random(8, h - 6));
        }
      }
    };

    this.drawStars = function () {
      for (let b of stars) {
        // compute alpha as a slow sine wave per-star
        b.phase += 0.02 * b.pulseSpeed;
        let a = map(sin(b.phase), -1, 1, 30, 255); // alpha between ~30 and 255
        if (starImg) {
          push();
          imageMode(CENTER);
          // tint the image with computed alpha to fade in/out
          tint(255, a);
          image(starImg, b.x, b.y, b.r * 2, b.r * 2);
          noTint();
          pop();
        } else {
          // fallback: procedural star with pulsing alpha
          push();
          strokeWeight(2);
          stroke(5, 200, 150, a * 0.8);
          fill(10, 140, 110, a * 0.6);
          ellipse(b.x, b.y, b.r * 2);
          // inner highlight
          noStroke();
          fill(255, 255, 255, a * 0.25);
          ellipse(b.x - b.r * 0.28, b.y - b.r * 0.28, b.r);
          pop();
        }
      }
    };

    this.drawLeaf = function () {
      // If a leaf image is provided in assets/leaf.png, draw it centered above the ribbon.
      let centersx = width / 2;
      let y = height * 0.18;
      if (logoImg) {
        return;
      }

      // fallback: simple pixelated leaf above the ribbon
      let px = 12; // pixel size
      let mapLeaf = [
        '....11....',
        '...1111...',
        '..112221..',
        '.11222211.',
        '.11222211.',
        '..112221..',
        '...1111...',
        '....11....'
      ];
      for (let i = 0; i < mapLeaf.length; i++) {
        for (let j = 0; j < mapLeaf[i].length; j++) {
          let ch = mapLeaf[i][j];
          if (ch === '1') fill(110, 200, 60);
          else if (ch === '2') fill(70, 150, 30);
          else continue;
          noStroke();
          rect(centersx + (j - mapLeaf[i].length / 2) * px, y + (i - mapLeaf.length / 2) * px, px, px);
        }
      }
    };

    this.drawRibbon = function () {
      let w = 520;
      let h = 38;
      let x = width / 2 - w / 2;
      let y = height * 0.28;

      // If logo is present, skip ribbon and draw logo instead
      if (logoImg) {
        push();
        imageMode(CENTER);
        let logoW = min(width * 0.5, 600);
        let logoH = logoW * (logoImg.height / logoImg.width);
        // Center logo vertically around where leaf + ribbon + title would be
        let logoY = height * 0.35;
        image(logoImg, width / 2, logoY, logoW, logoH);
        pop();
        return;
      }

      // Fallback: no logo, so skip drawing anything here
    };

    this.drawMainTitle = function () {
      // If logo is present, skip title (it's part of the logo)
      if (logoImg) {
        return;
      }

      // fallback: draw blocky title with black offset and neon glow
      let lines = ['CIDADE', 'ECOLÓGICA'];
      let baseY = height * 0.4;
      // neon glow using canvas shadow
      drawingContext.save();
      drawingContext.shadowBlur = 40;
      drawingContext.shadowColor = 'rgba(46,255,120,0.7)';
      drawingContext.restore();

      for (let i = 0; i < lines.length; i++) {
        let t = lines[i];
        let y = baseY + i * 58;
        textSize(46);
        textAlign(CENTER, CENTER);
        // black drop shadow (offset)
        push();
        fill(0);
        translate(6, 6);
        text(t, width / 2 - 6, y - 6);
        pop();

        // white fill with dark outline to get pixel look
        stroke(0);
        strokeWeight(8);
        fill(255);
        text(t, width / 2, y);

        // small inner stroke to sharpen
        stroke(30, 80, 20);
        strokeWeight(2);
        noFill();
        text(t, width / 2, y);
      }
    };

    this.drawStartText = function () {
      startBlink = (startBlink + 0.04) % (TWO_PI);
      let visible = sin(startBlink) > 0.2;
      if (visible) {
        push();
        textAlign(CENTER, CENTER);

        if (startGameImg) {
          // Draw the image, scaled to a reasonable size
          imageMode(CENTER);
          let btnWidth = min(width * 0.25, 250);
          let btnHeight = btnWidth * (startGameImg.height / startGameImg.width);
          image(startGameImg, width / 2, height * 0.6 + 10, btnWidth, btnHeight);
        } else {
          // Fallback: draw text if image not available
          textSize(16);
          fill(240);
          noStroke();
          text('START GAME', width / 2, height * 0.6 + 10);
        }
        pop();
      }
    };

    this.mouseClicked = function () {
      this.sceneManager.showScene(game_screen);
    };

    this.keyPressed = function () {
      this.sceneManager.showScene(game_screen);
    };
  }
}