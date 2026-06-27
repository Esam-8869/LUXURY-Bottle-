# BACKEND FIX PROMPT — LUXURY BOTTLE WEBSITE
### Complete Backend Implementation (Drop-in for Existing Frontend)

---

## 0. CONTEXT & MISSION

I have an **existing luxury bottle e-commerce website** already built with:
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion / GSAP**

The **frontend UI is complete and working visually**, but the entire backend is non-functional. Nothing works: cart, wishlist, auth, checkout, product fetching, reviews — all broken because there is no real backend behind them.

**Your job is backend-only.** Do NOT touch, rewrite, or modify any frontend component, page UI, or styling. Your entire job is:

1. Set up the PostgreSQL database with Prisma (full schema + migration)
2. Set up Redis for caching and rate limiting
3. Create every API route under `src/app/api/`
4. Create all lib utilities (`prisma.ts`, `redis.ts`, `auth.ts`, etc.)
5. Create all Zustand stores that the frontend hooks connect to
6. Create all custom hooks (`useCart`, `useWishlist`, etc.)
7. Wire up the frontend to the backend by replacing mock/stub functions with real API calls
8. Seed the database with realistic sample data so the site is immediately usable

**Do not truncate any file. Do not write `// TODO` or `// ...rest of code`. Every single file must be 100% complete.**

---

## 1. EXACT TECH STACK (Do Not Deviate)

```
Runtime:      Node.js 20+
Framework:    Next.js 14 (App Router, src/ directory)
Language:     TypeScript 5 (strict mode)
Database:     PostgreSQL 15+
ORM:          Prisma 5
Cache/Store:  Redis 7 (via ioredis)
Auth:         JWT (jose library) stored in httpOnly cookie
Validation:   Zod 3
State:        Zustand 4
Email:        Resend (or Nodemailer as fallback)
Payments:     Stripe (primary) + Razorpay (secondary)
Images:       Cloudinary (upload) + next/image (display)
Encryption:   Node.js built-in crypto (AES-256-GCM)
```

---

## 2. STEP 0 — INSTALL ALL DEPENDENCIES FIRST

Generate the complete `package.json` with every backend dependency pinned to exact versions. Then show the exact install command:

```bash
npm install prisma @prisma/client ioredis jose bcryptjs zod zustand resend stripe razorpay cloudinary @auth/core cookie helmet express-rate-limit
npm install -D @types/bcryptjs @types/cookie prisma
```

Full `package.json` dependencies section:

```json
{
  "dependencies": {
    "@prisma/client": "^5.14.0",
    "bcryptjs": "^2.4.3",
    "cloudinary": "^2.3.1",
    "cookie": "^0.6.0",
    "ioredis": "^5.3.2",
    "jose": "^5.4.1",
    "next": "14.2.5",
    "razorpay": "^2.9.2",
    "resend": "^3.3.0",
    "stripe": "^16.1.0",
    "zod": "^3.23.8",
    "zustand": "^4.5.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cookie": "^0.6.0",
    "@types/node": "^20",
    "prisma": "^5.14.0",
    "typescript": "^5"
  }
}
```

---

## 3. ENVIRONMENT VARIABLES

### File: `.env.local` (create this — never commit to git)

```env
# ─── App ──────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# ─── Database ─────────────────────────────────────────────────
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/luxurybottles?schema=public"

# ─── Redis ────────────────────────────────────────────────────
REDIS_URL="redis://localhost:6379"

# ─── Auth ─────────────────────────────────────────────────────
JWT_SECRET="generate-a-random-256-bit-secret-here"
JWT_EXPIRES_IN="1d"

# ─── Encryption (for storing integration API keys) ────────────
ENCRYPTION_KEY="generate-a-random-32-byte-hex-string"

# ─── Email ────────────────────────────────────────────────────
RESEND_API_KEY=""
EMAIL_FROM="hello@luxurybottles.com"

# ─── Cloudinary ───────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""

# ─── Stripe ───────────────────────────────────────────────────
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""

# ─── Razorpay ─────────────────────────────────────────────────
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
RAZORPAY_WEBHOOK_SECRET=""

# ─── Analytics ────────────────────────────────────────────────
NEXT_PUBLIC_GA_MEASUREMENT_ID=""
NEXT_PUBLIC_META_PIXEL_ID=""
```

### File: `.env.example` (safe to commit — no real values)

Same file as above but with all values empty strings or placeholder comments.

---

## 4. DATABASE — PRISMA SCHEMA

### File: `prisma/schema.prisma`

Generate the **complete, production-ready Prisma schema**. Every model, every field, every relation, every index. No shortcuts.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── ENUMS ────────────────────────────────────────────────────────────────────

enum Role {
  CUSTOMER
  ADMIN
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum PaymentGateway {
  STRIPE
  RAZORPAY
  PAYPAL
}

enum CouponType {
  PERCENTAGE
  FIXED_AMOUNT
  FREE_SHIPPING
}

enum InventoryChangeReason {
  SALE
  RESTOCK
  MANUAL_ADJUSTMENT
  RESERVATION
  RESERVATION_RELEASE
}

enum HomepageSectionType {
  HERO_VIDEO
  FEATURED_PRODUCT
  COLLECTION
  BANNER
  WHY_CHOOSE_US
  REVIEWS
  NEWSLETTER
  INSTAGRAM
}

enum IntegrationHealthStatus {
  HEALTHY
  DEGRADED
  DOWN
  UNKNOWN
}

enum IntegrationLogStatus {
  SUCCESS
  ERROR
}

// ─── MODELS ───────────────────────────────────────────────────────────────────

model User {
  id             String   @id @default(cuid())
  email          String   @unique
  passwordHash   String   @map("password_hash")
  firstName      String   @map("first_name")
  lastName       String   @map("last_name")
  phone          String?
  role           Role     @default(CUSTOMER)
  emailVerified  Boolean  @default(false) @map("email_verified")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  orders         Order[]
  cart           Cart?
  wishlist       Wishlist?
  recentlyViewed RecentlyViewed[]
  reviews        Review[]

  @@index([email])
  @@map("users")
}

model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?
  imageUrl    String?    @map("image_url")
  parentId    String?    @map("parent_id")
  position    Int        @default(0)
  isActive    Boolean    @default(true) @map("is_active")
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  parent   Category?  @relation("CategoryChildren", fields: [parentId], references: [id])
  children Category[] @relation("CategoryChildren")
  products Product[]

