// import redis from 'redis';
// import bluebird from 'bluebird';
// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);

// export default redis.createClient({ host: process.env.DATA_REDIS_HOST, port: 6379 });

import Redis from 'ioredis';

var redis = new Redis(6379, process.env.DATA_REDIS_HOST);

export default redis;
