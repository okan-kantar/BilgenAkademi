const express = require('express');
const app = express();
const {logger } = require('./middleware/logEvents.js');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler.js');
const userRouters = require('./routes/userRoutes.js');
const authRouters = require('./routes/authRoute.js');
const noteRouters = require('./routes/noteRoutes.js');
const port = 3000;
const corsOptions = require('./config/corsOptions.js');

// Hangi domainlerin sunucuya erişebileceğini belirlemek için cors middleware'ini kullanıyoruz
app.use(cors(corsOptions));

// Json formatındaki verileri okumak için express'in json middleware'ini kullanıyoruz
app.use(express.json());

// Logger middleware'ini kullanıyoruz
app.use(logger);

// Hata yakalama middleware'ini kullanıyoruz
app.use(errorHandler);

// tarayıcıdan gelen form verilerini okumak için urlencoded middleware'ini kullanıyoruz
app.use(express.urlencoded({ extended: false }));

// routers
app.use('/api/users', userRouters);
app.use('/api/notes', noteRouters);
app.use('/api/auth', authRouters);

app.use((req, res) => {
    res.status(404).send('Sayfa bulunamadı!');
})

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor!`);
})