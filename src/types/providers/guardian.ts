import { Either } from 'fp-either';
import { User } from '@/types/user';

export type GuardianProvider = {
  passThrough(role: User.Role, token?: string): Promise<Either<Error, User>>;
};