  @@index([slug])
  @@index([parentId])
  @@map("categories")
}

model Product {
  id               String   @id @default(cuid())
  name             String
  slug             String   @unique
  description      String
  shortDescription String?  @map("short_description")
  basePrice        Decimal  @map("base_price") @db.Decimal(10, 2)
  salePrice        Decimal? @map("sale_price") @db.Decimal(10, 2)
  categoryId       String   @map("category_id")
  isActive         Boolean  @default(true) @map("is_active")
  isFeatured       Boolean  @default(false) @map("is_featured")
  isTopSelling     Boolean  @default(false) @map("is_top_selling")
  metaTitle        String?  @map("meta_title")
  metaDescription  String?  @map("meta_description")
  tags             String[]
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  category                  Category                 @relation(fields: [categoryId], references: [id])
  images                    ProductImage[]
  variants                  ProductVariant[]
  orderItems                OrderItem[]
  wishlistItems             WishlistItem[]
  cartItems                 CartItem[]
  recentlyViewed            RecentlyViewed[]
  reviews                   Review[]
  frequentlyBoughtTogether  FrequentlyBoughtTogether[] @relation("ProductFBT")
  frequentlyBoughtWith      FrequentlyBoughtTogether[] @relation("RelatedProductFBT")

  @@index([slug])
  @@index([categoryId])
  @@index([isActive, isTopSelling])
  @@index([isActive, isFeatured])
  @@map("products")
}

model ProductVariant {
  id              String   @id @default(cuid())
  productId       String   @map("product_id")
  colorName       String   @map("color_name")
  hexCode         String   @map("hex_code")
  dynamicImageUrl String?  @map("dynamic_image_url")
  stockQuantity   Int      @default(0) @map("stock_quantity")
  sku             String   @unique
  price           Decimal  @db.Decimal(10, 2)
  weightGrams     Int?     @map("weight_grams")
  dimensionsJson  Json?    @map("dimensions_json")
  isActive        Boolean  @default(true) @map("is_active")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  product       Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
  images        ProductImage[]
  cartItems     CartItem[]
  orderItems    OrderItem[]
  inventory     Inventory?
  inventoryLogs InventoryLog[]

  @@index([productId])
  @@index([sku])
  @@map("product_variants")
}

model ProductImage {
  id        String   @id @default(cuid())
  productId String   @map("product_id")
  variantId String?  @map("variant_id")
  url       String
  altText   String?  @map("alt_text")
  position  Int      @default(0)
  isPrimary Boolean  @default(false) @map("is_primary")
  createdAt DateTime @default(now()) @map("created_at")

  product Product         @relation(fields: [productId], references: [id], onDelete: Cascade)
  variant ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)

  @@index([productId])
  @@index([variantId])
  @@map("product_images")
}

model Inventory {
  id                 String   @id @default(cuid())
  variantId          String   @unique @map("variant_id")
  quantity           Int      @default(0)
  reservedQuantity   Int      @default(0) @map("reserved_quantity")
  lowStockThreshold  Int      @default(5) @map("low_stock_threshold")
  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")

  variant ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)

  @@map("inventory")
}

model InventoryLog {
  id          String                @id @default(cuid())
  variantId   String                @map("variant_id")
  changeAmount Int                  @map("change_amount")
  reason      InventoryChangeReason
  referenceId String?               @map("reference_id")
  createdAt   DateTime              @default(now()) @map("created_at")

  variant ProductVariant @relation(fields: [variantId], references: [id])

  @@index([variantId])
  @@map("inventory_logs")
}

model Order {
  id                  String        @id @default(cuid())
  userId              String        @map("user_id")
  status              OrderStatus   @default(PENDING)
  subtotal            Decimal       @db.Decimal(10, 2)
  discountAmount      Decimal       @default(0) @map("discount_amount") @db.Decimal(10, 2)
  shippingCost        Decimal       @default(0) @map("shipping_cost") @db.Decimal(10, 2)
  taxAmount           Decimal       @default(0) @map("tax_amount") @db.Decimal(10, 2)
  total               Decimal       @db.Decimal(10, 2)
  couponId            String?       @map("coupon_id")
  shippingAddressJson Json          @map("shipping_address_json")
  billingAddressJson  Json          @map("billing_address_json")
  paymentStatus       PaymentStatus @default(PENDING) @map("payment_status")
  paymentMethod       String?       @map("payment_method")
  paymentReference    String?       @map("payment_reference")
  trackingNumber      String?       @map("tracking_number")
  notes               String?
  createdAt           DateTime      @default(now()) @map("created_at")
  updatedAt           DateTime      @updatedAt @map("updated_at")

  user       User        @relation(fields: [userId], references: [id])
  coupon     Coupon?     @relation(fields: [couponId], references: [id])
  items      OrderItem[]
  payment    Payment?

  @@index([userId])
  @@index([status])
  @@index([createdAt])
  @@map("orders")
}

