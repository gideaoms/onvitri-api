import { isNil } from '@/utils'

const config = {
  APP_ENV: process.env.APP_ENV,
  APP_PORT: Number(process.env.APP_PORT),
  APP_HOST: process.env.APP_HOST,
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASS: process.env.DATABASE_PASS,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  TOKEN_EXPIRES_IN: process.env.TOKEN_EXPIRES_IN,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_S3_ENDPOINT: process.env.AWS_S3_ENDPOINT,
}

Object.entries(config).forEach(([key, value]) => {
  if (isNil(value)) throw new Error(`Env ${key} is not defined`)
})

export default config
