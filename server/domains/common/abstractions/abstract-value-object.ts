export abstract class ValueObject<TValue> {
    protected constructor(
        protected readonly _value: TValue
    ) {}

    equal(other: this) {
        return other._value === this._value
    }
}