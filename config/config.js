'use strict'

module.exports = {
    name: 'LASER',
    version: '1.0.0',
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    base_url: process.env.BASE_URL,
    db: {
        uri: process.env.PROD_DB_URL,
        options: {
            user: process.env.DB_USER,
            pass: process.env.DB_PWD
        }
    },
    secret: process.env.SECRET_KEY, 
    google_api_key: process.env.GOOGLE_API_KEY,
    socket: {
        port: process.env.SOCKET_IO_PORT
    },
    twilio: {
        sid: process.env.TWILIO_SID,
        auth_token: process.env.TWILIO_TOKEN,
        phone: process.env.TWILIO_NUMBER
    },
    pubnub: {
        pub_key: process.env.PUB_KEY,
        sub_key: process.env.SUB_KEY,
        secret_key: process.env.SECRET_KEY
    }
}