import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Category from './models/Category.js';
import Product from './models/Product.js';
import Brand from './models/Brand.js';
import User from './models/User.js';
import Settings from './models/Settings.js';
import ChitScheme from './models/ChitScheme.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const seedAll = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in .env file!');
      process.exit(1);
    }

    console.log('🔄 Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: Host: ${conn.connection.host} | DB: ${conn.connection.name}`);

    // ==========================================
    // 1. ADMIN USERS
    // ==========================================
    console.log('\n👤 1. Seeding Admin Users...');
    const adminEmails = [
      process.env.ADMIN_EMAIL || 'cracker@saiyogi.com',
      'admin@crackerhub.com',
    ];
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcryptjs.hash(password, 10);

    for (const email of adminEmails) {
      const existing = await User.findOne({ email });
      if (existing) {
        existing.password = hashedPassword;
        existing.role = 'SUPER ADMIN';
        existing.isActive = true;
        await existing.save();
        console.log(`   ✓ Admin user verified/updated: ${email}`);
      } else {
        await User.create({
          name: 'Super Admin',
          email,
          password: hashedPassword,
          role: 'SUPER ADMIN',
          isActive: true
        });
        console.log(`   ✓ Admin user created: ${email}`);
      }
    }

    // ==========================================
    // 2. BRANDS
    // ==========================================
    console.log('\n🏷️  2. Seeding Brands...');
    const brandsData = [
      {
        brandId: 'B0001',
        name: 'Standard Fireworks',
        phone: '+91 94880 73004',
        logo: '/sky_rocket_box.png',
        description: 'Sivakasi Premium Quality Sparklers & Rockets',
        itemsCount: 45,
        isActive: true,
      },
      {
        brandId: 'B0002',
        name: 'Ajanta Pyrotechnics',
        phone: '+91 94880 73005',
        logo: '/flower_pots.png',
        description: 'Top Quality Flower Pots & Aerial Display',
        itemsCount: 30,
        isActive: true,
      },
      {
        brandId: 'B0003',
        name: 'Sri Kaliswari Cock Brand',
        phone: '+91 94880 73006',
        logo: '/royal_celebration.png',
        description: 'Heritage Crackers & Sound Crackers',
        itemsCount: 60,
        isActive: true,
      },
      {
        brandId: 'B0004',
        name: 'Sony Crackers',
        phone: '+91 94880 73007',
        logo: '/family_star_kit.png',
        description: 'Festive Special Fancy Fountains & Shots',
        itemsCount: 25,
        isActive: true,
      },
      {
        brandId: 'B0005',
        name: 'Sai Yogi Special',
        phone: '+91 94880 73004',
        logo: '/saiyogi-logo-1.png',
        description: 'Direct Factory Best Value Combos & Gift Boxes',
        itemsCount: 20,
        isActive: true,
      },
    ];

    for (const b of brandsData) {
      const existing = await Brand.findOne({ name: b.name });
      if (!existing) {
        await Brand.create(b);
        console.log(`   ✓ Brand created: ${b.brandId} - ${b.name}`);
      } else {
        existing.brandId = b.brandId;
        existing.description = b.description;
        existing.logo = b.logo;
        existing.isActive = true;
        await existing.save();
        console.log(`   ✓ Brand updated: ${b.brandId} - ${b.name}`);
      }
    }

    // ==========================================
    // 3. CATEGORIES
    // ==========================================
    console.log('\n📂 3. Seeding Categories...');
    const categoriesData = [
      { name: 'Sparklers', categoryCode: '100', description: 'Sparkling fireworks for family and kids', displayOrder: 1, slug: 'sparklers', image: '/flower_pots.png' },
      { name: 'Flower Pots', categoryCode: '110', description: 'Classic fountain pots and sparkling cones', displayOrder: 2, slug: 'flower-pots', image: '/flower_pots.png' },
      { name: 'Ground Chakkars', categoryCode: '120', description: 'Spinning wheels and deluxe chakkars', displayOrder: 3, slug: 'ground-chakkars', image: '/royal_celebration.png' },
      { name: 'Sky Shots', categoryCode: '130', description: 'Multicolor repeating aerial fireworks', displayOrder: 4, slug: 'sky-shots', image: '/sky_rocket_box.png' },
      { name: 'Combo Packs', categoryCode: '140', description: 'Curated celebration gift boxes & family sets', displayOrder: 5, slug: 'combo-packs', image: '/family_star_kit.png' },
      { name: 'Rockets', categoryCode: '150', description: 'High altitude whistles and parachute rockets', displayOrder: 6, slug: 'rockets', image: '/sky_rocket_box.png' },
      { name: 'Garland Crackers', categoryCode: '160', description: 'Traditional Sivakasi sound garlands and bijili', displayOrder: 7, slug: 'garland-crackers', image: '/garland_crackers.png' },
      { name: 'Kids Special', categoryCode: '170', description: 'Safe fun items: roll caps, snappers, snake tablets', displayOrder: 8, slug: 'kids-special', image: '/kids_joy_bundle.png' },
    ];

    const catMap = {};
    for (const c of categoriesData) {
      let existing = await Category.findOne({ name: c.name });
      if (!existing) {
        existing = await Category.create(c);
        console.log(`   ✓ Category created: [${c.categoryCode}] ${c.name}`);
      } else {
        existing.categoryCode = c.categoryCode;
        existing.description = c.description;
        existing.displayOrder = c.displayOrder;
        existing.image = c.image;
        existing.isActive = true;
        await existing.save();
        console.log(`   ✓ Category updated: [${c.categoryCode}] ${c.name}`);
      }
      catMap[c.name] = existing._id;
    }

    // ==========================================
    // 4. PRODUCTS
    // ==========================================
    console.log('\n🎆 4. Seeding Products...');

    const productsData = [
      // --- Sparklers (100) ---
      {
        name: '10cm Electric Sparklers',
        code: '1001',
        sku: '1001',
        category: catMap['Sparklers'],
        brand: 'Standard Fireworks',
        price: 50,
        wholesalePrice: 40,
        netRate: 35,
        stock: 500,
        storeStockPieces: 500,
        minimumStock: 50,
        image: '/flower_pots.png',
        quantity: '1 Box (10 Pcs)',
        crackerType: 'Kids Crackers',
        description: 'Safe electric sparklers with crackling golden sparks for children and families.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 4.8,
        isActive: true,
      },
      {
        name: '15cm Green Sparklers',
        code: '1002',
        sku: '1002',
        category: catMap['Sparklers'],
        brand: 'Standard Fireworks',
        price: 80,
        wholesalePrice: 70,
        netRate: 65,
        stock: 400,
        storeStockPieces: 400,
        minimumStock: 40,
        image: '/sky_rocket_box.png',
        quantity: '1 Box (10 Pcs)',
        crackerType: 'Night Crackers',
        description: 'Vivid emerald green sparklers with long burn time.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 4.9,
        isActive: true,
      },
      {
        name: '30cm Deluxe Color Sparklers',
        code: '1003',
        sku: '1003',
        category: catMap['Sparklers'],
        brand: 'Standard Fireworks',
        price: 140,
        wholesalePrice: 120,
        netRate: 110,
        stock: 350,
        storeStockPieces: 350,
        minimumStock: 30,
        image: '/flower_pots.png',
        quantity: '1 Box (5 Pcs)',
        crackerType: 'Night Crackers',
        description: 'Extra long 30cm colored sparklers with sparkling glitter.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 5,
        isActive: true,
      },
      {
        name: '50cm Mega Sparklers',
        code: '1004',
        sku: '1004',
        category: catMap['Sparklers'],
        brand: 'Ajanta Pyrotechnics',
        price: 250,
        wholesalePrice: 210,
        netRate: 190,
        stock: 200,
        storeStockPieces: 200,
        minimumStock: 25,
        image: '/sky_rocket_box.png',
        quantity: '1 Box (5 Pcs)',
        crackerType: 'Night Crackers',
        description: 'Giant mega sparklers with ultra-long duration and brilliant glow.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 5,
        isActive: true,
      },

      // --- Flower Pots (110) ---
      {
        name: 'Flower Pots Small',
        code: '1101',
        sku: '1101',
        category: catMap['Flower Pots'],
        brand: 'Ajanta Pyrotechnics',
        price: 120,
        wholesalePrice: 100,
        netRate: 90,
        stock: 300,
        storeStockPieces: 300,
        minimumStock: 30,
        image: '/flower_pots.png',
        quantity: '1 Box (10 Pcs)',
        crackerType: 'Night Crackers',
        description: 'Classic silver and gold fountain pots, gentle and safe for everyone.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 4.8,
        isActive: true,
      },
      {
        name: 'Flower Pots Big',
        code: '1102',
        sku: '1102',
        category: catMap['Flower Pots'],
        brand: 'Ajanta Pyrotechnics',
        price: 200,
        wholesalePrice: 180,
        netRate: 160,
        stock: 250,
        storeStockPieces: 250,
        minimumStock: 25,
        image: '/flower_pots.png',
        quantity: '1 Box (10 Pcs)',
        crackerType: 'Night Crackers',
        description: 'High fountain pot reaching up to 15 feet high with showering colors.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 4.9,
        isActive: true,
      },
      {
        name: 'Flower Pots Special',
        code: '1103',
        sku: '1103',
        category: catMap['Flower Pots'],
        brand: 'Sri Kaliswari Cock Brand',
        price: 280,
        wholesalePrice: 240,
        netRate: 220,
        stock: 200,
        storeStockPieces: 200,
        minimumStock: 20,
        image: '/flower_pots.png',
        quantity: '1 Box (10 Pcs)',
        crackerType: 'Night Crackers',
        description: 'Multi-stage colorful sparkling fountain with golden drops.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 5,
        isActive: true,
      },
      {
        name: 'Flower Pots Asoka Deluxe',
        code: '1104',
        sku: '1104',
        category: catMap['Flower Pots'],
        brand: 'Sony Crackers',
        price: 360,
        wholesalePrice: 310,
        netRate: 290,
        stock: 180,
        storeStockPieces: 180,
        minimumStock: 20,
        image: '/flower_pots.png',
        quantity: '1 Box (10 Pcs)',
        crackerType: 'Night Crackers',
        description: 'Grand Asoka flower pots with maximum height and shimmering stars.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 5,
        isActive: true,
      },

      // --- Ground Chakkars (120) ---
      {
        name: 'Ground Chakkar Normal',
        code: '1201',
        sku: '1201',
        category: catMap['Ground Chakkars'],
        brand: 'Standard Fireworks',
        price: 90,
        wholesalePrice: 80,
        netRate: 75,
        stock: 350,
        storeStockPieces: 350,
        minimumStock: 40,
        image: '/royal_celebration.png',
        quantity: '1 Box (10 Pcs)',
        crackerType: 'Night Crackers',
        description: 'Smooth spinning circular wheel with golden sparks on the ground.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 4.7,
        isActive: true,
      },
      {
        name: 'Ground Chakkar Special',
        code: '1202',
        sku: '1202',
        category: catMap['Ground Chakkars'],
        brand: 'Standard Fireworks',
        price: 150,
        wholesalePrice: 130,
        netRate: 120,
        stock: 450,
        storeStockPieces: 450,
        minimumStock: 40,
        image: '/royal_celebration.png',
        quantity: '1 Box (10 Pcs)',
        crackerType: 'Night Crackers',
        description: 'Fast rotating special chakkar with vibrant fiery perimeter.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 4.9,
        isActive: true,
      },
      {
        name: 'Ground Chakkar Deluxe',
        code: '1203',
        sku: '1203',
        category: catMap['Ground Chakkars'],
        brand: 'Sri Kaliswari Cock Brand',
        price: 220,
        wholesalePrice: 190,
        netRate: 175,
        stock: 250,
        storeStockPieces: 250,
        minimumStock: 30,
        image: '/royal_celebration.png',
        quantity: '1 Box (10 Pcs)',
        crackerType: 'Night Crackers',
        description: 'Long-running deluxe chakkar with intense golden light spray.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 5,
        isActive: true,
      },
      {
        name: 'Spinner Chakkar Wheel',
        code: '1204',
        sku: '1204',
        category: catMap['Ground Chakkars'],
        brand: 'Sony Crackers',
        price: 260,
        wholesalePrice: 230,
        netRate: 210,
        stock: 200,
        storeStockPieces: 200,
        minimumStock: 25,
        image: '/royal_celebration.png',
        quantity: '1 Box (10 Pcs)',
        crackerType: 'Night Crackers',
        description: 'Special whistling spinner wheel that dances with color.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 4.9,
        isActive: true,
      },

      // --- Sky Shots (130) ---
      {
        name: '7 Shots Aerial Repeater',
        code: '1301',
        sku: '1301',
        category: catMap['Sky Shots'],
        brand: 'Sony Crackers',
        price: 350,
        wholesalePrice: 300,
        netRate: 280,
        stock: 200,
        storeStockPieces: 200,
        minimumStock: 20,
        image: '/sky_rocket_box.png',
        quantity: '1 Pcs',
        crackerType: 'Night Crackers',
        description: '7 sequential high-altitude multi-color bursts in the night sky.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 4.9,
        isActive: true,
      },
      {
        name: '12 Shots Multicolor Sky Show',
        code: '1302',
        sku: '1302',
        category: catMap['Sky Shots'],
        brand: 'Sony Crackers',
        price: 550,
        wholesalePrice: 500,
        netRate: 480,
        stock: 150,
        storeStockPieces: 150,
        minimumStock: 15,
        image: '/sky_rocket_box.png',
        quantity: '1 Pcs',
        crackerType: 'Night Crackers',
        description: '12 brilliant aerial breaks featuring crackling palm and glittering pistil.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 5,
        isActive: true,
      },
      {
        name: '30 Shots Mega Fireworks Display',
        code: '1303',
        sku: '1303',
        category: catMap['Sky Shots'],
        brand: 'Sony Crackers',
        price: 1200,
        wholesalePrice: 1050,
        netRate: 980,
        stock: 80,
        storeStockPieces: 80,
        minimumStock: 10,
        image: '/sky_rocket_box.png',
        quantity: '1 Pcs',
        crackerType: 'Night Crackers',
        description: '30 shots grand finale cake box filling the sky with dazzling effects.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 5,
        isActive: true,
      },

      // --- Combo Packs (140) ---
      {
        name: 'Family Star Combo Pack',
        code: '1401',
        sku: '1401',
        category: catMap['Combo Packs'],
        brand: 'Sai Yogi Special',
        price: 1500,
        wholesalePrice: 1300,
        netRate: 1200,
        stock: 80,
        storeStockPieces: 80,
        minimumStock: 10,
        image: '/family_star_kit.png',
        quantity: '1 Box (45 Items Assorted)',
        crackerType: 'Gift Box',
        description: 'Perfect family collection with sparklers, flower pots, ground chakkars, aerial shots, and kids fun items.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 5,
        isActive: true,
        comboProducts: [
          { name: '10cm Electric Sparklers', quantity: '2 Boxes' },
          { name: '15cm Green Sparklers', quantity: '1 Box' },
          { name: 'Flower Pots Small', quantity: '1 Box' },
          { name: 'Ground Chakkar Normal', quantity: '1 Box' },
          { name: '7 Shots Aerial Repeater', quantity: '1 Pcs' },
          { name: 'Pop Pop Snappers', quantity: '2 Boxes' },
          { name: '28 Chorsa Sound Crackers', quantity: '2 Pkt' },
          { name: 'Magic Whip Sparkler Stick', quantity: '1 Box' },
          { name: 'Serpent Eggs / Black Snake', quantity: '1 Box' },
          { name: 'Whistling Rocket', quantity: '1 Box' }
        ]
      },
      {
        name: 'Grand Sky Delight Combo',
        code: '1402',
        sku: '1402',
        category: catMap['Combo Packs'],
        brand: 'Sai Yogi Special',
        price: 2500,
        wholesalePrice: 2200,
        netRate: 2000,
        stock: 50,
        storeStockPieces: 50,
        minimumStock: 8,
        image: '/grand_sky_delight.png',
        quantity: '1 Box (75 Items Assorted)',
        crackerType: 'Gift Box',
        description: 'Elite celebration gift box featuring high altitude sky shows, big flower pots, and long sound garlands.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 5,
        isActive: true,
        comboProducts: [
          { name: '15cm Green Sparklers', quantity: '2 Boxes' },
          { name: '30cm Deluxe Color Sparklers', quantity: '2 Boxes' },
          { name: 'Flower Pots Big', quantity: '2 Boxes' },
          { name: 'Flower Pots Special', quantity: '1 Box' },
          { name: 'Ground Chakkar Special', quantity: '2 Boxes' },
          { name: '12 Shots Multicolor Sky Show', quantity: '1 Pcs' },
          { name: '1000 Wala Festive Garland', quantity: '1 Box' },
          { name: 'Whistling Rocket', quantity: '2 Boxes' },
          { name: 'Magic Whip Sparkler Stick', quantity: '2 Boxes' },
          { name: 'Pop Pop Snappers', quantity: '3 Boxes' }
        ]
      },
      {
        name: 'Royal Celebration Mega Hamper',
        code: '1403',
        sku: '1403',
        category: catMap['Combo Packs'],
        brand: 'Sai Yogi Special',
        price: 4500,
        wholesalePrice: 3900,
        netRate: 3600,
        stock: 35,
        storeStockPieces: 35,
        minimumStock: 5,
        image: '/royal_celebration.png',
        quantity: '1 Box (110 Items Luxury)',
        crackerType: 'Gift Box',
        description: 'Ultimate grand luxury Diwali hamper containing top-of-the-line Sivakasi fireworks for memorable festivities.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 5,
        isActive: true,
        comboProducts: [
          { name: '50cm Mega Sparklers', quantity: '2 Boxes' },
          { name: 'Flower Pots Asoka Deluxe', quantity: '2 Boxes' },
          { name: 'Ground Chakkar Deluxe', quantity: '2 Boxes' },
          { name: '30 Shots Mega Fireworks Display', quantity: '1 Box' },
          { name: '2000 Wala Grand Garland', quantity: '1 Box' },
          { name: 'Lunik Rocket Special', quantity: '2 Boxes' },
          { name: '12 Shots Multicolor Sky Show', quantity: '2 Pcs' },
          { name: 'Family Star Sparkler Assortment', quantity: '1 Box' },
          { name: 'Kids Special Snapper & Whip Box', quantity: '1 Set' }
        ]
      },

      // --- Rockets (150) ---
      {
        name: 'Baby Rocket',
        code: '1501',
        sku: '1501',
        category: catMap['Rockets'],
        brand: 'Standard Fireworks',
        price: 110,
        wholesalePrice: 95,
        netRate: 85,
        stock: 300,
        storeStockPieces: 300,
        minimumStock: 30,
        image: '/sky_rocket_box.png',
        quantity: '1 Box (10 Pcs)',
        crackerType: 'Night Crackers',
        description: 'High soaring baby rocket with a sharp pop sound at top.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 4.8,
        isActive: true,
      },
      {
        name: 'Whistling Rocket',
        code: '1502',
        sku: '1502',
        category: catMap['Rockets'],
        brand: 'Standard Fireworks',
        price: 210,
        wholesalePrice: 180,
        netRate: 165,
        stock: 250,
        storeStockPieces: 250,
        minimumStock: 25,
        image: '/sky_rocket_box.png',
        quantity: '1 Box (10 Pcs)',
        crackerType: 'Night Crackers',
        description: 'Loud shrieking whistling rocket with colorful star bursts.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 4.9,
        isActive: true,
      },
      {
        name: 'Lunik Rocket Special',
        code: '1503',
        sku: '1503',
        category: catMap['Rockets'],
        brand: 'Ajanta Pyrotechnics',
        price: 320,
        wholesalePrice: 280,
        netRate: 260,
        stock: 180,
        storeStockPieces: 180,
        minimumStock: 20,
        image: '/sky_rocket_box.png',
        quantity: '1 Box (10 Pcs)',
        crackerType: 'Night Crackers',
        description: 'Space age high elevation rocket bursting into sparkling willow stars.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 5,
        isActive: true,
      },

      // --- Garland Crackers (160) ---
      {
        name: '28 Chorsa Sound Crackers',
        code: '1601',
        sku: '1601',
        category: catMap['Garland Crackers'],
        brand: 'Sri Kaliswari Cock Brand',
        price: 40,
        wholesalePrice: 32,
        netRate: 30,
        stock: 500,
        storeStockPieces: 500,
        minimumStock: 50,
        image: '/garland_crackers.png',
        quantity: '1 Pkt',
        crackerType: 'Day Crackers',
        description: 'Traditional crisp 28-sound red crackers packet for auspicious beginnings.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 4.7,
        isActive: true,
      },
      {
        name: '100 Wala Red Garland',
        code: '1602',
        sku: '1602',
        category: catMap['Garland Crackers'],
        brand: 'Sri Kaliswari Cock Brand',
        price: 110,
        wholesalePrice: 95,
        netRate: 85,
        stock: 400,
        storeStockPieces: 400,
        minimumStock: 40,
        image: '/garland_crackers.png',
        quantity: '1 Box',
        crackerType: 'Day Crackers',
        description: 'Continuous 100 crackers red lar with loud festive sound rhythm.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 4.8,
        isActive: true,
      },
      {
        name: '1000 Wala Festive Garland',
        code: '1603',
        sku: '1603',
        category: catMap['Garland Crackers'],
        brand: 'Sri Kaliswari Cock Brand',
        price: 650,
        wholesalePrice: 560,
        netRate: 520,
        stock: 120,
        storeStockPieces: 120,
        minimumStock: 15,
        image: '/garland_crackers.png',
        quantity: '1 Box',
        crackerType: 'Day Crackers',
        description: 'Grand 1000 sound garland with powerful ending blast.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 4.9,
        isActive: true,
      },
      {
        name: '2000 Wala Grand Garland',
        code: '1604',
        sku: '1604',
        category: catMap['Garland Crackers'],
        brand: 'Sri Kaliswari Cock Brand',
        price: 1250,
        wholesalePrice: 1080,
        netRate: 990,
        stock: 75,
        storeStockPieces: 75,
        minimumStock: 10,
        image: '/garland_crackers.png',
        quantity: '1 Box',
        crackerType: 'Day Crackers',
        description: 'Mega 2000 sound celebration garland for weddings and Diwali festival.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 5,
        isActive: true,
      },

      // --- Kids Special (170) ---
      {
        name: 'Magic Whip Sparkler Stick',
        code: '1701',
        sku: '1701',
        category: catMap['Kids Special'],
        brand: 'Standard Fireworks',
        price: 60,
        wholesalePrice: 50,
        netRate: 45,
        stock: 400,
        storeStockPieces: 400,
        minimumStock: 40,
        image: '/kids_joy_bundle.png',
        quantity: '1 Box',
        crackerType: 'Kids Crackers',
        description: 'Crackling magic whip with glowing sparks, completely safe for children.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 4.8,
        isActive: true,
      },
      {
        name: 'Cartoon Roll Caps & Toy Gun',
        code: '1702',
        sku: '1702',
        category: catMap['Kids Special'],
        brand: 'Standard Fireworks',
        price: 80,
        wholesalePrice: 65,
        netRate: 60,
        stock: 350,
        storeStockPieces: 350,
        minimumStock: 35,
        image: '/kids_joy_bundle.png',
        quantity: '1 Set (1 Gun + 10 Rolls)',
        crackerType: 'Kids Crackers',
        description: 'Kids favorite roll cap pistol with harmless sound effect.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 4.9,
        isActive: true,
      },
      {
        name: 'Pop Pop Snappers',
        code: '1703',
        sku: '1703',
        category: catMap['Kids Special'],
        brand: 'Standard Fireworks',
        price: 50,
        wholesalePrice: 42,
        netRate: 38,
        stock: 600,
        storeStockPieces: 600,
        minimumStock: 50,
        image: '/kids_joy_bundle.png',
        quantity: '1 Box (50 Pcs)',
        crackerType: 'Kids Crackers',
        description: 'Throwdown snap crackers, pops upon hitting the floor without fire.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 5,
        isActive: true,
      },
      {
        name: 'Serpent Eggs / Black Snake',
        code: '1704',
        sku: '1704',
        category: catMap['Kids Special'],
        brand: 'Standard Fireworks',
        price: 45,
        wholesalePrice: 38,
        netRate: 35,
        stock: 500,
        storeStockPieces: 500,
        minimumStock: 50,
        image: '/kids_joy_bundle.png',
        quantity: '1 Box (10 Pcs)',
        crackerType: 'Kids Crackers',
        description: 'Fun snake tablets that expand into long coiled black snakes when lit.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 4.7,
        isActive: true,
      },
      {
        name: 'Kids Joy Festival Pack',
        code: '1705',
        sku: '1705',
        category: catMap['Kids Special'],
        brand: 'Sai Yogi Special',
        price: 990,
        wholesalePrice: 850,
        netRate: 790,
        stock: 90,
        storeStockPieces: 90,
        minimumStock: 10,
        image: '/kids_joy_bundle.png',
        quantity: '1 Box (Kids Safe Fun Pack)',
        crackerType: 'Kids Crackers',
        description: 'Complete noise-free and low-smoke package specially created for youngsters and toddlers.',
        hasDiscount: true,
        displayNetRate: false,
        isSaiYogiVerified: true,
        rating: 5,
        isActive: true,
        comboProducts: [
          { name: '10cm Electric Sparklers', quantity: '3 Boxes' },
          { name: 'Pop Pop Snappers', quantity: '5 Boxes' },
          { name: 'Magic Whip Sparkler Sticks', quantity: '2 Boxes' },
          { name: 'Cartoon Roll Caps & Toy Gun', quantity: '1 Set' },
          { name: 'Serpent Eggs / Black Snake', quantity: '3 Boxes' }
        ]
      }
    ];

    for (const p of productsData) {
      let existing = await Product.findOne({ sku: p.sku });
      if (!existing) {
        existing = await Product.create(p);
        console.log(`   ✓ Product created: [${p.sku}] ${p.name}`);
      } else {
        Object.assign(existing, p);
        await existing.save();
        console.log(`   ✓ Product updated: [${p.sku}] ${p.name}`);
      }
    }

    // ==========================================
    // 5. SITE SETTINGS
    // ==========================================
    console.log('\n⚙️  5. Seeding Site Settings...');
    let settings = await Settings.findOne();
    const settingsData = {
      siteName: 'Sai Yogi Crackers',
      siteDescription: 'Direct Sivakasi Fireworks Wholesale & Retail Price Estimator',
      discountPercent: 10,
      minimumPurchaseAmount: 500,
      minPurchaseOutsideTN: 1000,
      freeDeliveryThreshold: 5000,
      deliveryCharge: 99,
      currency: 'INR',
      enablePackingCharge: true,
      maintenanceMode: false,
      contact: {
        email: 'cracker@saiyogi.com',
        phone: '+91 94880 73004',
        phone2: '+91 94880 73005',
        address: 'Sai Yogi Fireworks, Bypass Road, Sivakasi, Tamil Nadu - 626123'
      },
      socialLinks: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com'
      },
      features: {
        enableReviews: true,
        enableWishlist: true,
        enableGuestCheckout: true,
        enableCoupon: true,
        enableNotifications: true
      }
    };

    if (!settings) {
      await Settings.create(settingsData);
      console.log('   ✓ Site Settings created.');
    } else {
      Object.assign(settings, settingsData);
      await settings.save();
      console.log('   ✓ Site Settings updated.');
    }

    // ==========================================
    // 6. CHIT SCHEMES
    // ==========================================
    console.log('\n🎟️  6. Seeding Chit Schemes...');
    const schemesData = [
      {
        title: 'Diwali 2026 Mega Gold Scheme',
        description: 'Pay ₹1,000 monthly for 11 months and receive premium Sivakasi crackers worth ₹15,000 delivered to your doorstep for Diwali 2026!',
        monthlyAmount: 1000,
        totalMonths: 11,
        dueDateDay: 10,
        startDate: '2026-01-01',
        status: 'Active',
        isActive: true,
        displayOrder: 1,
      },
      {
        title: 'Diwali 2026 Silver Family Scheme',
        description: 'Pay ₹500 monthly for 11 months and receive crackers worth ₹7,500 for Diwali 2026!',
        monthlyAmount: 500,
        totalMonths: 11,
        dueDateDay: 10,
        startDate: '2026-01-01',
        status: 'Active',
        isActive: true,
        displayOrder: 2,
      }
    ];

    for (const s of schemesData) {
      const existing = await ChitScheme.findOne({ title: s.title });
      if (!existing) {
        await ChitScheme.create(s);
        console.log(`   ✓ Chit Scheme created: ${s.title}`);
      } else {
        Object.assign(existing, s);
        await existing.save();
        console.log(`   ✓ Chit Scheme updated: ${s.title}`);
      }
    }

    // ==========================================
    // SUMMARY
    // ==========================================
    const totalCategories = await Category.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalBrands = await Brand.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalSchemes = await ChitScheme.countDocuments();

    console.log('\n==========================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('==========================================');
    console.log(`📊 Total Categories: ${totalCategories}`);
    console.log(`📊 Total Products:   ${totalProducts}`);
    console.log(`📊 Total Brands:     ${totalBrands}`);
    console.log(`📊 Total Admins:     ${totalUsers}`);
    console.log(`📊 Total Schemes:    ${totalSchemes}`);
    console.log('==========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedAll();
