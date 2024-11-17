import { connectDatabase } from './database';

export const initConfig = async () => {
  await connectDatabase();
 // await connectRedis();
};
