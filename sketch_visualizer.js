let manifest = null;
let annotations = null;
let imgIndex = 0;
let imgCache = {};
let treeImg1;
let treeScale = 1.0;
let cnv;
let plantedTrees = []; // array of indices into current photo's points
let loading = false;
let preloading = new Set(); // Track which images are currently being preloaded
const CACHE_SIZE = 5; // Keep 5 images in memory

function preload() {
  treeImg1 = loadImage('assets/trees/Carnauba_1000_FINAL.png');
  treeImg2 = loadImage('assets/trees/Cajueiro_1000_FINAL.png');
  treeImg3 = loadImage('assets/trees/Juazeiro_1000_FINAL.png');
  treeImg4 = loadImage('assets/trees/Juca_1000_FINAL.png');
  treeImg5 = loadImage('assets/trees/Mororo_1000_FINAL.png');
  treeImg6 = loadImage('assets/trees/Oiti_1000_FINAL.png');
  manifest = loadJSON('assets/json/manifest.json');
  annotations = loadJSON('assets/json/annotations.json');
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
  
  loadCurrent();
}

function loadCurrent() {
  if (!manifest || !manifest.photos.length) return;
  
  const photoName = manifest.photos[imgIndex];
  const photoPath = 'assets/photos/' + photoName;
  
  // Clean up cache
  cleanCache();
  
  // Load image if not cached
  if (!imgCache[photoName]) {
    loading = true;
    loadImage(photoPath, (img) => {
      imgCache[photoName] = img;
      resizeCanvas(img.width, img.height);
      loading = false;
      preloadNearby();
    }, (err) => {
      console.error('Failed to load image:', photoPath, err);
      loading = false;
    });
  } else {
    const img = imgCache[photoName];
    resizeCanvas(img.width, img.height);
    loading = false;
    preloadNearby();
  }
  
  // Reset planted trees
  plantedTrees = [];
  updateInfo();
}

function cleanCache() {
  if (!manifest) return;
  
  const keepRange = Math.floor(CACHE_SIZE / 2);
  const keysToDelete = [];
  
  for (let photoName in imgCache) {
    const cacheIndex = manifest.photos.indexOf(photoName);
    if (cacheIndex === -1 || Math.abs(cacheIndex - imgIndex) > keepRange) {
      keysToDelete.push(photoName);
    }
  }
  
  keysToDelete.forEach(key => delete imgCache[key]);
}

function preloadNearby() {
  if (!manifest || loading) return;
  
  for (let offset = 1; offset <= 2; offset++) {
    const idx = imgIndex + offset;
    if (idx < manifest.photos.length) {
      const photoName = manifest.photos[idx];
      if (!imgCache[photoName] && !preloading.has(photoName)) {
        preloading.add(photoName);
        const photoPath = 'assets/photos/' + photoName;
        loadImage(photoPath, (img) => {
          imgCache[photoName] = img;
          preloading.delete(photoName);
        }, (err) => {
          console.warn('Preload failed:', photoPath);
          preloading.delete(photoName);
        });
      }
    }
  }
}

function draw() {
  background(200);
  
  if (!manifest || !manifest.photos.length) {
    push(); fill(0); textAlign(CENTER, CENTER); text('Loading...', width/2, height/2); pop();
    return;
  }
  
  const photoName = manifest.photos[imgIndex];
  const img = imgCache[photoName];
  
  if (img) {
    image(img, 0, 0);
  } else {
    push(); 
    fill(0); 
    textAlign(CENTER, CENTER); 
    textSize(16);
    text('Loading image...', width/2, height/2);
    textSize(12);
    text(`${photoName}`, width/2, height/2 + 25);
    pop();
    return;
  }
  
  // Draw available points in red
  const photoPoints = annotations && annotations.annotations ? 
    annotations.annotations[photoName] : [];
  
  if (photoPoints && photoPoints.length > 0) {
    for (let i = 0; i < photoPoints.length; i++) {
      const p = photoPoints[i];
      push();
      
      // Check if this point has a tree planted
      if (plantedTrees.includes(i)) {
        // Perspective scale for Street View: 0.05 at top (far), 0.8 at bottom (close)
        const pScale = 0.00000000005 + 0.75 * (p.y / height);
        const tw = treeImg1.width * pScale;
        const th = treeImg1.height * pScale;
        // Draw tree anchored at bottom-center on the dot
        push();
        imageMode(CORNER);
        image(treeImg1, p.x - tw / 2, p.y - th, tw, th);
        pop();
      } else {
        // Draw red dot for available points
        fill(255, 0, 0, 100);
        noStroke();
        circle(p.x, p.y, 15);
      }
      
      pop();
    }
  }
  
  // Draw info overlay
  push();
  fill(0);
  textSize(12);
  textAlign(LEFT);
  const info = `Trees planted: ${plantedTrees.length}/${photoPoints.length || 0}`;
  text(info, 10, 20);
  pop();
}

function mousePressed() {
  if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) return;
  if (!manifest || !manifest.photos.length) return;
  if (loading) return; // Don't allow clicks while loading
  
  const photoName = manifest.photos[imgIndex];
  if (!imgCache[photoName]) return; // Don't allow clicks if image not loaded
  
  const photoPoints = annotations && annotations.annotations ? 
    annotations.annotations[photoName] : [];
  
  if (!photoPoints || photoPoints.length === 0) return;
  
  // Find closest point to click
  let closest = -1;
  let closestDist = 50; // max click distance in pixels
  
  for (let i = 0; i < photoPoints.length; i++) {
    if (plantedTrees.includes(i)) continue; // skip already planted
    
    const p = photoPoints[i];
    const d = dist(mouseX, mouseY, p.x, p.y);
    if (d < closestDist) {
      closest = i;
      closestDist = d;
    }
  }

  if (closest >= 0) {
    plantedTrees.push(closest);
  }
}

function nextPhoto() {
  if (!manifest || !manifest.photos.length) return;
  imgIndex = Math.min(manifest.photos.length - 1, imgIndex + 1);
  loadCurrent();
}

function prevPhoto() {
  if (!manifest || !manifest.photos.length) return;
  imgIndex = Math.max(0, imgIndex - 1);
  loadCurrent();
}

function plantRandomTree() {
  if (!manifest || !manifest.photos.length) return;
  
  const photoName = manifest.photos[imgIndex];
  const photoPoints = annotations && annotations.annotations ? 
    annotations.annotations[photoName] : [];
  
  if (!photoPoints || photoPoints.length === 0) return;
  
  // Find available points (not yet planted)
  const available = [];
  for (let i = 0; i < photoPoints.length; i++) {
    if (!plantedTrees.includes(i)) {
      available.push(i);
    }
  }
  
  if (available.length === 0) return;
  
  // Plant at random available point
  const randomIdx = available[Math.floor(Math.random() * available.length)];
  plantedTrees.push(randomIdx);
}

function clearAllTrees() {
  plantedTrees = [];
}

function keyPressed() {
  if (key === 'N' || key === 'n') nextPhoto();
  if (key === 'P' || key === 'p') prevPhoto();
}

function updateInfo() {
  const info = document.getElementById('info');
  if (!manifest || !manifest.photos.length) {
    info.textContent = 'Loading...';
  } else {
    const photoName = manifest.photos[imgIndex];
    const photoPoints = annotations && annotations.annotations ? 
      annotations.annotations[photoName] : [];
    const totalPoints = photoPoints ? photoPoints.length : 0;
    info.textContent = `${imgIndex + 1}/${manifest.photos.length} — ${photoName} — ${plantedTrees.length}/${totalPoints} trees planted`;
  }
}
