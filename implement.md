# ADVENTURE SAFARIS EAST AFRICA — OPENCODE MASTER UPGRADE PROMPT

You are working on the existing **Adventure Safaris East Africa** website.

Act as a:

* Senior frontend engineer
* Three.js/WebGL/WebGPU engineer
* UI/UX designer
* GSAP animation specialist
* Mobile performance engineer
* SEO engineer
* Accessibility engineer
* Conversion-focused travel website designer

Your job is NOT simply to give recommendations.

**INSPECT THE EXISTING PROJECT, MODIFY IT, INSTALL MISSING DEPENDENCIES, RUN IT, TEST IT, FIND ERRORS, FIX THEM, AND LEAVE THE PROJECT WORKING.**

The most important problem to solve is the **non-working Earth animation**.

---

# 1. FIRST: INSPECT THE EXISTING PROJECT

Before changing anything, inspect the entire project.

Look at:

* `index.html`
* `styles.css`
* `script.js`
* `README.md`
* `assets/`
* existing `package.json`
* existing Three.js code
* existing import maps
* Earth-related files
* image URLs
* CSS positioning
* JavaScript initialization

Determine exactly why the current Earth is not visible.

Check for:

* JavaScript errors
* Three.js import errors
* WebGPU initialization errors
* missing dependencies
* missing textures
* incorrect texture paths
* CORS errors
* invalid module imports
* incompatible Three.js APIs
* incorrect renderer initialization
* canvas width/height equal to zero
* canvas hidden behind another element
* incorrect `z-index`
* incorrect camera position
* incorrect clipping planes
* shader/material errors
* animation loop problems
* code executing before DOM elements exist
* browser compatibility problems
* problems caused by opening the project directly with `file://`

DO NOT assume the problem.

Find the actual problem.

---

# 2. DO NOT USE NEXT.JS JUST FOR THREE.JS

Do NOT migrate to Next.js simply because the site has a Three.js Earth.

This website is primarily a highly visual marketing/travel website.

Use:

* Vite
* Vanilla JavaScript / ES Modules
* Three.js
* GSAP
* GSAP ScrollTrigger

Optionally use:

* Lenis

ONLY if it improves scrolling without damaging accessibility or performance.

The final project should be able to produce a static production build.

Preferred architecture:

```text
HTML
CSS
JavaScript
   ↓
Vite
   ↓
Three.js
GSAP
ScrollTrigger
```

Do not introduce React, Vue, Next.js, Nuxt, or another framework unless there is a genuine technical reason discovered during implementation.

---

# 3. INSTALL THE MISSING FRAMEWORK/DEPENDENCIES

If this is currently a plain HTML project without a build system, convert it carefully to Vite.

Create `package.json` if necessary.

Install:

```bash
npm install three gsap
npm install -D vite
```

If Lenis is useful:

```bash
npm install lenis
```

Use compatible current versions.

Create scripts similar to:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Create `.gitignore`.

Do not commit `node_modules`.

---

# 4. THREE.JS EARTH — THIS IS THE MOST IMPORTANT REQUIREMENT

The Earth must become a **REAL 3D INTERACTIVE EARTH**.

It must NOT be:

* a static image
* CSS artwork
* a rotating `<img>`
* a fake sphere
* a screenshot
* an iframe
* a video pretending to be Earth

It must be rendered by Three.js.

The user specifically wants a live interactive Earth similar in quality and behavior to the Three.js Earth sample they supplied.

---

# 5. USE MODERN THREE.JS CORRECTLY

Use one consistent Three.js version.

DO NOT mix:

* old Three.js examples
* new Three.js APIs
* incompatible TSL versions
* old import maps
* CDN imports and npm imports randomly

Use the installed npm package.

For example:

```js
import * as THREE from 'three';
```

and use the appropriate Three.js addons from the installed version.

If using WebGPU APIs, use the correct API for the installed version.

---

# 6. WEBGPU + WEBGL FALLBACK

Attempt to use the modern Three.js WebGPU renderer where supported.

However, the Earth MUST NOT disappear when WebGPU is unavailable.

