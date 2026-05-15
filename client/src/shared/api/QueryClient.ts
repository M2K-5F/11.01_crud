import { Future, Reject, Resolve } from "fluent-future"
import { ApiError } from "../errors"

export type QueryParams = RequestInit & {queries?: Record<string, number | string>}

export class ApiClient {
    private ROOT_PATH = 'http://localhost:8000'

    private _refreshPromise: Promise<void> | null = null

    private _errorHandlers: Map<number, (error: ApiError) => void> = new Map()

    onError(status: number, handler: (error: ApiError) => void) {
        this._errorHandlers.set(status, handler)
    }

    private get bearer(): string | null {
        return sessionStorage.getItem('access')
    }

    private set bearer(token: string) {
        sessionStorage.setItem('access', token)
    }

    public setBearer(token: string) {
        this.bearer = token
    }

    public removeBearer() {
        sessionStorage.removeItem('access')
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
                sessionStorage.setItem("access", data.access)
            } else {
                this.removeBearer()
                throw new Error("Session expired")
            }
        } catch {
            this.removeBearer()
            throw new Error("Refresh failed")
        }
    }

    get<T = void>(url: string, params?: Record<string, number | string>): Future<T, ApiError> {
        return this.query<T>(url, { queries: params })
    }

    post<T = void>(url: string, body?: Record<string, any>): Future<T, ApiError> {
        return this.query<T>(url, { body: JSON.stringify(body), method: "POST" })
    }

    query<T = void>(url: string, params: QueryParams): Future<T, ApiError> {
        const { queryUrl, init } = this._prepareParams(url, params)
        
        return this._fetchWithRefresh(queryUrl, init)
            .andThen (response => 
                Future.of(
                    response.json(),
                    () => new ApiError(response.status, 'PARSE_ERROR', 'Invalid JSON')
                )   
                    .andThen (data => response.ok
                        ?   Resolve(data)
                        :   Reject(new ApiError(response.status, data.code, data.message))
                    )
                    .tapErr (err => {
                        const handler = this._errorHandlers.get(response.status)
                        handler && handler(err)
                    })
            )
    }

    private _prepareParams(queryUrl: string, params: QueryParams) {
        const init = {...params}
        queryUrl = this.ROOT_PATH + queryUrl
        if (params?.queries) {
            queryUrl += "?" + new URLSearchParams(params.queries as any).toString()
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
        const result = Future.of(
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
        .tapErr ((err) => console.log(err))
        .mapErr (err => new ApiError(500, 'SERVER_ERROR', `Server unavailable: ${err.message}`))

        return result
    }
}

export const api = new ApiClient()