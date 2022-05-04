function pick(key: string) {
  if (!process.env[key]) throw new Error(`Env ${key} is not defined`)
  return process.env[key] as string
}

const config = {
  APP_ENV: pick('APP_ENV'),
  APP_PORT: Number(pick('APP_PORT')),
  APP_HOST: pick('APP_HOST'),
  DATABASE_NAME: pick('DATABASE_NAME'),
  DATABASE_USER: pick('DATABASE_USER'),
  DATABASE_PASS: pick('DATABASE_PASS'),
  DATABASE_PORT: pick('DATABASE_PORT'),
  DATABASE_URL: pick('DATABASE_URL'),
  TOKEN_SECRET: pick('TOKEN_SECRET'),
  TOKEN_EXPIRES_IN: pick('TOKEN_EXPIRES_IN'),
  AWS_ACCESS_KEY_ID: pick('AWS_ACCESS_KEY_ID'),
  AWS_SECRET_ACCESS_KEY: pick('AWS_SECRET_ACCESS_KEY'),
  AWS_S3_ENDPOINT: pick('AWS_S3_ENDPOINT'),
}

export default config
