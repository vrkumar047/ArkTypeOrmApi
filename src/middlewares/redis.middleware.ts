// Import required modules
import express from 'express';
import Redis from 'ioredis';

const app = express();

const redis = new Redis();

// Middleware to check if data is in the cache
export const checkCache = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  let cacheId: string = req.url;
  const cachedData = await redis.get(cacheId, (err, data) => {
    if (err) {
      //throw err;
    }
    if (data) {
      res.locals.data = data;
    }
    next(); // If no data is found, move to the next middleware/handler
  });
};
