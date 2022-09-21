import { Either } from '@/either';

export type ITokenProvider = {
  generate(sub: string): string;
  verify(token: string): Either<Error, string>;
};
