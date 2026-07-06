import { Future, Reject, Resolve } from "fluent-future"
import { ApiError } from "../errors"


export type QueryParams = RequestInit & {queries?: Record<string, number | string>}

type RefreshResponse = {access: string}


const fetchFuture = (input: string | URL | RequestInfo, init?: RequestInit) => Future.of(
    fetch(input, init),
    () => new ApiError(503, "SERVER_UNAVAILABLE", "Server unavailable")
)


const parseJson = <T = any>(response: Response) => Future.of(
    response.json() as Promise<T>,
    () => new ApiError(response.status, 'PARSE_ERROR', 'Invalid JSON')
)



export class ApiClient {
    private ROOT_PATH;

    constructor (rootPath: string) {
        this.ROOT_PATH = rootPath
    } 


    private _refreshFuture: Future<RefreshResponse, ApiError> | null = null


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


    private _refreshToken(): Future<RefreshResponse, ApiError> {
        if (!this._refreshFuture) {
            this._refreshFuture = this._performRefresh()
                .finally(() => this._refreshFuture = null)
        }
        
        return this._refreshFuture
    }


    private  _performRefresh(): Future<RefreshResponse, ApiError> {
        return fetchFuture(this.ROOT_PATH + '/identity/refresh', {
            method: 'post',
            credentials: 'include',
        })
        .andThen(res => res.ok
            ?    parseJson(res)
                    .tap(data => sessionStorage.setItem("access", data.access))
            :   Reject(new ApiError(401, "REFRESH_FAILED", "refresh failed"))
                    .tapErr(this.removeBearer)
        
        )
    }


    query<T = void>(url: string, params: QueryParams): Future<T, ApiError> {
        const { queryUrl, init } = this._prepareParams(url, params)
        
        return this._fetchWithRefresh(queryUrl, init)
            .map(res => ({res}))
            .bind({
                data: res => parseJson(res.res)
            })
            .throwIf(
                ({res}) => !res.ok,
                ({res, data}) => new ApiError(res.status, data.code, data.message)
            )
            .tapErr(err => {
                const handler = this._errorHandlers.get(err.status)
                handler && handler(err)
            })
            .tapErr(console.log)
            .map(({data}) => data as T)
    }


    get<T = void>(url: string, params?: Record<string, number | string>): Future<T, ApiError> {
        return this.query<T>(url, { queries: params })
    }


    post<T = void>(url: string, body?: Record<string, any>): Future<T, ApiError> {
        return this.query<T>(url, { body: JSON.stringify(body), method: "POST" })
    }


    private _prepareParams(queryUrl: string, params: QueryParams) {
        const init = structuredClone(params)
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
            init.headers = {...init.headers, Authorization: `Bearer ${this.bearer}`}
        }
        
        return {queryUrl, init}
    }


    private _fetchWithRefresh(url: string, params: QueryParams) {
        return fetchFuture(url, params)
            .andThen(res => {
                if (res.status !== 401) return Resolve(res)

                return this._refreshToken()
                    .tap(() => {
                        if (this.bearer) {
                            params.headers = {
                                ...params.headers, 
                                Authorization: `Bearer ${this.bearer}`
                            }
                        }
                    })
                    .andThen(() => fetchFuture(url, params))
                
            })
    }
}

export const api = new ApiClient('http://localhost:8000')