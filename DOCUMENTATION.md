# Shopco Shopify Theme – Development Documentation

## Project Overview
This theme is a Shopify Online Store 2.0 implementation of the Figma **E-commerce Website Template (Freebie)** by [Hamza Naeem](https://www.figma.com/@hamzauix), file ID `1273571982885059508`. The design is a modern fashion store branded **Shopco**.

The build is intended as a 4-hour Shopify Developer assessment. It focuses on design fidelity, responsive layout, dynamic editable content, and Shopify best practices.

## Design Reference
- **Figma File:** [E-commerce Website Template (Freebie)](https://www.figma.com/community/file/1273571982885059508)
- **Inspiration / public implementation:** [Shopco Next.js demo](https://shopco-nu.vercel.app/)
- **Core homepage sections reproduced:**
  1. Hero with headline, subtext, CTA, and statistics
  2. Brand logo marquee
  3. New Arrivals product grid
  4. Top Selling product grid
  5. Browse by dress style categories
  6. Customer testimonials
  7. Newsletter sign-up

## Technical Approach
- **Base theme:** Shopify Dawn 15.x (cloned to save setup time and inherit robust product, cart, checkout, and customer templates)
- **Custom additions:**
  - `assets/shopco.css` – design tokens, typography, layout, and section-specific styles
  - `assets/shopco-carousel.js` – `<shopco-carousel>` custom element for the testimonial scroller
  - `snippets/shopco-fonts.liquid` – `@font-face` declarations for the licensed display/body typefaces
  - `snippets/shopco-rating.liquid` – shared star-rating component
  - `sections/shopco-hero.liquid`
  - `sections/shopco-brands.liquid`
  - `sections/shopco-product-grid.liquid`
  - `sections/shopco-categories.liquid`
  - `sections/shopco-testimonials.liquid`
  - `sections/shopco-newsletter.liquid`
  - `templates/index.json` – wires the custom sections into the homepage
  - `locales/en.default.json` – `shopco.*` namespace for strings with no Dawn equivalent
  - `config/settings_schema.json` and `config/settings_data.json` – renamed theme identity and default Shopco preset

## Typography
The reference design uses **Integral CF** (display) and **Satoshi** (body), declared in
`snippets/shopco-fonts.liquid` and self-hosted from `assets/`:

| Asset | Family | Weight | Format |
|---|---|---|---|
| `integral-cf-bold.otf` | Integral CF | 700 | OpenType |
| `satoshi-regular.woff` | Satoshi | 400 | WOFF |
| `satoshi-medium.woff` | Satoshi | 500 | WOFF |
| `satoshi-bold.woff` | Satoshi | 700 | WOFF |

Integral CF (display) is applied to the hero heading, section titles and brand wordmarks;
Satoshi carries all body copy, prices and UI text. The display face and Satoshi Regular are
preloaded with `crossorigin`; all faces use `font-display: swap`, and
`--shopco-font-display` / `--shopco-font-body` retain fallback stacks if a file fails to load.

> **Licensing — action required before launch.** The bundled Integral CF file is the
> **Fontspring DEMO** release, licensed for evaluation and static mockups only, *not* for web
> embedding on a live store. Purchase a webfont licence and replace `integral-cf-bold.otf`
> before going to production. The demo also carries a reduced glyph set; this is safe here only
> because every element using the display face is `text-transform: uppercase`.

Optional optimisation: converting these to `.woff2` cuts roughly 30% of the transfer size.
It needs `fonttools`+`brotli` (`pip install fonttools brotli`), which is not installed in this
workspace, so the original formats are used.

## Design Tokens
Defined once on `:root` in `assets/shopco.css`:

| Token | Value | Use |
|---|---|---|
| `--shopco-page-width` | `1240px` | Content container |
| `--shopco-surface` | `#f2f0f1` | Hero background |
| `--shopco-surface-alt` | `#f0f0f0` | Dress-style container |
| `--shopco-media-bg` | `#f0eeed` | Product image background |
| `--shopco-star` | `#ffc633` | Rating stars |
| `--shopco-sale` | `#ff3333` | Discount badge |
| `--shopco-radius-card` | `20px` | Cards |
| `--shopco-radius-lg` | `40px` | Large containers |
| `--shopco-radius-pill` | `62px` | Buttons and inputs |

## Shopify OS 2.0 Best Practices Used
- JSON templates for the homepage with dynamic section ordering
- Reusable Liquid sections with `{% schema %}` for merchant customization
- Blocks inside sections (brands, categories, testimonials)
- Shopify `image_url` and `placeholder_svg_tag` filters for responsive images
- `routes` object instead of hard-coded URLs
- Lazy loading on product/category images
- Accessibility: semantic HTML, `aria-label`, `role="list"`, skip-to-content, form labels
- Mobile-first CSS with `clamp()` and container media queries
- Interop with Dawn's existing cart, header, footer, product, collection, and customer templates

## Performance Notes
- Product images use `srcset` with an explicit largest candidate (`image_url: width: image.width`).
- CSS and JS remain in Dawn's deferred loading pattern; the carousel script is `defer`red.
- Fonts are self-hosted with `font-display: swap`; there is no third-party font request.
- Hero image uses `loading="eager"` plus `fetchpriority="high"`; all other images are `loading="lazy"`.

## Accessibility Notes
- Lists use `<ul>`/`<li>` so anchors keep their native link role (`role="listitem"` on an `<a>`
  would override it).
- The newsletter email input has a real `<label>` and a unique per-section `id`.
- Star ratings expose a single `role="img"` label via `accessibility.star_reviews_info`; the
  individual glyphs are `aria-hidden`.
- Carousel arrows are real `<button>`s with `aria-controls`, and disable at the track ends.
- All user-facing strings resolve through the `t` filter.

## Deployment / Live Demo
This repository does **not** include a hosted Shopify store because a development store login is required.

To deploy:

```powershell
# 1. Authenticate to your development store
shopify auth login --store YOUR-STORE.myshopify.com

# 2. Push or serve the theme
shopify theme push --path shopco --theme SHOPIFY_THEME_ID
# or for local preview
shopify theme dev --path shopco --store YOUR-STORE.myshopify.com
```

To share a public preview, create a development store and add the evaluator as a staff/collaborator, or generate a theme preview link from the Shopify admin.

## Known Items
- `shopco-product-grid` defaults to the `all` collection, so **New Arrivals and Top Selling
  currently show the same products**. In a real store, create `new-arrivals` and `top-selling`
  collections and point each section at one.
- Product ratings render only when a reviews app populates the `reviews.rating` metafield.
- Category cards need a collection selected per block; without one they render as non-linked
  cards rather than linking to the homepage.
- The newsletter card's "Overlap the footer" setting is off by default; enable it after the
  footer is restyled (Phase 2) so it has room to sit behind the card.
- Schema `label`/`name` strings are plain English rather than `t:` keys. Storefront-facing
  copy is fully translated; schema translation is a Theme Store requirement, not a
  functional one.
- Theme Check reports 8 warnings, all inherited from the Dawn base (`scheme_classes`,
  `UnusedAssign`, etc.). Zero errors, and none originate in the `shopco-*` files.

## Scope Status
- **Phase 1 (done):** the seven homepage sections aligned to the reference design.
- **Phase 2 (pending):** header + promo bar, footer with payment badges, product detail page,
  collection page with filter sidebar, and cart page still use unmodified Dawn styling.
