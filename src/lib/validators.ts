import { z } from 'zod'

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*\\d)/, 'Password needs 1 uppercase and 1 number'),
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
