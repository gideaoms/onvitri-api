export const config = {
  NODE_ENV: process.env.NODE_ENV as 'development' | 'test' | 'production',
  APP_PORT: Number(process.env.APP_PORT),
  APP_HOST: process.env.APP_HOST,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASS: process.env.DATABASE_PASS,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  TOKEN_SECRET: process.env.TOKEN_SECRET as string,
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
  AWS_S3_ENDPOINT: process.env.AWS_S3_ENDPOINT,
  AWS_S3_NAME: process.env.AWS_S3_NAME,
  SENTRY_DSN: process.env.SENTRY_DSN,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: Number(process.env.MAIL_PORT),
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PASS: process.env.REDIS_PASS,
  REDIS_PORT: Number(process.env.REDIS_PORT),
};
