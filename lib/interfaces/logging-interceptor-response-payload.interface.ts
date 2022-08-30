/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingHttpHeaders } from 'http2'

export interface LoggingInterceptorResponsePayload {
    requestId: string
    timeToHandle: string
    handlerClass?: string
    handlerMethod?: string
    headers?: IncomingHttpHeaders
    requestBody?: any
    responseBody?: any
}