Implement a robust renderer strategy:

```text
Try WebGPU-capable renderer
        ↓
If unavailable/fails
        ↓
WebGL 2 renderer
        ↓
If that also fails
        ↓
High-resolution static Earth fallback
```

The rest of the website must continue working even if 3D rendering fails.

Do NOT allow a Three.js error to stop the entire site.

---

# 7. VERY IMPORTANT WEBGPU INITIALIZATION

If using:

```js
WebGPURenderer
```

follow the current Three.js API.

WebGPU initialization is asynchronous in modern Three.js.

Do NOT blindly do:

```js
const renderer = new THREE.WebGPURenderer();
```

and immediately render.

Use the correct initialization process for the installed Three.js version, including the required asynchronous initialization.

For example, if required by that version:

```js
await renderer.init();
```

Use the actual current API from the installed version.

If WebGPU initialization fails, catch the error and activate WebGL fallback.

---

# 8. CREATE A DEDICATED EARTH COMPONENT

Do not put 500 lines of Earth logic inside `index.html`.

Create a dedicated module.

For example:

```text
src/
├── main.js
├── earth/
│   ├── EarthExperience.js
│   ├── EarthRenderer.js
│   └── earthTextures.js
├── animations/
│   ├── scroll.js
│   ├── text.js
│   └── interactions.js
└── styles/
    ├── main.css
    ├── earth.css
    └── animations.css
```

You can use another clean architecture if better.

---

# 9. EARTH HTML CONTAINER

Create a dedicated section.

Example:

```html
<section id="earth-section">
    <div class="earth-content">
        ...
    </div>

    <div id="earth-stage">
        <canvas id="earth-canvas"></canvas>
    </div>
</section>
```

Do NOT randomly append the Earth canvas directly to `body`.

Make the canvas belong to a controlled container.

The container must have a reliable width and height.

---

# 10. EARTH VISUAL QUALITY

The Earth should feel premium.

Implement:

## Earth surface

Use a high-resolution Earth day texture.

It should show:

* continents
* oceans
* natural land colors
* terrain detail
* realistic shading

## Night side

Use a night Earth texture with city lights.

The night side should become visible naturally as the planet rotates relative to the light.

## Atmosphere

Create a transparent outer sphere with:

* blue atmospheric glow
* Fresnel-like edge effect
* subtle transparency
* realistic rim lighting

## Clouds

Create a separate cloud layer.

Use:

```text
Earth radius = 1
Cloud radius ≈ 1.01–1.03
Atmosphere radius ≈ 1.04–1.08
```

Clouds should rotate independently.

## Stars

Create a large deep-space star field.

Stars should remain subtle.

---

# 11. DAY/NIGHT LIGHTING

Create a directional Sun.

The Earth should clearly transition between:

```text
DAY
↓
SUNSET / TWILIGHT
↓
NIGHT
```

The night texture should become visible on the dark side.

Use realistic lighting where practical.

---

# 12. EARTH ANIMATION

The Earth should automatically rotate.

Use a smooth animation loop.

Example behavior:

```text
Page loads
   ↓
Earth slowly rotates
   ↓
User drags Earth
   ↓
Auto rotation pauses/reduces
   ↓
User releases
   ↓
Earth remains where user placed it
   ↓
After inactivity
   ↓
Slow auto rotation resumes
```

Cloud rotation should be slightly different from Earth rotation.

The atmosphere should remain visually alive.

---

# 13. EARTH INTERACTION

Desktop:

* mouse drag rotates Earth
* wheel zoom
* smooth damping
* controlled zoom limits

Mobile:

* touch drag rotates Earth
* pinch zoom
* smooth interaction
* no accidental horizontal overflow

Provide a small control interface:

```text
RESET
+
−
```

or another elegant alternative.

Add:

> Drag to explore

as a subtle UI hint.

---

# 14. RESPONSIVE EARTH

Test at:

```text
320px
375px
414px
768px
1024px
1366px
1920px
```

The Earth must remain visible.

It must never become:

* tiny
* clipped
* pushed outside viewport
* hidden behind text
* covered by navigation

