# WAKAPAY marketplace — product image prompts

Use these prompts in Midjourney, DALL·E, Flux, Ideogram, etc. to generate **square product hero images** for the demo store.

## Global settings (apply to every image)

| Setting | Value |
|--------|--------|
| Aspect ratio | **1:1** (square) — matches `aspect-square` product cards |
| Resolution | **1024×1024** minimum (export @2x if your tool allows) |
| Background | Soft off-white `#FAFAFA` or very light pink-to-blue gradient wash |
| Brand accents | Subtle **hot pink / magenta** (`#E91E8C` range) + **electric blue** (`#3B82F6` range) — never dominant neon |
| Style | Clean fintech marketplace photography; soft studio lighting; minimal props; no clutter |
| Mood | Trustworthy, modern, light theme, professional — not crypto-bro, not dark mode |
| Text in image | **Avoid** readable text, logos, and UI screenshots (hard for generators; add in Figma if needed) |

### Shared suffix (append to each prompt)

```
, square composition, centered subject, soft studio lighting, light off-white background with subtle pink and blue gradient accents, clean fintech ecommerce product photo, high detail, photorealistic or premium 3D render, no text, no watermark, no logo, 1:1 aspect ratio
```

### Shared negative prompt

```
dark background, black background, neon cyberpunk, cluttered scene, harsh shadows, cartoon, low quality, blurry, distorted hands, readable text, watermark, stock photo watermark, multiple products, busy collage, stripe purple branding, generic crypto coins pile
```

### Suggested filenames

Save as `public/products/{id}.webp` (or `.jpg`), then set `image: "/products/{id}.webp"` in `lib/products.ts`.

---

## Donation

### `donate-developer` — Support the developer

**Filename:** `donate-developer.webp`

**Prompt:**

```
Heartfelt developer support concept: open laptop on a clean desk showing blurred code editor, small potted plant, warm mug nearby, soft pink heart-shaped glow or ribbon accent suggesting gratitude, one-time donation vibe, indie maker aesthetic, welcoming and human

(+ append **Global suffix** from above)
```

---

### `donate-project` — Sponsor our open-source SDK

**Filename:** `donate-project.webp`

**Prompt:**

```
Open-source sponsorship concept: abstract network of connected nodes and package boxes floating above a laptop, green growth sprout merged with circuit lines, community collaboration metaphor, subtle blue tech accents, clean minimal 3D illustration style

(+ append **Global suffix** from above)
```

---

### `donate-cause` — Climate tech grant pool

**Filename:** `donate-cause.webp`

**Prompt:**

```
Climate tech donation pool: stylized earth globe with soft atmospheric glow, small saplings and clean energy wind turbine silhouettes, gentle green and sky-blue palette with faint pink accent, hopeful environmental fintech mood, premium minimal render

(+ append **Global suffix** from above)
```

---

## Tips

### `tip-coffee` — Buy me a coffee

**Filename:** `tip-coffee.webp`

**Prompt:**

```
Creator economy coffee tip: artisan latte in ceramic cup on light wood coaster, steam rising, small coins or digital tip jar metaphor with soft pink heart sparkle, cozy streamer desk setup blurred in background, warm morning light

(+ append **Global suffix** from above)
```

---

### `tip-shoutout` — Live stream shoutout

**Filename:** `tip-shoutout.webp`

**Prompt:**

```
Live stream shoutout perk: professional USB microphone with soft RGB ring light in pink and blue, headphones on stand, blurred monitor glow suggesting chat overlay, energetic but clean creator studio, no readable screen content

(+ append **Global suffix** from above)
```

---

## Digital

### `digital-ui-kit` — WAKAPAY UI kit (Figma)

**Filename:** `digital-ui-kit.webp`

**Prompt:**

```
Digital design product: floating UI component cards and buttons in pink-to-blue gradient style, abstract wireframe panels and design tokens swatches, Figma-style layers metaphor without readable labels, glassmorphism cards, instant download digital goods aesthetic

(+ append **Global suffix** from above)
```

---

### `digital-api-credits` — API credit bundle — 10k calls

**Filename:** `digital-api-credits.webp`

**Prompt:**

```
API credits bundle: glowing server rack cube or API endpoint symbol made of light, lightning bolt merged with data stream lines, electric blue primary accent with pink highlights, developer sandbox energy, abstract tech product packshot

(+ append **Global suffix** from above)
```

---

### `digital-ebook` — Crypto checkout playbook (PDF)

**Filename:** `digital-ebook.webp`

**Prompt:**

```
Digital ebook product: closed premium book or tablet displaying abstract checkout flow diagram with lock and checkmark icons, no readable words, merchant implementation guide mood, navy and pink accent spine, instant PDF delivery aesthetic

(+ append **Global suffix** from above)
```

---

## Subscription

### `sub-starter` — Merchant Starter — monthly

**Filename:** `sub-starter.webp`

**Prompt:**

```
SaaS subscription starter tier: simple pricing card pedestal with recurring circular arrow icon, small merchant storefront icon, monthly billing metaphor, friendly approachable fintech, pink and blue gradient edge lighting on white card

(+ append **Global suffix** from above)
```

---

### `sub-growth` — Merchant Growth — monthly

**Filename:** `sub-growth.webp`

**Prompt:**

