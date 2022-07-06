const redis = require("redis")

const client = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
      tls: true,
      rejectUnauthorized: false
    }
});

//let client = redis.createClient();


client.on('connect', () => {
    console.log("Connected to redis server");
});

client.on('error', err => {
    console.log(`Error: ${err}`);
});

client.connect();

module.exports.client = client;