Handle resize correctly:

```js
window.addEventListener('resize', ...)
```

Update:

* camera aspect
* projection matrix
* renderer size
* pixel ratio

Cap pixel ratio:

```js
Math.min(window.devicePixelRatio, 2)
```

---

# 15. EARTH DEBUGGING REQUIREMENT

If the Earth does not appear, DO NOT stop.

Perform progressive rendering tests.

First render:

```text
simple colored sphere
```

If sphere works:

```text
sphere + lighting
```

Then:

```text
sphere + Earth texture
```

Then:

```text
Earth + night texture
```

Then:

```text
Earth + clouds
```

Then:

```text
Earth + atmosphere
```

Then:

```text
Earth + stars
```

This makes it possible to identify exactly which component is breaking.

---

# 16. EARTH FALLBACK

If all WebGPU/WebGL rendering fails, display:

* high-resolution Earth image
* animated star background
* atmosphere-like CSS glow
* subtle rotation/parallax

The visitor must NEVER see an empty Earth section.

The fallback should still look intentional and premium.

---

# 17. EARTH SECTION DESIGN

Create a dramatic section titled:

# EXPLORE EAST AFRICA

or:

# YOUR NEXT ADVENTURE STARTS HERE

Use dark space styling.

Around the Earth display destination labels:

```text
UGANDA
RWANDA
KENYA
TANZANIA
SOUTH SUDAN
WESTERN CONGO
ETHIOPIA
SUDAN
```

Use floating UI labels.

Potential text:

> One region. Endless journeys.

Add subtle animated route lines or markers if practical.

The Earth section should feel like a digital travel map.

---

# 18. LOGO REDESIGN

The Adventure Safaris East Africa logo must be placed inside a premium rounded container.

Create:

* rounded rectangle/pill
* glass effect
* subtle border
* backdrop blur
* soft shadow
* proper spacing
* responsive dimensions

Example visual concept:

```text
╭──────────────────────────────╮
│   ADVENTURE SAFARIS          │
│       EAST AFRICA            │
╰──────────────────────────────╯
```

Do not stretch the logo.

Use:

```css
object-fit: contain;
```

The logo must remain sharp and professional.

On mobile, make the container smaller but still clearly visible.

---

# 19. HERO PHOTOGRAPHY

Replace poor-quality hero images.

Use high-resolution professional safari imagery.

Prefer:

* elephants
* lions
* giraffes
* gorillas
* savannah
* Serengeti
* Maasai Mara
* Uganda rainforest
* African mountains
* lakes
* safari vehicles
* dramatic sunsets

Use reputable image sources and ensure the licensing/usage is appropriate.

Prefer:

* Unsplash
* Pexels
* Wikimedia Commons where appropriate
* properly licensed image CDNs

Do not use random low-resolution images.

---

# 20. HERO PERFORMANCE

Use:

```html
srcset
sizes
```

where practical.

The first hero image should:

* load quickly
* not be lazy-loaded
* use `fetchpriority="high"`

Other images should use:

```html
loading="lazy"
```

where appropriate.

Prefer modern formats:

```text
AVIF
WebP
```

if local assets are available.

---

# 21. HERO ANIMATION

Create cinematic image transitions.

Use:

* crossfade
* zoom
* pan
* clip/wipe
* subtle parallax

Avoid abrupt image changes.

Example:

```text
Image A
↓
slow zoom
↓
text enters
↓
Image B wipes over
↓
text changes
↓
Image C fades/zooms
```

---

# 22. HERO TEXT ANIMATION

Create advanced animated typography.

Example:

```text
GO
FURTHER.

FEEL
MORE.
```

Animate each line separately.

Use:

* clip-path
* transform
* opacity
* blur
* scale
* stagger

Add a rotating phrase:

```text
SAFARI
ADVENTURE
DISCOVERY
WILDLIFE
JOURNEY
```

Words should smoothly enter and exit.

Do not make the text unreadable.

---

# 23. GSAP

Use GSAP for advanced animation.

Install:

```bash
npm install gsap
```

