# ⚡ Quick Commands Reference

## Development

### Start Dev Server
```bash
npm run dev
```
**Opens:** http://localhost:5173

### Stop Server
```bash
Ctrl + C
```

### Download 3D Assets
```bash
bash download-assets.sh
```

---

## Building

### Build for Production
```bash
npm run build
```
**Creates:** `dist/` folder

### Preview Production Build
```bash
npm run preview
```

### Clean Build
```bash
rm -rf dist node_modules
npm install
npm run build
```

---

## Git Commands

### First Time Setup
```bash
git init
git remote add origin https://github.com/USERNAME/atlas-access.git
git branch -M main
```

### Push Code to GitHub
```bash
git add .
git commit -m "Your message here"
git push -u origin main
```

### Daily Workflow
```bash
git add .
git commit -m "Description of changes"
git push
```

### Clone from Different Device
```bash
git clone https://github.com/USERNAME/atlas-access.git
cd atlas-access
npm install
npm run dev
```

### View Commit History
```bash
git log --oneline
```

---

## Common Development Tasks

### Install New Package
```bash
npm install package-name
```

### Format Code
```bash
# In VS Code:
Shift + Alt + F
```

### Check for Issues
```bash
# TypeScript check
npx tsc --noEmit
```

### Clear Cache
```bash
rm -rf dist
npm run build
```

---

## Environment Variables

### View Current
```bash
cat .env.local
```

### Edit
1. Open `.env.local`
2. Make changes
3. Save
4. Restart dev server

---

## GitHub URLs

### After Creating Repository

| Service | URL Pattern |
|---------|------------|
| GitHub Repo | `https://github.com/USERNAME/atlas-access` |
| GitHub Pages | `https://USERNAME.github.io/atlas-access/` |
| Netlify | `https://atlas-access.netlify.app` |
| Vercel | `https://atlas-access.vercel.app` |

---

## VS Code Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Terminal | `Ctrl + `` |
| Format File | `Shift + Alt + F` |
| Save | `Ctrl + S` |
| Find | `Ctrl + F` |
| Find & Replace | `Ctrl + H` |
| Go to File | `Ctrl + P` |
| Show Problems | `Ctrl + Shift + M` |

---

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 5174
```

### Module Not Found
```bash
rm -rf node_modules
npm install
```

### Git Auth Failed
Create token at: https://github.com/settings/tokens/new
- Select: `repo` scope
- Use token as password

### Clear npm Cache
```bash
npm cache clean --force
```

---

## Project Paths

```
.                          # Root
├── src/components/        # React components
├── src/pages/            # Page components
├── src/utils/            # Utility functions
├── src/services/         # API calls
├── dist/                 # Production build (after npm run build)
├── .env.local            # Environment variables
└── package.json          # Dependencies
```

---

## File Locations

| File | Purpose |
|------|---------|
| `src/App.tsx` | App entry point |
| `src/pages/AuthPage.tsx` | Main auth page |
| `src/components/AuthPanel.tsx` | Login/Signup form |
| `src/services/authApi.ts` | Backend API calls |
| `vite.config.ts` | Vite configuration |
| `tailwind.config.js` | Tailwind configuration |
| `.env.local` | Environment variables |

---

## Deployment Checklist

### Before Deploying:
```bash
npm run build          # ✓ Should complete without errors
npm run preview        # ✓ Should load without errors
```

### Deploy Steps:

**Netlify:**
1. Push code: `git push`
2. Go to https://netlify.com
3. Click "New site from Git"
4. Select `atlas-access` repo
5. Done! ✅

**Vercel:**
1. Push code: `git push`
2. Go to https://vercel.com
3. Click "New Project"
4. Select `atlas-access` repo
5. Done! ✅

**GitHub Pages:**
1. Update `vite.config.ts` with base path
2. Push code: `git push`
3. GitHub Actions auto-deploys
4. Done! ✅

---

## Important Reminders

✅ **Before coding:**
```bash
npm run dev
```

✅ **Before committing:**
```bash
git status
```

✅ **After making changes:**
```bash
git add .
git commit -m "message"
git push
```

✅ **Assets required:**
- `src/components/card.glb` (download)
- `src/components/lanyard.png` (already generated ✓)

✅ **Environment variable:**
- `.env.local` already configured ✓

---

## Directory Navigation

### From Project Root
```bash
cd src/components        # Components folder
cd src/pages            # Pages folder
cd dist                 # Production build folder
```

---

## View Logs

### Build Output
```bash
npm run build 2>&1 | tee build.log
```

### Dev Server Logs
```bash
npm run dev 2>&1 | tee dev.log
```

---

## Network & Testing

### Test API Endpoint
```bash
curl -X POST \
  https://script.google.com/macros/s/YOUR_ID/exec \
  -H "Content-Type: text/plain" \
  -d '{"action":"login","email":"test@test.com","password":"test"}'
```

### Check Internet Connection
```bash
ping google.com
```

---

## Time-Saving Tips

### Auto-format on Save
VS Code settings (Ctrl+,):
```
Editor: Format On Save = true
```

### Run Multiple Commands
```bash
npm install && npm run dev
```

### Kill Process on Port
```bash
# macOS/Linux
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID YOUR_PID /F
```

---

## Useful Links

| Service | URL |
|---------|-----|
| React Docs | https://react.dev |
| Tailwind CSS | https://tailwindcss.com |
| Three.js | https://threejs.org |
| Vite | https://vitejs.dev |
| Git | https://git-scm.com |
| GitHub | https://github.com |
| Netlify | https://netlify.com |
| Vercel | https://vercel.com |

---

## Complete Workflow

```bash
# 1. Start dev server
npm run dev

# 2. Make code changes (hot reload happens automatically)

# 3. Test locally at http://localhost:5173

# 4. When satisfied:
git add .
git commit -m "My changes"
git push

# 5. Hosting auto-deploys (1-2 minutes)

# 6. Share live URL!
```

---

## Emergency Commands

### Completely Reset Project
```bash
git reset --hard HEAD
git clean -fd
npm install
npm run dev
```

### Clear Everything and Rebuild
```bash
rm -rf dist node_modules .git
npm install
git init
git remote add origin https://github.com/USERNAME/atlas-access.git
npm run build
```

### Force Push (⚠️ careful!)
```bash
git push --force origin main
```

---

**Bookmark this page!** 📌

Print or save for quick reference while developing.
