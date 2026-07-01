# Components Directory

## 3D Lanyard Assets

### ⚠️ REQUIRED FILES (Download Manually)

This directory needs two 3D asset files for the Lanyard component to work:

#### 1. card.glb (3D Model)
- **Download:** https://image.buouui.com/file/card.glb
- **Save as:** `card.glb` (in this directory)
- **Size:** ~50-200 KB
- **Format:** GLTF Binary (.glb)

#### 2. lanyard.png (Texture)
- **Download:** https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg
- **Save as:** `lanyard.png` (in this directory)
- **Size:** ~10-50 KB
- **Format:** PNG or JPG

### Quick Download (From Project Root):

**Mac/Linux:**
```bash
bash download-assets.sh
```

**Windows:**
```bash
download-assets.bat
```

### Verify Download:

```bash
ls -lh card.glb lanyard.png
```

You should see both files listed.

### What Happens If Missing?

- Component shows friendly error message
- Provides download links
- No crashes or white screens
- 2D view still works perfectly

### Component Files:

- `Lanyard.jsx` - Main 3D physics component
- `Lanyard.css` - Styling
- `Lanyard.d.ts` - TypeScript definitions
- `Lanyard3D.tsx` - TypeScript wrapper with card generation
- `LanyardCard.tsx` - Original 2D card component

### Usage:

After downloading assets and restarting dev server:

1. Log in to Atlas Access
2. Click "3D View" button
3. Drag the card
4. Watch physics simulation
5. Click "2D View" to return

---

**Need help?** See `../LANYARD_3D_SETUP.md` for full documentation.
