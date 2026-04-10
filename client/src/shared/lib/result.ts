export type ResultType<T, E = Error> = 
    | { ok: true; value: T }
    | { ok: false; error: E }


export class Result<T, E = Error> {
    constructor(private readonly result: Promise<ResultType<T, E>>) {}

    async isOk(): Promise<boolean> {
        const res = await this.result
        return res.ok
    }

    async isErr(): Promise<boolean> {
        const res = await this.result
        return !res.ok
    }

    async unwrap(): Promise<T> {
        const res = await this.result
        if (!res.ok) throw res.error
        return res.value
    }

    async unwrapOr(defaultValue: T): Promise<T> {
        const res = await this.result
        return res.ok ? res.value : defaultValue
    }

    async unwrapOrElse(fn: (error: E) => T): Promise<T> {
        const res = await this.result
        return res.ok ? res.value : fn(res.error)
    }

    async expect(message: string): Promise<T> {
        const res = await this.result
        if (!res.ok) {
            throw new Error(`${message}: ${res.error}`)
        }
        return res.value
    }

    map<U>(fn: (value: T) => U) {
        const newPromise = this.result.then(res => 
            res.ok ? { ok: true, value: fn(res.value) } as const : res
        )
        return new Result(newPromise)
    }

    mapErr<U>(fn: (value: E) => U): Result<T, U> {
        const newPromise = this.result.then(res => 
            !res.ok ? { ok: false, error: fn(res.error) } as const : res
        )
        return new Result(newPromise)
    }

    andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
        const newPromise = this.result.then(async res => {
            if (!res.ok) return res
            const next = fn(res.value)
            return next.result
        })
        return new Result(newPromise)
    }

    orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F> {
        const newPromise = this.result.then(async res => {
            if (res.ok) return res
            const next = fn(res.error)
            return next.result
        })
        return new Result(newPromise)
    }

    async match<R>(patterns: {
        ok: (value: T) => R
        err: (error: E) => R
    }): Promise<R> {
        const res = await this.result
        if (res.ok) return patterns.ok(res.value)
        return patterns.err(res.error)
    }

    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
    ): Promise<TResult1 | TResult2> {
        return this.unwrap().then(onfulfilled, onrejected)
    }

    catch<TResult = never>(
        onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
    ): Promise<T | TResult> {
        return this.unwrap().catch(onrejected)
    }

    static fromPromise<T, E = Error>(
        promise: Promise<T>,
        errorTransformer?: (error: unknown) => E
    ) {
        const resultPromise = promise
            .then(value => ({ ok: true, value } as const))
            .catch(error => ({ 
                ok: false, 
                error: errorTransformer ? errorTransformer(error) : error as E
            } as const))
        
        return new Result(resultPromise)
    }
}

export const Ok = <T, E = Error>(value: T | Promise<T>): Result<T, E> => {
    const promise = Promise.resolve(value).then(v => ({ ok: true, value: v } as const))
    return new Result(promise)
}

export const Err = <E, T = never>(error: E | Promise<E>): Result<T, E> => {
    const promise = Promise.resolve(error).then(e => ({ ok: false, error: e } as const))
    return new Result(promise)
}
