require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const { logger } = require('./middleware/logEvents.js');
const corsOptions = require('./config/corsConfig.js');
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const connectDB = require('./config/dbConfig.js');
const PORT = 3000;

connectDB()

app.use(cors(corsOptions));

// Request log middleware
app.use(logger);

// Request error log middleware
/* app.use(errorHandler); */

// Middleware to parse JSON badies
app.use(express.json());

// Content-Type application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)

app.use((req, res) => {
  res.status(404).send('Page not found!');
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor!`);
});
