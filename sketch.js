// Title screen implementation for "Fortaleza in Cidade Ecologica"
// Click or press Enter to transition from title to game state

let stars = [];
let starImg = null; // loaded from assets/star.png when available
let logoImg = null; // loaded from assets/logo.png when available
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
    let h = random(0.08, 0.28) * height;
    if (i % 7 === 0) h *= random(1.0, 1.6);
    skyline.push({x: i * w, w: w, h: h});
  }
}

function drawBackground() {
  // radial-ish gradient from center
  let c1 = color(5, 60, 45);
  let c2 = color(3, 40, 35);
  for (let r = 0; r < width * 0.8; r += 2) {
    let inter = map(r, 0, width * 0.8, 0, 1);
    let c = lerpColor(c1, c2, inter);
    noStroke();
    fill(red(c), green(c), blue(c), 255 * (1 - inter * 0.9));
    ellipse(width / 2, height * 0.36, r, r * 0.6);
  }
  // a base fill to ensure edges
  noStroke();
  fill(c2);
  rect(0, 0, width, height);
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
    textSize(16);
    fill(240);
    noStroke();
    text('START GAME', width / 2, height * 0.6 + 10);
    pop();
  }
}

function drawSkyline() {
  push();
  translate(0, height - 120);
  noStroke();
  fill(6, 8, 40);
  rect(0, 0, width, 120);
  for (let s of skyline) {
    fill(4, 6, 30);
    rect(s.x, 120 - s.h, s.w + 1, s.h);
    // windows as small green pixels
    for (let wx = s.x; wx < s.x + s.w; wx += s.w / 6) {
      if (random() < 0.35) {
        fill(50, 220, 90);
        rect(wx + 2, 120 - random(8, s.h - 6), 4, 4);
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
