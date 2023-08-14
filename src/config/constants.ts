import "dotenv/config"; // Must be imported so env are initialized from file

export const HELLO_MESSAGE = process.env.WORLD as string;

export const LOG_DEBUG = Boolean(JSON.parse(process.env.LOG_DEBUG as string));
