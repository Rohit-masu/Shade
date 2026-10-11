# Gemini Build Prompt: Premium Sunglasses Shop Website (SanPuRO Demo #1)

> Copy everything below into Gemini (or Cursor / Claude). If the output is too long, ask it to build **one phase at a time** (see "Build Order" at the end).

---

## 1. Role

You are a senior front-end engineer and creative developer. Build a **modern, dark-themed, premium sunglasses and lens shop website** as a demo template for a freelance web agency called **SanPuRO**. The site must feel like a high-end product launch page: cinematic scroll animations, smooth motion, and clean code that can be re-skinned for other clients quickly.

## 2. Tech Stack (use exactly this)

- React + Vite (JavaScript, not TypeScript)
- Tailwind CSS
- GSAP + ScrollTrigger
- Lenis (smooth scroll, synced with ScrollTrigger)
- Optional: React Bits-style components for text effects and tilt/spotlight cards (write them yourself if the package is not available)
- No backend. All content comes from a data file.

## 3. Brand and Design

- Placeholder shop name: **VANTA Optics** (must be changeable in one place)
- Theme: dark, charcoal to dark-gray gradient (`#1a1a1d` to `#2b2b30`), white text, one accent color
- Accent color: configurable CSS variable `--accent` (default warm amber `#e8a24a`)
- Fonts: a bold display font for headings (e.g. Syne, Unbounded, or Clash-style) and Inter for body, loaded from Google Fonts
- Style: minimal, lots of whitespace, large typography, subtle grain overlay, soft glows
- Footer credit: "Website by SanPuRO"

## 4. Assets I Will Provide (use placeholders until then)

```
public/
  frames/frame_0001.webp ... frame_0120.webp   (transparent WebP, 1280px wide, ~120 frames, black wayfarer sunglasses rotating/zooming with light reflections)
  products/
    black-wayfarer.png        (transparent PNG)
    gold-aviator.png
    silver-round.png
    brown-tortoise.png
    green-wayfarer.png
  lookbook/ (optional lifestyle images)
```

Rules:
- Frames are **transparent**, so the page background and CSS glow show through behind them.
- Frame count and path pattern must be configurable constants (`FRAME_COUNT`, `FRAME_PATH`).
- If an asset is missing, show a graceful placeholder (gray box with the product name), never a broken image.

## 5. Folder Structure

```
src/
  components/
    Navbar.jsx
    Loader.jsx
    HeroScroll.jsx
    FeatureStrip.jsx
    ProductShowcase.jsx
    ProductCard.jsx
    LensTech.jsx
    Lookbook.jsx
    Testimonials.jsx
    StoreContact.jsx
    Footer.jsx
  data/
    siteData.js          (ALL text, colors, prices, links, product list)
  hooks/
    useImagePreloader.js
    useLenis.js
  App.jsx
  main.jsx
  index.css
```

All copy, product details, colors, store info, and links live in `src/data/siteData.js`. Components never hard-code content. This is critical: I will reuse the template for cafes, gyms, and halls by only editing this file and the assets.

## 6. Sections in Detail

### 6.1 Loader
- Full-screen loader with brand name and a progress bar while all hero frames preload.
- Fades out when 100% loaded. Disable scrolling until done.

### 6.2 Navbar
- Fixed, transparent, blur background after scroll.
- Logo (text), links: Collection, Technology, Lookbook, Store, and a "WhatsApp" button.
- Hamburger menu on mobile with a smooth slide-in.

### 6.3 Hero (most important)
- Pinned full-screen section containing a `<canvas>` that plays the **frame-by-frame image sequence driven by scroll** using GSAP ScrollTrigger (`scrub`, `pin`, about `+=300%` scroll distance).
- Implementation details:
  - Preload all frames into an array of `Image` objects.
  - Keep a `state = { frame: 0 }` object, tween it to `FRAME_COUNT - 1` with `snap: "frame"` and `ease: "none"`.
  - On every update: `ctx.clearRect(...)` then draw the current frame **centered and "contained"** (keep aspect ratio, handle devicePixelRatio, handle window resize).
- Behind the canvas: a CSS radial-gradient glow (soft white/amber halo) that slowly pulses, plus a subtle grain overlay.
- Text:
  - Headline: **"See the World Differently."**
  - Sub: "Premium shades. Crafted for your style."
  - Button: "Explore Collection" (smooth-scrolls to products)
  - Headline splits into letters/words and animates in on load. As the user scrolls, the text fades/moves away so the sunglasses become the focus, then a second line appears mid-scroll (e.g. "100% UV400. Zero compromise.").
- **Hero to Product transition:** at the end of the pin, the canvas scales down (about 0.6), moves up/down toward where the product viewer sits, and fades out while the product section fades in, so it feels like the sunglasses moved into the next section.
- **Mobile:** use fewer frames (every 2nd frame) and smaller canvas resolution. If `prefers-reduced-motion` is on, show a single static frame with no scrubbing.

### 6.4 Feature Strip
- Horizontal marquee or 4-column row: **100% UV400, Polarized Lenses, Lightweight Frame, 1 Year Warranty**.
- Icons (lucide-react), reveal on scroll with stagger.

### 6.5 Product Showcase (second most important)
- Large central stage showing the selected product PNG with:
  - A colored glow behind it that **changes with the selected product** (each product has its own `glowColor` in `siteData.js`)
  - A soft floor shadow/reflection (CSS only)
  - Mouse-move parallax + 3D tilt (on mobile: gentle auto-float)
  - Continuous slow floating animation
