import { Either } from 'fp-either';
import { User } from '@/types/user';
import NotFoundError from '@/errors/not-found';

export type IUserRepository = {
  findOneByEmail(email: string): Promise<Either<NotFoundError, User>>;
  findOneById(userId: string): Promise<Either<NotFoundError, User>>;
};