Use:

```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
```

Use ScrollTrigger for:

* section reveals
* text reveals
* image wipes
* parallax
* staggered cards
* progress animations
* Earth section transitions

---

# 24. WIPE ANIMATIONS

Create cinematic wipe effects.

Examples:

### Image wipe

Image starts clipped:

```css
clip-path: inset(0 100% 0 0);
```

and reveals as the user scrolls.

### Section wipe

Dark overlay moves across screen.

### Text wipe

Words reveal from behind a mask.

Use GSAP + ScrollTrigger.

---

# 25. FLOATING ANIMATIONS

Cards should subtly float.

Use small movement:

```text
Y ± 10–20px
rotation ± 1–3deg
```

Do not overdo it.

Floating elements:

* destination cards
* service cards
* icons
* decorative shapes
* Earth labels

---

# 26. FLIP ANIMATIONS

Use GSAP Flip where appropriate.

Potential uses:

* destination card expansion
* selected service card
* travel itinerary preview
* gallery item expansion

Do not use Flip animation everywhere.

Only use it where the state transition benefits from it.

---

# 27. PARALLAX

Create layered parallax:

```text
background image
      ↓
slow movement

main image
      ↓
medium movement

text
      ↓
small movement

decorative objects
      ↓
independent movement
```

Use ScrollTrigger.

Respect reduced motion.

---

# 28. PREMIUM MICRO-INTERACTIONS

Buttons:

* hover scale
* arrow movement
* glow
* magnetic effect on desktop
* press feedback on mobile

Cards:

* image zoom
* subtle tilt
* border glow
* shadow movement

Navigation:

* glass transition on scroll
* active underline
* logo container animation

---

# 29. CUSTOM CURSOR

Desktop only.

Create:

```text
outer ring
inner dot
```

When hovering buttons:

```text
cursor expands
```

When hovering special links:

```text
cursor displays small label
```

Disable on:

* touch devices
* mobile
* reduced-motion users

Never break normal pointer interaction.

---

# 30. SMOOTH SCROLL

Native scrolling must remain functional.

If Lenis is installed, integrate it properly with GSAP.

Do NOT create a custom scrolling system that breaks:

* browser back/forward
* anchor links
* keyboard navigation
* mobile scrolling
* accessibility

---

# 31. MOBILE BOTTOM NAVIGATION

Keep the mobile bottom navigation.

Use:

```text
HOME
EXPLORE
SERVICES
JOURNEY
BOOK
```

Use high-quality icons.

The active item should animate.

Respect:

```css
env(safe-area-inset-bottom)
```

so the navigation works on modern phones.

It must never cover important content.

---

# 32. DESTINATIONS

Include:

* Uganda
* Rwanda
* Kenya
* Tanzania
* South Sudan
* Western Congo
* Ethiopia
* Sudan

Each card should include:

* beautiful image
* destination
* persuasive description
* small icon
* CTA
* hover animation

Use varied entrance animations:

```text
Wipe
Float
Scale
Slide
Clip
Rotate
```

Keep the design consistent.

---

# 33. SERVICES

Include:

* Safari tours
* Tourism
* Travel transportation
* Car hire
* Hotel reservations
* Airbnb reservations
* Delivery services
* Travel consultancy

Use modern icons.

Create interactive service cards.

---

# 34. WHATSAPP BOOKING

Use:

**0761 890 792**

International:

**+256 761 890 792**

Create a dynamic booking form with:

```text
Name
Phone
Destination
Travel date
Number of travellers
Service
Budget
Message
```

On submit:

1. Validate form.
2. Construct a professional WhatsApp message.
3. Open WhatsApp using:

```text
+256761890792
```

4. Do not send the data to a server.

Also include:

* WhatsApp floating button
* call button
* booking CTA

---

# 35. PHONE CALL

The number:

**0761 890 792**

must support:

```html
<a href="tel:+256761890792">
```

Use it throughout appropriate CTAs.

---

# 36. CONVERSION-FOCUSED DESIGN

The goal is to persuade visitors to contact/book.

Do NOT make this merely a beautiful portfolio.

