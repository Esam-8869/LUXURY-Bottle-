# MASTER PROMPT — LUXURY BOTTLE WEBSITE
### Full-Stack E-Commerce Build (Production-Ready)

---

## 0. PRE-FLIGHT DECLARATION

Before writing a single line of code, the AI must:

1. Read this entire prompt from top to bottom.
2. Declare the full tech stack it will use.
3. Declare the folder/file structure it will generate.
4. Declare the order of operations (frontend → backend → database → integrations → admin).
5. Only then begin generating code, section by section.

Do not skip ahead. Do not generate partial outputs. Generate **every file completely** — no placeholders, no `// TODO`, no `...rest of code`.

---

## 1. ROLE & MISSION

You are simultaneously:

- The world's best **UI/UX Designer** (Apple, Aesop, Nothing, Dior, Tesla aesthetic)
- A **Creative Director** with a luxury editorial eye
- A **Senior Frontend Engineer** (Next.js 14, TypeScript, Tailwind CSS, Framer Motion, GSAP)
- A **Senior Backend Architect** (Node.js, Express, Prisma, PostgreSQL, Redis)
- A **Database Architect** (normalized schema, indexes, constraints, migrations)
- A **Senior E-commerce Expert** (cart, checkout, inventory, payments, shipping)
- A **DevOps-aware Engineer** (ENV configs, secrets management, deployment-ready)

**Mission:** Build a complete, production-ready luxury bottle e-commerce website. It must feel like Apple.com, Aesop.com, and Nothing.tech had a child — clean, cinematic, expensive-looking — without a single element that looks like a generic Shopify or WooCommerce theme.

---

## 2. DESIGN PHILOSOPHY

### 2.1 Core Aesthetic Principles

- **Minimalism with intention** — every element earns its place; nothing is decorative noise.
- **Negative space as luxury** — wide margins, generous padding, breathing room between sections.
- **Typographic hierarchy** — type does the heavy lifting; headlines are editorial, not promotional.
- **Cinematic pacing** — animations have deliberate timing, easing, and purpose.
- **Material quality** — surfaces feel like glass, linen, marble, or brushed metal — achieved through CSS, not images.
- **Premium tactility** — hover states, micro-interactions, and transitions feel physical and considered.

### 2.2 Color System

```
--color-cream-light:   #EDEEE9   /* Primary background */
--color-warm-white:    #F5EBE1   /* Card backgrounds, hero fills */
--color-blush-mist:    #E3D5CA   /* Dividers, subtle borders */
--color-sand-dark:     #D6CCC2   /* Muted text, icon fills */
--color-dusty-rose:    #D7BDB0   /* Accent, hover states, CTAs */
--color-ink:           #1A1A1A   /* Primary text */
--color-ink-soft:      #4A4A4A   /* Secondary text */
--color-ink-muted:     #8A8A8A   /* Captions, labels */
--color-white:         #FFFFFF   /* Pure white overlays */
--color-glass:         rgba(245, 235, 225, 0.72) /* Glassmorphism fills */
--color-glass-border:  rgba(214, 204, 194, 0.35) /* Glassmorphism borders */
```

