declare global {
    interface Array<T> {
        mapOr<U>(fn: (item: T, index: number) => U, fallback: U): U[]
    }
}

Array.prototype.mapOr = function<T, U>(
    this: T[],
    fn: (item: T, index: number) => U,
    fallback: U,
): U[] {
    if (!this.length) return [fallback]
    return this.map(fn)
}