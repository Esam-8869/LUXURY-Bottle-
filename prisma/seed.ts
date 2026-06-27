import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. Clean existing data
  await prisma.review.deleteMany()
  await prisma.frequentlyBoughtTogether.deleteMany()
  await prisma.homepageSection.deleteMany()
  await prisma.heroVideo.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.inventoryLog.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // 2. Users
  const adminPassword = await bcrypt.hash('Admin@123', 12)
  const customerPassword = await bcrypt.hash('Test@123', 12)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@luxurybottles.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: true,
    },
  })

  const customer = await prisma.user.create({
    data: {
      email: 'customer@test.com',
      passwordHash: customerPassword,
      firstName: 'Test',
      lastName: 'Customer',
      role: 'CUSTOMER',
      emailVerified: true,
    },
  })

  console.log('✅ Users created')

  // 3. Categories
  const catChildren = await prisma.category.create({
    data: { name: 'Children', slug: 'children', description: 'Bottles designed for kids.' },
  })
  const catWomen = await prisma.category.create({
    data: { name: 'Women', slug: 'women', description: 'Elegant bottles for women.' },
  })
  const catAesthetic = await prisma.category.create({
    data: { name: 'Aesthetic Collection', slug: 'aesthetic-collection', description: 'Curated for aesthetics.' },
  })

  // Subcategories
  const catKidsSchool = await prisma.category.create({
    data: { name: 'School', slug: 'kids-school', parentId: catChildren.id },
  })
  const catKidsSports = await prisma.category.create({
    data: { name: 'Sports', slug: 'kids-sports', parentId: catChildren.id },
  })
  const catWomenGym = await prisma.category.create({
    data: { name: 'Gym & Active', slug: 'women-gym', parentId: catWomen.id },
  })
  const catWomenWork = await prisma.category.create({
    data: { name: 'Work & Office', slug: 'women-work', parentId: catWomen.id },
  })
  const catAestheticMinimal = await prisma.category.create({
    data: { name: 'Minimalist', slug: 'aesthetic-minimal', parentId: catAesthetic.id },
  })
  const catAestheticPremium = await prisma.category.create({
    data: { name: 'Premium Glass', slug: 'aesthetic-premium', parentId: catAesthetic.id },
  })

  console.log('✅ Categories created')

  // 4. Products & Variants & Inventory
  const productData = [
    {
      name: 'Matte Onyx Hydration Flask',
      slug: 'matte-onyx-hydration-flask',
      catId: catAestheticMinimal.id,
      price: 49.99,
    },
    {
      name: 'Blush Pearl Ceramic Bottle',
      slug: 'blush-pearl-ceramic-bottle',
      catId: catWomenWork.id,
      price: 59.99,
    },
    {
      name: 'Nordic Frost Water Bottle',
      slug: 'nordic-frost-water-bottle',
      catId: catAestheticPremium.id,
      price: 65.00,
    },
    {
      name: 'Kids Safari Adventure Jug',
      slug: 'kids-safari-adventure-jug',
      catId: catKidsSchool.id,
      price: 29.99,
    },
    // Adding a few more to reach around 12 as requested
    {
      name: 'Women Active Tracker Bottle',
      slug: 'women-active-tracker',
      catId: catWomenGym.id,
      price: 35.00,
    },
    {
      name: 'Kids Mini Sport Flask',
      slug: 'kids-mini-sport-flask',
      catId: catKidsSports.id,
      price: 25.00,
    },
    {
      name: 'Rose Gold Stainless Steel',
      slug: 'rose-gold-stainless',
      catId: catWomenWork.id,
      price: 45.99,
    },
    {
      name: 'Midnight Glass Infuser',
      slug: 'midnight-glass-infuser',
      catId: catAestheticPremium.id,
      price: 55.00,
    },
    {
      name: 'Pastel Rainbow Kids Tumbler',
      slug: 'pastel-rainbow-tumbler',
      catId: catKidsSchool.id,
      price: 22.99,
    },
    {
      name: 'Ocean Blue Hydration Tracker',
      slug: 'ocean-blue-tracker',
      catId: catWomenGym.id,
      price: 32.50,
    },
    {
      name: 'Concrete Grey Minimalist',
      slug: 'concrete-grey-minimalist',
      catId: catAestheticMinimal.id,
      price: 48.00,
    },
    {
      name: 'Little Champ Sports Bottle',
      slug: 'little-champ-sports',
      catId: catKidsSports.id,
      price: 26.99,
    },
  ]

  const createdProducts = []

  for (const p of productData) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: `Experience hydration like never before with the ${p.name}. Crafted with premium materials for maximum durability and style.`,
        shortDescription: `Premium hydration with ${p.name}.`,
        basePrice: p.price,
        categoryId: p.catId,
        isFeatured: Math.random() > 0.5,
        isTopSelling: Math.random() > 0.7,
        variants: {
          create: [
            {
              colorName: 'Midnight Black',
              hexCode: '#1a1a1a',
              sku: `${p.slug}-BLK`,
              price: p.price,
              stockQuantity: 50,
            },
            {
              colorName: 'Pearl White',
              hexCode: '#f5f5f5',
              sku: `${p.slug}-WHT`,
              price: p.price,
              stockQuantity: 30,
            },
            {
              colorName: 'Rose Gold',
              hexCode: '#b76e79',
              sku: `${p.slug}-RGL`,
              price: p.price + 5, // premium color
              stockQuantity: 15,
            },
          ],
        },
      },
      include: {
        variants: true,
      },
    })
    createdProducts.push(product)

    // Add images for each variant
    let pos = 0
    for (const v of product.variants) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          variantId: v.id,
          url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
          isPrimary: pos === 0,
          position: pos++,
        },
      })
      
      await prisma.inventory.create({
        data: {
          variantId: v.id,
          quantity: v.stockQuantity,
        }
      })
    }
  }

  console.log('✅ Products, Variants, Images & Inventory created')

  // 5. Coupons
  await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      description: '10% off your first order',
      type: 'PERCENTAGE',
      value: 10,
      validFrom: new Date(),
      validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year validity
    },
  })

  await prisma.coupon.create({
    data: {
      code: 'FLAT200',
      description: 'Flat ₹200 off',
      type: 'FIXED_AMOUNT',
      value: 200,
      validFrom: new Date(),
      validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
  })

  console.log('✅ Coupons created')

  // 6. Hero Videos
  await prisma.heroVideo.create({
    data: {
      title: 'Experience Pure Hydration',
      videoUrl: 'https://cdn.coverr.co/videos/coverr-pouring-water-into-a-glass-bottle-3146/1080p.mp4',
      overlayText: 'Luxury in Every Sip',
      ctaText: 'Shop the Collection',
      ctaUrl: '/shop',
      position: 1,
    }
  })

  // 7. Homepage Sections
  await prisma.homepageSection.create({
    data: {
      type: 'HERO_VIDEO',
      position: 1,
      isActive: true,
    }
  })
  
  await prisma.homepageSection.create({
    data: {
      type: 'COLLECTION',
      title: 'Our Premium Collections',
      position: 2,
      isActive: true,
    }
  })

  console.log('✅ Hero Videos and Homepage Sections created')

  // 8. Reviews
  for (let i = 0; i < 5; i++) {
    await prisma.review.create({
      data: {
        userId: customer.id,
        productId: createdProducts[i].id,
        rating: 5,
        title: 'Absolutely love it!',
        body: 'The quality of this bottle is unmatched. Keeps water cold all day.',
        isVerifiedPurchase: true,
        isApproved: true,
      }
    })
  }

  // 9. Frequently Bought Together
  await prisma.frequentlyBoughtTogether.create({
    data: {
      productId: createdProducts[0].id,
      relatedProductId: createdProducts[1].id,
      score: 0.95
    }
  })
  
  await prisma.frequentlyBoughtTogether.create({
    data: {
      productId: createdProducts[1].id,
      relatedProductId: createdProducts[2].id,
      score: 0.88
    }
  })

  await prisma.frequentlyBoughtTogether.create({
    data: {
      productId: createdProducts[2].id,
      relatedProductId: createdProducts[0].id,
      score: 0.85
    }
  })

  console.log('✅ Reviews & FBT created')
  console.log('🎉 Seeding finished successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
