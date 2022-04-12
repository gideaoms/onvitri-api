import jsonwebtoken from 'jsonwebtoken'
import { left, right } from 'fp-either'
import { TOKEN_EXPIRES_IN, TOKEN_SECRET } from '@/settings/token'
import { Types } from '@/types'
import { Errors } from '@/errors'

function Token(): Types.Providers.Token {
  function generate(sub: string) {
    return jsonwebtoken.sign({ sub }, TOKEN_SECRET, {
      expiresIn: TOKEN_EXPIRES_IN,
    })
  }

  function verify(token: string) {
    try {
      const decoded = jsonwebtoken.verify(token, TOKEN_SECRET)
      return right(String(decoded.sub))
    } catch (err) {
      return left(new Errors.Unauthorized('Invalid token'))
    }
  }

  return {
    generate,
    verify,
  }
}

export { Token }
