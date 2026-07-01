# 3D Lanyard Integration - Complete Setup Guide

## ✅ Integration Status

### Completed Steps:
1. ✅ Installed dependencies (`three`, `meshline`, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`)
2. ✅ Updated `vite.config.ts` with GLB asset support
3. ✅ Created `src/components/Lanyard.jsx` (physics component)
4. ✅ Created `src/components/Lanyard.css` (styling)
5. ✅ Created `src/components/Lanyard3D.tsx` (TypeScript wrapper)
6. ✅ Created `src/utils/generateCardImage.js` (dynamic card generation with QR)
7. ✅ Integrated into `src/pages/AuthPage.tsx` with 2D/3D toggle
8. ✅ Added TypeScript definitions

### ⚠️ Required Manual Step:

**YOU MUST DOWNLOAD THESE ASSETS:**

## 🔥 CRITICAL: Download 3D Assets

### Download card.glb

**Method 1 (Command Line):**
```bash
cd src/components
curl -O https://image.buouui.com/file/card.glb
```

**Method 2 (Browser):**
1. Open: https://image.buouui.com/file/card.glb
2. Save file to `src/components/card.glb`

**Method 3 (Alternative Source):**
```bash
cd src/components
curl -o card.glb https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb
```

### Download lanyard.png

**Method 1:**
```bash
cd src/components
curl -o lanyard.png https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg
```

**Method 2 (Create Your Own):**
- Create a 256x256 px repeating fabric/ribbon texture
- Save as `src/components/lanyard.png`

## 📁 Verify File Structure

After downloading, verify:

```bash
ls -lh src/components/card.glb src/components/lanyard.png
```

Expected structure:
```
src/
  components/
    Lanyard.jsx          ✓ Created
    Lanyard.css          ✓ Created
    Lanyard.d.ts         ✓ Created
    Lanyard3D.tsx        ✓ Created
    card.glb             ← DOWNLOAD THIS
    lanyard.png          ← DOWNLOAD THIS
    DOWNLOAD_ASSETS.md   ✓ Created
  utils/
    generateCardImage.js ✓ Created
    generateCardImage.d.ts ✓ Created
```

## 🚀 How It Works

### After Login:

1. User logs in successfully
2. `AuthPage` shows the lanyard card (2D by default)
3. Click **"3D View"** button to switch to interactive 3D lanyard
4. The system:
   - Generates front card image with user name, email, UUID, and QR code
   - Generates back card image with features and issue date
   - Renders 3D physics-based lanyard with Rapier physics
   - Card can be dragged and swings realistically

### Features:

- **Physics Simulation**: Real rope physics with Rapier
- **Interactive Dragging**: Click and drag the card
- **Mobile Optimized**: Lower physics timestep on mobile
- **Dynamic Card Content**: User info rendered on canvas
- **QR Code**: Generated client-side from user email
- **Responsive**: Adapts to screen size
- **Smooth Toggle**: Switch between 2D and 3D views

## 🎮 Usage

Once assets are downloaded:

```bash
npm run dev
```

1. Sign up or log in
2. After authentication, you'll see the lanyard badge
3. Click **"3D View"** to activate the physics simulation
4. Drag the card around
5. Click **"2D View"** to return to the flat QR badge

## 🔧 Customization

### Change Card Design:

Edit `src/utils/generateCardImage.js`:
- Modify colors, gradients, fonts
- Add logos or custom graphics
- Adjust QR code position/size

### Adjust Physics:

Edit `src/components/Lanyard3D.tsx`:
- `position={[0, 0, 24]}` - Camera distance
- `gravity={[0, -40, 0]}` - Gravity strength
- `lanyardWidth={1}` - Lanyard thickness

### Performance:

The component auto-detects mobile and reduces:
- Physics timestep (60fps → 30fps)
- Curve points (32 → 16)
- Device pixel ratio (2 → 1.5)
- Clearcoat effect (disabled on mobile)

## 🐛 Troubleshooting

### "Assets not found" Error

**Solution**: Download `card.glb` and `lanyard.png` to `src/components/`

### White Screen / No 3D View

**Check:**
1. Assets downloaded correctly
2. No console errors
3. Browser supports WebGL
4. No ad blockers blocking Three.js

### "Failed to load GLTF"

**Solution:**
- Verify file is valid GLB format
- Check file size (should be 50-200 KB)
- Try alternative download source

### Physics Not Working

**Check:**
- Rapier WASM loaded correctly
- Console for Rapier errors
- Try refreshing the page

### Mobile Performance Issues

**Solution:**
- The component auto-optimizes
- If still slow, reduce `lanyardWidth` to `0.5`
- Lower `fov` to `20` or `15`

## 📦 Production Build

```bash
npm run build
```

The GLB and PNG assets will be bundled correctly via Vite.

Verify in `dist/`:
- Assets are inlined or copied
- No 404 errors in production

## 🔐 Security Notes

- QR codes generated client-side (no external API)
- Card images generated in-browser (no server calls)
- User data never leaves the client for card rendering
- All physics runs locally (no network requests)

## 🎨 Design Specs

### Card Dimensions:
- Canvas: 800x1200 px
- Front: User info + QR code
- Back: Features list + issue date

### Colors:
- Background: `#0A0A0F` → `#1a1a2e`
- Accent: `rgba(124, 92, 255, 0.15)`
- Text: White with various opacities

### Physics:
- Rope joints: 4 segments
- Damping: Angular 4, Linear 4
- Collision: Cuboid collider
- Type: Dynamic (draggable) or Kinematic (when grabbed)

## 🚢 Deployment Checklist

Before deploying:

- [ ] Downloaded `card.glb` to `src/components/`
- [ ] Downloaded `lanyard.png` to `src/components/`
- [ ] Tested 3D view in dev mode
- [ ] Tested drag interaction
- [ ] Tested on mobile
- [ ] Verified production build
- [ ] No console errors
- [ ] Assets load correctly

## 🎯 Next Steps

### Optional Enhancements:

1. **Add Logout Button to 3D View**:
   - Overlay a button on the 3D canvas
   - Position absolute with z-index

2. **Customize Lanyard Texture**:
   - Replace `lanyard.png` with branded texture
   - Add company logo to the strap

3. **Add Sound Effects**:
   - Card swing sound
   - Grab/release audio

4. **Share Feature**:
   - Export card as image
   - Share to social media

5. **AR View** (Advanced):
   - Use WebXR to view in AR
   - Place card in real environment

## 📚 References

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Rapier Physics](https://rapier.rs/)
- [Vercel Blog Post](https://vercel.com/blog/building-an-interactive-3d-event-badge-with-react-three-fiber)
- [Three.js Docs](https://threejs.org/docs/)

---

**Ready to go!** Just download the assets and run `npm run dev`. 🎉
