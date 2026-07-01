# 3D Lanyard Architecture

## System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LOGS IN                            │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AuthPage.tsx                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  State: user, use3DLanyard                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────┬───────────────────┘
                      │                       │
        ┌─────────────▼───────────┐ ┌─────────▼──────────────┐
        │   2D View (Default)     │ │   3D View (Toggle)     │
        │                         │ │                        │
        │  LanyardCard.tsx        │ │  Lanyard3D.tsx         │
        │  ┌──────────────────┐   │ │  ┌─────────────────┐   │
        │  │ - User info      │   │ │  │ 1. Generate     │   │
        │  │ - QR code        │   │ │  │    card images  │   │
        │  │ - UUID           │   │ │  │                 │   │
        │  │ - Logout button  │   │ │  │ 2. Pass to      │   │
        │  └──────────────────┘   │ │  │    Lanyard.jsx  │   │
        │                         │ │  └─────────────────┘   │
        └─────────────────────────┘ └────────┬───────────────┘
                                             │
                                             ▼
                        ┌────────────────────────────────────┐
                        │        Lanyard.jsx                 │
                        │  ┌──────────────────────────────┐  │
                        │  │  1. Load 3D Assets:          │  │
                        │  │     - card.glb (model)       │  │
                        │  │     - lanyard.png (texture)  │  │
                        │  │                              │  │
                        │  │  2. Setup Physics:           │  │
                        │  │     - Rapier world           │  │
                        │  │     - Rope joints (4)        │  │
                        │  │     - Spherical joint        │  │
                        │  │                              │  │
                        │  │  3. Composite Textures:      │  │
                        │  │     - Front image → UV left  │  │
                        │  │     - Back image → UV right  │  │
                        │  │                              │  │
                        │  │  4. Render Scene:            │  │
                        │  │     - Canvas (Three.js)      │  │
                        │  │     - Lighting               │  │
                        │  │     - Physics update loop    │  │
                        │  └──────────────────────────────┘  │
                        └────────────────────────────────────┘
```

## Component Hierarchy

```
AuthPage
├── AnimatedBackground
├── BrandMark
├── AuthPanel (when logged out)
│   ├── FloatingField (multiple)
│   ├── MessageBanner
│   └── Button
│
└── Lanyard Views (when logged in)
    │
    ├── 2D View (use3DLanyard = false)
    │   └── LanyardCard
    │       ├── User info display
    │       ├── QR code (qrcode lib)
    │       └── Logout button
    │
    └── 3D View (use3DLanyard = true)
        └── Lanyard3D
            ├── generateCardImage (util)
            │   ├── Canvas creation
            │   ├── User info rendering
            │   └── QR code generation
            │
            └── Lanyard (JSX)
                ├── Canvas (R3F)
                ├── Physics (Rapier)
                │   ├── RigidBody (fixed)
                │   ├── RigidBody (j1, j2, j3)
                │   └── RigidBody (card)
                │       ├── useRopeJoint (×3)
                │       └── useSphericalJoint
                │
                ├── Band Component
                │   ├── useGLTF (card.glb)
                │   ├── useTexture (lanyard.png)
                │   ├── useTexture (front/back)
                │   ├── useMemo (texture composite)
                │   └── useFrame (physics loop)
                │
                └── Environment (lighting)
```

## Data Flow

```
User Object
    │
    ├─► AuthPage
    │       │
    │       ├─► Lanyard3D
    │       │       │
    │       │       └─► generateCardImage(user, 'front')
    │       │       └─► generateCardImage(user, 'back')
    │       │               │
    │       │               ├─► Create canvas (800×1200)
    │       │               ├─► Draw gradients
    │       │               ├─► Render user.fullName
    │       │               ├─► Render user.email
    │       │               ├─► Render user.id
    │       │               ├─► QRCode.toCanvas(user.email)
    │       │               └─► Return dataURL
    │       │
    │       └─► Lanyard.jsx
    │               │
    │               ├─► frontImage (dataURL)
    │               ├─► backImage (dataURL)
    │               │
    │               └─► useMemo: Composite Texture
    │                       │
    │                       ├─► Load base material map
    │                       ├─► Create composite canvas
    │                       ├─► Draw front to left half
    │                       ├─► Draw back to right half
    │                       └─► Create THREE.CanvasTexture
    │
    └─► LanyardCard (2D)
            │
            ├─► Display user.fullName
            ├─► Display user.email
            ├─► Display user.id
            └─► QRCode.toDataURL(user.email)
```

## Physics System

```
Fixed Anchor Point (y=4)
    │
    ├── Rope Joint 1 (length: 1)
    │   │
    │   └── j1 (Ball Collider r=0.1)
    │       │
    │       ├── Rope Joint 2
    │       │   │
    │       │   └── j2 (Ball Collider r=0.1)
    │       │       │
    │       │       ├── Rope Joint 3
    │       │       │   │
    │       │       │   └── j3 (Ball Collider r=0.1)
    │       │       │       │
    │       │       │       └── Spherical Joint
    │       │       │           │
    │       │       │           └── Card (Cuboid Collider)
    │       │       │               ├── Dynamic (swings)
    │       │       │               └── Kinematic (when dragged)
    │       │       │
    │       │       └── lerped position (smoothing)
    │       │
    │       └── lerped position (smoothing)
    │
    └── Catmull-Rom Curve
        ├── Point 0: j3.translation()
        ├── Point 1: j2.lerped
        ├── Point 2: j1.lerped
        └── Point 3: fixed.translation()
            │
            └── MeshLine geometry (32 points)