Build trust.

Include sections such as:

```text
Why Travel With Us
```

Possible points:

* Local East African expertise
* Personalized journeys
* Reliable transportation
* Flexible travel planning
* Experienced guides
* Memorable experiences

Use numbers where appropriate:

```text
8+
Destinations

24/7
Travel Support

100%
Personalized Planning
```

Do not invent fake statistics.

If no real numbers are available, use non-numeric trust statements.

---

# 37. TRAVEL PROCESS

Create:

```text
01
Tell Us Your Dream

02
We Plan Your Journey

03
You Explore East Africa

04
You Return With Memories
```

Animate each step on scroll.

---

# 38. TESTIMONIALS

Create a premium testimonial section.

Do not fabricate real customer identities.

Use placeholder/demo testimonials only if clearly marked as examples, or structure the section so real testimonials can be inserted later.

---

# 39. SEO

Preserve and improve SEO.

Include:

* title
* meta description
* canonical URL placeholder
* robots
* Open Graph
* Twitter card
* JSON-LD
* TravelAgency schema
* service descriptions
* destination descriptions
* semantic headings

Important SEO phrases should naturally appear in HTML:

```text
Uganda safaris
Rwanda safaris
Kenya safaris
Tanzania safaris
South Sudan travel
Western Congo travel
Ethiopia travel
Sudan travel
East Africa tourism
car hire East Africa
hotel reservations East Africa
Airbnb reservations
travel consultancy
travel transportation
```

Do NOT keyword stuff.

---

# 40. CRITICAL SEO RULE

Do not put important SEO content only inside the Three.js canvas.

Search engines must be able to read normal HTML content.

The Earth is a visual experience.

The actual destination/service information must remain HTML.

---

# 41. ACCESSIBILITY

Implement:

* semantic HTML
* keyboard navigation
* visible focus states
* proper buttons
* labels
* aria labels
* descriptive alt attributes
* good contrast

Respect:

```css
prefers-reduced-motion
```

When reduced motion is enabled:

* disable parallax
* disable custom cursor
* disable text cycling
* reduce card animation
* reduce Earth rotation
* disable unnecessary motion

---

# 42. PERFORMANCE

This website will contain many animations.

Performance is critical.

Use:

* lazy loading
* responsive images
* compressed assets
* capped DPR
* IntersectionObserver
* transform/opacity animation
* no unnecessary layout calculations
* no DOM manipulation every frame unless required
* no repeated object allocation inside Three.js render loop
* dispose Three.js textures/materials/geometries
* pause expensive animation when tab is hidden

Use:

```js
document.visibilityState
```

to reduce GPU work when the page is hidden.

---

# 43. MOBILE PERFORMANCE

Do NOT run expensive desktop effects at full quality on low-end phones.

Use responsive quality.

For example:

```text
Desktop:
High-quality Earth
Large star field
Full animation

Tablet:
Medium quality

Mobile:
Optimized texture resolution
Reduced star count
Reduced pixel ratio
Reduced decorative animation
```

But the Earth must remain visually impressive.

---

# 44. PRELOADER

Create a short premium preloader.

Use:

* Adventure Safaris logo
* rounded logo container
* subtle progress animation
* animated text

Do not keep the user waiting unnecessarily.

Do NOT wait indefinitely for Three.js textures.

The normal HTML page must remain available.

---

# 45. HEADER

Desktop header:

* logo
* Destinations
* Services
* About
* Contact
* Book Now

Mobile:

* compact header
* rounded logo container
* mobile bottom navigation

On scroll:

```text
transparent header
       ↓
glass header
```

---

# 46. FOOTER

Include:

* Adventure Safaris East Africa
* destinations
* services
* phone
* WhatsApp
* email placeholder if available
* social links if available
* quick links
* copyright
* travel consultancy CTA

Use a premium dark footer.

---

# 47. DESIGN LANGUAGE

The website should feel like:

**Luxury African travel + cinematic documentary + modern technology + premium editorial design.**

Use:

