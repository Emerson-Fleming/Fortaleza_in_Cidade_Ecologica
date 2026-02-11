const fs = require('fs');
const path = require('path');

// Get all image files from the photos folder
const photosDir = path.join(__dirname, 'assets', 'photos', 'webp');
const files = fs.readdirSync(photosDir)
  .filter(file => /\.(webp|png|jpg|jpeg|gif)$/i.test(file))
  .sort();

const manifest = {
  photos: files,
  count: files.length,
  generated: new Date().toISOString()
};

// Write to assets/json/manifest.json
const jsonDir = path.join(__dirname, 'assets', 'json');
if (!fs.existsSync(jsonDir)) {
  fs.mkdirSync(jsonDir, { recursive: true });
}

fs.writeFileSync(
  path.join(jsonDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log(`Generated manifest with ${files.length} photos`);
