import { app } from '@/app'
import { APP_PORT, APP_HOST } from '@/settings/app'

app.listen({ port: APP_PORT, host: APP_HOST }).catch((err) => {
  app.log.error(err)
  process.exit(1)
})
