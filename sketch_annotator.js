let imgs = []; // {img: p5.Image, name: string}
let imgIndex = 0;
let points = [];
let master = {}; // filename -> { points: [...], mask: [...] }
let maskMode = false;
let maskVertices = [];
let snapEnabled = true;
let cnv;

function setup() {
  const holder = document.getElementById('sketch-holder');
  cnv = createCanvas(800, 600);
  cnv.parent(holder);
  background(240);

  // DOM hooks
  document.getElementById('fileInput').addEventListener('change', handleFiles);
  document.getElementById('nextBtn').addEventListener('click', nextImage);
  document.getElementById('prevBtn').addEventListener('click', prevImage);
  document.getElementById('undoBtn').addEventListener('click', undoLast);
  document.getElementById('saveBtn').addEventListener('click', saveMasterJSON);
  document.getElementById('snapBtn').addEventListener('click', ()=>{ snapEnabled = !snapEnabled; updateButtons(); });
  document.getElementById('maskBtn').addEventListener('click', ()=>{ maskMode = !maskMode; updateButtons(); });
  updateInfo();
}

function handleFiles(e) {
  const files = Array.from(e.target.files);
  imgs = [];
  if (!files.length) return;
  let loaded = 0;
  files.forEach((file, i) => {
    const url = URL.createObjectURL(file);
    loadImage(url, (img) => {
      imgs[i] = { img, name: file.name };
      loaded++;
      if (loaded === files.length) {
        imgIndex = 0;
        loadCurrent();
      }
    }, (err)=>{
      console.warn('image load err', err);
      loaded++;
    });
  });
}

function loadCurrent() {
  if (!imgs.length) return;
  const obj = imgs[imgIndex];
  resizeCanvas(obj.img.width, obj.img.height);
  points = (master[obj.name] && master[obj.name].points) ? [...master[obj.name].points] : [];
  maskVertices = (master[obj.name] && master[obj.name].mask) ? [...master[obj.name].mask] : [];
  updateInfo();
}

function draw() {
  background(200);
  if (imgs[imgIndex] && imgs[imgIndex].img) {
    image(imgs[imgIndex].img, 0, 0);
  } else {
    push(); fill(0); textAlign(CENTER, CENTER); text('Load images using the button above', width/2, height/2); pop();
    return;
  }

  // mask overlay
  if (maskVertices && maskVertices.length) {
    push();
    fill(0, 150, 255, 60);
    stroke(0, 120, 255);
    beginShape();
    for (let v of maskVertices) vertex(v.x, v.y);
    endShape(CLOSE);
    pop();
  }

  // draw points
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    push();
    fill(0, 255, 0);
    noStroke();
    circle(p.x, p.y, 10);
    fill(0);
    textSize(12);
    text(i+1, p.x+8, p.y-8);
    pop();
  }

  // draw active mask vertex indicator
  if (maskMode) {
    push();
    fill(255, 140, 0);
    noStroke();
    for (let v of maskVertices) circle(v.x, v.y, 8);
    pop();
  }
}

function mousePressed() {
  // only when clicking on canvas
  if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) return;
  if (!imgs[imgIndex]) return;

  if (maskMode) {
    maskVertices.push({ x: mouseX, y: mouseY });
    return;
  }

  let x = mouseX, y = mouseY;
  if (snapEnabled) {
    const snapped = snapToCurb(mouseX, mouseY, imgs[imgIndex].img);
    if (snapped) { x = snapped.x; y = snapped.y; }
  }
  points.push({ x, y });
}

function snapToCurb(mx, my, img) {
  // simple vertical-gradient search near mx; returns {x,y} or null
  img.loadPixels();
  const w = img.width, h = img.height;
  const px = Math.max(0, Math.min(w-1, Math.round(mx)));
  const searchRadius = 5;
  let best = { x: px, y: Math.round(my), val: 0 };
  for (let dx = -searchRadius; dx <= searchRadius; dx++) {
    const x = Math.max(0, Math.min(w-1, px + dx));
    let bestLocal = { y: 0, val: -1 };
    for (let y = 0; y < h-1; y++) {
      const b1 = brightnessAt(img, x, y);
      const b2 = brightnessAt(img, x, y+1);
      const g = Math.abs(b2 - b1);
      if (g > bestLocal.val) { bestLocal = { y, val: g }; }
    }
    if (bestLocal.val > best.val) { best = { x, y: bestLocal.y, val: bestLocal.val }; }
  }
  // threshold to avoid spurious snaps
  if (best.val < 15) return null;
  // return snapped point at the detected y on original mx
  return { x: mx, y: best.y };
}

function brightnessAt(img, x, y) {
  const idx = 4 * (y * img.width + x);
  const d = img.pixels;
  const r = d[idx], g = d[idx+1], b = d[idx+2];
  return 0.2126*r + 0.7152*g + 0.0722*b;
}

function keyPressed() {
  if (key === 'S' || key === 's') saveMasterJSON();
  if (key === 'N' || key === 'n') nextImage();
  if (key === 'P' || key === 'p') prevImage();
  if (key === 'Z' || key === 'z') undoLast();
  if (key === 'M' || key === 'm') { maskMode = !maskMode; updateButtons(); }
  if (keyCode === ENTER && maskMode) { // close mask
    // store mask
    commitCurrent();
    maskMode = false;
    updateButtons();
  }
}

function undoLast() {
  if (maskMode && maskVertices.length) maskVertices.pop();
  else if (!maskMode && points.length) points.pop();
}

function commitCurrent() {
  if (!imgs[imgIndex]) return;
  master[imgs[imgIndex].name] = { points: [...points], mask: [...maskVertices] };
}

function nextImage() {
  if (!imgs.length) return;
  commitCurrent();
  imgIndex = Math.min(imgs.length-1, imgIndex+1);
  loadCurrent();
}

function prevImage() {
  if (!imgs.length) return;
  commitCurrent();
  imgIndex = Math.max(0, imgIndex-1);
  loadCurrent();
}

function saveMasterJSON() {
  // commit current before saving
  commitCurrent();
  const out = [];
  for (let i = 0; i < imgs.length; i++) {
    const name = imgs[i].name;
    const data = master[name] || { points: [], mask: [] };
    out.push({ filename: name, points: data.points, mask: data.mask });
  }
  // Extract filename from first image and replace extension with .json
  const baseName = imgs.length > 0 ? imgs[0].name.split('.').slice(0, -1).join('.') : 'annotations_master';
  saveJSON(out, baseName + '.json');
}

function updateInfo() {
  const info = document.getElementById('info');
  if (!imgs.length) {
    info.textContent = 'No images loaded.';
  } else {
    info.textContent = `${imgIndex+1}/${imgs.length} — ${imgs[imgIndex].name} — Points: ${points.length}`;
  }
  updateButtons();
}

function updateButtons() {
  document.getElementById('snapBtn').textContent = `Snap: ${snapEnabled ? 'ON' : 'OFF'}`;
  document.getElementById('maskBtn').textContent = `Mask Mode: ${maskMode ? 'ON' : 'OFF'}`;
  document.getElementById('info').textContent = imgs.length ? `${imgIndex+1}/${imgs.length} — ${imgs[imgIndex].name} — Points: ${points.length}` : 'No images loaded.';
}
