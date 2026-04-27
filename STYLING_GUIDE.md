# NOVURE — AI Agent Styling Guide

> Panduan ini adalah **sumber kebenaran tunggal** untuk semua keputusan visual di project Novure.
> AI agent WAJIB membaca dokumen ini sebelum menulis CSS, inline style, atau JSX baru.

---

## 1. STACK & TOOLS

| Concern | Solution |
|---|---|
| Framework | Next.js (App Router) |
| Styling | **Tailwind CSS v4** + Custom CSS classes di `app/globals.css` |
| Animation | **Framer Motion** (`motion`, `useScroll`, `useTransform`, `useSpring`, `useInView`) |
| Icons | **Lucide React** |
| Font | **Inter** (Google Fonts via `next/font/google`) |

> [!IMPORTANT]
> Jangan pernah menulis style Tailwind untuk hal yang sudah ada class-nya di `globals.css`. Selalu cek globals.css dulu.

---

## 2. COLOR PALETTE

### 2.1 CSS Custom Properties (`:root`)

```css
:root {
  --background: #f5f5f3;          /* Off-white warm — background terang */
  --foreground: #111111;          /* Near-black — teks utama */
  --color-primary: #9cad8f;       /* Sage Green — accent utama */
  --color-accent-purple: #9b51e0; /* Purple — glow/ambient */
  --color-accent-green: #27ae60;  /* Green — glow/ambient */
  --color-muted: #999999;         /* Gray — teks sekunder */
}
```

### 2.2 Palet Warna Berdasarkan Konteks

| Token | Value | Digunakan di |
|---|---|---|
| **Dark BG** | `#0a0a0a` | Hero, Science, StyleOutlook, Footer |
| **Light BG** | `#f5f5f3` | Essentialized section, body default |
| **White BG** | `#ffffff` | Discover section, floating cards |
| **Card BG** | `#f0f0ef` | Product card background, filter pill |
| **Primary Sage** | `#9cad8f` | Text selection, accent, color theme |
| **Purple Glow** | `rgba(155,81,224,...)` | GlowOrb di Hero & Science |
| **Green Glow** | `rgba(39,174,96,...)` | GlowOrb di Science section |

### 2.3 Warna Teks Hierarki

```
#111111               → Heading utama (light background)
#333333               → Navbar links
#555555               → Section number label
#777777               → Body text / subtitle
#999999               → Muted (sizes, secondary info)
#ffffff               → Semua teks di dark section
rgba(255,255,255,0.7) → Body text di dark
rgba(255,255,255,0.5) → Subtitle di dark
rgba(255,255,255,0.4) → Muted/caption di dark
rgba(255,255,255,0.3) → Sangat faint (hints)
```

### 2.4 Dynamic Color Theme (ColorContext)

Section `EssentializedSection` menggunakan `ColorContext` provider. `AnimatedWave` membaca `activeTheme` dari context ini.

```ts
interface Theme {
  primary: string;   // warna tee aktif (hex)
  secondary: string; // warna jeans aktif (hex)
  tertiary: string;  // background fallback — "#161616"
  accent?: string;   // optional, default = primary
}
```

Gradient title "Essentialized" menggunakan warna ini secara dinamis:
```jsx
backgroundImage: `linear-gradient(90deg, ${currentTee.color}, ${currentJeans.color})`
```

---

## 3. TYPOGRAPHY

### 3.1 Font

