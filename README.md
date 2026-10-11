# VANTA Optics — 3D Interactive Sunglasses Shop (SanPuRO Demo #1)

A dark-engineered, luxury sunglasses and lens shop website featuring 60fps canvas scroll-driven 3D frame rotations, Lenis smooth scrolling, GSAP ScrollTrigger timeline choreography, interactive variant switching, before/after glare comparison sliders, and direct WhatsApp e-commerce ordering.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build optimized production bundle
npm run build
```

---

## 📁 Where to Drop Assets

### 1. 3D Scroll-Driven Hero Frames
Place your 120 transparent WebP images inside:
```
public/frames/
  frame_0001.webp
  frame_0002.webp
  ...
  frame_0120.webp
```
* **Format:** WebP (recommended) or PNG with transparent alpha background.
* **Resolution:** 1280x720px, 1920x1080px, or 1200x1200px centered.
* **Padding:** 4-digit zero padding (`frame_0001.webp`).
* *Tip:* Until you drop your frames, the engine automatically runs the fallback depth and glare reflection canvas engine using `public/products/amber-wayfarer.png`.

### 2. Product Catalog Images
Place transparent PNGs or WebPs (~1000x800px) inside:
```
public/products/
  amber-wayfarer.png   (provided: Cinematic Amber Lens Sunglasses)
  black-wayfarer.png
  gold-aviator.png
  silver-round.png
  brown-tortoise.png
  green-wayfarer.png
```

---

## 🛠️ How to Customize All Content & Colors

All text copy, product lines, prices, WhatsApp numbers, boutique hours, and styling colors are centrally controlled in:
👉 [`src/data/siteData.js`](file:///c:/Users/DELL/Downloads/Sanpuro/Shade/src/data/siteData.js)

### Changing the Brand Name & WhatsApp
```javascript
export const site = {
  brand: "VANTA Optics",
  tagline: "See the World Differently.",
  subtitle: "Premium shades. Crafted for your style.",
  accent: "#e8a24a",
  whatsapp: "919999999999", // Enter your phone number with country code
  instagram: "https://instagram.com/yourshop",
  address: "Studio 07, Design Boulevard, Bandra West, Mumbai",
  hours: "Mon-Sun, 10:00 AM - 9:00 PM",
  mapEmbedUrl: "https://www.google.com/maps/embed?..."
};
```

### Changing Accent Color
Edit `--accent` in `src/index.css` or `site.accent` in `siteData.js`. The radial glow and highlights will adapt across the entire site.

---

## 🚢 Deployment (Vercel & Netlify)

### Deploying to Vercel
1. Push your repository to GitHub.
2. Import project on [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Click **Deploy**.

### Deploying to Netlify
1. Connect repository on [Netlify](https://netlify.com).
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Deploy!

---

## 💡 5 Ideas to Upgrade This Demo
1. **Interactive Three.js / React Three Fiber Model**: Allow users to click and drag to freely rotate a real GLTF/GLB sunglasses 3D model, change frame materials (matte, gloss, carbon fiber), and adjust lens transparency in real-time.
2. **Virtual Try-On (Webcam AR / MediaPipe Face Mesh)**: Let users activate their camera to see the sunglasses tracked onto their face in real-time right in the browser!
3. **Sound Design & Spatial Audio**: Subtle tactile sound effects when scrolling, switching color swatches, or clicking the WhatsApp concierge button.
4. **Custom Lens Engraving / Monogram Preview**: Allow users to type their initials and preview laser engraving along the inner temple arm.
5. **Dynamic Lighting Environment Selector**: Toggle between Golden Hour, Midnight Neon, Studio Softbox, and Direct Sunlight to see the polarized reflection changes under different light scenarios.

---
*Created for SanPuRO Demo #1*
