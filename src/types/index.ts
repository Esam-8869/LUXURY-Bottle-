import type {
  User as PrismaUser,
  Product as PrismaProduct,
  ProductVariant as PrismaVariant,
  ProductImage as PrismaImage,
  Category as PrismaCategory,
  Cart as PrismaCart,
  CartItem as PrismaCartItem,
  Wishlist as PrismaWishlist,
  WishlistItem as PrismaWishlistItem,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  Coupon as PrismaCoupon,
  Review as PrismaReview,
  Payment as PrismaPayment,
  HomepageSection as PrismaHomepageSection,
  HeroVideo as PrismaHeroVideo,
  Inventory as PrismaInventory
} from '@prisma/client'

export type {
  PrismaUser as User,
  PrismaProduct as Product,
  PrismaVariant as ProductVariant,
  PrismaImage as ProductImage,
  PrismaCategory as Category,
  PrismaCart as Cart,
  PrismaCartItem as CartItem,
  PrismaWishlist as Wishlist,
  PrismaWishlistItem as WishlistItem,
  PrismaOrder as Order,
  PrismaOrderItem as OrderItem,
  PrismaCoupon as Coupon,
  PrismaReview as Review,
  PrismaPayment as Payment,
  PrismaHomepageSection as HomepageSection,
  PrismaHeroVideo as HeroVideo,
  PrismaInventory as Inventory
}

export interface ApiError {
  error: string
  code: string
  details?: any
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
}

export interface CartWithItems extends PrismaCart {
  items: (PrismaCartItem & {
    product: PrismaProduct
    variant: PrismaVariant & { inventory: PrismaInventory | null }
  })[]
}

export interface ProductWithDetails extends PrismaProduct {
  images: PrismaImage[]
  variants: (PrismaVariant & {
    images: PrismaImage[]
    inventory: PrismaInventory | null
  })[]
  category: PrismaCategory
  reviews?: PrismaReview[]
  _count?: {
    reviews: number
  }
}

export interface OrderWithItems extends PrismaOrder {
  items: (PrismaOrderItem & {
    product: PrismaProduct
    variant: PrismaVariant
  })[]
  payment?: PrismaPayment | null
}
