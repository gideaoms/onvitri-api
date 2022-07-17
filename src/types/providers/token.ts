import { Either } from '@/either';

export type TokenProvider = {
  generate(sub: string): string;
  verify(token: string): Either<Error, string>;
};
