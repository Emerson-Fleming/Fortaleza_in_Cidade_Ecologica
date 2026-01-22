// Title screen implementation for "Fortaleza in Cidade Ecologica"
// Click or press Enter to transition from title to game state

let stars = [];
let starImg = null; // loaded from assets/star.png when available
let logoImg = null; // loaded from assets/logo.png when available
let bgImg = null; // loaded from assets/background.png when available
let startGameImg = null; // loaded from assets/start_game.png when available
let skyline = [];
let scene = 'title';
let startBlink = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Press Start 2P');
  initStars();
  initSkyline();
}

function preload() {
  // Try to load a user-provided star image at assets/star.png.
  // If it doesn't exist, we keep starImg null and fall back to procedural stars.
  loadImage('assets/star.png', img => {
    starImg = img;
    // scale down if needed later when drawn by using b.r
  }, err => {
    console.log('assets/star.png not found — using procedural stars');
    starImg = null;
  });
  // Try to load a user-provided logo image at assets/logo.png.
  loadImage('assets/logo.png', img => {
    logoImg = img;
  }, err => {
    console.log('assets/logo.png not found — using procedural fallback');
    logoImg = null;
  });
  // Try to load a user-provided background image at assets/background.png.
  loadImage('assets/background.png', img => {
    bgImg = img;
  }, err => {
    console.log('assets/background.png not found — using procedural gradient');
    bgImg = null;
  });
  // Try to load a user-provided start game button image at assets/start_game.png.
  loadImage('assets/start_game.png', img => {
    startGameImg = img;
  }, err => {
    console.log('assets/start_game.png not found — using fallback text');
    startGameImg = null;
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initSkyline();
}

function draw() {
  if (scene === 'title') {
    drawBackground();
    drawStars();
    drawLeaf();
    drawRibbon();
    drawMainTitle();
    drawStartText();
    drawSkyline();
  } else {
    // Placeholder game scene
    background(20);
    fill(255);
    textSize(18);
    textAlign(CENTER, CENTER);
    text('Game started — replace with your game', width / 2, height / 2);
  }
}

function initStars() {
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
}

function initSkyline() {
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
}

function drawBackground() {
  // Replicate the background gradient using p5 instead of image
  // Gradient from outer tone (dark green) to inner tone (brighter green)
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    // gradient from outer tone rgb(0, 61, 34) at top to inner tone rgb(0, 135, 62) at bottom
    let r = lerp(0, 0, inter);
    let g = lerp(61, 135, inter);
    let b = lerp(34, 62, inter);
    stroke(r, g, b);
    line(0, y, width, y);
  }
  noStroke();
}

function drawStars() {
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
}

function drawLeaf() {
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
}

function drawRibbon() {
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
}

function drawMainTitle() {
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
}

function drawStartText() {
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
}

function drawSkyline() {
  push();
  translate(0, height - 160);
  noStroke();
  fill(6, 8, 40);
  rect(0, 0, width, 160);
  for (let s of skyline) {
    fill(4, 6, 30);
    rect(s.x, 120 - s.h, s.w + 1, s.h);
    
    // increment counter and toggle windows every 1 second (60 frames at 60fps)
    s.windowCounter++;
    if (s.windowCounter >= 60) {
      s.windowCounter = 0;
      s.windowOn = !s.windowOn;
    }
    
    // draw windows at fixed positions if currently "on"
    if (s.windowOn) {
      for (let i = 0; i < 6; i++) {
        let wx = s.x + (i * s.w / 6);
        fill(50, 220, 90);
        rect(wx + 2, 120 - s.windowYPositions[i], 4, 4);
      }
    }
  }
  pop();
}

function mousePressed() {
  if (scene === 'title') {
    scene = 'game';
  }
}

function keyPressed() {
  if (scene === 'title' && (keyCode === ENTER || key === ' ')) {
    scene = 'game';
  }
}