```css
font-family: var(--font-inter), system-ui, sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### 3.2 Skala Tipografi

| Penggunaan | Value |
|---|---|
| Giant Hero Title | `clamp(5rem, 18vw, 16rem)` · weight 700 · spacing -0.06em · lh 0.85 |
| Giant Section Title | `clamp(5rem, 15vw, 18rem)` · weight 800 · spacing -0.06em · lh 0.85 |
| Section Heading H2 | `clamp(3rem, 7vw, 7rem)` · weight 700 · spacing -0.04em |
| Section Heading H2 (SM) | `clamp(3rem, 6vw, 6rem)` · weight 700 · spacing -0.04em |
| Discover Left H3 | `3.5rem` · weight 800 · lh 1.05 · spacing -0.04em |
| Filter Bar H2 | `2.5rem` · weight 800 · spacing -0.03em |
| Brand Logo | `1.4rem` · weight 700 · spacing -0.03em |
| Footer Brand | `1.6rem` · weight 700 · spacing -0.03em |
| Feature Card Title | `1.2rem` · weight 600 |
| Product Card Name | `1rem` · weight 700 · lh 1.3 |
| Product Card Price | `1.3rem` · weight 800 · spacing -0.02em |
| Body / Desc | `0.85–1.1rem` · lh 1.6–1.7 |
| Nav Link | `0.9rem` · weight 500 |
| Section Label | `0.8rem` · spacing 0.15em · uppercase |
| Pill / Tag | `0.82rem` · weight 500 |
| Corner Label | `0.8rem` · weight 500 · spacing 0.05em |
| Progress Text | `0.7rem` · font-family monospace |

### 3.3 Gradient Text

```css
/* Static (Essentialized default) */
background: linear-gradient(180deg, #1a1a1a 0%, #999 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

---

## 4. DESIGN SYSTEMS

### 4.1 Neumorphism (Product Card)

Dipakai di `.product-card-image` — **hanya di background terang**.

```css
/* Default */
box-shadow:
  6px 6px 12px rgba(0, 0, 0, 0.06),
  -6px -6px 12px rgba(255, 255, 255, 0.8);

/* Hover */
box-shadow:
  10px 10px 20px rgba(0, 0, 0, 0.1),
  -10px -10px 20px rgba(255, 255, 255, 0.9);
```

> [!IMPORTANT]
> Neumorphism hanya pada background `#f0f0ef` atau `#f5f5f3`. JANGAN di dark background.

### 4.2 Glassmorphism

```css
/* Floating card */
background: rgba(255, 255, 255, 0.85);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.5);
border-radius: 1.2rem;

/* Navbar */
background: rgba(245, 245, 243, 0.92);
backdrop-filter: blur(20px);
border-bottom: 1px solid rgba(0, 0, 0, 0.05);

/* Dark glass button */
background: rgba(30, 30, 30, 0.9);
backdrop-filter: blur(20px);
```

### 4.3 Gradient Mesh Wave (AnimatedWave)

Container blob:
```css
filter: blur(90px) saturate(150%);
transform: translateZ(0); /* hardware acceleration */
```

Blob mix-blend-modes:
```
blob 1 & 2 → mixBlendMode: "screen"
blob 3     → mixBlendMode: "multiply"
blob 5     → mixBlendMode: "overlay"
```

Grain overlay di atas wave:
```css
opacity: 0.15;
backgroundImage: url('data:image/svg+xml; ... feTurbulence baseFrequency="0.85" ...');
mixBlendMode: "overlay";
```

### 4.4 Noise Texture (Science Section)

```css
opacity: 0.05;
backgroundImage: url('data:image/svg+xml; ... feTurbulence type="fractalNoise" baseFrequency="0.65" ...');
```

### 4.5 Dot Grid (Hero Background)

```css
backgroundImage: radial-gradient(circle at center, rgba(255,255,255,0.015) 1px, transparent 1px);
backgroundSize: 50px 50px;
```

---

## 5. LAYOUT PATTERNS

### 5.1 Section Background Sequence

```
Hero          → #0a0a0a (dark)
Essentialized → #f5f5f3 (light warm)
Discover      → #ffffff (white)
Science       → #0a0a0a (dark)
StyleOutlook  → #0a0a0a (dark)
Footer        → #0a0a0a (dark)
```

> [!NOTE]
> Pola dark → light → white → dark membuat kontras visual yang kuat.

### 5.2 Spacing System

```
Section padding (large): 8vw 3rem 5vw
Section padding (standard): 5rem 3rem
Navbar padding: 1.5rem 3rem
Content gaps: 1rem / 1.5rem / 2rem / 3rem
Max content width: 1200px
Footer max content: 1000px
```

### 5.3 Bento Grid

```css
.bento-grid-container {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1.5rem;
  height: 75vh;
}
/* Kolom kiri dan kanan bergerak parallax berlawanan arah */
```

### 5.4 Discover Layout

```css
.discover-content { display: flex; gap: 3rem; }
.discover-left { flex: 0 0 280px; position: sticky; top: 6rem; }
.discover-right { flex: 1; overflow-x: auto; scroll-snap-type: x mandatory; }
```

### 5.5 Infinite Marquee

```css
/* Container */ overflow: hidden;
/* Track */ display: flex; gap: 3rem; width: max-content;
/* Item */ width: 320px; flex-shrink: 0;
```

---

## 6. BORDER RADIUS

| Context | Value |
|---|---|
| Card utama (wave, bento, product) | `1.5rem` |
| Floating product card | `1.2rem` |
| Pill/button | `9999px` |
| Pill nav button | `2rem` |
| Carousel nav button | `50%` |
| Scrollbar thumb | `3px` |
| Scroll indicator | `11px` |

---

## 7. BOX SHADOW

| Context | Value |
|---|---|
| Wave container | `0 20px 60px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.04)` |
| Floating card default | `0 8px 30px rgba(0,0,0,0.08)` |
| Floating card hover | `0 16px 50px rgba(0,0,0,0.15)` |
| CTA button | `0 8px 30px rgba(0,0,0,0.2)` |
| CTA button hover | `0 12px 40px rgba(0,0,0,0.3)` |
| Carousel nav circle | `0 4px 16px rgba(0,0,0,0.15)` |
| Search focus | `0 4px 12px rgba(0,0,0,0.06)` |
| Product card (neumorphism) | `6px 6px 12px rgba(0,0,0,0.06), -6px -6px 12px rgba(255,255,255,0.8)` |
| Product card hover | `10px 10px 20px rgba(0,0,0,0.1), -10px -10px 20px rgba(255,255,255,0.9)` |
| Cursor trail | `drop-shadow(0 10px 30px rgba(0,0,0,0.4))` |
| Marquee images | `drop-shadow(0 10px 20px rgba(0,0,0,0.5))` |

---

## 8. ANIMATION SYSTEM

### 8.1 Easing Curves

```js
[0.16, 1, 0.3, 1]           // Primary — "expo out" — semua animasi masuk
[0.25, 0.46, 0.45, 0.94]    // Secondary — smooth ease-in-out
"easeInOut"                  // Standard framer
"easeOut"                    // Hover feedback
"linear"                     // Marquee, rotate continuous
```

### 8.2 Duration Standar

| Context | Duration |
|---|---|
| Teks per huruf | `0.8s` |
| Card reveal | `0.9s` |
| Section element | `0.6–0.8s` |
| Hover | `0.3–0.5s` |
| Hero title | `1.5s` |
| Wave blobs | `18–30s` |
| GlowOrb | `8–15s` |
| Cursor trail | `1.8s` |
| Navbar slide | `0.6s` |
| Divider draw | `1.2s` |

### 8.3 Stagger Delay Pattern

```js
// AnimatedText (huruf)
delay: baseDelay + i * 0.03

// Cards
delay: index * 0.15

// Filter pills
delay: 0.1 + i * 0.08

// Footer columns
delay: 0.1 + ci * 0.1

// Essentialized title letters
delay: i * 0.04
```

### 8.4 Scroll Parallax Setup

```js
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start end", "end start"],
});

const y = useSpring(
  useTransform(scrollYProgress, [0, 1], [100, -80]),
  { stiffness: 50, damping: 20 }
);
```

Spring defaults: `stiffness: 50–80`, `damping: 20`

### 8.5 Entry Animations

```jsx
// Standard — dari bawah
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}

// Card — dengan rotasi
initial={{ opacity: 0, y: 80, rotateY: -5 }}
whileInView={{ opacity: 1, y: 0, rotateY: 0 }}

// Dari samping
initial={{ opacity: 0, x: 30 }}
whileInView={{ opacity: 1, x: 0 }}

// Line draw
initial={{ scaleX: 0 }}
whileInView={{ scaleX: 1 }}
style={{ transformOrigin: "left" }}

// Section label dari kiri
initial={{ opacity: 0, x: -20 }}
whileInView={{ opacity: 0.5, x: 0 }}
```

### 8.6 Hover Interactions

```jsx
// Button scale
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.97 }}

// Arrow circle — rotate on hover
// CSS: .buy-now-btn:hover .arrow-circle { transform: rotate(45deg); }

// Nav link underline — CSS
// .main-navbar a::after { width: 0; transition: width 0.4s ... }
// .main-navbar a:hover::after { width: 100%; }

// Product card lift
// .product-card:hover .product-card-image { transform: translateY(-6px); }
```

### 8.7 GlowOrb Pattern

```jsx
animate={{
  x: [0, 20, -15, 0], y: [0, -25, 15, 0],
  scale: [1, 1.2, 0.9, 1], opacity: [0.15, 0.3, 0.15],
}}
transition={{ duration: 8–15, repeat: Infinity, ease: "easeInOut" }}
style={{
  borderRadius: "50%",
  background: `radial-gradient(circle, ${color}, transparent 70%)`,
  filter: `blur(${blur}px)`,
  pointerEvents: "none",
}}
```

### 8.8 Cursor Trail

- Spawn tiap **150ms** saat mouse bergerak
- Setiap item float naik 30px lalu fade dalam **1.8s**
- `mixBlendMode: "lighten"` di dark background
- Max **12 item** aktif sekaligus

### 8.9 Infinite Marquee

```jsx
// Array di-duplicate untuk seamless loop
animate={{ x: ["-50%", "0%"] }}
transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
```

### 8.10 Floating Bob

```jsx
animate={{ y: [0, -12, 0] }}
transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
```

### 8.11 Footer Scale

```jsx
const rawScale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
const scale = useSpring(rawScale, { stiffness: 60, damping: 20 });
// <motion.footer style={{ scale }}>
```

---

## 9. COMPONENT PATTERNS

### 9.1 CTA Button (Pill)

```css
padding: 0.75rem 1.5rem;
border-radius: 9999px;
font-weight: 600;
font-size: 0.82–0.85rem;
gap: 0.8rem;

/* Arrow circle */
width: 28px; height: 28px;
border-radius: 50%;
background: #fff; color: #111;
/* → rotate(45deg) on hover */
```

### 9.2 Filter Pill

```css
padding: 0.5rem 1.2rem;
border-radius: 9999px;
font-size: 0.82rem; font-weight: 500;
background: #f0f0ef;
border: 1px solid #e0e0de;
```

### 9.3 Section Label

```jsx
// Format: "/02" atau "/02 — Label"
fontSize: "0.8rem"
letterSpacing: "0.15em"
textTransform: "uppercase"
// color: "#111" di light, "rgba(255,255,255,0.4)" di dark
```

### 9.4 Carousel Nav Buttons

```jsx
width: 54, height: 54
borderRadius: "50%"
background: "#fff"
boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
```

### 9.5 Scroll Indicator (Mouse Icon)

```jsx
// Outer: width:22, height:34, borderRadius:11
// Inner dot: animate bounce + fade, duration:2s, repeat:Infinity
```

### 9.6 Pill Nav (StyleOutlook)

```css
.pill-btn { border-radius: 2rem; border: 1px solid rgba(255,255,255,0.3); }
.pill-btn.active { background: #fff; color: #000; font-weight: 500; }
```

### 9.7 Sticky Navbar

```jsx
// Muncul setelah scroll > 85vh hero
// Background berubah opacity setelah scroll > 100vh
background: scrolled
  ? "rgba(245,245,243,0.92)"
  : "rgba(245,245,243,0.8)"
backdropFilter: "blur(20px)"
```

### 9.8 Product Card (Neumorphism)

```jsx
// Container: perspective: 800px (untuk rotateY entry)
// Image: border-radius 1.5rem, aspect-ratio 3/4, bg #f0f0ef
// Hover overlay shine:
background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)"
```

---

## 10. SCROLLBAR & SELECTION

```css
/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0a0a0a; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }

/* Selection */
::selection { background: rgba(156, 173, 143, 0.4); color: #111; }
```

---

## 11. Z-INDEX LAYER MAP

| z-index | Elemen |
|---|---|
| 1 | Dot grid, GlowOrb |
| 2–5 | Wave container, noise, marquee |
| 9 | CursorTrail mouse capture |
| 10–15 | Hero title, cursor trail items |
| 20 | Floating controls, scroll indicator |
| 30 | ClothingCarousel wrapper |
| 50 | Embedded main-navbar |
| 100 | Global sticky navbar |

---

## 12. RESPONSIVE (max-width: 768px)

```css
.hero-clothes-wrapper    → width:340px; height:240px
.main-navbar             → padding: 1rem 1.5rem
.essentialized-subtitle  → flex-direction:column; gap:1rem
.wave-image-container    → height:45vh; border-radius:1.5rem
.discover-section        → padding: 3rem 1.5rem
.discover-content        → flex-direction:column
.discover-left           → position:static
.floating-product-card   → width:110px; height:140px
.bento-grid-container    → grid-template-columns:1fr; height:auto
.bento-col-left          → height:400px
.bento-card.small-card   → height:250px
```

---

## 13. ATURAN UNTUK AI AGENT

### DO ✅

- Gunakan class dari `globals.css` jika sudah ada
- Gunakan Framer Motion untuk **semua** animasi masuk/keluar/scroll
- Easing utama: `[0.16, 1, 0.3, 1]` untuk animasi masuk
- Selalu pasang `viewport={{ once: true }}` di `whileInView`
- Gunakan `useSpring` untuk smooth parallax scroll
- Semua shadow menggunakan `rgba` — tidak ada solid shadow
- Typography besar selalu `clamp()` agar fluid
- `letter-spacing: -0.04em` sampai `-0.06em` untuk heading besar
- `border-radius: 9999px` untuk pill/button
- Neumorphism shadow hanya di background `#f0f0ef` atau `#f5f5f3`
- Setiap section baru: `position: relative; overflow: hidden`

### DON'T ❌

- Jangan animasi CSS `@keyframes` — gunakan Framer Motion
- Jangan hardcode warna plain (`red`, `blue`, `green`)
- Jangan `border-radius < 1.2rem` untuk card
- Jangan animasikan tanpa `ease`
- Jangan gunakan neumorphism di dark background
- Jangan `box-shadow` dengan warna solid
- Jangan `font-weight < 500` untuk teks yang tampil

---

## 14. CHECKLIST SECTION BARU

- [ ] Background sesuai pola alternating (dark/light)
- [ ] Ada `SectionLabel` dengan nomor urut
- [ ] Heading menggunakan `AnimatedText` (letter reveal)
- [ ] Parallax dengan `useScroll` + `useSpring`
- [ ] Entry animation `whileInView` + `viewport={{ once: true }}`
- [ ] Responsive di `@media (max-width: 768px)`
- [ ] Tidak ada horizontal scroll
- [ ] `overflow: hidden` pada container section

---

*Dibuat dari audit kode sumber Novure landing page.*
*Update dokumen ini setiap ada perubahan design system baru.*
