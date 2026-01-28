let photos = []; // { photo: p5.Image, name: string, points: [...] }
let imgIndex = 0;
let treeImg;
let treeScale = 1.0;
let cnv;

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
  document.getElementById('scale').addEventListener('input', (e) => {
    treeScale = parseFloat(e.target.value);
    document.getElementById('scaleValue').textContent = treeScale.toFixed(1);
  });

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

  // draw trees at annotated points
  if (current.points && current.points.length > 0) {
    for (let p of current.points) {
      push();
      const w = treeImg.width * treeScale;
      const h = treeImg.height * treeScale;
      // plant from bottom: top-left corner at (p.x - w/2, p.y - h) so bottom aligns with point
      image(treeImg, p.x - w/2, p.y - h, w, h);
      pop();
    }
  }

  // draw point markers
  if (current.points && current.points.length > 0) {
    push();
    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    for (let i = 0; i < current.points.length; i++) {
      const p = current.points[i];
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
  updateInfo();
}

function prevPhoto() {
  imgIndex = Math.max(0, imgIndex - 1);
  if (photos[imgIndex]) {
    resizeCanvas(photos[imgIndex].photo.width, photos[imgIndex].photo.height);
  }
  updateInfo();
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
    const pointCount = current.points ? current.points.length : 0;
    info.textContent = `${imgIndex + 1}/${photos.length} — ${current.name} — ${pointCount} tree(s)`;
  }
}
