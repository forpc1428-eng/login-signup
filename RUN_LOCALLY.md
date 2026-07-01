# 🚀 Run Atlas Access Locally in VS Code

## Step-by-Step Guide

### 1. Prerequisites

**Install Node.js:**
- Download from https://nodejs.org/ (LTS version recommended)
- Verify installation:
```bash
node --version
npm --version
```

**Install VS Code:**
- Download from https://code.visualstudio.com/
- Install recommended extensions:
  - `ES7+ React/Redux/React-Native snippets`
  - `Tailwind CSS IntelliSense`
  - `Prettier - Code formatter`

---

### 2. Open Project in VS Code

**Option A: From Terminal**
```bash
code /path/to/atlas-access
```

**Option B: VS Code File Menu**
1. Click `File` → `Open Folder`
2. Navigate to your project folder
3. Click `Select Folder`

---

### 3. Install Dependencies

**Open Terminal in VS Code:**
- Press `Ctrl + `` (backtick) or `Cmd + `` on Mac
- Or click `Terminal` → `New Terminal`

**Install all packages:**
```bash
npm install
```

**Wait for completion** (takes 1-2 minutes)

---

### 4. Download 3D Assets

**Run the download script:**

**Mac/Linux:**
```bash
bash download-assets.sh
```

**Windows:**
```bash
download-assets.bat
```

**Or manually download:**
1. Visit: https://image.buouui.com/file/card.glb
2. Save to: `src/components/card.glb`

The `lanyard.png` is already generated ✅

---

### 5. Start Development Server

**Run the dev server:**
```bash
npm run dev
```

**Output will show:**
```
  VITE v7.3.2  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

---

### 6. Open in Browser

**Click the link:**
- Click `http://localhost:5173/` in terminal, or
- Manually open: http://localhost:5173

**You should see:**
- ✅ Dark minimal interface
- ✅ Animated WebGL background (rays)
- ✅ Login/Signup card
- ✅ Floating labels
- ✅ Password strength meter

---

### 7. Test Features

**Sign Up:**
1. Click "Switch to sign up" (if on login)
2. Enter:
   - Full name: `John Doe`
   - Email: `john@test.com`
   - Password: `SecurePass123!`
   - Confirm: `SecurePass123!`
3. Click "Create account"

**Log In:**
1. Enter email: `john@test.com`
2. Enter password: `SecurePass123!`
3. Click "Unlock access"

**View Badges:**
- **2D View:** Default - shows QR code
- **3D View:** Click button - interactive physics simulation
- Drag the card around to see physics
- Click "2D View" to return

---

### 8. Hot Reload Development

**Changes automatically reload:**
1. Edit any file in `src/`
2. Save the file (`Ctrl+S` / `Cmd+S`)
3. Browser updates instantly

**No restart needed!**

---

### 9. Build for Production

**When ready to deploy:**
```bash
npm run build
```

**Creates:**
- `dist/index.html` - Single HTML file
- Ready for deployment

**Preview production build:**
```bash
npm run preview
```

---

### 10. Stop Dev Server

**To stop the server:**
- Press `Ctrl+C` in terminal

**To restart:**
```bash
npm run dev
```

---

## Common Issues & Solutions

### Issue: Port 5173 already in use
**Solution:**
```bash
# Use different port
npm run dev -- --port 5174
```

### Issue: Module not found errors
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: WebGL error / blank screen
**Solution:**
1. Check browser console (F12)
2. Verify card.glb downloaded
3. Try different browser
4. Check GPU support

### Issue: Hot reload not working
**Solution:**
1. Restart dev server: `Ctrl+C` then `npm run dev`
2. Clear browser cache: `Ctrl+Shift+Del`
3. Refresh page: `Ctrl+R`

### Issue: CSS not updating
**Solution:**
```bash
# Restart dev server
npm run dev
```

---

## VS Code Tips

### Useful Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open terminal | `Ctrl + `` |
| Format file | `Shift + Alt + F` |
| Go to definition | `Ctrl + Click` |
| Find in files | `Ctrl + Shift + F` |
| Rename symbol | `Ctrl + Shift + R` |

### Recommended Extensions

1. **ES7+ React/Redux**
   - Auto-complete for React

2. **Tailwind CSS IntelliSense**
   - Tailwind class suggestions

3. **Prettier**
   - Auto-format code
   - Command: `Shift + Alt + F`

4. **Thunder Client** (optional)
   - Test API endpoints

---

## Environment Variables

**Already set in `.env.local`:**
```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbxYnuEXzrj4K_scVMSrxm7MluSL77OsEGOB7qZ2FMTx8fXW7bzEsnNkRFIJZzUdaW7Q/exec
```

**Change if needed:**
1. Edit `.env.local`
2. Save
3. Restart dev server

---

## Project Structure Quick Navigation

**In VS Code Explorer:**
```
src/
├── pages/
│   └── AuthPage.tsx           ← Main page
├── components/
│   ├── AuthPanel.tsx          ← Login/Signup
│   ├── LanyardCard.tsx        ← 2D badge
│   ├── Lanyard3D.tsx          ← 3D badge
│   ├── SideRays.jsx           ← WebGL background
│   └── ...
├── services/
│   └── authApi.ts             ← API calls
└── utils/
    ├── validation.ts          ← Form validation
    └── generateCardImage.js   ← Card generator
```

---

## Development Workflow

1. **Start server:**
   ```bash
   npm run dev
   ```

2. **Make changes** to files in `src/`

3. **Save** (Ctrl+S)

4. **Browser updates automatically**

5. **Test in browser**

6. **Repeat**

**No build step needed during development!**

---

## Full Rebuild (if needed)

**Clean build from scratch:**
```bash
rm -rf dist node_modules
npm install
npm run build
```

---

## Production Preview

**See exactly what will be deployed:**
```bash
npm run build
npm run preview
```

**Then visit:** http://localhost:4173

---

## Next: Deploy to GitHub

See `DEPLOY_TO_GITHUB.md` for step-by-step deployment instructions.

---

## Summary

✅ **Run Locally:** `npm run dev`
✅ **View:** http://localhost:5173
✅ **Edit:** Files in `src/` auto-reload
✅ **Build:** `npm run build`
✅ **Deploy:** See next guide

**You're ready to develop!** 🚀
