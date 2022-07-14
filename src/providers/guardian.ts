import { isFailure, failure, success } from '@/either';
import { TokenProvider } from '@/types/providers/token';
import { UserRepository } from '@/types/repositories/shopkeeper/user';
import { CryptoProvider } from '@/types/providers/crypto';
import { GuardianProvider } from '@/types/providers/guardian';
import { User } from '@/types/user';
import { UserModel } from '@/models/user';
import { UnauthorizedError } from '@/errors/unauthorized';

export function GuardianProvider(
  tokenProvider: TokenProvider,
  userRepository: UserRepository,
  cryptoProvider: CryptoProvider,
): GuardianProvider {
  const userModel = UserModel(cryptoProvider);

  async function passThrough(role: User.Role, token?: string) {
    if (!token) return failure(new UnauthorizedError('Unauthorized'));
    const [, rawToken] = token.split(' ');
    if (!rawToken) return failure(new UnauthorizedError('Unauthorized'));
    const sub = tokenProvider.verify(rawToken);
    if (isFailure(sub)) return failure(new UnauthorizedError('Unauthorized'));
    const user = await userRepository.findOneById(sub.success);
    if (isFailure(user)) return failure(new UnauthorizedError('Unauthorized'));
    if (!userModel.isActive(user.success))
      return failure(new UnauthorizedError('O seu perfil não está ativo na plataforma'));
    if (!userModel.hasRole(user.success, role)) return failure(new UnauthorizedError('Unauthorized'));
    return success({ ...user.success, token: rawToken });
  }

  return {
    passThrough: passThrough,
  };
}
