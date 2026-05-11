export abstract class ValueObject<TValue extends any> {
    protected constructor(
        protected readonly _value: TValue
    ) {}

    equal(other: this) {
        const deepEqual = (a: any, b: any): boolean => {
            if (a === b) return true

            if (a instanceof Date && b instanceof Date) {
                return a.getTime() === b.getTime()
            }

            if (typeof a !== 'object' || !a || !b) return false

            const keys = Object.keys(a)

            return keys.every(k => deepEqual(a[k], b[k]))
        }

        return deepEqual(this._value, other._value)
    }
}