import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Brand from './models/Brand.js';
import Order from './models/Order.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

console.log('====================================================');
console.log('🍃 PBL Crackers - VPS MongoDB Initialization & Test');
console.log('====================================================');

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pbl_crackers_db';
console.log(`Connecting to: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);

async function run() {
  try {
    await connectDB();

    // Small delay to allow async seeding to finish
    await new Promise((r) => setTimeout(r, 1500));

    const [userCount, productCount, categoryCount, brandCount, orderCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Category.countDocuments(),
      Brand.countDocuments(),
      Order.countDocuments(),
    ]);

    console.log('\n📊 Database Status & Collection Counts:');
    console.log(`  - Users (Admins/Customers): ${userCount}`);
    console.log(`  - Products:                ${productCount}`);
    console.log(`  - Categories:              ${categoryCount}`);
    console.log(`  - Brands:                  ${brandCount}`);
    console.log(`  - Orders:                  ${orderCount}`);

    console.log('\n🔑 Default Admin Account:');
    console.log(`  - Email:    ${process.env.ADMIN_EMAIL || 'cracker@PBL.com'}`);
    console.log(`  - Password: ${process.env.ADMIN_PASSWORD || 'PBL123'}`);
    console.log(`  - Role:     SUPER ADMIN`);

    console.log('\n✅ MongoDB connected & initialized successfully!');
    console.log('====================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ MongoDB Initialization Failed:', err.message);
    process.exit(1);
  }
}

run();
