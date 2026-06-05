# NM Bau — Homepage Project Brief
> Read this file EVERY time before responding to any prompt in this project.

---

## Who is the client

**NM Bau** is a premium bathroom and property renovation company based in Sopron, Hungary. Operated since 2020. They work with a small, curated team of specialists — plumber, tiler, electrician, stonemason — and coordinate everything under one roof. They are **not cheap**. They charge more than competitors and deliver higher precision. That positioning must be visceral in the design.

**Core service (primary):** Komplett fürdőszoba felújítás — complete bathroom renovation, end-to-end project management included.

**Secondary services:**
- Ingatlan felújítás (property renovation)
- Falpanel kivitelezés (wall panel installation)

**Do NOT reference:** generálkivitelezés (general contracting), bérbeadás (rental). These are excluded.

**Contact:**
- Phone: +36 20 254 6624
- Email: nmbau@nmbau.hu
- Website: www.nmbau.hu

**Key USPs:**
- 2 éves munkagarancia (2-year work guarantee)
- One contractor manages everything — no coordination chaos for the client
- Premium quality materials, personal consultation
- Precision work — "a precíz munka a mi védjegyünk"
- On-site visit → detailed quote → execution

---

## What you are building

**Scope: Home page only.** One HTML file. No other pages.

Language: **Hungarian only.**

This is a pitch mockup. The developer (Pirint) is showing this to the client to win their business. It must look so far above what the client currently has that they feel embarrassed about their old site. The goal is to win a deal worth significantly more later (AI quoting widget). The website itself is free — it is a Trojan horse.

**There is no real content yet.** Use placeholder copy that is coherent and professional. Real photos, testimonials, and copy will come in a later phase. Use placeholder images intelligently — reference real image slots with descriptive alt tags.

---

## Design Direction

**Aesthetic:** Dark premium charcoal. Architectural minimalism with weight.

**Palette:**
```css
--color-bg: #111111;
--color-surface: #1a1a1a;
--color-surface-raised: #222222;
--color-accent: #2590f4;
--color-accent-muted: rgba(37, 144, 244, 0.12);
--color-text-primary: #f5f5f5;
--color-text-secondary: #a0a0a0;
--color-border: rgba(255, 255, 255, 0.08);
--color-gold: #c8a96e;
```

**Typography:**
- Display / headings: `Playfair Display` or `DM Serif Display` — serif for gravitas
- Body: `DM Sans` or `Outfit` — clean, modern
- Load from Google Fonts

**Motion:** Framer Motion for all entrance animations. Every section fades + slides in on scroll. Stagger children. No bouncing, no playfulness — only confident, slow reveals (0.6s–0.9s ease-out).

**Logo:** The NM Bau logo is a minimal house icon in black/white. Use text-based or SVG recreation in the nav — white version on dark background. Do NOT use the old site's blue nav.

**Feel:** Like a high-end architecture firm's website. Sparse. Confident. Sections have breathing room. No clutter.

**Reference aesthetic direction:** Cormack Developments, luxury Swiss construction firms, premium interior studio sites.

---

## Homepage Sections (in order)

### 1. Sticky Nav
- Logo left (SVG house icon + "NM BAU" text, white)
- Links right: Szolgáltatások | Folyamat | Referenciák | Kapcsolat
- On scroll: nav gets subtle backdrop blur + border-bottom
- Hamburger on mobile