model OrderItem {
  id                  String   @id @default(cuid())
  orderId             String   @map("order_id")
  productId           String   @map("product_id")
  variantId           String   @map("variant_id")
  quantity            Int
  unitPrice           Decimal  @map("unit_price") @db.Decimal(10, 2)
  totalPrice          Decimal  @map("total_price") @db.Decimal(10, 2)
  productSnapshotJson Json     @map("product_snapshot_json")
  createdAt           DateTime @default(now()) @map("created_at")

  order   Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product        @relation(fields: [productId], references: [id])
  variant ProductVariant @relation(fields: [variantId], references: [id])

  @@index([orderId])
  @@map("order_items")
}

model Cart {
  id        String     @id @default(cuid())
  userId    String?    @unique @map("user_id")
  sessionId String?    @unique @map("session_id")
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")

  user  User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
  items CartItem[]

  @@map("carts")
}

model CartItem {
  id        String   @id @default(cuid())
  cartId    String   @map("cart_id")
  productId String   @map("product_id")
  variantId String   @map("variant_id")
  quantity  Int
  addedAt   DateTime @default(now()) @map("added_at")

  cart    Cart           @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product Product        @relation(fields: [productId], references: [id])
  variant ProductVariant @relation(fields: [variantId], references: [id])

  @@unique([cartId, variantId])
  @@index([cartId])
  @@map("cart_items")
}

model Wishlist {
  id        String         @id @default(cuid())
  userId    String         @unique @map("user_id")
  createdAt DateTime       @default(now()) @map("created_at")

  user  User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  items WishlistItem[]

  @@map("wishlists")
}

model WishlistItem {
  id         String   @id @default(cuid())
  wishlistId String   @map("wishlist_id")
  productId  String   @map("product_id")
  addedAt    DateTime @default(now()) @map("added_at")

  wishlist Wishlist @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
  product  Product  @relation(fields: [productId], references: [id])

  @@unique([wishlistId, productId])
  @@map("wishlist_items")
}

model RecentlyViewed {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  productId String   @map("product_id")
  viewedAt  DateTime @default(now()) @map("viewed_at")

  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])

  @@unique([userId, productId])
  @@index([userId, viewedAt])
  @@map("recently_viewed")
}

model Review {
  id                 String   @id @default(cuid())
  userId             String   @map("user_id")
  productId          String   @map("product_id")
  rating             Int
  title              String
  body               String
  isVerifiedPurchase Boolean  @default(false) @map("is_verified_purchase")
  isApproved         Boolean  @default(false) @map("is_approved")
  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")

  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@index([productId, isApproved])
  @@map("reviews")
}

model Coupon {
  id                 String     @id @default(cuid())
  code               String     @unique
  description        String?
  type               CouponType
  value              Decimal    @db.Decimal(10, 2)
  minOrderAmount     Decimal?   @map("min_order_amount") @db.Decimal(10, 2)
  maxDiscountAmount  Decimal?   @map("max_discount_amount") @db.Decimal(10, 2)
  usageLimit         Int?       @map("usage_limit")
  usageCount         Int        @default(0) @map("usage_count")
  userLimitPerCoupon Int        @default(1) @map("user_limit_per_coupon")
  isActive           Boolean    @default(true) @map("is_active")
  validFrom          DateTime   @map("valid_from")
  validUntil         DateTime   @map("valid_until")
  createdAt          DateTime   @default(now()) @map("created_at")
  updatedAt          DateTime   @updatedAt @map("updated_at")

  orders Order[]

  @@index([code])
  @@map("coupons")
}

model Payment {
  id                  String         @id @default(cuid())
  orderId             String         @unique @map("order_id")
  gateway             PaymentGateway
  gatewayPaymentId    String?        @map("gateway_payment_id")
  gatewayOrderId      String?        @map("gateway_order_id")
  amount              Decimal        @db.Decimal(10, 2)
  currency            String         @default("USD")
  status              PaymentStatus  @default(PENDING)
  gatewayResponseJson Json?          @map("gateway_response_json")
  createdAt           DateTime       @default(now()) @map("created_at")
  updatedAt           DateTime       @updatedAt @map("updated_at")

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@map("payments")
}

model HomepageSection {
  id          String              @id @default(cuid())
  type        HomepageSectionType
  title       String?
  subtitle    String?
  contentJson Json?               @map("content_json")
  position    Int                 @default(0)
  isActive    Boolean             @default(true) @map("is_active")
  createdAt   DateTime            @default(now()) @map("created_at")
  updatedAt   DateTime            @updatedAt @map("updated_at")

  @@index([isActive, position])
  @@map("homepage_sections")
}

model HeroVideo {
  id            String   @id @default(cuid())
  title         String
  videoUrl      String   @map("video_url")
  posterImageUrl String? @map("poster_image_url")
  overlayText   String?  @map("overlay_text")
  ctaText       String?  @map("cta_text")
  ctaUrl        String?  @map("cta_url")
  isActive      Boolean  @default(true) @map("is_active")
  position      Int      @default(0)
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  @@map("hero_videos")
}

model Integration {
  id                    String                  @id @default(cuid())
  name                  String                  @unique
  displayName           String                  @map("display_name")
  apiKeyEncrypted       String?                 @map("api_key_encrypted")
  secretKeyEncrypted    String?                 @map("secret_key_encrypted")
  webhookSecretEncrypted String?                @map("webhook_secret_encrypted")
  configJson            Json?                   @map("config_json")
  isEnabled             Boolean                 @default(false) @map("is_enabled")
  isSandbox             Boolean                 @default(true) @map("is_sandbox")
  lastHealthCheckAt     DateTime?               @map("last_health_check_at")
  healthStatus          IntegrationHealthStatus @default(UNKNOWN) @map("health_status")
  createdAt             DateTime                @default(now()) @map("created_at")
  updatedAt             DateTime                @updatedAt @map("updated_at")

  logs IntegrationLog[]

  @@map("integrations")
}

