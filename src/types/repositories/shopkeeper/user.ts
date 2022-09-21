import { Either } from '@/either';
import { User } from '@/types/user';

export type IUserRepository = {
  findOneByEmail(email: string): Promise<Either<Error, User>>;
  findOneById(userId: string): Promise<Either<Error, User>>;
  update(user: User): Promise<User>;
};
