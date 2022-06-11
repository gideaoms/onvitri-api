import { Either } from 'fp-either';

export type FollowerRepository = {
  create(storeId: string, userId: string): Promise<void>;
  exists(storeId: string, userId: string): Promise<Either<Error, void>>;
  remove(storeId: string, userId: string): Promise<void>;
};
