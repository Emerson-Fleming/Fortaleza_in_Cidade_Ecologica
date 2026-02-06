# Quick Start Guide

## What Changed?

Your project has been refactored to:
- ✅ Automatically load all 184 photos from `assets/photos/`
- ✅ Compile annotations into a single JSON file with all points indexed by photo name
- ✅ Remove manual file uploading and image snapping
- ✅ Place green dots exactly where you click
- ✅ Use those points to plant trees in the visualizer

## How to Use

### 1️⃣ Annotate Trees (Mark Locations)

**Open:** `http://localhost:8080/annotator.html`

- Photos load automatically
- **Click** anywhere on a photo to place a green dot (tree location)
- **P** - Previous photo
- **N** - Next photo  
- **Z** - Undo last dot
- **D** - Download all annotations as JSON

When done, download the JSON file.

### 2️⃣ Import Annotations

1. You'll get a file named `annotations.json` from step 1
2. Save it to: `assets/json/annotations.json` (replace existing)
3. (You can do this manually or commit to git)

### 3️⃣ Visualize Trees (Plant Them)

**Open:** `http://localhost:8080/visualizer.html`

- All photos and their annotated points load automatically
- Red dots = available locations to plant trees
- **Click red dots** to plant trees (they'll appear as green tree images)
- **Plant Tree** - plants at random available location
- **Clear All** - removes all planted trees on current photo
- **P/N** - Navigate between photos

## File Locations

```
📁 assets/
  📁 photos/
     └─ E_00001.png through E_00199.png (184 photos)
  📁 json/
     ├─ manifest.json (auto-generated - list of all photos)
     └─ annotations.json (import your annotations here!)

📄 annotator.html (annotation interface)
📄 visualizer.html (visualization interface)
📄 sketch_annotator.js (annotation logic)
📄 sketch_visualizer.js (visualization logic)
```

## Keyboard Shortcuts

**Annotator:**
- **P** - Previous photo
- **N** - Next photo
- **Z** - Undo dot
- **D** - Download JSON

**Visualizer:**
- **P** - Previous photo
- **N** - Next photo
- (Click dots to plant trees)

## Notes

- ✅ No more manual image upload
- ✅ No more snap-to-curb or mask modes
- ✅ Dots placed exactly where you click
- ✅ All data in one JSON file indexed by photo name
- ✅ Works entirely in the browser
- ✅ Download is automatic - just save and copy to the project

## Server

```bash
npm start          # Starts dev server on port 8080
npm run manifest   # Regenerates manifest (if you add photos)
```
