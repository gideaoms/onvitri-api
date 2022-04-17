import jsonwebtoken from 'jsonwebtoken'
import { left, right } from 'fp-either'
import { TokenProvider } from '@/types/providers/token'
import UnauthorizedError from '@/errors/unauthorized'
import { TOKEN_EXPIRES_IN, TOKEN_SECRET } from '@/settings/token'

function TokenProvider(): TokenProvider {
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
      return left(new UnauthorizedError('Invalid token'))
    }
  }

  return {
    generate,
    verify,
  }
}

export default TokenProvider
