import redis from 'redis';
import bluebird from 'bluebird';
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export default redis.createClient({ host: process.env.DATA_REDIS_HOST, port: 6379 });
