# Shopmatic

Affiliate product review site — honest, research-backed reviews across 50 products in 8 categories.

## Live

Deployed on Cloudflare Pages. Latest deployment URL varies per deploy.

## Tech Stack

- **Framework:** Next.js 14 (App Router, static export)
- **Styling:** Tailwind CSS 4
- **Deployment:** Cloudflare Pages via Wrangler
- **Analytics:** Google Analytics 4 (G-1ZEQ5D2MRP)
- **Affiliate Links:** l-nk.in (Magik Links URL shortener)

## Current Version: v1.6

### Changelog

#### v1.6 (May 15, 2026)
- Researched and verified pricing for all 50 products against official websites
- Fixed incorrect pricing labels (InsecureWeb, Grammarly, Filmora, Blinkist, etc.)
- Redesigned product page layout with interspersed images in content sections
- Added mid-content CTA banners between review sections
- Orange/amber CTA color scheme replacing blue
- Bottom CTA with gradient background + dual buttons
- Updated About page with current stats and orange theme

#### v1.5 (May 15, 2026)
- Fixed YAML frontmatter bleeding into rendered pages
- Replaced all 50 SVG placeholder images with AI-generated product card images (MiniMax image-01)
- Updated image references from .svg to .jpg

#### v1.4 (May 15, 2026)
- Fixed product names displaying affiliate URLs instead of actual names (all 50 mapped)
- Improved review page spacing and typography hierarchy
- Enhanced markdown rendering CSS for tables, lists, blockquotes

#### v1.3 (May 14, 2026)
- Added search/filter functionality
- Product comparison feature
- Editor picks section
- GA4 integration
- l-nk.in affiliate links

#### v1.0 (May 14, 2026)
- Initial launch with 50 products
- 8 categories
- Detailed reviews for all products

## Product Coverage

| Category | Products |
|----------|----------|
| AI Tools | 12 |
| Developer Tools | 10 |
| Marketing | 8 |
| Productivity | 8 |
| Design | 4 |
| Hosting & Infra | 5 |
| Education | 3 |
| Security | 3 |

## Features

- 50 detailed product reviews (1500+ words each)
- Verified pricing from official sources
- Pros/cons with clear verdicts
- FAQ sections per product
- Product search and filtering
- Product comparison tool
- Editor picks
- Responsive design (mobile-first)
- SEO optimized (JSON-LD structured data, meta tags, OG images)

## Development

```bash
npm install
npm run dev        # Development server
npm run build      # Static export to /out
```

## Deployment

```bash
# Deploy to Cloudflare Pages
npx wrangler pages deploy out --project-name=shopmatic
```

Uses Global API Key from Cloudflare (Spbinc25 account). Credentials in vault.

## Project Structure

```
src/
  app/
    page.tsx              # Homepage
    about/page.tsx        # About page
    products/
      page.tsx            # Products listing
      [slug]/page.tsx     # Individual product review
    categories/
      page.tsx            # Categories listing
      [category]/page.tsx # Category pages
    compare/page.tsx      # Product comparison
    deals/page.tsx        # Deals page
    blog/page.tsx         # Blog page
  components/
    ProductCard.tsx
    CTAButton.tsx
    FAQAccordion.tsx
  lib/
    products.ts           # Product data, pricing, names, descriptions
  data/
    all_products.json     # Raw product data
    products_research.json # Research data
content/
  products/*.md           # 50 detailed review markdown files
public/
  images/products/*.jpg   # 50 product card images
```

## GitHub

**Repo:** garudaccs/shopmatic (branch: main)
