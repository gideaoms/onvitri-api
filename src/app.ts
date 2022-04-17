import path from 'path'
import fastify from 'fastify'
import autoload from 'fastify-autoload'
import cors from 'fastify-cors'
import { APP_ENV } from '@/settings/app'

const app = fastify({
  logger: APP_ENV === 'development',
})

app.register(cors, {
  exposedHeaders: ['x-has-more'],
})
app.register(autoload, {
  dir: path.join(__dirname, 'routes'),
  options: { prefix: '/v1' },
})

export default app
