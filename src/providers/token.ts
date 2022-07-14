import jsonwebtoken from 'jsonwebtoken';
import { failure, success } from '@/either';
import { TokenProvider } from '@/types/providers/token';
import { UnauthorizedError } from '@/errors/unauthorized';
import { config } from '@/config';

export function TokenProvider(): TokenProvider {
  function generate(sub: string) {
    return jsonwebtoken.sign({ sub }, config.TOKEN_SECRET, {
      expiresIn: config.TOKEN_EXPIRES_IN,
    });
  }

  function verify(token: string) {
    try {
      const decoded = jsonwebtoken.verify(token, config.TOKEN_SECRET);
      return success(String(decoded.sub));
    } catch (err) {
      return failure(new UnauthorizedError('Invalid token'));
    }
  }

  return {
    generate: generate,
    verify: verify,
  };
}
