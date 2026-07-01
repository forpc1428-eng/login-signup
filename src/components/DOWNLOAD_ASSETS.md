# ⚠️ CRITICAL: Download Required 3D Assets

## The Lanyard component WILL NOT WORK without these files!

### Step 1: Download card.glb

**Option A (Recommended):**
```bash
cd src/components
curl -O https://image.buouui.com/file/card.glb
```

**Option B (Alternative):**
```bash
cd src/components
curl -o card.glb https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb
```

**Option C (Manual):**
1. Visit https://image.buouui.com/file/card.glb
2. Download the file
3. Save as `src/components/card.glb`

### Step 2: Download lanyard.png

**Option A:**
```bash
cd src/components
curl -o lanyard.png https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg
```

**Option B (Create your own):**
Create a 256x256 pixel repeating texture with a fabric/ribbon pattern and save as `src/components/lanyard.png`

### Step 3: Verify Files

Check that both files exist:
```bash
ls -lh src/components/card.glb src/components/lanyard.png
```

### Expected File Sizes
- `card.glb`: ~50-200 KB
- `lanyard.png`: ~10-50 KB

## What Happens If Assets Are Missing?

The component will throw errors like:
- ❌ "Failed to load GLTF"
- ❌ "Texture not found"
- ❌ "useGLTF hook failed"
- ❌ White screen / Console errors

## After Downloading

1. Restart dev server: `npm run dev`
2. Check browser console for errors
3. You should see the 3D lanyard render

## Alternative: Use Different Models

If you have your own GLB card model:
1. Replace `card.glb` with your model
2. Ensure it has meshes named `card`, `clip`, and `clamp`
3. Adjust UV mapping if needed
