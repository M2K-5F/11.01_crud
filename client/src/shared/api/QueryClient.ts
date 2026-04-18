import { ApiError } from "../errors"
import { Err, Ok, Result } from "../lib/result"

export type QueryParams = RequestInit & {queries?: Record<string, number | string>}

export class ApiClient {
    private ROOT_PATH = 'http://localhost:8000'

    private _refreshPromise: Promise<void> | null = null

    private _errorHandlers: Map<number, (error: ApiError) => void> = new Map()

    onError(status: number, handler: (error: ApiError) => void) {
        this._errorHandlers.set(status, handler)
    }

    private get bearer(): string | null {
        return localStorage.getItem('access')
    }

    private set bearer(token: string) {
        localStorage.setItem('access', token)
    }

    public setBearer(token: string) {
        this.bearer = token
    }

    public removeBearer() {
        localStorage.removeItem('access')
    }

    private async _refreshToken(): Promise<void> {
        if (this._refreshPromise) return this._refreshPromise
        
        this._refreshPromise = this._performRefresh()
    
        try {
            await this._refreshPromise
        } finally {
            this._refreshPromise = null
        }
    }


    private async _performRefresh() {
        try {
            const response = await fetch(this.ROOT_PATH + '/identity/refresh', {
                method: 'post',
                credentials: 'include',
            })
            
            if (response.ok) {
                const data = await response.json() as {access: string}
                localStorage.setItem("access", data.access)
            } else {
                this.removeBearer()
                throw new Error("Session expired")
            }
        } catch {
            this.removeBearer()
            throw new Error("Refresh failed")
        }
    }

    get<T>(url: string, params?: Record<string, number | string>): Result<T, ApiError> {
        return this.query<T>(url, { queries: params })
    }

    post<T>(url: string, body?: Record<string, any>): Result<T, ApiError> {
        return this.query<T>(url, { body: JSON.stringify(body), method: "POST" })
    }

    query<T>(url: string, params: QueryParams): Result<T, ApiError> {
        const { queryUrl, init } = this._prepareParams(url, params)
        
        return this._fetchWithRefresh(queryUrl, init)
            .andThen(response => 
                Result.fromPromise(
                    response.json(),
                    () => new ApiError(response.status, 'PARSE_ERROR', 'Invalid JSON')
                )
                    .andThen(data => {
                        if (response.ok) {
                            return Ok(data)
                        }

                        const error = new ApiError(response.status, data.code, data.message)
                        const handler = this._errorHandlers.get(response.status)

                        if (handler) handler(error)
                        
                        return Err(error)
                    })
            )
    }

    private _prepareParams(queryUrl: string, params: QueryParams) {
        const init = {...params}
        queryUrl = this.ROOT_PATH + queryUrl
        if (params?.queries) {
            queryUrl += new URLSearchParams(params.queries as any).toString()
        }

        init.credentials = 'include'

        init.headers = {
            ...init?.headers,
            accept: 'application/json',
            "Content-Type": 'application/json',
        }

        if (this.bearer) {
            init.headers! = {...init.headers, Authorization: `Bearer ${this.bearer}`}
        }
        
        return {queryUrl, init}
    }

    private _fetchWithRefresh(url: string, params: QueryParams) {
        const result = Result.fromPromise(
            fetch(url, params)
                .then(async (res) => {
                    if (res.status === 401) {
                        await this._refreshToken()

                        if (this.bearer) {
                            params.headers! = {
                                ...params.headers, 
                                Authorization: `Bearer ${this.bearer}`
                            }
                        }
                        
                        return fetch(url, params)
                    }

                    return res
                })
        )
        .mapErr(err => new ApiError(500, 'SERVER_ERROR', `Server unavailable: ${err.message}`))

        return result
    }
}

export const api = new ApiClient()