model IntegrationLog {
  id             String               @id @default(cuid())
  integrationId  String               @map("integration_id")
  event          String
  requestJson    Json?                @map("request_json")
  responseJson   Json?                @map("response_json")
  status         IntegrationLogStatus
  createdAt      DateTime             @default(now()) @map("created_at")

  integration Integration @relation(fields: [integrationId], references: [id], onDelete: Cascade)

  @@index([integrationId, createdAt])
  @@map("integration_logs")
}

model FrequentlyBoughtTogether {
  id               String  @id @default(cuid())
  productId        String  @map("product_id")
  relatedProductId String  @map("related_product_id")
  score            Float   @default(1.0)

  product        Product @relation("ProductFBT", fields: [productId], references: [id], onDelete: Cascade)
  relatedProduct Product @relation("RelatedProductFBT", fields: [relatedProductId], references: [id], onDelete: Cascade)

  @@unique([productId, relatedProductId])
  @@map("frequently_bought_together")
}
```

---

## 5. DATABASE SETUP COMMANDS

After creating the schema, run these commands exactly in order:

```bash
# 1. Initialize Prisma (if not already done)
npx prisma init

# 2. Run the migration (creates all tables)
npx prisma migrate dev --name init

# 3. Generate the Prisma client
npx prisma generate

# 4. Seed the database (run the seed file below)
npx prisma db seed
```

---

## 6. DATABASE SEED FILE

### File: `prisma/seed.ts`

Generate a complete seed file that creates realistic sample data:

**Create exactly:**
- 1 Admin user: `admin@luxurybottles.com` / password: `Admin@123`
- 1 Test customer: `customer@test.com` / password: `Test@123`
- 3 top-level categories: Children, Women, Aesthetic Collection
- 6 subcategories (2 per parent)
- 12 products (4 per category), each with:
  - 3–4 color variants (with hex codes and SKUs)
  - 3–4 images per product (using real Unsplash bottle image URLs)
  - Inventory record for each variant
- 2 active coupons: `WELCOME10` (10% off) and `FLAT200` (flat ₹200 off)
- 3 hero video records (with placeholder video URLs)
- Homepage sections in correct order
- 5 approved reviews across products
- 3 frequently bought together pairs

Use real-looking product names like:
- "Matte Onyx Hydration Flask", "Blush Pearl Ceramic Bottle", "Nordic Frost Water Bottle", etc.

Use real Unsplash image URLs (format: `https://images.unsplash.com/photo-XXXXXXXXXX?w=800&q=80`) that look like luxury bottles.

---

## 7. LIB UTILITIES — COMPLETE FILES

### File: `src/lib/prisma.ts`
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### File: `src/lib/redis.ts`
```typescript
import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
}

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  })

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis

// Helper: cache wrapper
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached) as T
  const data = await fetcher()
  await redis.setex(key, ttlSeconds, JSON.stringify(data))
  return data
}

// Helper: rate limit check
export async function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const current = await redis.incr(key)
  if (current === 1) await redis.expire(key, windowSeconds)
  const ttl = await redis.ttl(key)
  return {
    allowed: current <= maxAttempts,
    remaining: Math.max(0, maxAttempts - current),
    resetIn: ttl,
  }
}
```

### File: `src/lib/auth.ts`

Generate a complete auth utility file using the `jose` library:

```typescript
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const COOKIE_NAME = 'lb_auth_token'

export interface JWTPayload {
  userId: string
  email: string
  role: 'CUSTOMER' | 'ADMIN'
}

// Sign a new JWT
export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(JWT_SECRET)
}

// Verify a JWT (throws if invalid)
export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET)
  return payload as unknown as JWTPayload
}

// Set auth cookie on a NextResponse
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  })
}

// Clear auth cookie
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.delete(COOKIE_NAME)
}

// Get current user from request (returns null if not authenticated)
export async function getCurrentUser(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (!token) return null
    return await verifyToken(token)
  } catch {
    return null
  }
}

// Middleware helper: require authentication
export async function requireAuth(
  request: NextRequest
): Promise<{ user: JWTPayload } | NextResponse> {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized', code: 'AUTH_REQUIRED' }, { status: 401 })
  }
  return { user }
}

// Middleware helper: require admin role
export async function requireAdmin(
  request: NextRequest
): Promise<{ user: JWTPayload } | NextResponse> {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized', code: 'AUTH_REQUIRED' }, { status: 401 })
  }
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden', code: 'ADMIN_REQUIRED' }, { status: 403 })
  }
  return { user }
}
```

### File: `src/lib/validators.ts`

Generate all Zod validation schemas:

```typescript
import { z } from 'zod'

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*\d)/, 'Password needs 1 uppercase and 1 number'),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// ─── Cart ──────────────────────────────────────────────────────────────────────
export const addToCartSchema = z.object({
  productId: z.string().cuid(),
  variantId: z.string().cuid(),
  quantity: z.number().int().min(1).max(99),
})

export const updateCartItemSchema = z.object({
  cartItemId: z.string().cuid(),
  quantity: z.number().int().min(0).max(99),
})

// ─── Checkout ─────────────────────────────────────────────────────────────────
export const addressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(2).max(2),
  phone: z.string().min(10),
})

export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['stripe', 'razorpay']),
  paymentToken: z.string().optional(),
})

// ─── Review ───────────────────────────────────────────────────────────────────
export const reviewSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(100),
  body: z.string().min(10).max(2000),
})

// ─── Coupon ───────────────────────────────────────────────────────────────────
export const validateCouponSchema = z.object({
  code: z.string().min(1),
  orderAmount: z.number().positive(),
})
```

