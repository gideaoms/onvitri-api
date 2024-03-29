import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from 'http-status';
import { BadRequestError } from '@/errors/bad-request';
import { NotFoundError } from '@/errors/not-found';
import { UnauthorizedError } from '@/errors/unauthorized';

export type ListOf<T> = {
  data: T[];
  hasMore: boolean;
};

export function findHttpStatusByError(error: Error) {
  if (error instanceof NotFoundError) return NOT_FOUND;
  if (error instanceof UnauthorizedError) return UNAUTHORIZED;
  if (error instanceof BadRequestError) return BAD_REQUEST;
  throw error;
}

export function isNil(value: unknown) {
  return value === undefined || value === null;
}
