# Fortaleza in Cidade Ecologica - Annotation & Visualization Workflow

## Overview
This project uses a two-step workflow:
1. **Annotator** (`annotator.html`) - Manually place green dots on photos to mark tree locations
2. **Visualizer** (`visualizer.html`) - Plant trees at annotated locations and see the final result

## Workflow

### Step 1: Annotation
1. Open `annotator.html` in your browser
2. The app automatically loads all 184 photos from `assets/photos/` in order
3. For each photo:
   - **Click** to place a green dot where you want a tree
   - Use **Prev (P)** and **Next (N)** buttons to navigate between photos
   - Use **Undo (Z)** to remove the last placed dot
4. When done, click **Download JSON (D)** to save your annotations

### Step 2: Import Annotations
1. Take the downloaded `annotations.json` file
2. Replace the file at `assets/json/annotations.json` in the project
3. (The app is now ready for visualization)

### Step 3: Visualization
1. Open `visualizer.html` in your browser
2. All photos load automatically with the annotated points shown as red dots
3. For each photo:
   - **Click on red dots** to plant trees at those locations
   - Use **Prev (P)** and **Next (N)** to navigate
   - Use **Plant Tree** button to plant at a random available location
   - Use **Clear All** to reset the planted trees for the current photo
4. The counter shows `X/Y trees planted` where Y is the total available points

## Data Structure

### manifest.json
Contains a list of all photo filenames:
```json
{
  "photos": ["E_00001.png", "E_00002.png", ...],
  "count": 184,
  "generated": "2026-02-05T..."
}
```

### annotations.json
Contains the compiled annotations from all photos:
```json
{
  "annotations": {
    "E_00001.png": [
      {"x": 100, "y": 200},
      {"x": 150, "y": 250}
    ],
    "E_00002.png": [
      {"x": 300, "y": 400}
    ]
  },
  "lastUpdated": "2026-02-05T...",
  "totalPhotos": 184,
  "annotatedPhotos": 2
}
```

## Files Structure
```
assets/
  photos/           # All 184 photos (E_00001.png to E_00199.png)
  json/
    manifest.json   # Auto-generated list of all photos
    annotations.json # Your annotations (empty by default)
annotator.html      # Annotation interface
visualizer.html     # Visualization interface
sketch_annotator.js # Annotation logic
sketch_visualizer.js # Visualization logic
generate-manifest.js # Script to generate manifest.json
```

## Development

### Regenerate Manifest
If you add/remove photos:
```bash
npm run manifest
```

### Start Dev Server
```bash
npm start
```

This will:
1. Generate/update the manifest
2. Start http-server on port 8080
3. Open the default page (index.html)

## Notes
- Photos are automatically sorted alphabetically
- The manifest is generated from actual files in `assets/photos/`
- Annotations are stored locally in the browser while annotating, then exported as JSON
- The visualizer reads from the compiled `annotations.json` file
