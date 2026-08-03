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
  - `sections/shopco-hero.liquid`
  - `sections/shopco-brands.liquid`
  - `sections/shopco-product-grid.liquid`
  - `sections/shopco-categories.liquid`
  - `sections/shopco-testimonials.liquid`
  - `sections/shopco-newsletter.liquid`
  - `templates/index.json` – wires the custom sections into the homepage
  - `config/settings_schema.json` and `config/settings_data.json` – renamed theme identity and default Shopco preset

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
- Product images use `srcset` for responsive sizing.
- CSS and JS remain in Dawn's deferred loading pattern.
- `shopco.css` is pre-minified style and uses a Google Fonts import for `Inter`.
- Hero image uses `loading="eager"`; product/collection images use `loading="lazy"`.

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
- `shopco-product-grid` defaults to the `all` collection. In a real store, create `new-arrivals` and `top-selling` collections and point the sections to them.
- The `scheme_classes` lint warning in `layout/theme.liquid` is inherited from the Dawn base and does not affect functionality.
