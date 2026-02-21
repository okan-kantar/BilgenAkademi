require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/dbConfig');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
  { name: 'Electronics', description: 'Phones, laptops, and smart accessories' },
  { name: 'Fashion', description: 'Clothing, shoes, and seasonal collections' },
  { name: 'Home & Kitchen', description: 'Home organization and kitchen essentials' },
  { name: 'Sports & Outdoors', description: 'Training equipment and outdoor gear' },
  { name: 'Books', description: 'Popular books and learning resources' },
];

const products = [
  { name: 'Smartphone X', price: 24999, categoryName: 'Electronics', description: '5G smartphone with OLED display', inStock: true, tags: ['phone', 'mobile'] },
  { name: 'Laptop Pro 14', price: 42999, categoryName: 'Electronics', description: 'Lightweight laptop for daily work', inStock: true, tags: ['laptop', 'computer'] },
  { name: 'Wireless Earbuds', price: 2999, categoryName: 'Electronics', description: 'Noise-isolating bluetooth earbuds', inStock: true, tags: ['audio', 'wireless'] },
  { name: 'Smart Watch Fit', price: 3499, categoryName: 'Electronics', description: 'Fitness-focused smartwatch', inStock: true, tags: ['wearable', 'fitness'] },

  { name: 'Classic T-Shirt', price: 399, categoryName: 'Fashion', description: 'Soft cotton t-shirt for everyday use', inStock: true, tags: ['tshirt', 'casual'] },
  { name: 'Denim Jacket', price: 1499, categoryName: 'Fashion', description: 'Regular fit denim jacket', inStock: true, tags: ['jacket', 'denim'] },
  { name: 'Running Sneakers', price: 1899, categoryName: 'Fashion', description: 'Comfortable sneakers for active days', inStock: true, tags: ['shoes', 'sport'] },
  { name: 'Leather Belt', price: 299, categoryName: 'Fashion', description: 'Adjustable genuine leather belt', inStock: true, tags: ['accessory', 'belt'] },

  { name: 'Ceramic Mug Set', price: 249, categoryName: 'Home & Kitchen', description: 'Set of 4 durable ceramic mugs', inStock: true, tags: ['kitchen', 'mug'] },
  { name: 'Non-Stick Pan', price: 799, categoryName: 'Home & Kitchen', description: 'Pan with heat-resistant handle', inStock: true, tags: ['cookware', 'pan'] },
  { name: 'Storage Box 20L', price: 179, categoryName: 'Home & Kitchen', description: 'Stackable box for home storage', inStock: true, tags: ['storage', 'home'] },
  { name: 'LED Desk Lamp', price: 499, categoryName: 'Home & Kitchen', description: 'Adjustable brightness desk lamp', inStock: true, tags: ['lamp', 'lighting'] },

  { name: 'Yoga Mat 6mm', price: 449, categoryName: 'Sports & Outdoors', description: 'Non-slip yoga mat for workouts', inStock: true, tags: ['yoga', 'fitness'] },
  { name: 'Dumbbell Set 10kg', price: 1299, categoryName: 'Sports & Outdoors', description: 'Adjustable dumbbell set', inStock: true, tags: ['gym', 'weights'] },
  { name: 'Camping Tent 2P', price: 2199, categoryName: 'Sports & Outdoors', description: 'Water-resistant 2-person tent', inStock: true, tags: ['camping', 'tent'] },
  { name: 'Insulated Water Bottle', price: 329, categoryName: 'Sports & Outdoors', description: 'Keeps drinks cold for long hours', inStock: true, tags: ['outdoor', 'bottle'] },

  { name: 'JavaScript Basics', price: 299, categoryName: 'Books', description: 'Beginner guide to JavaScript concepts', inStock: true, tags: ['programming', 'javascript'] },
  { name: 'Node.js in Practice', price: 349, categoryName: 'Books', description: 'Practical backend development with Node.js', inStock: true, tags: ['nodejs', 'backend'] },
  { name: 'Clean Code Notes', price: 279, categoryName: 'Books', description: 'Readable and maintainable coding habits', inStock: true, tags: ['software', 'best-practice'] },
  { name: 'MongoDB Quick Start', price: 259, categoryName: 'Books', description: 'Fast start guide for MongoDB users', inStock: true, tags: ['mongodb', 'database'] },
];

const seedCategoriesAndProducts = async () => {
  try {
    await connectDB();

    const categoryOps = categories.map((category) => ({
      updateOne: {
        filter: { name: category.name },
        update: { $set: category },
        upsert: true,
      },
    }));

    await Category.bulkWrite(categoryOps, { ordered: false });

    const categoryDocs = await Category.find({
      name: { $in: categories.map((category) => category.name) },
    })
      .select('_id name')
      .lean();

    const categoryMap = new Map(
      categoryDocs.map((category) => [category.name, category._id]),
    );

    const productOps = products.map((product) => {
      const categoryId = categoryMap.get(product.categoryName);

      if (!categoryId) {
        throw new Error(`Category not found for product: ${product.name}`);
      }

      const { categoryName, ...productData } = product;

      return {
        updateOne: {
          filter: { name: productData.name },
          update: {
            $set: {
              ...productData,
              category: categoryId,
            },
          },
          upsert: true,
        },
      };
    });

    await Product.bulkWrite(productOps, { ordered: false });

    console.log('Seed completed successfully.');
    console.log(`Categories processed: ${categories.length}`);
    console.log(`Products processed: ${products.length}`);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
    }
  }
};

seedCategoriesAndProducts();
