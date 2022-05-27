import { User } from '@/types/user';
import { ICryptoProvider } from '@/types/providers/crypto';

function UserModel(cryptoProvider: ICryptoProvider) {
  function isPasswordCorrect(plainPassword: string, hashedPassword: string) {
    return cryptoProvider.compare(plainPassword, hashedPassword);
  }

  function isActive(user: User) {
    return user.status === 'active';
  }

  function hasRole(user: User, role: User.Role) {
    return user.roles.includes(role);
  }

  return {
    isPasswordCorrect,
    isActive,
    hasRole,
  };
}

export default UserModel;
