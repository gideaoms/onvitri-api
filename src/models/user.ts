import { User } from '@/types/user';
import { CryptoProvider } from '@/types/providers/crypto';

export function UserModel(cryptoProvider: CryptoProvider) {
  function isPasswordCorrect(plainPassword: string, hashedPassword: string) {
    return cryptoProvider.compare(plainPassword, hashedPassword);
  }

  function isActive(user: User) {
    return user.status === 'active';
  }

  function hasRole(user: User, role: User.Role) {
    return user.roles.includes(role);
  }

  function isAwaiting(user: User) {
    return user.status === 'awaiting';
  }

  return {
    isPasswordCorrect: isPasswordCorrect,
    isActive: isActive,
    hasRole: hasRole,
    isAwaiting: isAwaiting,
  };
}