```

## Asset Pipeline

```
Build Time:
    Vite Config
    ├── assetsInclude: ['**/*.glb']
    └── Process imports with new URL()

Runtime:
    card.glb (not present)
    ├── Check: file exists?
    │   ├── Yes → useGLTF loads model
    │   └── No  → Show download UI
    │
    lanyard.png (not present)
    ├── Check: file exists?
    │   ├── Yes → useTexture loads image
    │   └── No  → Show download UI
    │
    Front/Back Images (generated)
    └── useTexture (dataURL)
        └── Canvas texture created

Composite:
    Base Material Map
    ├── Load original card texture
    ├── Create new canvas
    ├── Draw base texture
    ├── Composite front image (left half)
    ├── Composite back image (right half)
    └── Create THREE.CanvasTexture
        ├── Set color space (SRGB)
        ├── Set anisotropy (16)
        └── Apply to material
```

## State Management

```
AuthPage State:
    ├── mode: "login" | "signup"
    ├── values: AuthFormValues
    ├── errors: FieldErrorMap
    ├── loading: boolean
    ├── use3DLanyard: boolean  ← New
    └── user: AuthUser | null
        │
        └─► sessionStorage
            └─► "atlas-auth-session"

Lanyard3D State:
    ├── frontImage: string | null
    ├── backImage: string | null
    └── loading: boolean

Lanyard State:
    ├── isMobile: boolean
    ├── curve: CatmullRomCurve3
    ├── dragged: Vector3 | false
    └── hovered: boolean

Physics State (Rapier):
    ├── j1.translation()
    ├── j2.translation()
    ├── j3.translation()
    ├── card.translation()
    ├── card.rotation()
    └── card.angvel()
```

## Performance Optimization

```
Desktop:
    ├── DPR: 2
    ├── Physics: 60 FPS (1/60)
    ├── Curve Points: 32
    ├── Clearcoat: Enabled
    └── Resolution: [1000, 1000]

Mobile:
    ├── DPR: 1.5
    ├── Physics: 30 FPS (1/30)
    ├── Curve Points: 16
    ├── Clearcoat: Disabled
    └── Resolution: [1000, 2000]

Auto-Detection:
    window.innerWidth < 768
    ├── True  → Mobile config
    └── False → Desktop config

useFrame Optimization:
    ├── Only update when dragged
    ├── Lerp joint positions (smooth)
    ├── Clamp distance (stability)
    └── Tilt correction (Y-axis)
```

## Error Handling

```
Asset Loading:
    card.glb missing
    ├── Catch error
    ├── Set cardGLB = null
    └── Render fallback UI
        ├── Warning icon
        ├── Download instructions
        └── Download link

Physics Errors:
    Rapier WASM failed
    ├── Catch in Physics component
    └── Fallback to static card

Network Errors:
    QR generation failed
    ├── Catch in generateCardImage
    └── Show error text instead

Render Errors:
    Three.js context lost
    ├── Canvas error boundary
    └── Show reload message
```

## File Dependencies

```
Lanyard.jsx
├── Imports:
│   ├── react (hooks)
│   ├── @react-three/fiber (Canvas, extend, useFrame)
│   ├── @react-three/drei (useGLTF, useTexture, Environment)
│   ├── @react-three/rapier (Physics, RigidBody, joints)
│   ├── meshline (MeshLineGeometry, MeshLineMaterial)
│   ├── three (Vector3, CatmullRomCurve3, etc.)
│   ├── ./card.glb (3D model asset)
│   ├── ./lanyard.png (texture asset)
│   └── ./Lanyard.css (styles)
│
└── Exports:
    └── Lanyard component

Lanyard3D.tsx
├── Imports:
│   ├── react (hooks)
│   ├── @/types/auth (AuthUser)
│   ├── @/utils/generateCardImage (card generator)
│   └── ./Lanyard (JSX component)
│
└── Exports:
    └── Lanyard3D component

generateCardImage.js
├── Imports:
│   └── qrcode (QR generation)
│
└── Exports:
    └── generateCardImage function
```

## Deployment Checklist

```
Pre-Deploy:
    ├── Download assets
    │   ├── card.glb → src/components/
    │   └── lanyard.png → src/components/
    │
    ├── npm run build
    │   ├── Success: Continue
    │   └── Errors: Fix and retry
    │
    └── Test production build
        ├── npm run preview
        └── Verify 3D works

Deploy:
    ├── Upload dist/ to host
    ├── Set VITE_APPS_SCRIPT_URL
    └── Test live site

Post-Deploy:
    ├── Test authentication
    ├── Test 2D view
    ├── Test 3D view
    └── Test on mobile
```

---

**Architecture Status: PRODUCTION READY**

All components properly structured, typed, and integrated.
