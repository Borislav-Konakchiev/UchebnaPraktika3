import type { ErrorType } from './error-type.model'
import { ResponseError } from './response-error'
export class UnauthorizedError extends ResponseError {
protected errorType: ErrorType = 'UNAUTHORIZED'
}