- Color/variant selector: round swatches (Black, Gold, Silver, Brown Tortoise, Green).
- When a swatch is clicked:
  - The current product animates out (scale down + rotate + fade).
  - The new product animates in (`scale 0.6 -> 1`, `rotateY` spin, slight blur to sharp) with a GSAP timeline.
  - Background glow color, product name, price, and description cross-fade to the new values.
  - Only the product changes; the rest of the page stays static.
- Details panel: product name, price, short description, specs (frame material, lens type, UV protection), and an **"Enquire on WhatsApp"** button that opens `https://wa.me/<number>?text=<prefilled message with the product name>`.
- Below the stage: a grid of **Product Cards** (tilt + spotlight-follows-cursor hover effect). Clicking a card selects that product in the showcase and scrolls to it.

### 6.6 Lens Technology
- Section with 3 to 4 lens types (Polarized, Photochromic, Blue-cut, Prescription) as interactive cards.
- Include a **before/after drag slider** (glare vs polarized) using placeholder images.

### 6.7 Lookbook
- Gallery with parallax images (different scroll speeds), hover zoom, and a lightbox on click.

### 6.8 Testimonials
- Auto-sliding carousel with customer name, city, and a short quote. Pause on hover.

### 6.9 Store and Contact
- Address, opening hours, phone, Instagram link, WhatsApp button.
- Embedded Google Map (iframe, URL from `siteData.js`).
- Simple contact form UI (name, phone, message) that opens WhatsApp with the message prefilled (no backend).

### 6.10 Footer
- Brand, quick links, social icons, "Website by SanPuRO".

## 7. Animation and Interaction Rules

- Initialize Lenis once and connect it to ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` and drive Lenis from `gsap.ticker`).
- Section headings reveal on scroll (split text, fade-up, stagger).
- Use `gsap.context()` inside `useEffect` and clean up properly (kill ScrollTriggers and the ticker on unmount) so there are no React StrictMode double-run bugs.
- Buttons: magnetic hover effect on primary CTAs.
- Custom cursor (small dot with a ring) on desktop only. Hide on touch devices.
- Keep everything at 60fps: only animate `transform` and `opacity`, use `will-change` carefully, and don't re-render React components on every scroll tick (use refs, not state, for the frame index).

## 8. Performance and Quality Requirements

- Fully responsive (320px to 1920px), mobile-first.
- Lazy-load every image except the hero frames and first product.
- Total hero frames should be under ~15MB. Show a warning in the console if the frame count is above 180.
- Lighthouse targets: Performance 80+ on desktop, Accessibility 90+.
- Semantic HTML, alt text on all images, visible keyboard focus states, `prefers-reduced-motion` respected.
- No console errors or warnings.
- Clean, commented code. Small components. Meaningful names.

## 9. `siteData.js` Shape (follow this)

```js
export const site = {
  brand: "VANTA Optics",
  tagline: "See the World Differently.",
  subtitle: "Premium shades. Crafted for your style.",
  accent: "#e8a24a",
  whatsapp: "919999999999",
  instagram: "https://instagram.com/yourshop",
  address: "Shop No. 12, Main Market, Gorakhpur",
  hours: "Mon-Sun, 10:00 AM - 9:00 PM",
  mapEmbedUrl: "",
};

export const hero = { framePath: "/frames/frame_", frameCount: 120, frameExt: "webp", padLength: 4 };

export const features = [
  { icon: "Shield", title: "100% UV400", text: "Full protection from harmful rays" },
  // ...
];

export const products = [
  {
    id: "black-wayfarer",
    name: "Noir Wayfarer",
    price: 1999,
    colorName: "Matte Black",
    swatch: "#111111",
    glowColor: "#ffffff",
    image: "/products/black-wayfarer.png",
    description: "Classic wayfarer silhouette with glossy black lenses.",
    specs: { frame: "Acetate", lens: "Polarized", uv: "UV400" },
  },
  // gold-aviator, silver-round, brown-tortoise, green-wayfarer
];

export const lensTypes = [/* ... */];
export const testimonials = [/* ... */];
export const lookbook = [/* ... */];
```

## 10. Output Expectations

1. Give the **complete code for every file**, no "rest of the code here" shortcuts.
2. Give exact terminal commands to create the project and install packages (`npm create vite@latest`, Tailwind setup, `npm i gsap lenis lucide-react`).
3. Add a short **README** explaining: where to drop the frames, how to change the content, how to change colors, how to deploy on Vercel/Netlify.
4. Use temporary placeholder assets (gray boxes or generated gradient canvas frames) so the project runs even before my real assets are added.
5. At the end, list **5 ideas** to upgrade this demo (e.g. real 3D model with React Three Fiber, WebGL shaders, sound).

## Build Order (if you run out of tokens, do this in phases)

- **Phase 1:** project setup, Tailwind, Lenis + GSAP wiring, `siteData.js`, Navbar, Loader, Footer
- **Phase 2:** HeroScroll (canvas frame sequence, text animation, hero-to-product transition)
- **Phase 3:** ProductShowcase + ProductCard (variant switching, glow color change, tilt, WhatsApp button)
- **Phase 4:** FeatureStrip, LensTech, Lookbook, Testimonials, StoreContact
- **Phase 5:** responsive polish, mobile fallback, reduced-motion, performance cleanup, README

Start with **Phase 1** and wait for me to say "next" before continuing.
