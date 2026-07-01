# Required 3D Assets for Lanyard Component

## Download Instructions

### 1. card.glb (3D Model)
Download the 3D card model from one of these sources:

**Option A (Recommended):**
- Visit: https://image.buouui.com/file/card.glb
- Download directly to `src/components/card.glb`

**Option B:**
- Visit: https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb
- Rename to `card.glb`
- Place in `src/components/card.glb`

### 2. lanyard.png (Texture)
Download the lanyard texture:

**Option A:**
- Visit: https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg
- Place in `src/components/lanyard.png`

**Option B (Create Your Own):**
Create a 256x256 px repeating texture with a fabric/ribbon pattern.

## File Structure
```
src/
  components/
    Lanyard.jsx       ✓ Created
    Lanyard.css       ✓ Created
    card.glb          ← DOWNLOAD THIS
    lanyard.png       ← DOWNLOAD THIS
```

## Verification
Once downloaded, verify the files exist:
- [ ] src/components/card.glb exists
- [ ] src/components/lanyard.png exists
- [ ] Files are not corrupted (try opening in Blender/image viewer)

## Alternative: Temporary Placeholders
If you cannot download the assets immediately, the component will fail to load.
You MUST download these files for the component to work.
