import Redis from 'ioredis';
import config from '../config';

const redis = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD,
  db: 0,
});

export default redis;