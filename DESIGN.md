# EL BARAKA CONSEIL — Le Portail

The site is built from the company's own photographs: a guard in a khaki uniform behind a cobalt steel gate, with the Jijel hills behind him. Gates, bars, checkpoints and duty registers are the only motif.

## Sampled color

Pixels read from `public/images/about/about.jpg` and `public/images/services/IMG_2665.jpg`.

| Token | Role | Value | Source |
|---|---|---|---|
| `--portail` | Bars, buttons, links, numbers | `#0B5199` | Gate bar in shade, `IMG_2665.jpg` (80, 300). The sunlit bar in `about.jpg` is `#0090FD`; that value fails WCAG for white or dark text, so the working brand color is the same gate in shade. |
| `--tenue` | Rules, captions, timeline ticks | `#B2A390` | Uniform, `about.jpg` |
| `--nuit` | Text, dark sections, footer | `#0B1626` | Ink. The hills read lighter (`#74808C`); this darker value is for type. |
| `--beton` | Main light background | `#E2E0DC` | Sunlit concrete (`#C1BDBC`, `#D2CFC8`), lifted so body text stays AA |
| `--mur` | Paper, forms, logo cells | `#F6F5F2` | Lightest concrete, lifted |
| `--veille` | Focus rings only | `#F5A400` | Not in the photos. The "en service" dot stays off until the client confirms 24/7 |

No gold, no gradients, no glow, no glass. Flat color. The only gradient is the hero scrim (transparent to 72% `--nuit` over the bottom 55%), there so the white headline stays readable on the photograph.

## Type

- Latin: Archivo, variable `wdth` 62–125 and `wght` 100–900.
  - Display: `wdth` 62, `wght` 860, leading 0.88, tracking −0.01em.
  - Body: `wdth` 100, `wght` 400, 17px, leading 1.6, measure 66ch.
  - Navigation: `wdth` 100, `wght` 500, sentence case.
- Arabic: Reem Kufi for display, IBM Plex Sans Arabic for body. RTL.
- Hero: `clamp(4.5rem, 17vw, 17rem)`. Section titles: `clamp(2.5rem, 7vw, 6rem)`.
- Sentence case. No colored word inside a headline. No eyebrow labels. No middle dots. No arrows on buttons.

## Shape

Sharp rectangles. Buttons and the cookie tab use a 2px radius. Hairlines are 1px `--nuit`. The contact form is the only shadow: a hard 4px offset in `--portail`.

## Wireframes

### Hero

Solid `--mur` bar, then a full-bleed gate photograph (or the video, when one is uploaded). Nine cobalt bars cover the picture and slide open once per session. Headline bottom-left, one color, three lines: "Nous œuvrons / pour votre / sécurité". Subline is a normal sentence that includes gardiennage, sécurisation, transport de fonds et produits sensibles. Two rectangular buttons. A bar strip closes the hero.

### À propos

Photograph bleeding off the left (the close gate). Intro paragraph on the right. Stats are one sentence, numbers in `--portail`, counted once.

### Services

Full-width rows, condensed names, a short line on the right, 1px rules. Hover or focus reveals the photo through nine slits. On a narrow screen the row opens and shows the photo. No numbers, no cards.

### Depuis 1996

A horizontal rail. Years are ticks. Each stop has a photograph. Only 1996 is a confirmed fact; the later stops are marked for the client.

### Logos

A hairline grid on `--mur`. Logos are large, complete, grayscale, and return to full color on hover. The last cell reads "+ 100 partenaires".

### Pourquoi

Three statements and two photographs. Claims used: 30+ ans, 500 professionnels, véhicules aménagés, confidentialité. No 24/7 claim.

### Galerie, contact, footer

Text toggles and a masonry grid. A paper form with an offset shadow, a plain coordinate list, a grayscale map with one cobalt square. Footer in `--nuit`, bar strip on top, a cropped "El Baraka" wordmark.

## Motion budget

1. Gate opening, once per session, skipped when reduced motion is requested. The poster is already in the DOM.
2. A 12s scale from 1 to 1.04 on the still hero, only when there is no video.
3. Service photo through the slits, on hover or focus.
4. Timeline scroll, driven by the user.
5. Numbers count up once.
6. Lenis.

Nothing else moves. No cursor ring, no particles, no fade-up on sections.
