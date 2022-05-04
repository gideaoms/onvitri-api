import app from '@/app'
import config from '@/config'

app.listen({ port: config.APP_PORT, host: config.APP_HOST }).catch((err) => {
  app.log.error(err)
  process.exit(1)
})
