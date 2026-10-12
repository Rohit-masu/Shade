# VANTA 3D — Asset Checklist

The 3D demo currently runs on **procedural sunglasses built in code** (`src/three/`), so nothing below blocks the demo.
Each asset replaces a placeholder and makes it look like *our* product.

Priority: **P0** = needed for client-ready version · **P1** = big visual upgrade · **P2** = polish

---

## 1. 3D models (P0) — `public/models/`

One `.glb` per product. This is the most important item.

| File | Product | Style |
|---|---|---|
| `green-wayfarer.glb` | Emerald Horizon | Wayfarer (also used as the hero / colorway model) |
| `gold-aviator.glb` | Aero Mirage Gold | Aviator |
| `silver-round.glb` | Komorebi Round | Round |
| `amber-wayfarer.glb` | Noir Wayfarer | Wayfarer (can reuse wayfarer mesh, different material) |
| `black-wayfarer.glb` | Obsidian Classic | Wayfarer (reuse) |
| `brown-tortoise.glb` | Havana Tortoise | Wayfarer/clubmaster |

**Spec for the 3D artist (send this as-is):**

- **Separate, named meshes** — required for the assemble/explode animation:
  `Rim_L`, `Rim_R`, `Lens_L`, `Lens_R`, `Bridge`, `Temple_L`, `Temple_R`, `Hinge_L`, `Hinge_R`, `Screw_L`, `Screw_R` (+ `NosePad_L/R`, `BrowBar` for aviators)
- **Temple pivot** (origin) placed exactly at the hinge so arms can fold/unfold.
- **Three materials, named**: `Frame`, `Lens`, `Metal` — we recolor these in code for the color-theme change.
- Front of glasses faces **+Z**, Y up, real-world scale (≈ 14 cm wide), centred at origin.
- **≤ 50k triangles**, **≤ 2 MB** after compression (Draco or Meshopt), textures **1k–2k** (KTX2/WebP).
- PBR: base color, roughness, metalness, normal. Lens: separate transparent material, no baked reflections.
- Deliver the `.blend` source too.

Where to get them: commission (Fiverr / Upwork, "product glTF for web, separated parts") — or buy and re-split from Sketchfab / CGTrader / TurboSquid (check the commercial license).
Optimise: `npx @gltf-transform/cli optimize in.glb out.glb --compress draco --texture-compress webp`

## 2. Materials & textures (P1) — `public/textures/`

| Asset | Use | Source |
|---|---|---|
| Tortoiseshell acetate texture (seamless, 2k) | Havana Tortoise frame | Poly Haven / Substance / artist |
| Brushed metal normal map (1k) | Gold/silver frames, hinges | Poly Haven / ambientCG (CC0) |
| Lens gradient map (top dark → bottom light, 512px) | Gradient lenses | Make in Figma |
| Studio HDRI, 1k `.hdr` | Reflections (optional — we use built-in light panels now) | Poly Haven, e.g. `studio_small_09` (CC0) |

## 3. Colorway data (P0) — fill in `src/data/siteData.js → themes3d`

For every colorway the client wants, give us:

| Field | Example |
|---|---|
| Name | Cinematic Amber |
| Frame color (hex) + finish (matte / glossy / metal) | `#1c140e`, glossy |
| Lens color (hex) + type (tint / mirror / gradient) | `#e8a24a`, tint |
| Page background tint (hex) | `#140e08` |
| Accent color (hex) | `#e8a24a` |

## 4. 2D product images (P0) — `public/products/`

`siteData.js` already points at these, but **4 of 6 are missing**:

- [x] `amber-wayfarer.png`
- [x] `black-wayfarer.png`
- [ ] `gold-aviator.png`
- [ ] `silver-round.png`
- [ ] `brown-tortoise.png`
- [ ] `green-wayfarer.png`

Transparent PNG/WebP, ~1200×900, same angle and padding for all. (Tip: render them from the `.glb` files in Blender so 2D and 3D match.)

## 5. Brand & content (P1)

- Logo — SVG, light and dark versions
- Lookbook photos ×4 (currently Unsplash hotlinks — replace with our own, ~2000px wide, WebP)
- OG / social share image 1200×630
- Copy: real part/material names for the **Anatomy** chapter (currently: *Polarized UV400 lens, Hand-cut bio-acetate rim, Keyhole bridge, Flex temple arm, 5-barrel Japanese hinge*)
- Real prices and product names for the **Lineup** chapter

## 6. Optional polish (P2)

- Short UI sounds (`.mp3`, < 30 KB): "click" when parts snap together, soft whoosh on color change
- Product turntable video (MP4/WebM) as a fallback for very low-end phones

---

## Libraries in use

| Library | Used for |
|---|---|
| `three` + `@react-three/fiber` | 3D rendering in React |
| `@react-three/drei` | Environment light panels, contact shadow, HTML labels on 3D parts (and `useGLTF` once models arrive) |
| `gsap` + `ScrollTrigger` + `SplitText` | Scroll-scrubbed timeline, letter-by-letter headline |
| `@gsap/react` (`useGSAP`) | Safe GSAP setup/cleanup in React |
| `lenis` | Smooth scrolling (already in the project) |

**React Bits picks (next step, copy-paste components from reactbits.dev):**
`ShinyText` (badges), `Magnet` (CTA buttons), `ClickSpark` (swatches), `TiltedCard` (product grid), `CircularGallery` (alternative lineup), `Silk` / `Aurora` (background behind the model).
