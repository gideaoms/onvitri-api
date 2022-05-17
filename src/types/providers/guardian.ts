import { Either } from 'fp-either';
import { User } from '@/types/user';
import UnauthorizedError from '@/errors/unauthorized';

export type GuardianProvider = {
  passThrough(role: User.Role, token?: string): Promise<Either<UnauthorizedError, User>>;
};
