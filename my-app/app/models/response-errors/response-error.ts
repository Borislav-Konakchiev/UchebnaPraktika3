import type { ErrorType } from './error-type.model'
export class ResponseError<TData = unknown> extends Error {
protected errorType: ErrorType = 'GENERIC'
protected data: TData | undefined
constructor(data?: TData, message?: string) {
super(message)
this.data = data
}
public getErrorType() {
return this.errorType
}
public getData() {
return this.data
}
}
