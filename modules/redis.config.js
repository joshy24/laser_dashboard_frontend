const redis = require("redis")

const client = redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});

//let client = redis.createClient();

client.on('connect', () => {
    console.log("Connected to redis server");
});

client.on('error', err => {
    console.log(`Error: ${err}`);
});

//client.connect()

module.exports.client = client;