### File: `src/lib/email.ts`

Generate complete email sending utilities using Resend, with HTML email templates for:
- Order confirmation (includes order summary table, product names, totals)
- Welcome email
- Password reset (for future use)

### File: `src/lib/cloudinary.ts`

Generate complete Cloudinary upload utility:
- `uploadImage(file: File, folder: string): Promise<{ url: string; publicId: string }>`
- `deleteImage(publicId: string): Promise<void>`

### File: `src/lib/crypto.ts`

```typescript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex')

export function encrypt(text: string): string {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, KEY, iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')
  const decipher = createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(authTag)
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
}
```

### File: `src/types/index.ts`

Generate complete TypeScript interfaces for every Prisma model + all API request/response types. Example structure:

```typescript
// Re-export Prisma types + add API-specific ones
export type { User, Product, ProductVariant, ProductImage,
              Category, Cart, CartItem, Wishlist, WishlistItem,
              Order, OrderItem, Coupon, Review, Payment } from '@prisma/client'

export interface CartWithItems { /* Cart + nested items with product and variant */ }
export interface ProductWithDetails { /* Product + variants + images + reviews avg */ }
export interface OrderWithItems { /* Order + items + payment */ }
export interface ApiError { error: string; code: string }
export interface PaginatedResponse<T> { data: T[]; total: number; page: number; totalPages: number }
// ... all other types
```

---

## 8. ALL API ROUTES — COMPLETE IMPLEMENTATION

Generate every route file below with **100% complete, working TypeScript code**. No stubs, no placeholders.

### 8.1 Auth Routes

