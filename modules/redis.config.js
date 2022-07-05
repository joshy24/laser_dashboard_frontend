const redis = require("redis")

let client = redis.createClient({url: process.env.REDIS_URL});

//let client = redis.createClient();

client.on('connect', () => {
    console.log("Connected to redis server");
});

client.on('error', err => {
    console.log(`Error: ${err}`);
});

client.connect()

module.exports.client = client;