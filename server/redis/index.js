const redis = require('redis');
const client = redis.createClient();

const connect = async() => {
    await client.connect();
}

const redisClient = {
    client,
    connect,
};

module.exports = redisClient;