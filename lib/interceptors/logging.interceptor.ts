import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { LoggingInterceptorConfig } from '../interfaces/logging-interceptor-config.interface'
import { LoggingInterceptorResponsePayload } from '../interfaces/logging-interceptor-response-payload.interface'

const REQUEST_ARGUMENT_INDEX = 2

/**
 * ```
 * // .env
 * LOGGING_INTERCEPTOR_MODES=request,headers,handlers,response
 *
 * // main.ts
 * async function bootstrap(): Promise<void> {
 *   const app = await NestFactory.create(AppModule)
 *
 *   const configService = app.get(ConfigService)
 *
 *   const interceptorModes = configService.get<string>('LOGGING_INTERCEPTOR_MODES') || ''
 *
 *   app.useGlobalInterceptors(
 *       new LoggingInterceptor({ modes: interceptorModes.split(',')})
 *   )
 *
 *   await app.listen(port, hostname, () =>
 *       logger.log(`Server running at ${hostname}:${port}`),
 *   )
 * }
 * ```
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private _logger = new Logger()

    constructor(private readonly _config: LoggingInterceptorConfig) {
        if (_config.modes.includes('*')) {
            this._config.modes = ['headers', 'request', 'response', 'handlers']
        }
    }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const startTime = Date.now()

        const { modes } = this._config

        const { req } = context.getArgByIndex<{
            req: Request
        }>(REQUEST_ARGUMENT_INDEX)

        const logPayload: LoggingInterceptorResponsePayload = {
            requestId: `no 'x-request-id' provided`,
            timeToHandle: undefined,
        }

        if (modes.length === 0 || modes.shift() === '') {
            return next.handle()
        }

        return next.handle().pipe(
            tap((data) => {
                const timeToHandle = `${new Date(
                    Date.now() - startTime,
                ).getMilliseconds()} ms`

                logPayload.timeToHandle = timeToHandle

                if (modes.includes('handlers')) {
                    const handlerClass = context.getClass().name
                    const handlerMethod = context.getHandler().name

                    logPayload.handlerClass = handlerClass
                    logPayload.handlerMethod = handlerMethod
                }

                if (modes.includes('request')) {
                    logPayload.requestBody = req?.body
                }

                if (modes.includes('response')) {
                    logPayload.responseBody = data
                }

                if (modes.includes('headers')) {
                    logPayload.headers = req?.headers
                }

                this._logger.debug(logPayload)
            }),
        )
    }
}
