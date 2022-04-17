export const APP_PORT = Number(process.env.APP_PORT)

export const APP_HOST = String(process.env.APP_HOST)

export const APP_ENV = process.env.APP_ENV as 'development' | 'production' | 'test'
