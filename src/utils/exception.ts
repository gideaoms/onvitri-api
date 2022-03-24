import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, UNPROCESSABLE_ENTITY } from 'http-status'
import { Errors } from '@/errors'

function Exception() {
  function findCodeByError(error: Error) {
    if (error instanceof Errors.NotFoundError) {
      return NOT_FOUND
    }
    if (error instanceof Errors.UnauthorizedError) {
      return UNAUTHORIZED
    }
    if (error instanceof Errors.BadRequestError) {
      return BAD_REQUEST
    }
    return UNPROCESSABLE_ENTITY
  }

  return {
    findCodeByError,
  }
}

export { Exception }
