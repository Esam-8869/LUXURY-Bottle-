import {
  User,
  Category,
  Product,
  ProductVariant,
  ProductImage,
  Inventory,
  InventoryLog,
  Order,
  OrderItem,
  Cart,
  CartItem,
  Wishlist,
  WishlistItem,
  RecentlyViewed,
  Review,
  Coupon,
  Payment,
  HomepageSection,
  HeroVideo,
  Integration,
  IntegrationLog,
  FrequentlyBoughtTogether,
  Role,
  Reason,
  OrderStatus,
  PaymentStatus,
  CouponType,
  PaymentGateway,
  PaymentLogStatus,
  SectionType,
  IntegrationStatus,
} from '@prisma/client';

export type {
  User,
  Category,
  Product,
  ProductVariant,
  ProductImage,
  Inventory,
  InventoryLog,
  Order,
  OrderItem,
  Cart,
  CartItem,
  Wishlist,
  WishlistItem,
  RecentlyViewed,
  Review,
  Coupon,
  Payment,
  HomepageSection,
  HeroVideo,
  Integration,
  IntegrationLog,
  FrequentlyBoughtTogether,
};

export {
  Role,
  Reason,
  OrderStatus,
  PaymentStatus,
  CouponType,
  PaymentGateway,
  PaymentLogStatus,
  SectionType,
  IntegrationStatus,
};

// Extended Types (e.g. Products with their related entities included)
export type ProductWithVariants = Product & {
  ProductVariants: ProductVariant[];
  ProductImages: ProductImage[];
  Category: Category;
};

export type CartWithItems = Cart & {
  CartItems: (CartItem & {
    Product: Product;
    ProductVariant: ProductVariant;
  })[];
};

export type OrderWithItems = Order & {
  OrderItems: OrderItem[];
  Payment: Payment | null;
  User: User;
};

// API Route Types
export interface APIErrorResponse {
  error: string;
  code: string;
}

export interface APIListResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
