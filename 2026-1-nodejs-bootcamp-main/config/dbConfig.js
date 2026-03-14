const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/e-commerce");

    console.log(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);

    // Eski schema'dan kalan orphan index'leri temizle
    const ordersCollection = conn.connection.collection('orders');
    const indexes = await ordersCollection.indexes();
    const orphanIndexNames = ['conversationId_1', 'token_1'];
    for (const indexName of orphanIndexNames) {
      if (indexes.some((index) => index.name === indexName)) {
        await ordersCollection.dropIndex(indexName);
        console.log(`Eski ${indexName} index'i silindi`);
      }
    }
  } catch (error) {
    console.log(`MongoDB bağlantısı başarısız: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
