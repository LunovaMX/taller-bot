import * as dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT ?? 3008;

export const MONGO_DB_URI = process.env.MONGO_DB_URI as string;
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME as string;
export const PHONE_NUMBER = process.env.PHONE_NUMBER as string;
