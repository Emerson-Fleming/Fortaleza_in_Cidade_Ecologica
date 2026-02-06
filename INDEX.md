# Documentation Index

## 📚 Quick Reference

Start here for different needs:

### 🚀 New to the Project?
→ Read **[QUICK_START.md](QUICK_START.md)** (2 min read)

### 📖 Want Full Details?
→ Read **[WORKFLOW.md](WORKFLOW.md)** (5 min read)

### 🔧 Interested in Changes Made?
→ Read **[REFACTOR_SUMMARY.md](REFACTOR_SUMMARY.md)** (5 min read)

### ✨ See What's New?
→ Read **[CHANGES.md](CHANGES.md)** (3 min read)

---

## 📋 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| **QUICK_START.md** | Step-by-step guide to using the app | New users |
| **WORKFLOW.md** | Complete workflow documentation | Everyone |
| **REFACTOR_SUMMARY.md** | Detailed technical changes | Developers |
| **CHANGES.md** | Summary of what was refactored | Developers |
| **README.md** | Original project info | Reference |

---

## 🎯 Common Tasks

### I want to annotate trees
1. Open `http://localhost:8080/annotator.html`
2. Click on photos to mark tree locations
3. Download the JSON file
4. See **QUICK_START.md** → Step 1

### I want to visualize trees
1. Import the annotations.json file
2. Open `http://localhost:8080/visualizer.html`
3. Click red dots to plant trees
4. See **QUICK_START.md** → Steps 2-3

### I want to understand the new system
→ See **WORKFLOW.md** for the complete flow

### I added new photos
Run: `npm run manifest`

### I want to understand what changed
→ See **REFACTOR_SUMMARY.md** for technical details

---

## 📁 Project Structure

```
Fortaleza_in_Cidade_Ecologica/
├── 📄 annotator.html          ← Annotation interface
├── 📄 visualizer.html         ← Visualization interface
├── 📄 sketch_annotator.js     ← Annotation logic
├── 📄 sketch_visualizer.js    ← Visualization logic
├── 📄 generate-manifest.js    ← Auto-generate photo list
├── 📁 assets/
│   ├── 📁 photos/            ← All 184 photos (E_00001.png - E_00199.png)
│   └── 📁 json/
│       ├── manifest.json     ← Auto-generated list of photos
│       └── annotations.json  ← Your annotations (import here)
└── 📚 Documentation
    ├── 📄 QUICK_START.md       ← Start here!
    ├── 📄 WORKFLOW.md          ← Detailed workflow
    ├── 📄 REFACTOR_SUMMARY.md  ← Technical details
    ├── 📄 CHANGES.md           ← What changed
    └── 📄 README.md            ← Original info
```

---

## ⌨️ Keyboard Shortcuts

### Annotator (annotator.html)
| Key | Action |
|-----|--------|
| **P** | Previous photo |
| **N** | Next photo |
| **Z** | Undo last dot |
| **D** | Download annotations |

### Visualizer (visualizer.html)
| Key | Action |
|-----|--------|
| **P** | Previous photo |
| **N** | Next photo |
| **Click dot** | Plant tree |

---

## 🔗 Important Links

- **Annotator**: `http://localhost:8080/annotator.html`
- **Visualizer**: `http://localhost:8080/visualizer.html`
- **Manifest**: `http://localhost:8080/assets/json/manifest.json`
- **Annotations**: `http://localhost:8080/assets/json/annotations.json`

---

## 💡 How It Works (Quick Version)

1. **Discover Photos**: `generate-manifest.js` scans `assets/photos/` → creates `manifest.json`
2. **Load Photos**: Both annotator & visualizer read `manifest.json` → auto-load all 184 photos
3. **Annotate**: Click on annotator to mark tree locations → download `annotations.json`
4. **Import**: Copy downloaded file to `assets/json/annotations.json`
5. **Visualize**: Visualizer reads both manifest & annotations → shows points & lets you plant trees

---

## ❓ FAQ

**Q: Do I need to upload images?**
A: No! All 184 photos are automatically discovered from `assets/photos/`

**Q: Where do I get the annotations.json file?**
A: Download it from the annotator after marking locations (press D or click "Download JSON")

**Q: Can I have multiple annotation files?**
A: Yes! The current system uses one file at `assets/json/annotations.json`, but you can keep backups elsewhere

**Q: What if I add new photos?**
A: Run `npm run manifest` to regenerate the manifest.json

**Q: Do my annotations auto-save?**
A: Only in the browser memory. Download to save permanently. There's no auto-sync to the server.

---

Made with ❤️ for Fortaleza in Cidade Ecologica 🌲
