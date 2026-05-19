---
name: Artisanal Heritage
colors:
  surface: '#fff8f7'
  surface-dim: '#ffcdd6'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0f1'
  surface-container: '#ffe9eb'
  surface-container-high: '#ffe1e5'
  surface-container-highest: '#ffd9df'
  on-surface: '#3e0217'
  on-surface-variant: '#444748'
  inverse-surface: '#5a172c'
  inverse-on-surface: '#ffecee'
  outline: '#747878'
  outline-variant: '#c4c7c8'
  surface-tint: '#5d5f5f'
  primary: '#5d5f5f'
  on-primary: '#ffffff'
  primary-container: '#ffffff'
  on-primary-container: '#747676'
  inverse-primary: '#c6c6c7'
  secondary: '#81524d'
  on-secondary: '#ffffff'
  secondary-container: '#fec0b9'
  on-secondary-container: '#7a4c46'
  tertiary: '#795559'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffffff'
  on-tertiary-container: '#926c70'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#f5b8b0'
  on-secondary-fixed: '#32110e'
  on-secondary-fixed-variant: '#663b36'
  tertiary-fixed: '#ffd9dc'
  tertiary-fixed-dim: '#e9bbbf'
  on-tertiary-fixed: '#2e1417'
  on-tertiary-fixed-variant: '#5f3e41'
  background: '#fff8f7'
  on-background: '#3e0217'
  surface-variant: '#ffd9df'
typography:
  h1:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Noto Serif
    fontSize: 36px
    fontWeight: '400'
    lineHeight: '1.3'
  h3:
    fontFamily: Noto Serif
    fontSize: 28px
    fontWeight: '400'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  button:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  section-gap: 80px
  container-padding: 24px
  grid-gutter: 16px
---

## Brand & Style

This design system is built to reflect the delicate craftsmanship and high-end nature of luxury South Asian lawn suits. The brand personality is sophisticated, timeless, and ethereal, aimed at a discerning audience that appreciates both heritage and modern minimalism.

The visual style is a blend of **Minimalism** and **Tactile Elegance**. It prioritizes extreme clarity and negative space to allow the intricate details of the apparel to breathe. The emotional response is one of calm, exclusivity, and beauty. Subtle vintage-inspired botanical patterns are used as rhythmic breaks in the layout, grounding the digital experience in the physical artistry of textile design.

## Colors

The palette is anchored by **Pure White**, serving as a canvas that mimics the airy feel of high-quality lawn fabric. **Rich Berry** provides the essential structural contrast, ensuring all typographic elements are legible and authoritative. 

**Rose Gold** is reserved strictly for primary actions and interactive states, providing a metallic, premium warmth. **Graceful Blush** is utilized as a background tint for secondary containers, highlights, and soft UI accents, creating a gentle layered effect without disrupting the minimalist aesthetic.

## Typography

This design system uses a dual-font strategy to balance heritage with modern usability. **Noto Serif** is used for all editorial headings, bringing an artisanal, literary quality to the product titles and storytelling sections.

For UI elements, navigation, and long-form body text, **Plus Jakarta Sans** is employed for its clean, welcoming, and highly legible characteristics. All text should default to **Rich Berry** to maintain high contrast. "Label-caps" should be used sparingly for category eyebrows or metadata, always in uppercase with increased letter spacing to enhance the premium feel.

## Layout & Spacing

The layout follows a **fixed-width grid** centered on the viewport to evoke the feeling of a curated lookbook. A 12-column system is used for desktop, with generous outer margins to emphasize the "airy" brand pillar.

Spacing is dictated by an 8px rhythmic scale. Large "section-gaps" are essential between content blocks to prevent visual clutter. Botanical patterns may be used within these gaps as subtle dividers, but they should never compete with the content. Content should feel loosely placed but strictly aligned to the grid.

## Elevation & Depth

To maintain a minimalist aesthetic, depth is conveyed through **tonal layering** and **low-contrast outlines** rather than heavy shadows. 

- **Surface 0:** Pure White (Global background).
- **Surface 1:** Graceful Blush (Used for cards or call-out sections).
- **Interactive:** Rose Gold (Elevated via color, not shadow).

Where shadows are necessary for functional overlays (like quick-buy modals), use an "Ambient Shadow": a very soft, diffused Rich Berry tint with 5% opacity and a 20px blur. This keeps the elevation feeling organic and light.

## Shapes

The shape language is defined by **Rounded** geometry (Level 2). This softens the high-contrast typography and aligns with the organic nature of floral patterns.

Standard buttons and input fields utilize a 0.5rem radius. Larger components like product cards or imagery containers should use the `rounded-lg` (1rem) setting to create a friendly, premium enclosure. Circular shapes are reserved for icon buttons or status indicators to provide a distinct visual departure from structural elements.

## Components

### Buttons
Primary buttons use a solid **Rose Gold** fill with White text. Secondary buttons use a **Rich Berry** ghost style with a 1px border. All buttons should have a subtle hover transition that increases the saturation of the color.

### Input Fields
Inputs are minimalist: a 1px border in **Graceful Blush** that transitions to **Rich Berry** on focus. Labels should use the "label-caps" typographic style placed above the field.

### Cards
Product cards are borderless with a **Pure White** background. They rely on the `rounded-lg` corners and generous internal padding (24px) to separate them from the background. 

### Chips & Tags
Used for fabric types or sizing, chips should use a **Graceful Blush** fill with **Rich Berry** text to maintain a soft but readable presence.

### Dividers
Dividers should be used sparingly. When used, they can incorporate a faint, watermark-style botanical illustration centered between two 1px horizontal lines in Graceful Blush.