**Never use pure black (#000000) for backgrounds or text.** Always use the ink scale above.

### 2.3 Typography System

```
Font Stack:
  Display:  "Cormorant Garamond", Georgia, serif         (hero headings, product names)
  Body:     "DM Sans", "Inter", system-ui, sans-serif    (body, UI, navigation)
  Mono:     "JetBrains Mono", monospace                  (prices, SKUs, codes)

Type Scale (clamp-based, fluid):
  --text-xs:    clamp(0.625rem, 0.5vw + 0.5rem, 0.75rem)
  --text-sm:    clamp(0.75rem, 0.6vw + 0.6rem, 0.875rem)
  --text-base:  clamp(0.875rem, 0.8vw + 0.7rem, 1rem)
  --text-md:    clamp(1rem, 1vw + 0.75rem, 1.125rem)
  --text-lg:    clamp(1.125rem, 1.2vw + 0.8rem, 1.5rem)
  --text-xl:    clamp(1.5rem, 2vw + 1rem, 2.25rem)
  --text-2xl:   clamp(2.25rem, 4vw + 1.5rem, 4rem)
  --text-3xl:   clamp(3rem, 6vw + 2rem, 7rem)

Letter Spacing:
  Display:  -0.03em
  Heading:  -0.015em
  Body:     0em
  Caps:     0.1em (for small caps/labels)

Line Heights:
  Display:  1.0
  Heading:  1.15
  Body:     1.65
  UI:       1.3
```

### 2.4 Spacing System

```
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   24px
--space-6:   32px
--space-7:   48px
--space-8:   64px
--space-9:   96px
--space-10:  128px
--space-11:  192px
--space-12:  256px

Section padding (vertical): --space-10 to --space-12 on desktop, --space-8 to --space-10 on mobile.
```

### 2.5 Motion System

```
Durations:
  --duration-instant:   80ms
  --duration-fast:      160ms
  --duration-normal:    300ms
  --duration-slow:      500ms
  --duration-cinematic: 900ms
  --duration-hero:      1400ms

Easings:
  --ease-standard:   cubic-bezier(0.4, 0, 0.2, 1)
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1)
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1)
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1)
  --ease-luxury:     cubic-bezier(0.76, 0, 0.24, 1)

Rules:
  - All page-load animations use --duration-cinematic minimum.
  - Scroll-triggered reveals stagger at 80ms intervals.
  - All hover transitions use --duration-fast.
  - Image reveals use clip-path wipes, not fade-ins.
  - Respect prefers-reduced-motion: wrap all animations in @media (prefers-reduced-motion: no-preference).
```

### 2.6 Border & Shadow System

```
Border Radius:
  --radius-sm:    4px
  --radius-md:    8px
  --radius-lg:    16px
  --radius-xl:    24px
  --radius-2xl:   40px
  --radius-pill:  9999px
  --radius-card:  var(--radius-xl)

Shadows:
  --shadow-sm:     0 1px 2px rgba(26,26,26,0.04);
  --shadow-md:     0 4px 12px rgba(26,26,26,0.06), 0 1px 3px rgba(26,26,26,0.04);
  --shadow-lg:     0 12px 40px rgba(26,26,26,0.08), 0 4px 12px rgba(26,26,26,0.04);
  --shadow-xl:     0 24px 80px rgba(26,26,26,0.10), 0 8px 24px rgba(26,26,26,0.05);
  --shadow-glass:  0 8px 32px rgba(180,160,145,0.15), inset 0 1px 0 rgba(255,255,255,0.6);
  --shadow-product:0 20px 60px rgba(180,160,145,0.20);

Never use black in shadows. Always use warm-toned rgba values.
```

---

## 3. FULL FILE & FOLDER STRUCTURE

Generate every file listed. Do not skip any.

```
/
├── .env.local                          # Environment variables template
├── .env.example                        # Safe example to commit
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── prisma/
│   ├── schema.prisma                   # Full DB schema
│   └── migrations/
│       └── 001_init.sql               # Initial migration
├── public/
│   ├── fonts/                         # Self-hosted fonts
│   ├── images/                        # Static images
│   └── videos/
│       └── hero-placeholder.mp4       # Placeholder hero video
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Homepage
│   │   ├── globals.css                # Global styles + CSS variables
│   │   ├── not-found.tsx
│   │   ├── loading.tsx                # Global loading UI
│   │   ├── products/
│   │   │   ├── page.tsx               # All products listing
│   │   │   └── [id]/
│   │   │       └── page.tsx           # Product detail page
│   │   ├── categories/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── wishlist/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   ├── page.tsx
│   │   │   └── success/
│   │   │       └── page.tsx
│   │   ├── account/
│   │   │   ├── page.tsx
│   │   │   ├── orders/
│   │   │   │   └── page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── page.tsx               # Admin dashboard
│   │       ├── products/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── orders/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── categories/
│   │       │   └── page.tsx
│   │       ├── customers/
│   │       │   └── page.tsx
│   │       ├── analytics/
│   │       │   └── page.tsx
│   │       ├── coupons/
│   │       │   └── page.tsx
│   │       ├── homepage/
│   │       │   └── page.tsx           # Drag-and-drop homepage editor
│   │       └── integrations/
│   │           └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navigation.tsx         # Glassmorphism sticky nav
│   │   │   ├── Sidebar.tsx            # Animated nested category sidebar
│   │   │   ├── Footer.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── home/
│   │   │   ├── HeroBanner.tsx         # Fullscreen video hero
│   │   │   ├── CategoryStrip.tsx      # 3-category visual strip
│   │   │   ├── FeaturedProduct.tsx    # Editorial featured product
│   │   │   ├── TopSelling.tsx         # 6-7 product grid
│   │   │   ├── WomensCollection.tsx
│   │   │   ├── ChildrensCollection.tsx
│   │   │   ├── AestheticCollection.tsx
│   │   │   ├── WhyChooseUs.tsx
│   │   │   ├── Reviews.tsx
│   │   │   ├── InstagramGallery.tsx
│   │   │   └── Newsletter.tsx
│   │   ├── product/
│   │   │   ├── ProductGallery.tsx     # Touch-friendly image gallery
│   │   │   ├── ColorSelector.tsx      # Swatch-based color picker
│   │   │   ├── VariantSwitcher.tsx    # Image switching on variant change
│   │   │   ├── PriceDisplay.tsx       # Live price with currency
│   │   │   ├── InventoryBadge.tsx     # Stock status badge
│   │   │   ├── AddToCart.tsx
│   │   │   ├── AddToWishlist.tsx
│   │   │   ├── ProductCard.tsx        # Reusable card for grids
│   │   │   ├── RecentlyViewed.tsx
│   │   │   ├── RelatedProducts.tsx
│   │   │   └── FrequentlyBoughtTogether.tsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx         # Slide-in cart panel
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── ShippingForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── CouponInput.tsx
│   │   │   └── OrderSummary.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── ui/
│   │       ├── Button.tsx             # All button variants
│   │       ├── Input.tsx
│   │       ├── Badge.tsx
│   │       ├── Modal.tsx
│   │       ├── Drawer.tsx
│   │       ├── Skeleton.tsx           # Loading skeletons
│   │       ├── Toast.tsx
│   │       ├── Breadcrumb.tsx
│   │       ├── Pagination.tsx
│   │       ├── Rating.tsx
│   │       └── AnimatedSection.tsx    # Scroll-triggered wrapper
│   ├── lib/
│   │   ├── prisma.ts                  # Prisma client singleton
│   │   ├── redis.ts                   # Redis client singleton
│   │   ├── auth.ts                    # JWT helpers
│   │   ├── email.ts                   # Email sending (Nodemailer/Resend)
│   │   ├── cloudinary.ts              # Image upload helpers
│   │   ├── stripe.ts                  # Stripe client
│   │   └── validators.ts              # Zod schemas
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useWishlist.ts
│   │   ├── useRecentlyViewed.ts
│   │   ├── useInventory.ts
│   │   └── useAuth.ts
│   ├── store/
│   │   ├── cartStore.ts               # Zustand cart state
│   │   ├── wishlistStore.ts
│   │   └── uiStore.ts                 # Sidebar, modal, drawer state
│   ├── types/
│   │   └── index.ts                   # All TypeScript interfaces
│   └── app/api/                       # Next.js API Routes
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── register/route.ts
│       │   ├── logout/route.ts
│       │   └── me/route.ts
│       ├── homepage/route.ts
│       ├── categories/route.ts
│       ├── products/
│       │   ├── route.ts
│       │   └── [id]/
│       │       ├── route.ts
│       │       └── variant/route.ts
│       ├── cart/route.ts
│       ├── wishlist/route.ts
│       ├── history/route.ts
│       ├── checkout/route.ts
│       ├── orders/
│       │   └── [id]/route.ts
│       ├── reviews/route.ts
│       ├── coupons/
│       │   └── validate/route.ts
│       ├── admin/
│       │   ├── products/route.ts
│       │   ├── orders/route.ts
│       │   ├── categories/route.ts
│       │   ├── customers/route.ts
│       │   ├── analytics/route.ts
│       │   ├── coupons/route.ts
│       │   ├── homepage/route.ts
│       │   └── integrations/route.ts
│       └── webhooks/
│           ├── stripe/route.ts
│           └── razorpay/route.ts
```

---

## 4. DATABASE SCHEMA (Prisma)

Generate the **complete** `prisma/schema.prisma`. Every model must include:
- All fields with correct types
- All relations
- All `@id`, `@unique`, `@index`, `@default`, `@updatedAt` decorators
- All enum definitions

### Models Required:

#### User
```
id, email (unique), password_hash, first_name, last_name,
phone, role (CUSTOMER | ADMIN), email_verified, created_at, updated_at
Relations: Orders, Cart, Wishlist, RecentlyViewed, Reviews
```

#### Category
```
id, name, slug (unique), description, image_url,
parent_id (nullable, self-relation for nested categories),
position (for ordering), is_active, created_at, updated_at
Relations: parent (Category), children (Category[]), Products
```

#### Product
```
id, name, slug (unique), description (long text), short_description,
base_price (Decimal), sale_price (nullable Decimal),
category_id, is_active, is_featured, is_top_selling,
meta_title, meta_description, tags (String[]),
created_at, updated_at
Relations: Category, ProductImages, ProductVariants,
           OrderItems, WishlistItems, CartItems, RecentlyViewed,
           Reviews, FrequentlyBoughtTogether
```

#### ProductVariant
```
id, product_id, color_name, hex_code, dynamic_image_url,
stock_quantity, sku (unique), price (Decimal — can differ from base),
weight_grams, dimensions_json, is_active, created_at, updated_at
Relations: Product, CartItems, OrderItems, InventoryLogs
```

#### ProductImage
```
id, product_id, variant_id (nullable), url, alt_text,
position (Int), is_primary (Boolean), created_at
Relations: Product, ProductVariant
```

#### Inventory
```
id, variant_id (unique), quantity, reserved_quantity,
low_stock_threshold, created_at, updated_at
Relations: ProductVariant
```

#### InventoryLog
```
id, variant_id, change_amount, reason (SALE | RESTOCK | MANUAL | RESERVATION),
reference_id (order_id etc), created_at
```

#### Order
```
id, user_id, status (PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED),
subtotal, discount_amount, shipping_cost, tax_amount, total,
coupon_id (nullable), shipping_address_json, billing_address_json,
payment_status (PENDING | PAID | FAILED | REFUNDED),
payment_method, payment_reference, tracking_number,
notes, created_at, updated_at
Relations: User, OrderItems, Coupon, Payment
```

#### OrderItem
```
id, order_id, product_id, variant_id, quantity,
unit_price (price at time of purchase — immutable), total_price,
product_snapshot_json (full product data snapshot for receipts)
Relations: Order, Product, ProductVariant
```

#### Cart
```
id, user_id (nullable — guests use session), session_id (nullable),
created_at, updated_at
Relations: User, CartItems
```

#### CartItem
```
id, cart_id, product_id, variant_id, quantity, added_at
Relations: Cart, Product, ProductVariant
```

#### Wishlist
```
id, user_id, created_at
Relations: User, WishlistItems
```

#### WishlistItem
```
id, wishlist_id, product_id, added_at
Relations: Wishlist, Product
```

#### RecentlyViewed
```
id, user_id, product_id, viewed_at
Unique: [user_id, product_id]
Relations: User, Product
```

#### Review
```
id, user_id, product_id, rating (1-5), title, body,
is_verified_purchase, is_approved, created_at, updated_at
Relations: User, Product
```

#### Coupon
```
id, code (unique), description, type (PERCENTAGE | FIXED_AMOUNT | FREE_SHIPPING),
value (Decimal), min_order_amount, max_discount_amount,
usage_limit (nullable), usage_count, user_limit_per_coupon,
is_active, valid_from, valid_until, created_at, updated_at
Relations: Orders
```

#### Payment
```
id, order_id (unique), gateway (STRIPE | RAZORPAY | PAYPAL),
gateway_payment_id, gateway_order_id, amount, currency,
status (PENDING | PROCESSING | COMPLETED | FAILED | REFUNDED),
gateway_response_json, created_at, updated_at
Relations: Order
```

#### HomepageSection
```
id, type (HERO_VIDEO | FEATURED_PRODUCT | COLLECTION | BANNER | CUSTOM_HTML),
title, subtitle, content_json, position, is_active, created_at, updated_at
```

#### HeroVideo
```
id, title, video_url, poster_image_url, overlay_text,
cta_text, cta_url, is_active, position, created_at, updated_at
```

#### Integration
```
id, name (unique slug — e.g. "stripe", "razorpay", "shiprocket"),
display_name, api_key_encrypted, secret_key_encrypted,
webhook_secret_encrypted, config_json, is_enabled,
is_sandbox, last_health_check_at, health_status,
created_at, updated_at
```

#### IntegrationLog
```
id, integration_id, event, request_json, response_json,
status (SUCCESS | ERROR), created_at
Relations: Integration
```

#### FrequentlyBoughtTogether
```
id, product_id, related_product_id, score (Float — higher = more frequently bought)
Unique: [product_id, related_product_id]
Relations: Product
```

---

## 5. ALL API ROUTES — FULL SPEC

Every route must include:
- Request type (GET/POST/PUT/DELETE)
- Request body/params schema (TypeScript interface)
- Response body schema
- Auth requirements (Public | User | Admin)
- Error responses
- Business logic

### 5.1 Auth Routes

#### `POST /api/auth/register`
- Body: `{ email, password, first_name, last_name, phone? }`
- Validates: email format, password strength (min 8 chars, 1 uppercase, 1 number)
- Hashes password with bcrypt (saltRounds: 12)
- Creates User
- Sends welcome email
- Returns: JWT access token + user object (no password)

#### `POST /api/auth/login`
- Body: `{ email, password }`
- Rate limited: 5 attempts per 15 minutes per IP (via Redis)
- Returns: JWT access token (1d expiry) + user object

#### `POST /api/auth/logout`
- Clears httpOnly cookie

#### `GET /api/auth/me`
- Auth: User
- Returns: current user object

### 5.2 Homepage

#### `GET /api/homepage`
- Returns: `{ hero_videos[], sections[], featured_product, top_selling[], categories[] }`
- Cached in Redis with 5-minute TTL

### 5.3 Categories

#### `GET /api/categories`
- Returns: full nested category tree
- Query params: `?flat=true` for flat array

### 5.4 Products

#### `GET /api/products`
- Query params: `?category=slug&page=1&limit=12&sort=price_asc|price_desc|newest|popular&min_price=&max_price=&color=`
- Returns: paginated product list with variants and primary image

#### `GET /api/products/:id`
- Returns: full product with all images, all variants with inventory, reviews avg, related products, frequently bought together

#### `GET /api/products/:id/variant?color=hex_code_or_color_name`
- Returns: specific variant with its images and real-time stock count

### 5.5 Cart

#### `GET /api/cart`
- Auth: User or session cookie
- Returns: cart with all items, subtotals, stock validation flags

#### `POST /api/cart`
- Body: `{ product_id, variant_id, quantity }`
- Validates stock availability before adding
- Merges guest cart into user cart on login

#### `PUT /api/cart`
- Body: `{ cart_item_id, quantity }`
- Set quantity to 0 to remove

#### `DELETE /api/cart`
- Clears entire cart

### 5.6 Wishlist

#### `GET /api/wishlist`
- Auth: User
- Returns: all wishlisted products with current prices and stock status

#### `POST /api/wishlist`
- Body: `{ product_id }`
- Auth: User
- Toggles wishlist (adds if not present, removes if present)

#### `DELETE /api/wishlist/:product_id`
- Auth: User

### 5.7 Recently Viewed

#### `POST /api/history`
- Body: `{ product_id }`
- Auth: User
- Upserts viewedAt; keeps max 10 entries per user (deletes oldest)

#### `GET /api/history/:userId`
- Auth: User (must match userId or be Admin)
- Returns: last 10 recently viewed products

### 5.8 Checkout

#### `POST /api/coupons/validate`
- Body: `{ code, order_amount, user_id }`
- Returns: `{ valid, discount_type, discount_value, message }`

#### `POST /api/checkout`
- Auth: User
- Body: `{ shipping_address, billing_address, coupon_code?, payment_method, payment_token? }`
- Steps (all in a single database transaction with rollback on failure):
  1. Re-fetch all cart items from DB (never trust client-side prices)
  2. Validate all items are still in stock
  3. Lock inventory rows with `SELECT ... FOR UPDATE`
  4. Recalculate subtotal, discount, shipping, tax, total server-side
  5. Create Order record
  6. Create OrderItems with price snapshot
  7. Deduct stock from ProductVariant and Inventory
  8. Create InventoryLog entries
  9. Process payment (Stripe/Razorpay)
  10. If payment fails → rollback transaction
  11. If payment succeeds → commit
  12. Clear cart
  13. Send order confirmation email (async, non-blocking)
- Returns: `{ order_id, order_number, total, status, payment_status }`

### 5.9 Reviews

#### `POST /api/reviews`
- Auth: User
- Body: `{ product_id, rating, title, body }`
- Validates: user has a completed order containing this product (verified purchase)

#### `GET /api/products/:id/reviews?page=1&limit=10&sort=newest|highest|lowest`
- Public
- Returns: paginated reviews with user first name, verified badge

### 5.10 Admin Routes (all require Admin JWT)

#### `GET/POST/PUT/DELETE /api/admin/products`
- Full CRUD with image upload to Cloudinary/S3
- Variant management
- Bulk operations: activate, deactivate, delete

#### `GET/PUT /api/admin/orders`
- List with filters: status, date range, search by email/order_id
- Update status and tracking number
- Trigger refund

#### `GET/POST/PUT/DELETE /api/admin/categories`
- Nested category management with drag-and-drop position support

#### `GET /api/admin/customers`
- List with order count, total spent, last order date

#### `GET /api/admin/analytics`
- Revenue by day/week/month (last 90 days)
- Top products by units sold and by revenue
- Conversion funnel (sessions → cart → checkout → order)
- New vs returning customers

#### `GET/POST/PUT/DELETE /api/admin/coupons`

#### `GET/PUT /api/admin/homepage`
- Manage HomepageSection ordering, content
- Manage HeroVideo pool

#### `GET/POST/PUT /api/admin/integrations`
- List all available integrations (hardcoded catalog)
- Store and retrieve API keys (encrypted at rest with AES-256)
- Toggle enable/disable
- Trigger health check
- View integration logs with retry button

---

## 6. SECTION-BY-SECTION UI SPEC

### 6.1 Navigation (Sticky Glass)

Structure:
- Sticky, `position: fixed`, full-width
- Background: glassmorphism (`backdrop-filter: blur(20px) saturate(180%)`, `background: var(--color-glass)`, border-bottom: `1px solid var(--color-glass-border)`)
- Left: Logo (wordmark in Cormorant Garamond, Display font, 22px, letter-spacing -0.03em)
- Center: Nav links — `Children | Women | Aesthetic Collection` (DM Sans, 13px, caps, letter-spacing 0.08em)
- Right: Search icon + Wishlist icon (with count badge) + Cart icon (with count badge) + Account icon
- On hover over category link: mega-dropdown appears with subcategories and featured image
- On scroll past hero: nav transitions from transparent to glass
- Mobile: hamburger → full-screen mobile menu with animated staggered links

### 6.2 Hero Banner (Fullscreen Video)

- `height: 100svh`, `overflow: hidden`
- Fullscreen `<video>` tag: `autoPlay muted loop playsInline`
- `object-fit: cover`, `object-position: center`
- Overlay: very subtle gradient from `rgba(26,26,26,0.15)` at top to `rgba(26,26,26,0.35)` at bottom
- Content (centered, bottom-third of screen):
  - Eyebrow label: `THE NEW COLLECTION` (caps, letter-spacing 0.2em, 11px, cream color)
  - Headline: 3-line editorial headline in Cormorant Garamond, fluid 5–7vw, color white
  - Subheadline: 1 line, DM Sans, 16px, rgba(255,255,255,0.75)
  - CTA button: outlined style, white border, white text, hover → filled with `var(--color-dusty-rose)`
- On load: headline words animate in with staggered clip-path reveal (from bottom, 80ms stagger per word)
- Scroll indicator: thin animated line pulsing downward at bottom center

### 6.3 Category Strip

- 3 equal-width cards side by side (on mobile: vertical stack)
- Each card: full-bleed image, gradient overlay, category name centered in Cormorant Garamond italic
- On hover: image scales to 1.05, overlay lightens, text translates up 4px
- Cards: `Children | Women | Aesthetic Collection`

### 6.4 Featured Product (Editorial)

- Full-width section, alternating image/text layout (image left, text right)
- Image: large, fills ~55% width, tall aspect ratio, subtle parallax on scroll
- Text side: eyebrow, product name (display serif, large), description (2–3 sentences), price, CTA
- Background: `var(--color-warm-white)`

### 6.5 Top Selling Products Grid

- Section heading: `Best Sellers` — left-aligned, display serif
- Grid: 3 columns on desktop, 2 on tablet, 1 on mobile
- 6–7 ProductCards
- ProductCard anatomy:
  - Image container: aspect-ratio 4/5, overflow hidden, `var(--radius-card)` border radius
  - On hover: image scales 1.04 over 400ms, secondary image cross-fades in (if available)
  - Quick-add button: slides up from bottom of image on hover, glassmorphism pill button
  - Below image: product name (16px, medium weight), color swatches (4px gap dots), price
  - Wishlist heart icon: top-right of image, appears on hover

### 6.6 Collection Sections (Women's, Children's, Aesthetic)

Each collection section:
- 2-column editorial layout: large hero product image + stacked 2×2 grid of smaller products
- Section heading with thin divider line
- "View All" text link at bottom right

### 6.7 Why Choose Us

4 columns, each with:
- Icon (SVG, 32×32, `var(--color-dusty-rose)`)
- Heading (DM Sans, 16px, semi-bold)
- Description (14px, muted)

Content ideas: Premium Materials, Free Shipping, Easy Returns, Lifetime Warranty

### 6.8 Customer Reviews

- Section heading + aggregate rating (stars + count)
- Horizontal scroll carousel of review cards on mobile, 3-column grid on desktop
- Each card: glassmorphism surface, reviewer name (first name + last initial), verified badge, rating stars, review text, date
- Animated: cards fade up on scroll with 80ms stagger

### 6.9 Instagram Gallery

- 6–8 image grid (masonry or equal-square)
- Hover: Instagram icon overlay + like count
- Link: opens Instagram profile

### 6.10 Newsletter

- Full-width section
- Background: `var(--color-ink)` (dark, high contrast for visual break)
- Heading in Cormorant Garamond, large, color white
- Subtext: "Join 50,000+ subscribers. No spam." in muted cream
- Email input + Subscribe button in a row
- On success: input replaced by a checkmark animation + "You're in." message

### 6.11 Footer

- 4-column layout:
  - Brand column: Logo, tagline, social icons
  - Shop: category links
  - Help: FAQ, Shipping, Returns, Contact
  - Legal: Privacy, Terms, Cookie Policy
- Bottom bar: copyright + payment icons (Stripe, Razorpay, PayPal)
- Background: `var(--color-ink-soft)`, text in light tones

---

## 7. PRODUCT DETAIL PAGE — FULL SPEC

Layout: 2-column on desktop (gallery left, info right), 1-column on mobile

### 7.1 Image Gallery
- Primary large image (60% of left column)
- Thumbnail strip below (horizontal scroll on mobile)
- Clicking thumbnail: smooth crossfade swap of main image
- Pinch-to-zoom on mobile
- Full-screen lightbox on click (desktop)

### 7.2 Product Info Panel (right column, sticky)
- Breadcrumb: `Home > Women > Product Name`
- Product name: display serif, 32–48px
- Rating summary: stars + "24 reviews" link (scrolls to reviews)
- Price: large mono font
  - If sale: `<strike>original</strike>` + sale price in dusty rose
- Short description: 2-3 sentences
- Color Selector:
  - Label: `Color: Sage Green` (updates dynamically)
  - Swatches: circular 28px dots, border on selected, tooltip on hover
  - On selection: variant images load instantly, price updates, stock badge updates
- Quantity selector: `−` / `1` / `+` (disabled at stock limit)
- Inventory badge:
  - > 10 units: no badge
  - 4–10 units: `Only 6 left in stock` (amber)
  - 1–3 units: `Almost gone!` (red)
  - 0 units: `Out of stock` (greyed out CTA)
- CTA buttons:
  - Primary: `Add to Cart` (full width, dark fill)
  - Secondary: `Add to Wishlist` (outlined)
- Delivery estimator: based on postcode input → "Estimated delivery: 3–5 business days"
- Collapsible accordions: Description | Specifications | Shipping & Returns | Care Instructions

### 7.3 Frequently Bought Together
- Horizontal row of 2–3 products with combined price and single "Add All" button

### 7.4 Reviews Section
- Sort dropdown: Newest | Highest Rated | Lowest Rated
- Paginated review cards
- Write a review form (if logged in and verified purchaser)

### 7.5 Related Products
- Same category, 4 cards, horizontal scroll on mobile

### 7.6 Recently Viewed
- Last 4–6 viewed products, horizontal strip at bottom of page

---

## 8. CART DRAWER

- Slides in from the right (`translateX(100%)` → `translateX(0)`)
- Overlay backdrop: `rgba(26,26,26,0.4)` with blur
- Header: `Your Cart (3 items)`
- Item list: scrollable
  - Each item: thumbnail, name, color, quantity stepper, price, remove button
- Footer (sticky inside drawer):
  - Subtotal
  - Coupon code input
  - Shipping estimate
  - `Proceed to Checkout` button (full width)
  - `Continue Shopping` link

---

## 9. CHECKOUT FLOW

3-step progress indicator at top: `1. Shipping → 2. Payment → 3. Review`

### Step 1 — Shipping
- Fields: First Name, Last Name, Email, Phone, Address Line 1, Address Line 2, City, State/Province, ZIP, Country
- Save address checkbox (for logged-in users)
- Shipping method selector with prices and estimated delivery

### Step 2 — Payment
- Stripe Card Element (or Razorpay if India is selected country)
- Billing address: same as shipping checkbox or separate form

### Step 3 — Review & Place Order
- Full order summary with product thumbnails
- Coupon code section (if not already applied)
- Final totals: Subtotal + Discount + Shipping + Tax = Total
- `Place Order` button → triggers `/api/checkout`
- Loading state: spinner + "Securing your order..." text
- Success: redirect to `/checkout/success` with order confirmation

---

## 10. ADMIN DASHBOARD

### 10.1 Dashboard Overview
- Metric cards: Total Revenue (MTD), Orders Today, New Customers, Avg Order Value
- Revenue chart: line chart, last 30 days
- Recent orders table: last 10, with status badges
- Low stock alerts: variants below threshold

### 10.2 Product Manager
- Table with search, filters (category, status), bulk actions
- Inline quick-edit for price, stock, status
- Full product form: all fields, variant management (add/edit/delete), image uploader with drag-and-drop reorder

### 10.3 Order Manager
- Table with filters: status, date range, search
- Order detail view: customer info, items, timeline of status changes, tracking input, refund button

### 10.4 Homepage Editor
- Visual representation of sections with drag-and-drop reorder
- Each section has an Edit button → opens a form to update content, image, CTA
- HeroVideo pool: upload/link videos, set active, reorder

### 10.5 Integration Center
- Card grid of all supported integrations (active + available)
- Active integrations show green health badge + last ping time
- Clicking any card → opens integration settings sheet with:
  - API Key field (masked)
  - Secret Key field (masked)
  - Webhook URL (read-only, for setting in provider's dashboard)
  - Sandbox/Production toggle
  - Enable/Disable toggle
  - Health Check button → triggers live ping to integration
  - Logs tab: last 50 events with status, request preview, retry button

---

## 11. INTEGRATION CATALOG

Generate an `integrations.catalog.ts` file listing all integrations as typed objects:

```typescript
type IntegrationType = "commerce" | "payment" | "shipping" | "analytics" | "media";

interface IntegrationDefinition {
  id: string;            // e.g. "stripe"
  displayName: string;   // e.g. "Stripe"
  type: IntegrationType;
  logoUrl: string;
  description: string;
  fields: IntegrationField[];
  webhookEvents?: string[];
  docsUrl: string;
  sandboxSupported: boolean;
}
```

Required integrations:

**Commerce Platforms:** Athle Commerce API, Shopify, WooCommerce, Commerce Layer, Medusa, Saleor

**Payment Gateways:** Stripe, Razorpay, PayPal

**Shipping Providers:** Shiprocket, Delhivery, DHL, FedEx, UPS, Blue Dart

**Analytics & Tracking:** Google Analytics 4, Meta Pixel (Facebook Pixel)

**Media & Storage:** Cloudinary, AWS S3

Each integration configuration form must have:
- API Key (encrypted before storage)
- Secret Key (encrypted before storage)
- Webhook URL (auto-generated, read-only)
- Webhook Secret (for verifying incoming webhooks)
- Sandbox mode toggle
- Enable/Disable toggle
- Health check endpoint
- Event log with retry button

Encryption: use AES-256-GCM with a `ENCRYPTION_KEY` env variable. Never store plain-text API keys in the database.

---

## 12. ANIMATION BLUEPRINT

### Page Load Sequence
```
0ms:     Nav fades in (opacity 0 → 1, translateY(-8px) → 0)
200ms:   Hero video starts playing
400ms:   Hero eyebrow label clips in (clip-path reveal, bottom to top)
600ms:   Hero headline word 1 clips in
680ms:   Hero headline word 2 clips in
760ms:   Hero headline word 3... (80ms per word)
900ms:   Hero subtext fades up
1100ms:  Hero CTA slides up + fades in
```

### Scroll Animations (use IntersectionObserver + Framer Motion)
- All sections start at `opacity: 0, translateY: 24px`
- On entering viewport: animate to `opacity: 1, translateY: 0` over 600ms `var(--ease-decelerate)`
- Product grid cards stagger: 60ms per card
- Review cards stagger: 80ms per card

### ProductCard Hover
```
Image: scale(1.04) over 400ms ease
Second image: opacity 0 → 1 over 300ms (crossfade)
Quick-add pill: translateY(100%) → translateY(0) over 300ms spring ease
```

### Cart Drawer
```
Overlay: opacity 0 → 0.4 over 200ms
Drawer: translateX(100%) → translateX(0) over 400ms var(--ease-decelerate)
Items stagger in: 50ms each
```

### Color Swatch Selection
```
Main image: opacity 0 → 1 (100ms) crossfade to new variant image
Price: fast number counter animation if price differs
Stock badge: fade out → fade in with new text
```

---

## 13. ACCESSIBILITY REQUIREMENTS (WCAG 2.1 AA)

- All interactive elements have visible `:focus-visible` rings (2px `var(--color-ink)` offset 2px)
- Color contrast ratios: all text ≥ 4.5:1 against background
- All images have descriptive `alt` attributes (pulled from `ProductImage.alt_text`)
- All icon buttons have `aria-label`
- Modal/Drawer: focus trap, Escape to close, aria-modal="true"
- Cart count badge: `aria-live="polite"` region
- Skip-to-content link: visually hidden until focused
- Video hero: muted by default, pause button visible, no autoplay if prefers-reduced-motion
- Form fields: all have `<label>`, error messages linked via `aria-describedby`
- Color swatches: `role="radio"` within `role="radiogroup"`, aria-label includes color name

---

## 14. SEO REQUIREMENTS

- Every page uses Next.js `generateMetadata()` for dynamic meta tags
- Product pages: `og:image`, `og:title`, `og:description`, `product:price:amount`
- Structured data (JSON-LD) on product pages:
  - `Product` schema with name, image, offers (price, availability, seller), aggregateRating
- Canonical URLs on all pages
- `robots.txt` and `sitemap.xml` auto-generated (Next.js built-in)
- `next/image` for all product images: lazy loading, WebP/AVIF conversion, blur placeholder
- Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, FID < 100ms

---

## 15. SECURITY REQUIREMENTS

- Passwords: bcrypt with saltRounds: 12
- JWT: HS256, 1-day access token, stored in httpOnly Secure SameSite=Strict cookie
- All admin routes: verify `user.role === 'ADMIN'` in middleware
- Rate limiting (Redis): 5 login attempts per 15 min per IP; 30 API calls per minute per user
- CSRF: use `csurf` middleware on all mutation routes
- Helmet.js: all HTTP security headers
- Input validation: Zod schemas on all API inputs; never pass raw user input to Prisma queries
- SQL injection: Prisma parameterized queries (never raw SQL with user input)
- XSS: DOMPurify on any user-generated HTML displayed (reviews, etc.)
- API key encryption: AES-256-GCM for all stored integration secrets
- Content Security Policy: strict CSP headers via Next.js config
- Image uploads: validate MIME type server-side; stream to Cloudinary/S3, never save to disk

---

## 16. ENVIRONMENT VARIABLES

Generate a complete `.env.example` file:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/luxurybottles

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-256-bit-random-secret

# Encryption (for API keys at rest)
ENCRYPTION_KEY=your-256-bit-random-key

# Email (Resend or Nodemailer)
RESEND_API_KEY=
EMAIL_FROM=hello@yourdomain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# AWS S3 (alternative to Cloudinary)
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# Meta Pixel
NEXT_PUBLIC_META_PIXEL_ID=
```

---

## 17. CODE QUALITY STANDARDS

- **TypeScript**: strict mode, no `any` types, all props fully typed
- **Error handling**: all API routes wrapped in try/catch, return typed error responses `{ error: string, code: string }`
- **Loading states**: all data-fetching components have skeleton loading states
- **Empty states**: all lists/grids have illustrated empty state components
- **No magic numbers**: all values in constants or CSS variables
- **Consistent naming**: camelCase for JS/TS, kebab-case for CSS classes, PascalCase for components
- **Comments**: JSDoc on all utility functions; inline comments only when logic is non-obvious
- **Imports**: absolute imports via `@/` alias configured in tsconfig.json

---

## 18. OUTPUT INSTRUCTION

Generate files in the following order. Complete each file fully before moving to the next:

1. `package.json` — all dependencies pinned to specific versions
2. `.env.example`
3. `tsconfig.json`
4. `tailwind.config.ts` — with the full design token system
5. `next.config.ts`
6. `prisma/schema.prisma` — full schema
7. `src/types/index.ts` — all TypeScript interfaces mirroring the schema
8. `src/lib/prisma.ts`, `redis.ts`, `auth.ts`, `email.ts`, `cloudinary.ts`, `stripe.ts`, `validators.ts`
9. `src/app/globals.css` — all CSS variables, resets, global styles
10. All UI components (`src/components/ui/`)
11. All layout components (`src/components/layout/`)
12. All homepage section components (`src/components/home/`)
13. All product components (`src/components/product/`)
14. All API routes (`src/app/api/`)
15. All page files (`src/app/**/page.tsx`)
16. All admin pages
17. `integrations.catalog.ts`

**Do not truncate any file. Do not use `// ... rest of code`. Every file must be complete and copy-pasteable.**

---

## 19. FINAL CHECKLIST

Before declaring done, verify the generated code satisfies every item:

- [ ] All 17+ database models present in schema.prisma with correct relations
- [ ] All API routes implemented with auth guards, validation, and error handling
- [ ] Checkout uses a database transaction with rollback
- [ ] All admin routes require admin role
- [ ] All integration API keys are encrypted before storage
- [ ] Navigation is glassmorphism and sticky
- [ ] Hero has fullscreen video with animated text reveal
- [ ] ProductCard has hover image swap and quick-add
- [ ] Color swatch selection dynamically updates image, price, and stock
- [ ] Cart drawer is slide-in with item management
- [ ] Checkout is multi-step with server-side price recalculation
- [ ] All pages have SEO meta tags and structured data
- [ ] All interactive elements are accessible (ARIA, focus, contrast)
- [ ] All animations respect prefers-reduced-motion
- [ ] JWT stored in httpOnly cookie
- [ ] Rate limiting on auth routes
- [ ] `.env.example` documents every variable
- [ ] No TypeScript `any` types
- [ ] No hardcoded values — all in constants or CSS variables
- [ ] Mobile-first responsive design at all breakpoints (320px, 768px, 1024px, 1440px)
```
