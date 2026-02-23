const corsOption = {
    origin: function (origin, callback){
        const whiteList = [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'https://www.google.com'
        ]

        if(whiteList.indexOf(origin) !== -1 || !origin){
            callback(null, true);
        }
        else{
            callback(new Error('CORS politikası tarafından engellendiniz!'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeader: ['Content-Type', 'Authorization'],
    credentials: true
}

module.exports = corsOption;