* deep forest green
* charcoal
* warm sand
* off-white
* restrained gold
* glassmorphism
* large typography
* huge photography
* organic shapes
* rounded containers
* thin borders
* cinematic darkness
* generous spacing

Avoid generic:

* Bootstrap-looking cards
* excessive gradients
* cheap-looking shadows
* excessive rounded rectangles
* clutter
* unnecessary animations

---

# 48. PAGE STRUCTURE

Build the website approximately in this order:

```text
PRELOADER

HEADER

HERO

TRUST / QUICK INTRO

DESTINATIONS

SERVICES

WHY ADVENTURE SAFARIS

FEATURED EXPERIENCES

INTERACTIVE EARTH

TRAVEL PROCESS

TESTIMONIALS

BOOKING CTA

CONTACT

FOOTER

MOBILE BOTTOM NAVIGATION
```

---

# 49. SECTION TRANSITION BETWEEN EARTH AND WEBSITE

Make the transition into the Earth section impressive.

For example:

```text
Safari photography
       ↓
image darkens
       ↓
stars begin appearing
       ↓
content fades
       ↓
Earth emerges
       ↓
Earth rotates
```

Then when leaving the Earth:

```text
Earth
↓
slight scale
↓
space fades
↓
booking content emerges
```

This should feel like a cinematic journey.

---

# 50. DYNAMIC DESTINATION WORDS

Create a dynamic phrase system.

Example:

```text
DISCOVER
UGANDA
```

then:

```text
DISCOVER
RWANDA
```

then:

```text
DISCOVER
KENYA
```

then:

```text
DISCOVER
TANZANIA
```

Animate destination names vertically or through a mask.

Do not change so quickly that users cannot read them.

---

# 51. INTERACTIVE DESTINATION CARDS

When the user hovers/clicks a destination:

* image expands slightly
* description appears
* icon moves
* arrow moves
* card border animates

On mobile:

* tap interaction
* no hover dependency

---

# 52. EARTH DESTINATION MARKERS

If technically feasible, place subtle markers on the globe.

Potential destinations:

```text
Uganda
Kenya
Tanzania
Rwanda
Ethiopia
South Sudan
Congo
Sudan
```

Do not require perfect geographical accuracy if it becomes technically expensive.

Visual quality is more important than fake precision.

If markers are implemented, use reasonable geographic coordinates.

---

# 53. DO NOT BREAK EXISTING FUNCTIONALITY

Preserve:

* WhatsApp booking
* phone calling
* navigation
* existing content
* existing useful assets
* SEO files

Improve them where needed.

---

# 54. REMOVE BROKEN CODE

If the old Earth implementation is broken, do not leave several competing Earth implementations in the project.

Remove obsolete:

* import maps
* duplicate Three.js scripts
* old renderer initialization
* unused Earth functions
* broken texture loaders

There must be ONE clear Earth implementation.

---

# 55. TESTING

After implementation run:

```bash
npm install
npm run build
```

Then:

```bash
npm run dev
```

Open the actual website.

Do not rely only on static code inspection.

---

# 56. EARTH TEST CHECKLIST

Verify manually:

```text
[ ] Earth appears
[ ] Earth rotates
[ ] Earth can be dragged
[ ] Earth can zoom
[ ] Earth works on mobile
[ ] Clouds visible
[ ] Atmosphere visible
[ ] Night side visible
[ ] Stars visible
[ ] Sun/day-night transition works
[ ] Resize works
[ ] No console errors
[ ] WebGPU attempted
[ ] WebGL fallback works
[ ] Static fallback works
```

---

# 57. WEBSITE TEST CHECKLIST

Verify:

```text
[ ] Hero loads
[ ] Hero images are sharp
[ ] Hero slider works
[ ] Logo container looks premium
[ ] Desktop navigation works
[ ] Mobile bottom nav works
[ ] All destination cards work
[ ] Service cards work
[ ] Scroll animations work
[ ] Wipe animations work
[ ] Float animations work
[ ] Text animations work
[ ] Parallax works
[ ] Reduced motion works
[ ] WhatsApp works
[ ] Phone link works
[ ] Forms validate
[ ] No horizontal overflow
[ ] Mobile works
[ ] Desktop works
[ ] npm run build succeeds
```

