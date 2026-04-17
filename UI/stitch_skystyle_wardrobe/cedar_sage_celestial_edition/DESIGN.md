# Design System Specification: High-End Editorial Organic

## 1. Overview & Creative North Star: "The Celestial Naturalist"
This design system moves away from the sterile, modular grid of standard SaaS products and embraces the aesthetic of a high-end, tactile lifestyle journal. Our Creative North Star is **"The Celestial Naturalist"**—a philosophy that balances the grounded, tactile weight of the earth (Sage/Cedar) with the ethereal, expansive clarity of the cosmos (Zodiac Gold/Muted Purple).

To break the "template" look, we prioritize **intentional asymmetry** and **tonal depth** over rigid containment. The experience should feel like a curated desk: objects don't sit in boxes; they rest on surfaces. We use overlapping elements and a dramatic typography scale to create an editorial rhythm that guides the eye through data-heavy sections like weather and personal settings with grace rather than friction.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the earth but accented by the heavens. We utilize a sophisticated Material Design 3 token logic to manage light and shadow through color rather than lines.

### Primary Palette: Earth & Growth
*   **Primary (`#4d6328`):** Use for active states and core brand moments.
*   **Primary Container (`#657c3e`):** A softer landing for large UI blocks.
*   **Surface (`#fcf9f2`):** Our "Paper." Never use pure white (#FFFFFF) for backgrounds; this cream base reduces eye strain and feels premium.

### Secondary Palette: Zodiac Accents
*   **Secondary (`#735c00` - Celestial Gold):** Reserved for astronomical data, high-priority highlights, or "golden hour" weather states.
*   **Tertiary (`#675577` - Muted Purple):** Used for evening states, zodiac transitions, or mystical data points.

### The "No-Line" Rule
**Borders are prohibited for sectioning.** To separate a weather forecast from a personal setting, do not draw a line. Instead, shift the background color. 
*   Place a `surface-container-low` card atop a `surface` background. 
*   Use `surface-container-highest` for the most nested, "embedded" feel.

### Signature Textures & Glass
*   **The Gradient Soul:** For primary CTAs, use a subtle linear gradient from `primary` to `primary_container`. It adds a "haptic" visual weight that flat colors lack.
*   **Glassmorphism:** For floating overlays (e.g., zodiac modals), use `surface_variant` at 70% opacity with a `24px` backdrop blur. This ensures the organic background "bleeds" through, maintaining a sense of place.

---

## 3. Typography: Editorial Hierarchy
We use a high-contrast pairing of **Newsreader** (Serif) for storytelling and **Manrope** (Sans-Serif) for utility and data.

### Display & Headlines (The Voice)
*   **Display Large (Newsreader, 3.5rem):** Use for "Hero" moments—the current temperature or a daily horoscope.
*   **Headline Medium (Newsreader, 1.75rem):** Use for section starts. The serif font provides an authoritative, editorial feel.

### Body & Labels (The Utility)
*   **Title Medium (Manrope, 1.125rem):** The workhorse for settings labels. The sans-serif geometricity ensures clarity in dense lists.
*   **Body Medium (Manrope, 0.875rem):** Our standard for descriptive text.
*   **Label Small (Manrope, 0.6875rem):** Used for metadata in weather charts or fine print in settings. Use with generous letter-spacing (0.05rem) to maintain legibility.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "digital." We achieve depth through the **Layering Principle.**

*   **Stacking Tiers:** A `surface-container-lowest` card sitting on a `surface-container-low` section creates a natural, soft lift.
*   **Ambient Shadows:** If an element must float (like a FAB), use the `on-surface` color for the shadow at **6% opacity** with a blur radius of **32px**. It should look like an object casting a shadow on a soft linen tablecloth.
*   **The Ghost Border Fallback:** If accessibility requires a boundary, use `outline-variant` at **15% opacity**. It should be felt, not seen.

---

## 5. Components
### Buttons: Tactile Sophistication
*   **Primary:** Rounded `xl` (1.5rem). Use the Primary-to-PrimaryContainer gradient. Apply a subtle 1px inner-top-highlight (white @ 20%) to give it a "pressed paper" depth.
*   **Secondary:** Ghost-style with a `primary` label. No container until hover.
*   **Tertiary:** `tertiary_fixed_dim` background with `on_tertiary_fixed` text for celestial-specific actions.

### Cards & Data Lists
*   **Forbid Dividers:** Use `8px` of vertical white space or a shift to `surface-container-low` to separate items.
*   **Data Weather Modules:** Use `surface-container` with `xl` (1.5rem) rounded corners. Group weather metrics (Wind, Humidity) using `title-sm` for values and `label-md` for units, creating a clear vertical rhythm.

### Zodiac Chips
*   Use `secondary_fixed` for the container and `on_secondary_fixed` for text. These should be `full` rounded (pills) to contrast against the more rectangular data cards.

### Input Fields
*   Soft `md` (0.75rem) corners. Use `surface_container_highest` as the fill. No bottom line—just a tonal shift. On focus, the border transitions to a `primary` "Ghost Border" (20% opacity).

---

## 6. Do’s and Don’ts

### Do:
*   **Do** embrace negative space. If a layout feels "crowded," increase the padding rather than adding a border.
*   **Do** overlap elements. A zodiac icon can slightly "peek" out of a card container to break the grid.
*   **Do** use `Newsreader` for any text meant to be "read" and `Manrope` for any text meant to be "used."

### Don't:
*   **Don't** use pure black (#000000) or pure white (#FFFFFF). Always use the `on-surface` and `surface` tokens to maintain the "Organic & Cozy" warmth.
*   **Don't** use standard Material Design "Level 1-5" shadows. Stick to Tonal Layering.
*   **Don't** use high-saturation greens. Keep the "Sage" muted and earthy to allow the "Zodiac Gold" to shine when necessary.