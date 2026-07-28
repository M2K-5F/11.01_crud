import { ValueObject } from "@domain/common/abstractions"
import { Serializable } from "nucleus-mold"


@Serializable()
export class HashMap<K, V> extends ValueObject<Record<string, V>> {
    
    static new<K, V>(): HashMap<K, V> {
        return new HashMap({})
    }

    static fromEntries<K, V>(entries: [K, V][]): HashMap<K, V> {
        const map = HashMap.new()

        entries.forEach(entry => {
            map.set(entry[0], entry[1])
        })

        return map as any
    }

    public set(key: K, value: V): void {
        const hash = getHash(key)
        this._value[hash] = value
    }

    public get(key: K): V | undefined {
        const hash = getHash(key)
        return this._value[hash]
    }

    public has(key: K): boolean {
        const hash = getHash(key)
        return hash in this._value
    }

    public values(): V[] {
        return Object.values(this._value)
    }

    public get size(): number {
        return Object.values(this._value).length
    }
}


function getHash(value: any) {
    if (typeof value !== 'object') return JSON.stringify(value)

    if (typeof value.toJSON === 'function') {
        return JSON.stringify(value.toJSON())
    }

    return JSON.stringify(value.toString())
}
