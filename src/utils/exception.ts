import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, UNPROCESSABLE_ENTITY } from 'http-status'
import BadRequestError from '@/errors/bad-request'
import NotFoundError from '@/errors/not-found'
import UnauthorizedError from '@/errors/unauthorized'

export function findHttpStatusByError(error: Error) {
  if (error instanceof NotFoundError) return NOT_FOUND
  if (error instanceof UnauthorizedError) return UNAUTHORIZED
  if (error instanceof BadRequestError) return BAD_REQUEST
  return UNPROCESSABLE_ENTITY
}
