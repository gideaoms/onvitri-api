import { User } from '@/types/user';

export function UserModel() {
  function isActive(user: User) {
    return user.status === 'active';
  }

  function hasRole(user: User, role: User.Role) {
    return user.roles.includes(role);
  }

  function isAwaiting(user: User) {
    return user.status === 'awaiting';
  }

  function isValidationCodeValid(user: User, validationCode: string) {
    return user.validationCode === validationCode;
  }

  return {
    isActive: isActive,
    hasRole: hasRole,
    isAwaiting: isAwaiting,
    isValidationCodeValid: isValidationCodeValid,
  };
}
