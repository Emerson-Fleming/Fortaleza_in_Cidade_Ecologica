# Project Refactor Summary

## Changes Made

### 1. **Automated Photo Loading**
- Created `generate-manifest.js` - Node script that scans `assets/photos/` and generates `manifest.json`
- Manifest contains all 184 photo filenames automatically sorted
- No more manual file uploads needed

### 2. **Annotator Refactor** (`sketch_annotator.js`)
- ✅ Now loads all photos automatically from manifest
- ✅ Removed snap-to-curb and mask mode functionality
- ✅ Simple direct dot placement at click coordinates
- ✅ Downloads compiled annotations as single JSON file with all photos indexed by name
- Keyboard shortcuts: P=Prev, N=Next, Z=Undo, D=Download

### 3. **Compiled Annotations System**
- Created `assets/json/annotations.json` - central file storing all annotations
- Format: `{ annotations: { "photo_name.png": [{x, y}, ...], ... }, lastUpdated: "...", ... }`
- Single source of truth for all annotated points across all photos

### 4. **Visualizer Refactor** (`sketch_visualizer.js`)
- ✅ Now loads all photos automatically from manifest
- ✅ Reads annotated points from compiled `annotations.json`
- ✅ Shows available points as red dots
- ✅ Click dots to plant trees (visual feedback: tree appears)
- ✅ Plant Tree button plants at random available location
- ✅ Clear All resets planted trees for current photo
- ✅ Counter shows trees planted vs total available

### 5. **Package.json Update**
- Added `npm run manifest` script to regenerate manifest if needed
- Updated `npm start` to auto-generate manifest before starting server

## Workflow

```
ANNOTATOR                          VISUALIZER
┌──────────────────┐              ┌──────────────────┐
│ Load all photos  │              │ Load all photos  │
│ from manifest    │              │ from manifest    │
└────────┬─────────┘              └────────┬─────────┘
         │                                 │
         ↓                                 ↓
┌──────────────────┐              ┌──────────────────┐
│ Click to place   │              │ Click red dots   │
│ green dots       │              │ to plant trees   │
└────────┬─────────┘              └────────┬─────────┘
         │                                 │
         ↓                                 ↓
┌──────────────────┐              ┌──────────────────┐
│ Download JSON    │    ────→     │ Import JSON to   │
│ with all points  │              │ assets/json/     │
└──────────────────┘              │ annotations.json │
                                  └──────────────────┘
                                           │
                                           ↓
                                  ┌──────────────────┐
                                  │ Visualizer reads │
                                  │ and displays     │
                                  │ all points       │
                                  └──────────────────┘
```

## Key Files

| File | Purpose |
|------|---------|
| `generate-manifest.js` | Scans photos/ and generates manifest.json |
| `annotator.html` | UI for annotation phase |
| `sketch_annotator.js` | Logic for placing and downloading annotations |
| `assets/json/manifest.json` | List of all 184 photos (auto-generated) |
| `assets/json/annotations.json` | Compiled annotations (user-provided) |
| `visualizer.html` | UI for visualization phase |
| `sketch_visualizer.js` | Logic for planting trees at annotated points |

## How to Use

1. **Annotate**: Open `annotator.html`, click on photos to mark tree locations, download JSON
2. **Import**: Replace `assets/json/annotations.json` with your downloaded file
3. **Visualize**: Open `visualizer.html`, click red dots to plant trees

## Browser Download Format

When you download from the annotator, you get a JSON file with structure:
```json
{
  "annotations": {
    "E_00001.png": [{"x": 100, "y": 200}, ...],
    "E_00002.png": [...],
    ...
  },
  "lastUpdated": "2026-02-05T...",
  "totalPhotos": 184,
  "annotatedPhotos": 45
}
```

Just save this as `annotations.json` and place it in `assets/json/`
