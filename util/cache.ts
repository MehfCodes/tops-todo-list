import { clientRedis, getCache } from './../server';

export async function cacheOrSet(key: string, cb) {
  try {
    const inCache = await getCache(key);
    if (inCache) {
      return JSON.parse(inCache);
    } else {
      const data = await cb();
      clientRedis.setex(key, 3600, JSON.stringify(data));
      return data;
    }
  } catch (error) {
    console.log(error);
    return error.message;
  }
}
