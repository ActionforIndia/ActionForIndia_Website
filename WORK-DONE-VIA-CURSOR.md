# Work Done Via Cursor

A feature overview of the **Action For India** redesigned static website — what is built, what each page contains, and how the site works today.

---

## Overview

This is a **multi-page static website** for [Action For India](https://actionforindia.org/), rebuilt with a custom layout and brand color scheme (terracotta red, warm cream backgrounds, Playfair Display + DM Sans typography). Content is driven by a central JSON data file and shared JavaScript modules — no React, no build step required.

**To preview locally:** run `python -m http.server 8765` and open `http://localhost:8765`

---

## Site Architecture

| Layer | Files | Purpose |
|-------|-------|---------|
| **Data** | `scraped-data.json` | All site content — programs, people, partners, news, directories, etc. |
| **Data helpers** | `site-data.js` | Loads JSON, logo paths, partner logo mapping, news merging |
| **Shared layout** | `shared-layout.js` | Mega-menu nav, banner carousel, modals, analytics, partner grids |
| **Shared UI** | `shared-components.css`, `site-common.js` | Reusable styles, footer wiring, scroll reveal, navbar behavior |
| **Page logic** | `index.js`, `about.js`, `programs.js`, etc. | Page-specific content population |
| **Page shell** | `page-shell.js` | Standard init helper for inner pages |

---

## Pages & Features

### Home (`index.html`)
- Fixed navbar with mega-menu and **Donate** CTA
- **Hero section** — headline, mission subtitle, apply/impact buttons, 4-image photo grid, floating “10M+ Lives Impacted” stat card
- **Banner carousel** — auto-rotating slides (AI+Impact Cohort, Agri Cohort, Donate) linking to live AFI pages
- **Stats bar** — animated counters (lives impacted, entrepreneurs, farmers, students)
- **Mission section** — initiatives image, value proposition pillars, link to About
- **Impact areas grid** — 6 sectors (Education, Healthcare, Agriculture, Energy, Livelihoods, Financial Inclusion)
- **Programs preview** — cards linking to program detail pages
- **Testimonials carousel** — 7 quotes from board, mentors, and entrepreneurs
- **Annual Forum** section with image and external link
- **What We Provide** — Funding, Mentorship, Technology cards
- **Partners section** — logo grids by category (Investors, Corporates, Academia/Government)
- **Impact infographic** image
- **Get Involved** cards — Entrepreneur, Mentor, Investor, Partner, Donate
- Footer with org links, contact, social media, newsletter signup

### About Us (`about.html`)
- Light cream page hero
- **Our Story** — narrative paragraphs + journey image
- **Our Journey** — full timeline from 2012 to present
- **Board of Trustees & Directors** — photo cards with names and titles
- **Team** section
- **Partners** — categorized partner logo grids (33+ logos from local `images/` folder)
- **International Chapters** — cards linking to chapter detail pages
- **Photo gallery** — 6 community images

### Programs (`programs.html`)
- Page hero with program overview
- **Tabbed program panels** — AI+Impact Cohort, Agri Cohort, Impact Catalyzer, Women Entrepreneurship (each with image, benefits, apply CTA)
- **Annual Forum** highlight block
- **Resources / What We Provide** grid
- Links to individual **program detail** pages

### Program Detail (`program-detail.html?id=...`)
- Dynamic page for 9 programs: AI+Impact, Agri 1.0/2.0, Catalyzer, Funding, WISE, Accelerator, AI+Agri, Learning & Networking
- Hero, program image, benefits list, apply/learn-more link to live AFI site

### Impact (`impact.html`)
- Page hero
- Key impact statistics
- Sector-by-sector impact breakdown
- Portfolio highlights and visual data sections

### News (`news.html`)
- Page hero
- **Category filters** — All, Recognition, Program, Agriculture, Women, Annual Forum
- **Featured articles** grid + **More Stories** list
- Articles link out to original sources when URLs are available
- **Newsletter signup** (Mailchimp)

### Get Involved (`get-involved.html`)
- Page hero
- **Role tabs** — Social Entrepreneur, Mentor, Investor, Partner (each with description, benefits, interest form)
- Forms redirect to live AFI application URLs
- **Donation section** — INR amount selector with impact description, PayPal modal trigger

### Social Entrepreneurs (`entrepreneurs.html`)
- Full directory of **97 social entrepreneurs** scraped from actionforindia.org
- **Sector filter buttons** — Education, Healthcare, Agriculture, Energy, etc.
- **Search** by venture, founder, or sector
- Cards show logo, sector, founder, website & LinkedIn links
- Apply CTA linking to Accubate application form

### Mentors (`mentors.html`)
- Full directory of **60 mentors**
- **Search** by name, title, or location
- Photo, title, location, LinkedIn per card
- Become a Mentor CTA

### Blog (`blog.html`)
- **19 blog posts** from AFI blog archive
- Cards link to original posts on actionforindia.org

### Media (`media.html`)
- Press coverage and recognition highlights
- Link to full News page

### Careers (`careers.html`)
- Open positions at AFI
- Apply via external careers page or email

### SE Opportunities (`opportunities.html`)
- Role categories for careers at portfolio social enterprises
- Link to AFI SE careers portal

### Annual Forum (`forum.html`)
- Forum edition info, stats, hero image
- Link to full forum microsite

### Chapters (`chapters.html` + `chapter-detail.html`)
- Hub for international chapters (Silicon Valley, UK, etc.)
- Detail pages with chapter-specific content via `?chapter=` URL param

---

## Site-Wide Features

### Navigation
- **Mega-menu** with dropdowns: Get to Know Us, What We Do, Get Involved, More
- Active page highlighting
- **Mobile hamburger menu** with collapsible dropdowns
- **AFI logo** (`images/AFI-logo.png`) in navbar and footer on every page

### Modals
- **Donate modal** — PayPal one-time donation ($12 / $22 / $32)
- **Volunteer modal** — interest form with name, email, phone, reason

### Newsletter
- **Mailchimp** signup in footer (email, name, company, country, category)
- Duplicate signup on News page

### Analytics
- **Google Analytics** (G-8MHQRGD6PY)
- **Facebook Pixel** tracking

### UI/UX
- Scroll-reveal animations on sections and cards
- Animated stat counters on homepage
- Testimonial carousel with prev/next controls
- Banner carousel with dot navigation (5s auto-advance)
- Responsive layouts for tablet and mobile
- Light cream page heroes across all inner pages (matching Figma design)
- Consistent footer with org info, program links, contact, social links

---

## Data & Content (`scraped-data.json`)

| Dataset | Count | Used On |
|---------|-------|---------|
| Social entrepreneurs directory | 97 | Entrepreneurs page |
| Mentors directory | 60 | Mentors page |
| Blog archive | 19 | Blog page |
| News articles + archive | 16+ | News page |
| Program details | 9 | Programs + program detail pages |
| Testimonials | 7 | Homepage |
| Partner logos | 33 local + mapped | Home + About partners sections |
| Board / team members | Full roster | About page |
| Journey timeline | 2012–present | About page |
| Banner images | 3 | Homepage carousel |
| Chapter pages | Silicon Valley, UK | Chapters pages |
| Careers, media, volunteer, PayPal, Mailchimp config | — | Respective pages |

Content was scraped from the live [actionforindia.org](https://actionforindia.org/) site. Re-scrape directories with `python scrape_supplement.py`.

---

## Local Assets (`images/`)

| Asset | Usage |
|-------|-------|
| `AFI-logo.png` | Navbar + footer logo site-wide |
| 33 partner logos | Partners sections (eBay, Intel, NITI Aayog, IDRF, etc.) |

Other images load from the AFI CDN (`actionforindia.org/assets/img/...`) — hero photos, program banners, team photos, SE logos, etc.

---

## Page Inventory (18 HTML pages)

| Page | File |
|------|------|
| Home | `index.html` |
| About Us | `about.html` |
| Programs | `programs.html` |
| Program Detail | `program-detail.html` |
| Impact | `impact.html` |
| News | `news.html` |
| Get Involved | `get-involved.html` |
| Social Entrepreneurs | `entrepreneurs.html` |
| Mentors | `mentors.html` |
| Blog | `blog.html` |
| Media | `media.html` |
| Careers | `careers.html` |
| SE Opportunities | `opportunities.html` |
| Annual Forum | `forum.html` |
| Chapters Hub | `chapters.html` |
| Chapter Detail | `chapter-detail.html` |

---

## What Is Not Included Yet

- Production hosting / deployment setup
- Local download of all CDN images
- Full program & forum microsites (summary pages link out to live AFI site)
- Recurring PayPal donations
- In-page form submission (forms open external AFI URLs)
- 8 partner logos still missing from `images/` folder (Deshpande Foundation, Cisco, Caspian, etc.)

---

*Last updated: June 2026*
