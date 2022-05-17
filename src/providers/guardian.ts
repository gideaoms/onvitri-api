import { isLeft, left, right } from 'fp-either';
import { TokenProvider } from '@/types/providers/token';
import { UserRepository } from '@/types/repositories/user';
import { CryptoProvider } from '@/types/providers/crypto';
import { User } from '@/types/user';
import UserModel from '@/models/user';
import UnauthorizedError from '@/errors/unauthorized';

function GuardianProvider(
  tokenProvider: TokenProvider,
  userRepository: UserRepository,
  cryptoProvider: CryptoProvider,
) {
  const userModel = UserModel(cryptoProvider);

  async function passThrough(role: User.Role, token?: string) {
    if (!token) return left(new UnauthorizedError('Unauthorized'));
    const [, rawToken] = token.split(' ');
    if (!rawToken) return left(new UnauthorizedError('Unauthorized'));
    const sub = tokenProvider.verify(rawToken);
    if (isLeft(sub)) return left(new UnauthorizedError('Unauthorized'));
    const user = await userRepository.findOneById(sub.right);
    if (isLeft(user)) return left(new UnauthorizedError('Unauthorized'));
    if (!userModel.isActive(user.right))
      return left(new UnauthorizedError('O seu perfil não está ativo na plataforma'));
    if (!userModel.hasRole(user.right, role)) return left(new UnauthorizedError('Unauthorized'));
    return right({ ...user.right, token: rawToken });
  }

  return {
    passThrough,
  };
}

export default GuardianProvider;
