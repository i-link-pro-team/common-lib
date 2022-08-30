import {
    HttpService,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common'
import FormData from 'form-data'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'

import { GraphqlMutation } from './interfaces/graphql-mutation.interface'
import { GraphqlQuery } from './interfaces/graphql-query.interface'
import { RequestConfig } from './interfaces/request-config.interface'
import { ResponsePayload } from './interfaces/response-payload.interface'

@Injectable()
export class GraphQLClientService {
    protected readonly _httpService: HttpService
    protected readonly _logger: Logger
    protected readonly _url: string

    constructor(url: string | undefined) {
        this._httpService = new HttpService()
        this._logger = new Logger(this.constructor.name)

        if (!url) {
            throw new Error(
                `The URL for ${this.constructor.name} was not found. Please, check your .env settings`,
            )
        }

        this._url = url
    }

    protected async _sendQuery<T>(
        query: GraphqlQuery | GraphqlMutation,
        config: RequestConfig = {},
    ): Promise<T> {
        const { name, log } = config

        try {
            const graphqlQuery = jsonToGraphQLQuery(query, { pretty: true })

            if (name) {
                this._logger.debug(`[${name}] Request was sent to ${this._url}`)
            }

            if (log === true) {
                this._logger.debug(`\n${graphqlQuery}`)
            }

            const { data: response } = await this._httpService
                .post<ResponsePayload<T>>(
                    this._url,
                    {
                        query: graphqlQuery,
                    },
                    config,
                )
                .toPromise()

            if (response?.errors?.length > 0) {
                const { message } = response.errors[0]
                throw new Error(message)
            }

            return response.data
        } catch (error) {
            this._logger.error(error, `Error came from ${this._url}`)
            throw new InternalServerErrorException(error)
        }
    }

    protected async _uploadFile<T>(
        formData: FormData,
        url: string,
        config: RequestConfig = {},
    ): Promise<T> {
        const { name, log } = config

        try {
            if (name) {
                this._logger.debug(`[${name}] Request was sent to ${this._url}`)
            }

            if (log === true) {
                this._logger.debug(formData)
            }

            const { data: response } = await this._httpService
                .post(url, formData, config)
                .toPromise()

            if (response?.errors?.length > 0) {
                const { message } = response.errors[0]
                throw new Error(message)
            }

            return response
        } catch (error) {
            this._logger.error(error, `Error came from ${this._url}`)
            throw new InternalServerErrorException(error)
        }
    }
}
