let photos = []; // { photo: p5.Image, name: string, points: [...] }
let imgIndex = 0;
let treeImg;
let treeScale = 1.0;
let cnv;
let plantedTrees = []; // array of indices into current photo's points
let usedPointIndices = new Set(); // track which point indices have been used

function preload() {
  treeImg = loadImage('assets/Carnauba_1000_FINAL.png');
}

function setup() {
  const holder = document.getElementById('sketch-holder');
  cnv = createCanvas(800, 600);
  cnv.parent(holder);

  // hooks
  document.getElementById('nextBtn').addEventListener('click', nextPhoto);
  document.getElementById('prevBtn').addEventListener('click', prevPhoto);
  document.getElementById('plantBtn').addEventListener('click', plantRandomTree);
  document.getElementById('clearBtn').addEventListener('click', clearAllTrees);

  loadPhotosAndPoints();
}

async function loadPhotosAndPoints() {
  try {
    // fetch list of photos
    const photoRes = await fetch('assets/photos/');
    const photoHTML = await photoRes.text();
    const photoParser = new DOMParser();
    const photoDoc = photoParser.parseFromString(photoHTML, 'text/html');
    const photoLinks = Array.from(photoDoc.querySelectorAll('a'))
      .map(a => a.href)
      .filter(href => /\.(png|jpg|jpeg)$/i.test(href))
      .map(href => href.split('/').pop());

    // load each photo with its corresponding JSON
    for (const photoName of photoLinks) {
      const baseName = photoName.split('.').slice(0, -1).join('.');
      try {
        const photoData = await loadImage(`assets/photos/${photoName}`);
        const jsonRes = await fetch(`assets/json/${baseName}.json`);
        let points = [];
        if (jsonRes.ok) {
          const data = await jsonRes.json();
          // handle both single object and array format
          if (Array.isArray(data)) {
            const entry = data.find(d => d.filename === photoName);
            points = entry ? entry.points : [];
          } else if (data.points) {
            points = data.points;
          }
        }
        photos.push({ photo: photoData, name: photoName, points });
      } catch (err) {
        console.warn(`Error loading ${photoName}:`, err);
      }
    }

    if (photos.length > 0) {
      resizeCanvas(photos[0].photo.width, photos[0].photo.height);
    }
    updateInfo();
  } catch (err) {
    console.error('Error loading photos:', err);
    updateInfo();
  }
}

function draw() {
  background(200);
  if (!photos.length || !photos[imgIndex]) {
    push();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(16);
    text('Loading photos from assets/photos...', width / 2, height / 2);
    pop();
    return;
  }

  const current = photos[imgIndex];
  image(current.photo, 0, 0);

  // draw trees at planted points
  if (plantedTrees && plantedTrees.length > 0 && current.points) {
    // get planted point objects from indices
    const plantedPoints = plantedTrees.map(idx => current.points[idx]);
    // sort points by y-position (back to front) so closer trees draw on top
    const sortedTrees = [...plantedPoints].sort((a, b) => a.y - b.y);
    
    for (let p of sortedTrees) {
      push();
      // map y-axis to scale: top of image (y=0) = 0.025, bottom of image (y=height) = 0.7
      const depthScale = map(p.y, 0, current.photo.height, 0.025, 0.7);
      const w = treeImg.width * depthScale;
      const h = treeImg.height * depthScale;
      // plant from bottom: top-left corner at (p.x - w/2, p.y - h) so bottom aligns with point
      image(treeImg, p.x - w/2, p.y - h, w, h);
      pop();
    }
  }

  // draw point markers for planted trees
  if (plantedTrees && plantedTrees.length > 0 && current.points) {
    push();
    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    for (let i = 0; i < plantedTrees.length; i++) {
      const p = current.points[plantedTrees[i]];
      circle(p.x, p.y, 15);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(10);
      text(i + 1, p.x, p.y);
      noFill();
    }
    pop();
  }
}

function nextPhoto() {
  imgIndex = Math.min(photos.length - 1, imgIndex + 1);
  if (photos[imgIndex]) {
    resizeCanvas(photos[imgIndex].photo.width, photos[imgIndex].photo.height);
  }
  plantedTrees = [];
  usedPointIndices.clear();
  updateInfo();
}

function prevPhoto() {
  imgIndex = Math.max(0, imgIndex - 1);
  if (photos[imgIndex]) {
    resizeCanvas(photos[imgIndex].photo.width, photos[imgIndex].photo.height);
  }
  plantedTrees = [];
  usedPointIndices.clear();
  updateInfo();
}

function plantRandomTree() {
  if (!photos[imgIndex] || !photos[imgIndex].points) return;
  const current = photos[imgIndex];
  const availableIndices = [];
  // find all points that haven't been planted yet
  for (let i = 0; i < current.points.length; i++) {
    if (!usedPointIndices.has(i)) {
      availableIndices.push(i);
    }
  }
  if (availableIndices.length === 0) return; // no more points to plant
  // select random unused point
  const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  plantedTrees.push(randomIdx);
  usedPointIndices.add(randomIdx);
}

function clearAllTrees() {
  plantedTrees = [];
  usedPointIndices.clear();
}

function keyPressed() {
  if (key === 'N' || key === 'n') nextPhoto();
  if (key === 'P' || key === 'p') prevPhoto();
}

function updateInfo() {
  const info = document.getElementById('info');
  if (!photos.length) {
    info.textContent = 'Loading...';
  } else {
    const current = photos[imgIndex];
    info.textContent = `${imgIndex + 1}/${photos.length} — ${current.name} — ${plantedTrees.length} tree(s) planted`;
  }
}
