let manifest = null;
let currentPhoto = null;
let currentImg = null;
let points = [];
let allAnnotations = {}; // All annotations stored in localStorage
let cnv;

function preload() {
  manifest = loadJSON('assets/json/manifest.json');
}

function setup() {
  const holder = document.getElementById('sketch-holder');
  cnv = createCanvas(800, 600);
  cnv.parent(holder);
  background(240);

  // Load saved annotations from localStorage
  const saved = localStorage.getItem('treeAnnotations');
  if (saved) {
    try {
      allAnnotations = JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved annotations:', e);
      allAnnotations = {};
    }
  }

  // Populate dropdown
  const select = document.getElementById('photoSelect');
  select.innerHTML = '<option value="">-- Select a photo --</option>';
  if (manifest && manifest.photos) {
    manifest.photos.forEach(photoName => {
      const option = document.createElement('option');
      option.value = photoName;
      const hasAnnotations = allAnnotations[photoName] && allAnnotations[photoName].length > 0;
      option.textContent = photoName + (hasAnnotations ? ' ✓' : '');
      select.appendChild(option);
    });
  }

  // DOM hooks
  document.getElementById('photoSelect').addEventListener('change', loadSelectedPhoto);
  document.getElementById('saveBtn').addEventListener('click', saveCurrentPhoto);
  document.getElementById('undoBtn').addEventListener('click', undoLast);
  document.getElementById('downloadBtn').addEventListener('click', downloadAllAnnotations);

  updateInfo();
}

function loadSelectedPhoto() {
  const select = document.getElementById('photoSelect');
  const photoName = select.value;
  
  if (!photoName) {
    currentPhoto = null;
    currentImg = null;
    points = [];
    updateInfo();
    return;
  }

  currentPhoto = photoName;
  const photoPath = 'assets/game_screen/street_photos/' + photoName;
  
  // Load existing points for this photo
  points = allAnnotations[photoName] ? [...allAnnotations[photoName]] : [];
  
  // Load the image
  loadImage(photoPath, (img) => {
    currentImg = img;
    resizeCanvas(img.width, img.height);
    updateInfo();
  }, (err) => {
    console.error('Failed to load image:', photoPath, err);
    alert('Failed to load image: ' + photoName);
  });
}

function saveCurrentPhoto() {
  if (!currentPhoto) {
    alert('No photo selected');
    return;
  }

  // Save points for current photo
  allAnnotations[currentPhoto] = [...points];
  
  // Save to localStorage
  localStorage.setItem('treeAnnotations', JSON.stringify(allAnnotations));
  
  // Update dropdown checkmarks
  const select = document.getElementById('photoSelect');
  Array.from(select.options).forEach(option => {
    if (option.value) {
      const hasAnnotations = allAnnotations[option.value] && allAnnotations[option.value].length > 0;
      const baseName = option.value.replace(' ✓', '');
      option.textContent = baseName + (hasAnnotations ? ' ✓' : '');
    }
  });
  
  updateInfo();
  alert(`Saved ${points.length} points for ${currentPhoto}`);
}

function draw() {
  background(200);
  
  if (!currentImg) {
    push();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(16);
    text('Select a photo from the dropdown above', width/2, height/2);
    pop();
    return;
  }

  // Draw the image
  image(currentImg, 0, 0);

  // Draw points
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
  if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) return;
  if (!currentImg || !currentPhoto) return;
  
  points.push({ x: mouseX, y: mouseY });
  updateInfo();
}

function keyPressed() {
  if (key === 'S' || key === 's') saveCurrentPhoto();
  if (key === 'Z' || key === 'z') undoLast();
  if (key === 'D' || key === 'd') downloadAllAnnotations();
}

function undoLast() {
  if (points.length > 0) {
    points.pop();
    updateInfo();
  }
}

function downloadAllAnnotations() {
  const data = {
    annotations: allAnnotations,
    lastUpdated: new Date().toISOString(),
    totalPhotos: manifest ? manifest.photos.length : 0,
    annotatedPhotos: Object.keys(allAnnotations).filter(k => allAnnotations[k].length > 0).length
  };
  
  saveJSON(data, 'annotations.json');
}

function updateInfo() {
  const info = document.getElementById('info');
  if (!currentPhoto) {
    info.textContent = 'Select a photo to begin...';
  } else {
    const saved = allAnnotations[currentPhoto];
    const savedCount = saved ? saved.length : 0;
    const unsavedChanges = JSON.stringify(points) !== JSON.stringify(saved || []);
    info.textContent = `${currentPhoto} — Points: ${points.length} — Saved: ${savedCount}${unsavedChanges ? ' (unsaved changes)' : ''}`;
  }
}

function updateButtons() {
  document.getElementById('info').textContent = imgs.length ? `${imgIndex+1}/${imgs.length} — ${imgs[imgIndex].name} — Points: ${points.length}` : 'No images loaded.';
}
