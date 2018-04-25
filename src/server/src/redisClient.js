import Redis from 'ioredis';
import { RedisPubSub } from 'graphql-redis-subscriptions';

const options = {
  host: process.env.DATA_REDIS_HOST,
  port: 6379,
  retry_strategy: options => {
    // reconnect after
    return Math.max(options.attempt * 100, 3000);
  },
};

export const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});

export default new Redis(options);
