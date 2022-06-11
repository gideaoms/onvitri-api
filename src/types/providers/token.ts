import { Either } from 'fp-either';

export type TokenProvider = {
  generate(sub: string): string;
  verify(token: string): Either<Error, string>;
};
