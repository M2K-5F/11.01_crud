import { ID, ValueObject } from "@domain/common/abstractions"
import { TopicNumber } from "@domain/content/topic"
import type { User } from "@domain/identity/user"
import { TopicEnrollmentAttempt } from "@domain/learning/topic-enrollment"
import { Json, Serializable } from "nucleus-mold"


@Serializable()
export class HashMap<K, V> extends ValueObject<Record<string, { key: K, value: V }>> {
    
    static new<K, V>(): HashMap<K, V> {
        return new HashMap({})
    }

    static fromEntries<K, V>(entries: Array<[K, V]>): HashMap<K, V> {
        const map = HashMap.new<K, V>()
        
        for (const [key, value] of entries) {
            map.set(key, value)
        }
        
        return map
    }

    public set(key: K, value: V): void {
        const hash = getHash(key)
        this._value[hash] = { key, value }
    }

    public get(key: K): V | undefined {
        const hash = getHash(key)
        return this._value[hash]?.value
    }

    public has(key: K): boolean {
        const hash = getHash(key)
        return hash in this._value
    }

    public entries(): Array<[K, V]> {
        return Object.values(this._value).map(item => [item.key, item.value])
    }

    public values(): V[] {
        return Object.values(this._value).map(item => item.value)
    }
}


function getHash(value: any) {
    if (typeof value !== 'object') return JSON.stringify(value)

    if (typeof value.toJSON === 'function') {
        return JSON.stringify(value.toJSON())
    }

    return JSON.stringify(value.toString())
}
