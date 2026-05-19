---
name: Nancy Pahuja Brand System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#534344'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#857374'
  outline-variant: '#d8c1c2'
  surface-tint: '#8e4a53'
  primary: '#8e4a53'
  on-primary: '#ffffff'
  primary-container: '#d98891'
  on-primary-container: '#5c222c'
  inverse-primary: '#ffb2ba'
  secondary: '#71585b'
  on-secondary: '#ffffff'
  secondary-container: '#f9d8db'
  on-secondary-container: '#755c5f'
  tertiary: '#6b5a5c'
  on-tertiary: '#ffffff'
  tertiary-container: '#ae9a9c'
  on-tertiary-container: '#413234'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9dc'
  primary-fixed-dim: '#ffb2ba'
  on-primary-fixed: '#3a0813'
  on-primary-fixed-variant: '#72333c'
  secondary-fixed: '#fcdbde'
  secondary-fixed-dim: '#debfc2'
  on-secondary-fixed: '#281719'
  on-secondary-fixed-variant: '#584144'
  tertiary-fixed: '#f4dddf'
  tertiary-fixed-dim: '#d7c1c3'
  on-tertiary-fixed: '#25181a'
  on-tertiary-fixed-variant: '#524345'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: notoSerif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: notoSerif
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: notoSerif
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: manrope
    fontSize: 18px
    fontWeight: '300'
    lineHeight: '1.6'
  body-md:
    fontFamily: manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
spacing:
  base: 8px
  section-gap: 120px
  container-padding: 64px
  gutter: 24px
  grid-columns: '12'
---

## Brand & Style

The design system is rooted in the intersection of traditional South Asian heritage and contemporary minimalist luxury. It targets a discerning clientele that values artisanal craftsmanship and understated elegance. The visual language evokes a sense of "Ethereal Authority"—soft and feminine in tone, yet precise and confident in execution.

The aesthetic follows a **Minimalist** philosophy, prioritizing high-quality imagery and negative space to allow the intricate details of the apparel to breathe. By utilizing a restrained color palette and editorial typography, the system creates an atmosphere of an exclusive digital atelier rather than a standard e-commerce platform.

## Colors

This design system utilizes a palette designed to feel organic and high-end. The primary interaction color, **Rose Blush**, is reserved for purposeful actions and subtle highlights to maintain its impact. **Graceful Blush** serves as the secondary structural color, used for large-scale sections, dividers, and decorative backgrounds to soften the interface.

**Deep Berry** provides the necessary weight to the design, used exclusively for typography and iconography to ensure legibility and a sense of premium groundedness. The background remains **Pure White** to maximize the "white gallery" effect, ensuring the colors of the apparel remain the focal point.

## Typography

The typography strategy relies on the contrast between the literary, sophisticated nature of **notoSerif** (serving the brand's editorial headings) and the functional refinement of **manrope** for UI elements and long-form descriptions. 

Headlines should be treated with generous leading and occasional tracking adjustments for a "magazine-style" layout. Body text utilizes a lighter weight (300) for a delicate appearance without sacrificing readability. Labels and micro-copy use uppercase tracking to inject a sense of modern structure into the feminine aesthetic.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop to create a curated, intentional viewing experience, transitioning to a fluid model for mobile. Large horizontal margins (64px+) are mandatory to frame the content, mimicking the matting of a fine-art photograph.

Spacing is aggressive; sections are separated by significant vertical gaps (120px+) to denote a change in narrative or collection. Elements within components are spaced using a strict 8px incremental scale, ensuring that while the layout feels airy, the internal logic remains disciplined and professional.

## Elevation & Depth

This design system avoids traditional drop shadows to maintain a high-fashion, flat editorial look. Depth is instead communicated through **Tonal Layers** and **Low-Contrast Outlines**.

1.  **Surface Tiers:** Primary content sits on Pure White. Secondary information or specialized modules sit on Graceful Blush (#F8D7DA) containers with no border.
2.  **Ghost Borders:** When structural separation is required (e.g., input fields or product grids), use 1px hairlines in a 10% opacity of Deep Berry.
3.  **Active States:** Depth is indicated by a color fill rather than a lift; a button "pressed" state might shift from a Rose Blush fill to a Deep Berry fill.

## Shapes

The shape language is strictly **Sharp (0px)**. This decision reinforces the architectural and high-fashion nature of the brand. Rectilinear containers create a formal frame for the flowing, organic shapes of the South Asian apparel.

All buttons, image containers, cards, and input fields must feature 90-degree corners. This sharpness provides a modern, sophisticated edge that balances the softness of the "Graceful Blush" color palette.

## Components

### Buttons
Primary CTAs are solid rectangles in **Rose Blush** with white uppercase text. Secondary buttons are "Ghost" style—1px Deep Berry borders with no fill. All buttons feature a subtle 200ms color transition on hover.

### Input Fields
Inputs are minimalist, consisting of a single 1px bottom border in Deep Berry. Floating labels in **manrope** (label-sm) sit above the line. Error states are indicated by a shift to a slightly warmer terracotta tone, avoiding harsh bright reds.

### Product Cards
Product cards should have no external borders or shadows. The image takes up 100% of the card width, with typography (Product Name in notoSerif, Price in manrope) center-aligned underneath with ample padding.

### Thin-Line Iconography
Icons must be 1px stroke weight, utilizing Deep Berry. They should be strictly geometric and minimalist, avoiding any filled areas or rounded caps.

### Navigation
The navigation bar is persistent and transparent, utilizing a blur effect only when scrolling over content. Menu items use the `label-sm` typographic style for a refined, balanced look.