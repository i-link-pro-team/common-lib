import { Catch, ArgumentsHost, Logger } from '@nestjs/common'
import { GqlExceptionFilter } from '@nestjs/graphql'
import { v4 as uuid } from 'uuid'

/**
 * ```
 * // main.ts
 * async function bootstrap(): Promise<void> {
 *   const app = await NestFactory.create(AppModule)
 *
 *   const configService = app.get(ConfigService)
 *
 *   app.useGlobalFilters(new CommonExceptionFilter())
 *
 *   await app.listen(port, hostname, () =>
 *       logger.log(`Server running at ${hostname}:${port}`),
 *   )
 * }
 * ```
 */
@Catch()
export class ErrorConverterExceptionFilter implements GqlExceptionFilter {
    private readonly _logger = new Logger()

    catch(exception: Error, _host: ArgumentsHost): void {
        const errorId = this._generateErrorId()
        this._logger.error(
            `Error ID: ${errorId} ${exception.message}`,
            exception.stack,
        )

        exception.message = `${errorId}::${exception.message}`
        throw exception
    }

    private _generateErrorId(): string {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return uuid().split(`-`).slice(2).join('')
    }
}