### 2. Hero
- Full viewport height
- Background: very dark, with a subtle overlay on a high-quality bathroom image (placeholder for now)
- Headline (large, serif): "Fürdőszobád legyen olyan, mint amilyet mindig is akartál."
- Subline: "Komplett fürdőszoba felújítás — egy kézben, a felméréstől az átadásig."
- CTA button: **"Azonnali árajánlat kérése"** — this is the primary CTA everywhere. Style: filled blue (#2590f4), no border-radius overkill — 4px max, uppercase tracking.
- Secondary CTA: "Referenciáink megtekintése" — ghost/outline version
- Animate: headline word-by-word stagger in, CTAs fade in after

### 3. Trust Bar
- Thin horizontal strip below hero
- 4 stats/trust signals, separated by vertical lines:
  - "5+ év tapasztalat"
  - "2 év munkagarancia"
  - "Sopron és környéke"
  - "Egyetlen felelős kivitelező"
- Clean, muted — white text on dark surface

### 4. Services
- Section title: "Mivel foglalkozunk"
- 3 cards in a row (or stacked on mobile):
  1. **Komplett fürdőszoba felújítás** — icon: bathtub or tiles. Description: end-to-end project, all trades coordinated, premium materials.
  2. **Ingatlan felújítás** — icon: building/house. Description: full property interior renovation.
  3. **Falpanel kivitelezés** — icon: wall/layers. Description: precision wall panel installation.
- Cards: dark surface, thin blue left-border accent, hover lifts subtly
- Each card has a "Többet megtudok" ghost link (no navigation yet — it's a mockup)

### 5. Why NM Bau (differentiators)
- Section title: "Miért mi?"
- Layout: Left side large serif pull quote, right side 4 bullet-style points
- Pull quote: *"Nem csak felújítunk — a projektet az elejétől a végéig kézben tartjuk."*
- Points:
  - ✦ Minden szakma egy kézben — nincs koordinációs káosz
  - ✦ 2 éves munkagarancia minden munkánkra
  - ✦ Prémium anyagok, személyes anyagválasztási tanácsadás
  - ✦ Helyszíni felmérés és részletes árajánlat — ingyen
- Use a subtle thin accent line or gold dot (--color-gold) before each point

### 6. Process (How it works)
- Section title: "Hogyan dolgozunk"
- 4 steps, horizontal on desktop, vertical on mobile:
  1. Helyszíni szemle — "Felmérjük az igényeket és a helyszínt"
  2. Árajánlat — "Részletes, átlátható költségtervet küldünk"
  3. Kivitelezés — "Szakembereink precízen, ütemezetten dolgoznak"
  4. Átadás — "Ellenőrzés, garanciavállalás, kulcsátadás"
- Number each step with large, faded numerals behind the step title
- Animate steps in one-by-one on scroll

### 7. Portfolio Teaser
- Section title: "Néhány munkánkból"
- Placeholder grid: 2 rows × 3 columns of image placeholders
- Each placeholder: dark grey box with label like "Fürdőszoba felújítás — Sopron, 2024"
- Below grid: CTA button "Összes referencia megtekintése" (disabled/placeholder for now)
- Note in code comment: `<!-- Real photos to be inserted here in Phase 2 -->`

### 8. CTA Banner
- Full-width dark-blue tinted section (#0d1f35 or similar)
- Headline: "Kész az azonnali árajánlatra?"
- Subline: "Töltse ki a kérdőívünket, és perceken belül tudja, mibe kerül a felújítás."
- Big CTA button: "Azonnali árajánlat kérése" (links to #contact for now)
- Note in comment: `<!-- This button will connect to the AI quoting widget in Phase 2 -->`

### 9. Contact
- Section title: "Lépjen kapcsolatba"
- 2 columns: left side contact info (phone, email, area served), right side a simple placeholder form (Name, Phone, Message, Submit)
- The form submits nowhere for now — it's visual only
- Below: "Vagy hívjon közvetlenül: +36 20 254 6624" — make the number large and tappable

### 10. Footer
- Logo + tagline: "NM Bau — Szeretünk építeni."
- Nav links
- "© 2025 NM Bau. Minden jog fenntartva."

---

## Technical Rules

- **Stack:** Vanilla HTML + CSS + JavaScript only. No frameworks, no build step.
- **Single file:** Everything in `index.html`. Inline `<style>` and `<script>` tags.
- **Framer Motion:** Load via CDN — `https://cdn.jsdelivr.net/npm/framer-motion@10/dist/framer-motion.js` — BUT since this is vanilla HTML (not React), use the **Framer Motion for DOM** API (`motion` global). If CDN is unavailable or version conflicts, fall back to pure CSS `@keyframes` + `IntersectionObserver` for scroll-triggered animations. Never break the layout over animation library issues.
- **Fonts:** Load from Google Fonts in `<head>`.
- **Images:** Use `background-color: #2a2a2a` placeholder divs with `aspect-ratio` set. Add descriptive `alt` attributes and `data-placeholder` comment for Phase 2.
- **Mobile first:** Fully responsive. Test mentally at 375px, 768px, 1280px.
- **No contact form logic:** Form is visual only. No JS validation, no fetch.
- **Performance:** No unnecessary dependencies. Keep it lean.
- **Code comments:** Mark every placeholder with `<!-- PHASE 2: ... -->` so replacements are obvious.

---

## Skills to invoke (say this at the start of your first prompt)

> "Please read and apply the frontend-design skill from your skills directory before starting."

If Claude Code has MCP/skills configured, reference:
- `frontend-design` — for aesthetic decisions, layout, typography, motion
- `context7` — for accurate Framer Motion DOM API documentation if available

---

## What NOT to do

- Do not use Inter, Roboto, or Arial
- Do not use purple gradients or generic SaaS aesthetics
- Do not use light background — the entire site is dark
- Do not make it look like a WordPress template
- Do not add pages — home page only
- Do not reference generálkivitelezés or bérbeadás anywhere
- Do not use any color outside the defined palette without a strong reason
- Do not skip mobile responsiveness
- Do not make animations bouncy or cartoonish

---

## Phase 2 (not now — just be aware)

- Real photos injected
- Real testimonials
- Contact form wired to email
- AI quoting widget (chat interface) connected to the "Azonnali árajánlat kérése" CTA
- Additional pages: Szolgáltatások, Referenciák, Kapcsolat

---

*Last updated: 2025. This file is the source of truth. When in doubt, re-read it.*
