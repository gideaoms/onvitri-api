import { Types } from '@/types'

function User(cryptoProvider: Types.Providers.Crypto) {
  function isPasswordCorrect(plainPassword: string, hashedPassword: string) {
    return cryptoProvider.compare(plainPassword, hashedPassword)
  }

  function isActive(user: Types.Models.User) {
    return user.status === 'active'
  }

  function hasRole(user: Types.Models.User, role: Types.Models.User.Role) {
    return user.roles.includes(role)
  }

  return {
    isPasswordCorrect,
    isActive,
    hasRole,
  }
}

export { User }