---

# 58. IF EARTH STILL DOES NOT WORK

DO NOT finish the task.

Stop adding fancy effects.

Create a minimal test:

```js
scene
camera
renderer
sphere
light
animation
```

Make the sphere visible first.

Then progressively add:

```text
Earth texture
night texture
clouds
atmosphere
stars
controls
animations
```

Find the exact failure.

Fix it.

Then restore the premium visuals.

---

# 59. BROWSER COMPATIBILITY

Test modern:

* Chrome
* Edge
* Firefox where supported
* Safari where practical
* Android Chrome
* iPhone Safari

WebGPU support varies.

Therefore WebGL fallback is mandatory.

---

# 60. DO NOT MAKE WEBGPU A SINGLE POINT OF FAILURE

The website must never depend entirely on WebGPU.

The correct hierarchy is:

```text
WebGPU
   ↓
WebGL2
   ↓
Static visual fallback
```

---

# 61. CLEAN CODE

Use:

* ES modules
* small functions
* descriptive variable names
* comments around difficult rendering code
* no giant monolithic script
* no duplicate listeners
* no global pollution

---

# 62. FINAL PROJECT STRUCTURE

A good final structure might look like:

```text
Adventure-Safaris-East-Africa/
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
├── README.md
├── robots.txt
├── sitemap.xml
├── manifest.webmanifest
│
├── public/
│   └── assets/
│       ├── safari/
│       └── earth/
│
└── src/
    ├── main.js
    │
    ├── earth/
    │   ├── EarthExperience.js
    │   ├── EarthRenderer.js
    │   └── earthTextures.js
    │
    ├── animations/
    │   ├── scroll.js
    │   ├── text.js
    │   └── interactions.js
    │
    └── styles/
        ├── main.css
        ├── earth.css
        └── animations.css
```

You may improve this structure if necessary.

---

# 63. IMPORTANT: USE CURRENT DOCUMENTATION

Do not rely on an old Three.js snippet just because it appears online.

Use the API compatible with the installed version.

Particularly verify:

* WebGPURenderer
* WebGLRenderer
* OrbitControls
* TSL
* renderer initialization
* Three.js addons

For GSAP verify:

* ScrollTrigger
* Flip
* current plugin registration

---

# 64. FINAL STANDARD

Do not tell me:

> "The Earth should work now."

Instead:

**RUN IT.**

**LOOK AT IT.**

**CHECK THE CONSOLE.**

**FIX THE ERROR.**

**RUN IT AGAIN.**

Keep iterating until the website works.

---

# 65. FINAL BUILD REQUIREMENT

The final command must succeed:

```bash
npm run build
```

There must be no unresolved build errors.

There should be no unresolved runtime errors related to:

* Three.js
* GSAP
* Earth renderer
* missing assets
* JavaScript modules

---

# 66. FINAL EXPERIENCE

When a visitor opens the website, the experience should feel like:

```text
A cinematic African landscape
        ↓
Adventure Safaris branding
        ↓
Beautiful animated typography
        ↓
Destinations reveal
        ↓
Services appear
        ↓
Images move naturally
        ↓
The screen transforms into space
        ↓
A REAL INTERACTIVE EARTH APPEARS
        ↓
The visitor rotates East Africa's world
        ↓
Booking CTA appears
        ↓
WhatsApp / Call
```

The website should persuade the visitor that:

**Adventure Safaris East Africa is the company that can turn their East African travel idea into a real journey.**

---

# 67. MOST IMPORTANT RULES

Remember these five rules:

### RULE 1

**Do not guess why the Earth is broken. Diagnose it.**

### RULE 2

**Do not use Next.js just because Three.js is involved. Vite + Vanilla JS + Three.js is preferred.**

### RULE 3

**WebGPU must have WebGL fallback.**

### RULE 4

**An Earth section that displays nothing is NOT acceptable.**

### RULE 5

**Do not finish until `npm run build` succeeds and the actual website has been tested.**