```
SaaS growth subscription: ascending bar chart merged with payment terminal and webhook nodes, team seats represented as three subtle user silhouettes, scale-up merchant mood, stronger blue accent with pink highlights, premium B2B fintech

(+ append **Global suffix** from above)
```

---

## Physical goods

### `physical-sweat` — Trail sweatshirt

**Filename:** `physical-sweat.webp`

**Prompt:**

```
Ecommerce product shot: folded heather gray trail sweatshirt on seamless light background, outdoor adventure texture, subtle embroidered tag area blank, soft shadow beneath, catalog apparel photography, natural fibers visible

(+ append **Global suffix** from above)
```

---

### `physical-tote` — Canvas tote

**Filename:** `physical-tote.webp`

**Prompt:**

```
Ecommerce product shot: natural canvas tote bag standing upright with reinforced handles, minimal blank front panel for branding, farmers market aesthetic, clean white studio, soft daylight

(+ append **Global suffix** from above)
```

---

### `physical-mug` — Ceramic camp mug

**Filename:** `physical-mug.webp`

**Prompt:**

```
Ecommerce product shot: matte ceramic camp mug 12oz, speckled glaze, enamel rim, outdoor camping vibe with small pine branch prop, limited edition craft feel, centered hero on light gray background

(+ append **Global suffix** from above)
```

---

## Services

### `service-review` — 1-hour integration review

**Filename:** `service-review.webp`

**Prompt:**

```
Professional services: video call consultation concept, laptop with abstract video tiles, checklist clipboard and wrench-tool icon for integration audit, solutions engineer desk, trustworthy B2B fintech, calendar hour metaphor with subtle clock

(+ append **Global suffix** from above)
```

---

### `service-onboarding` — Merchant onboarding package

**Filename:** `service-onboarding.webp`

**Prompt:**

```
Merchant onboarding service: rocket launching from checklist document, KYC shield icon, test transaction checkmarks, go-live runway metaphor, enterprise handshake energy, pink and blue gradient trail, premium consulting package visual

(+ append **Global suffix** from above)
```

---

## Tickets

### `ticket-webinar` — WAKAPAY builder webinar — seat

**Filename:** `ticket-webinar.webp`

**Prompt:**

```
Event ticket webinar: single premium event pass card with perforated edge, play button and headset icons, virtual classroom seats in soft bokeh background, builder workshop mood, pink-to-blue holographic foil effect on card edge, no readable text

(+ append **Global suffix** from above)
```

---

### `ticket-conference` — Fintech builders day — pass

**Filename:** `ticket-conference.webp`

**Prompt:**

```
Conference pass lanyard and badge on light background, large venue silhouette blurred behind, fintech builders day energy, keynote stage lights, professional attendee credential, blue dominant with pink accent stripe, no legible printing

(+ append **Global suffix** from above)
```

---

## Membership

### `member-community` — Builders Circle — annual

**Filename:** `member-community.webp`

**Prompt:**

```
Community membership: circle of diverse professional avatars as abstract silhouettes around a glowing hub, private community metaphor, annual membership crown or ring badge, collaborative builders mood, warm inclusive fintech

(+ append **Global suffix** from above)
```

---

### `member-pro` — Merchant Pro lounge

**Filename:** `member-pro.webp`

**Prompt:**

```
Exclusive merchant lounge membership: velvet-rope VIP lounge chair with star badge, compliance document folder and benchmark graph icons, partner network nodes, premium pro tier aesthetic, subtle gold hints with pink-blue brand lighting

(+ append **Global suffix** from above)
```

---

## Quick reference

| ID | Category | File |
|----|----------|------|
| `donate-developer` | Donation | `public/products/donate-developer.webp` |
| `donate-project` | Donation | `public/products/donate-project.webp` |
| `donate-cause` | Donation | `public/products/donate-cause.webp` |
| `tip-coffee` | Tips | `public/products/tip-coffee.webp` |
| `tip-shoutout` | Tips | `public/products/tip-shoutout.webp` |
| `digital-ui-kit` | Digital | `public/products/digital-ui-kit.webp` |
| `digital-api-credits` | Digital | `public/products/digital-api-credits.webp` |
| `digital-ebook` | Digital | `public/products/digital-ebook.webp` |
| `sub-starter` | Subscription | `public/products/sub-starter.webp` |
| `sub-growth` | Subscription | `public/products/sub-growth.webp` |
| `physical-sweat` | Physical goods | `public/products/physical-sweat.webp` |
| `physical-tote` | Physical goods | `public/products/physical-tote.webp` |
| `physical-mug` | Physical goods | `public/products/physical-mug.webp` |
| `service-review` | Services | `public/products/service-review.webp` |
| `service-onboarding` | Services | `public/products/service-onboarding.webp` |
| `ticket-webinar` | Tickets | `public/products/ticket-webinar.webp` |
| `ticket-conference` | Tickets | `public/products/ticket-conference.webp` |
| `member-community` | Membership | `public/products/member-community.webp` |
| `member-pro` | Membership | `public/products/member-pro.webp` |

## After generation

1. Create folder: `mkdir -p public/products`
2. Optimize images (WebP, ~80–120 KB each if possible).
3. Update each product in `lib/products.ts`:

   ```ts
   image: "/products/donate-developer.webp",
   ```

4. Optional: add a `.gitkeep` in `public/products/` if images are generated locally and not committed.
