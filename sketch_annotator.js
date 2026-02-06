let imgs = []; // {img: p5.Image, name: string}
let imgIndex = 0;
let points = [];
let master = {}; // filename -> { points: [...] }
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


}

function mousePressed() {
  // only when clicking on canvas
  if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) return;
  if (!imgs[imgIndex]) return;
  points.push({ x: mouseX, y: mouseY });
}



function keyPressed() {
  if (key === 'S' || key === 's') saveMasterJSON();
  if (key === 'N' || key === 'n') nextImage();
  if (key === 'P' || key === 'p') prevImage();
  if (key === 'Z' || key === 'z') undoLast();
}

function undoLast() {
  if (points.length) points.pop();
}

function commitCurrent() {
  if (!imgs[imgIndex]) return;
  master[imgs[imgIndex].name] = { points: [...points] };
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
    const data = master[name] || { points: [] };
    out.push({ filename: name, points: data.points });
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
  document.getElementById('info').textContent = imgs.length ? `${imgIndex+1}/${imgs.length} — ${imgs[imgIndex].name} — Points: ${points.length}` : 'No images loaded.';
}
