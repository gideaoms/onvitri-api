import { UserModel } from '@/types/models/user'
import { CryptoProvider } from '@/types/providers/crypto'

function UserModel(cryptoProvider: CryptoProvider) {
  function isPasswordCorrect(plainPassword: string, hashedPassword: string) {
    return cryptoProvider.compare(plainPassword, hashedPassword)
  }

  function isActive(user: UserModel) {
    return user.status === 'active'
  }

  function hasRole(user: UserModel, role: UserModel.Role) {
    return user.roles.includes(role)
  }

  return {
    isPasswordCorrect,
    isActive,
    hasRole,
  }
}

export default UserModel
