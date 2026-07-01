# ⚡ Quick Start - 3D Lanyard

## 1️⃣ Download Assets (30 seconds)

### Mac/Linux:
```bash
bash download-assets.sh
```

### Windows:
```bash
download-assets.bat
```

### Manual:
1. Download: https://image.buouui.com/file/card.glb
2. Save to: `src/components/card.glb`
3. Download: https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg
4. Save to: `src/components/lanyard.png`

---

## 2️⃣ Run Dev Server

```bash
npm run dev
```

---

## 3️⃣ Test 3D Lanyard

1. Open http://localhost:5173
2. **Sign up** or **log in**
3. After login, click **"3D View"** button
4. **Drag the card** around
5. Watch it **swing with physics**
6. Click **"2D View"** to return

---

## ✅ That's It!

### Troubleshooting:

**"Assets not found" message?**
→ Run `bash download-assets.sh`

**White screen on 3D view?**
→ Check browser console for errors

**Card not draggable?**
→ Refresh the page

**Too slow on mobile?**
→ System auto-optimizes (30fps, lower quality)

---

## 🎮 Features:

- ✅ Real physics (Rapier engine)
- ✅ Drag interaction
- ✅ Dynamic user card with QR
- ✅ Mobile responsive
- ✅ 2D/3D toggle
- ✅ No external APIs

---

## 📦 Files Created:

- `src/components/Lanyard.jsx` - 3D component
- `src/components/Lanyard3D.tsx` - TypeScript wrapper
- `src/utils/generateCardImage.js` - Card generator
- `download-assets.sh` - Asset downloader
- `LANYARD_3D_SETUP.md` - Full documentation

---

**Questions?** See `LANYARD_3D_SETUP.md` for detailed docs.
