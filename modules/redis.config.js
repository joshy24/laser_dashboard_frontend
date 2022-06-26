const redis = require("redis")

client = redis.createClient();

client.on('connect', () => {
    console.log("Connected to redis server");
});

client.on('error', err => {
    console.log(`Error: ${err}`);
});

client.connect()

module.exports.client = client;