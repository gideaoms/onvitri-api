import { Either } from 'fp-either';
import { User } from '@/types/user';

export type UserRepository = {
  findOneByEmail(email: string): Promise<Either<Error, User>>;
  findOneById(userId: string): Promise<Either<Error, User>>;
  update(user: User): Promise<User>;
};
