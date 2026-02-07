const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('node:fs');
const path = require('node:path');
const { logger } = require('./middleware/logEvents.js');
const errorHandler = require('./middleware/errorHandler.js');
const corsOptions = require('./config/corsConfig.js');
const userRoutes = require('./routes/userRoutes.js');
const PORT = 3000;

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

app.use((req, res) => {
  res.status(404).send('Page not found!');
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor!`);
});