#### `src/app/api/auth/register/route.ts`
- Parse + validate body with `registerSchema`
- Check if email already exists → `409 Conflict`
- Hash password with `bcryptjs` (saltRounds: 12)
- Create User in DB
- Sign JWT, set httpOnly cookie
- Send welcome email (async, don't await)
- Return `{ user: { id, email, firstName, lastName, role } }`

#### `src/app/api/auth/login/route.ts`
- Rate limit: 5 attempts per 15 min per IP (Redis key: `ratelimit:login:{ip}`)
- Validate body with `loginSchema`
- Find user by email
- Compare password with `bcryptjs.compare`
- If mismatch → `401` with generic message (don't reveal if email exists)
- Sign JWT, set httpOnly cookie
- Merge guest cart: if `session_id` cookie exists, move those cart items to user cart
- Return `{ user: { id, email, firstName, lastName, role } }`

#### `src/app/api/auth/logout/route.ts`
- Clear auth cookie
- Return `{ success: true }`

#### `src/app/api/auth/me/route.ts`
- `requireAuth` check
- Fetch user from DB (no passwordHash in response)
- Return user object

### 8.2 Homepage

#### `src/app/api/homepage/route.ts`
- Use `withCache` (Redis, 5-minute TTL, key: `homepage:data`)
- Fetch in parallel:
  - Active hero videos (ordered by position)
  - Active homepage sections (ordered by position)
  - Featured product (isActive + isFeatured, with primary image and first variant)
  - Top selling products (isActive + isTopSelling, limit 7, with primary image, variants, avg rating)
  - Top-level categories with image
- Return all as single JSON object

### 8.3 Categories

#### `src/app/api/categories/route.ts`
- Use `withCache` (Redis, 10-minute TTL)
- Fetch all active categories with children
- Return as nested tree (build tree from flat array)
- Accept `?flat=true` to return flat array instead

### 8.4 Products

#### `src/app/api/products/route.ts`
- Accept query params: `category`, `page`, `limit`, `sort`, `minPrice`, `maxPrice`, `color`
- Build Prisma `where` clause dynamically
- Sort options: `price_asc`, `price_desc`, `newest`, `popular`
- Return paginated response with `PaginatedResponse<ProductWithDetails>` shape

#### `src/app/api/products/[id]/route.ts`
- Fetch product by id with:
  - All images
  - All active variants with their images and inventory
  - Category
  - Avg rating + review count
  - Related products (same category, limit 4)
  - Frequently bought together products
- Post a recently viewed entry (if user is authenticated via cookie)
- Return full product detail object

#### `src/app/api/products/[id]/variant/route.ts`
- Accept `?color=hexCodeOrColorName`
- Find variant by productId + colorName (case-insensitive) or hexCode
- Return variant with its images and live stock count
- Cache per variant with 1-minute TTL

### 8.5 Cart

#### `src/app/api/cart/route.ts` (GET, POST, PUT, DELETE)

**GET:**
- Get cart by userId (auth) or sessionId (cookie for guests)
- If no cart exists, return `{ items: [], subtotal: 0 }`
- Validate each item still in stock (flag items that exceed available stock)
- Return cart with fully populated items (product name, image, variant, price, stock status)

**POST (add item):**
- Validate body with `addToCartSchema`
- Check variant stock BEFORE adding
- Get or create cart
- Upsert CartItem (increment quantity if already exists)
- Invalidate cart cache
- Return updated cart

**PUT (update quantity):**
- Validate body with `updateCartItemSchema`
- If quantity = 0, delete the CartItem
- Otherwise update quantity (check stock)
- Return updated cart

**DELETE (clear cart):**
- Delete all CartItems for the cart
- Return `{ success: true }`

### 8.6 Wishlist

#### `src/app/api/wishlist/route.ts` (GET, POST)
- GET: `requireAuth`, return all wishlisted products with current price and primary image
- POST: `requireAuth`, body `{ productId }`, toggle (add if not in wishlist, remove if already there), return `{ added: boolean }`

#### `src/app/api/wishlist/[productId]/route.ts` (DELETE)
- `requireAuth`, remove product from wishlist

### 8.7 Recently Viewed

#### `src/app/api/history/route.ts` (POST)
- `requireAuth`, body `{ productId }`
- Upsert: update `viewedAt` if exists, insert if not
- Keep max 10 per user: after upsert, delete oldest entries beyond 10

#### `src/app/api/history/[userId]/route.ts` (GET)
- `requireAuth`, verify userId matches JWT or is admin
- Return last 10 recently viewed products with primary image

### 8.8 Coupons

#### `src/app/api/coupons/validate/route.ts` (POST)
- Validate body with `validateCouponSchema`
- Find coupon by code
- Check: isActive, validFrom <= now <= validUntil, usageCount < usageLimit (if set)
- Calculate discount based on type (PERCENTAGE, FIXED_AMOUNT, FREE_SHIPPING)
- Apply maxDiscountAmount cap if set
- Return `{ valid: true, discountType, discountValue, calculatedDiscount, message }`

### 8.9 Checkout

#### `src/app/api/checkout/route.ts` (POST)

This is the most critical route. Generate it completely with every step:

```typescript
// COMPLETE CHECKOUT FLOW — all steps inside a Prisma transaction
export async function POST(request: NextRequest) {
  // 1. requireAuth
  // 2. Parse + validate body with checkoutSchema
  // 3. Fetch user's cart with all items from DB (NEVER trust client prices)
  // 4. If cart is empty → 400
  // 5. For each cart item:
  //    a. Fetch variant with inventory (SELECT ... FOR UPDATE via $transaction)
  //    b. Verify stockQuantity >= requested quantity
  //    c. If any item is out of stock → 409 with { outOfStockItems: [...] }
  // 6. Server-side price recalculation:
  //    a. Subtotal = sum of (variant.price * quantity)
  //    b. Validate and apply coupon if provided (re-validate server-side)
  //    c. Calculate shipping (flat rate or free over threshold)
  //    d. Calculate tax (e.g., 18% GST)
  //    e. Total = subtotal - discount + shipping + tax
  // 7. BEGIN TRANSACTION:
  //    a. Create Order record
  //    b. Create OrderItem records with productSnapshotJson
  //    c. Deduct stockQuantity from each ProductVariant
  //    d. Create InventoryLog entries (reason: SALE)
  //    e. Increment coupon usageCount if coupon used
  //    f. Process payment (Stripe or Razorpay)
  //       - If payment FAILS → throw error → transaction rolls back
  //    g. Update Order paymentStatus = PAID, paymentReference
  //    h. Create Payment record
  //    i. Delete all CartItems
  //    COMMIT TRANSACTION
  // 8. Send order confirmation email (async, non-blocking)
  // 9. Invalidate homepage cache (top selling might change)
  // 10. Return { orderId, orderNumber (= short id), total, status, paymentStatus }
}
```

### 8.10 Orders

#### `src/app/api/orders/[id]/route.ts` (GET)
- `requireAuth`, verify order belongs to user (or is admin)
- Return order with all items, payment, shipping address

### 8.11 Reviews

#### `src/app/api/reviews/route.ts` (POST)
- `requireAuth`
- Validate body with `reviewSchema`
- Check if user already reviewed this product → `409`
- Check verified purchase (look for completed order with this product)
- Create review with `isVerifiedPurchase` flag
- `isApproved` defaults to `false` (admin must approve)
- Return created review

#### `src/app/api/products/[id]/reviews/route.ts` (GET)
- Public, no auth needed
- Accept `?page=1&limit=10&sort=newest|highest|lowest`
- Only return `isApproved = true` reviews
- Return paginated reviews with user first name + last initial

### 8.12 Admin Routes

#### `src/app/api/admin/products/route.ts` (GET, POST)
- GET: `requireAdmin`, paginated product list with search, category filter
- POST: `requireAdmin`, create product with variants and images

#### `src/app/api/admin/products/[id]/route.ts` (GET, PUT, DELETE)
- All require `requireAdmin`
- PUT: full product update including variant add/edit/delete and image reorder
- DELETE: soft delete (set isActive = false)

#### `src/app/api/admin/orders/route.ts` (GET)
- `requireAdmin`, list orders with filters: status, date range, search by email

#### `src/app/api/admin/orders/[id]/route.ts` (GET, PUT)
- PUT: update status, tracking number; trigger email notification on status change

#### `src/app/api/admin/categories/route.ts` (GET, POST, PUT, DELETE)
- Full CRUD, `requireAdmin`

#### `src/app/api/admin/customers/route.ts` (GET)
- `requireAdmin`, list customers with order count + total spent

#### `src/app/api/admin/analytics/route.ts` (GET)
- `requireAdmin`
- Revenue by day (last 30 days): aggregate from Orders where paymentStatus = PAID
- Top 5 products by revenue
- Top 5 products by units sold
- New customers per week (last 4 weeks)
- Return as structured JSON for charting

#### `src/app/api/admin/coupons/route.ts` (GET, POST, PUT, DELETE)
- Full CRUD, `requireAdmin`

#### `src/app/api/admin/homepage/route.ts` (GET, PUT)
- `requireAdmin`
- GET: return all sections + hero videos in order
- PUT: update section content or reorder (accept `{ sections: [{ id, position }] }`)

#### `src/app/api/admin/integrations/route.ts` (GET, POST, PUT)
- `requireAdmin`
- GET: list all integrations (merge DB records with hardcoded catalog)
- POST: create integration record (encrypt API keys before storage)
- PUT: update integration (re-encrypt keys if changed), toggle enable/disable, trigger health check

### 8.13 Webhook Routes

#### `src/app/api/webhooks/stripe/route.ts`
- Verify Stripe webhook signature using `stripe.webhooks.constructEvent`
- Handle `payment_intent.succeeded` → update Order + Payment records
- Handle `payment_intent.payment_failed` → update Order paymentStatus = FAILED, release inventory
- Return `200` immediately; process async

#### `src/app/api/webhooks/razorpay/route.ts`
- Verify signature using HMAC-SHA256
- Handle `payment.captured` and `payment.failed` events
- Same logic as Stripe webhook

---

## 9. ZUSTAND STORES

### File: `src/store/cartStore.ts`

```typescript
// Complete Zustand store for cart
// State: items, itemCount, subtotal, isOpen (drawer), isLoading
// Actions:
//   openCart() / closeCart() / toggleCart()
//   fetchCart() — GET /api/cart
//   addItem(productId, variantId, quantity) — POST /api/cart
//   updateItem(cartItemId, quantity) — PUT /api/cart
//   removeItem(cartItemId) — PUT /api/cart with quantity=0
//   clearCart() — DELETE /api/cart
//   applyCoupon(code) — POST /api/coupons/validate
//   removeCoupon()
// Computed: subtotalAfterDiscount, shippingCost, total
// Persist: cart items count in localStorage for badge display (not full cart)
```

### File: `src/store/wishlistStore.ts`

```typescript
// State: productIds (Set<string>), isLoading
// Actions:
//   fetchWishlist() — GET /api/wishlist
//   toggle(productId) — POST /api/wishlist
//   remove(productId) — DELETE /api/wishlist/:productId
//   isWishlisted(productId): boolean
```

### File: `src/store/authStore.ts`

```typescript
// State: user (null | UserObject), isAuthenticated, isLoading
// Actions:
//   login(email, password) — POST /api/auth/login
//   register(data) — POST /api/auth/register
//   logout() — POST /api/auth/logout
//   fetchMe() — GET /api/auth/me
//   initialize() — called on app mount to restore session
```

### File: `src/store/uiStore.ts`

```typescript
// State: isSidebarOpen, isSearchOpen, activeModal (null | string), toast messages
// Actions: toggleSidebar, openSidebar, closeSidebar, showToast, dismissToast
```

---

## 10. CUSTOM HOOKS

### `src/hooks/useCart.ts`
- Wraps `cartStore` with convenience selectors
- `useCartItem(variantId)` — returns the cart item for a specific variant (or null)
- `useCartCount()` — returns total item count
- Auto-fetches cart on mount if user is authenticated

### `src/hooks/useWishlist.ts`
- `useIsWishlisted(productId): boolean`
- `useToggleWishlist(productId): () => void`

### `src/hooks/useAuth.ts`
- Returns `{ user, isAuthenticated, isLoading, login, register, logout }`
- Calls `authStore.initialize()` on mount

### `src/hooks/useRecentlyViewed.ts`
- Fetches from `/api/history/:userId` if authenticated
- Falls back to localStorage for guest users

### `src/hooks/useProduct.ts`
- `useProduct(id)` — fetches product detail with SWR/React Query pattern
- `useProductVariant(productId, color)` — fetches variant on color change

---

## 11. FRONTEND WIRING INSTRUCTIONS

**Do not rewrite any component UI.** Only modify the data layer inside existing components:

For each component below, find it in the existing codebase and replace its mock/placeholder data calls with real API calls:

### Navigation (cart badge, wishlist badge)
- Replace hardcoded `3` with `useCartCount()` from cart store
- Replace hardcoded wishlist count with `wishlistStore.productIds.size`

### AddToCart component
- Replace mock `handleAddToCart` with `cartStore.addItem(productId, variantId, quantity)`
- Show toast on success/error

### CartDrawer component
- Replace mock cart data with `cartStore.items`
- Wire quantity steppers to `cartStore.updateItem`
- Wire remove buttons to `cartStore.removeItem`
- Wire coupon input to `cartStore.applyCoupon`
- Wire "Proceed to Checkout" button to navigate to `/checkout`

### AddToWishlist / WishlistButton
- Replace with `wishlistStore.toggle(productId)`
- Show filled/unfilled heart based on `wishlistStore.isWishlisted(productId)`

### ColorSelector
- On color change: call `fetch(\`/api/products/${productId}/variant?color=${colorName}\`)`
- Update parent component state with new variant data (image, price, stock)

### ProductGallery
- Image src should come from `product.images` from the API, not hardcoded paths

### InventoryBadge
- Read `variant.stockQuantity` from selected variant state
- Display badge logic: > 10 = no badge, 4-10 = "Only X left", 1-3 = "Almost gone!", 0 = "Out of stock"

### Homepage sections
- Replace all mock arrays with data from `GET /api/homepage`
- Use `useSWR` or `fetch` in Server Components

### ProductCard (quick-add)
- Wire quick-add button to `cartStore.addItem` with first available variant

---

## 12. NEXT.JS MIDDLEWARE

### File: `src/middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /account/* routes — redirect to login if not authenticated
  if (pathname.startsWith('/account')) {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Protect /admin/* routes — redirect to home if not admin
  if (pathname.startsWith('/admin')) {
    const user = await getCurrentUser(request)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect /checkout — redirect to login if not authenticated
  if (pathname.startsWith('/checkout')) {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login?redirect=/checkout', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*', '/checkout/:path*'],
}
```

---

## 13. ERROR HANDLING STANDARD

Every API route must follow this exact error response format:

```typescript
// Success
return NextResponse.json({ data: result }, { status: 200 })

// Validation error
return NextResponse.json({
  error: 'Validation failed',
  code: 'VALIDATION_ERROR',
  details: zodError.flatten()
}, { status: 400 })

// Unauthorized
return NextResponse.json({ error: 'Unauthorized', code: 'AUTH_REQUIRED' }, { status: 401 })

// Forbidden
return NextResponse.json({ error: 'Forbidden', code: 'ADMIN_REQUIRED' }, { status: 403 })

// Not found
return NextResponse.json({ error: 'Not found', code: 'NOT_FOUND' }, { status: 404 })

// Conflict (duplicate, out of stock, etc.)
return NextResponse.json({ error: 'Conflict', code: 'CONFLICT', message: '...' }, { status: 409 })

// Server error
return NextResponse.json({ error: 'Internal server error', code: 'SERVER_ERROR' }, { status: 500 })
```

All routes must be wrapped in try/catch. Prisma errors must be caught and translated to user-friendly messages.

---

## 14. OUTPUT ORDER

Generate every file completely in this order:

1. `package.json` (updated with all backend deps)
2. `.env.local` + `.env.example`
3. `prisma/schema.prisma`
4. `prisma/seed.ts`
5. `src/lib/prisma.ts`
6. `src/lib/redis.ts`
7. `src/lib/auth.ts`
8. `src/lib/crypto.ts`
9. `src/lib/validators.ts`
10. `src/lib/email.ts`
11. `src/lib/cloudinary.ts`
12. `src/types/index.ts`
13. `src/middleware.ts`
14. `src/store/authStore.ts`
15. `src/store/cartStore.ts`
16. `src/store/wishlistStore.ts`
17. `src/store/uiStore.ts`
18. `src/hooks/useAuth.ts`
19. `src/hooks/useCart.ts`
20. `src/hooks/useWishlist.ts`
21. `src/hooks/useRecentlyViewed.ts`
22. `src/hooks/useProduct.ts`
23. `src/app/api/auth/register/route.ts`
24. `src/app/api/auth/login/route.ts`
25. `src/app/api/auth/logout/route.ts`
26. `src/app/api/auth/me/route.ts`
27. `src/app/api/homepage/route.ts`
28. `src/app/api/categories/route.ts`
29. `src/app/api/products/route.ts`
30. `src/app/api/products/[id]/route.ts`
31. `src/app/api/products/[id]/variant/route.ts`
32. `src/app/api/products/[id]/reviews/route.ts`
33. `src/app/api/cart/route.ts`
34. `src/app/api/wishlist/route.ts`
35. `src/app/api/wishlist/[productId]/route.ts`
36. `src/app/api/history/route.ts`
37. `src/app/api/history/[userId]/route.ts`
38. `src/app/api/coupons/validate/route.ts`
39. `src/app/api/checkout/route.ts`
40. `src/app/api/orders/[id]/route.ts`
41. `src/app/api/reviews/route.ts`
42. `src/app/api/admin/products/route.ts`
43. `src/app/api/admin/products/[id]/route.ts`
44. `src/app/api/admin/orders/route.ts`
45. `src/app/api/admin/orders/[id]/route.ts`
46. `src/app/api/admin/categories/route.ts`
47. `src/app/api/admin/customers/route.ts`
48. `src/app/api/admin/analytics/route.ts`
49. `src/app/api/admin/coupons/route.ts`
50. `src/app/api/admin/homepage/route.ts`
51. `src/app/api/admin/integrations/route.ts`
52. `src/app/api/webhooks/stripe/route.ts`
53. `src/app/api/webhooks/razorpay/route.ts`

---

## 15. SETUP COMMANDS (Run After All Files Are Generated)

```bash
# 1. Install all dependencies
npm install

# 2. Start PostgreSQL (if local)
# Make sure PostgreSQL is running on port 5432

# 3. Start Redis (if local)
# Make sure Redis is running on port 6379

# 4. Push database schema
npx prisma migrate dev --name init

# 5. Generate Prisma client
npx prisma generate

# 6. Seed the database
npx prisma db seed

# 7. Start the dev server
npm run dev

# 8. Verify everything works:
# - Visit http://localhost:3000
# - Log in as admin@luxurybottles.com / Admin@123
# - Add a product to cart
# - Go through checkout (use Stripe test card: 4242 4242 4242 4242)
```

---

## 16. FINAL VERIFICATION CHECKLIST

Before declaring done, verify:

- [ ] `prisma/schema.prisma` has all 17+ models with correct relations
- [ ] `prisma migrate dev` runs with zero errors
- [ ] `prisma db seed` creates all sample data successfully
- [ ] `GET /api/homepage` returns hero videos, sections, featured product, top sellers
- [ ] `GET /api/categories` returns nested category tree
- [ ] `GET /api/products` returns paginated product list
- [ ] `GET /api/products/:id` returns full product with variants and images
- [ ] `POST /api/auth/register` creates user and returns token in httpOnly cookie
- [ ] `POST /api/auth/login` authenticates and sets cookie
- [ ] `GET /api/cart` returns empty cart for new user
- [ ] `POST /api/cart` adds item and returns updated cart
- [ ] `PUT /api/cart` updates quantity correctly
- [ ] `POST /api/wishlist` toggles product in wishlist
- [ ] `POST /api/coupons/validate` validates coupon and returns discount
- [ ] `POST /api/checkout` completes order inside a single DB transaction with rollback
- [ ] `GET /api/admin/*` routes return 403 for non-admin users
- [ ] All API keys encrypted before storage in Integration table
- [ ] All auth tokens stored in httpOnly Secure SameSite=Strict cookies
- [ ] Rate limiting active on `/api/auth/login`
- [ ] Cart merges on login (guest cart → user cart)
- [ ] Webhook routes verify signatures before processing
- [ ] All Zustand stores connect to real API endpoints
- [ ] Cart badge in nav shows live count
- [ ] Wishlist heart icon reflects real wishlist state
- [ ] Color variant switching updates image, price, and stock badge
- [ ] Out-of-stock variants disable the Add to Cart button
```
