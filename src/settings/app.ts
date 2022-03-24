const APP_PORT = Number(process.env.APP_PORT)
const APP_HOST = String(process.env.APP_HOST)
const APP_ENV = process.env.APP_ENV as 'development' | 'production' | 'test'

export { APP_PORT, APP_HOST, APP_ENV }
