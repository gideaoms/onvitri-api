import { Either } from '@/either';
import { User } from '@/types/user';

export type IGuardianProvider = {
  passThrough(role: User.Role, token?: string): Promise<Either<Error, User>>;
};
