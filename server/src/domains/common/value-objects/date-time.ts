import { ValueObject } from "@domain/common/abstractions"
import { Serializable } from "nucleus-mold"


@Serializable()
export class DateTime extends ValueObject<string> {
    static now() {
        return new DateTime(new Date().toISOString())
    }

    static fromISO(isoString: string) {
        return new DateTime(isoString)
    }

    private toDate(): Date {
        return new Date(this._value)
    }


    public isBefore(other: DateTime): boolean {
        return this.toDate().getTime() < other.toDate().getTime()
    }

    public isAfter(other: DateTime): boolean {
        return this.toDate().getTime() > other.toDate().getTime()
    }

    public addSeconds(seconds: number): DateTime {
        const d = this.toDate()
        d.setSeconds(d.getSeconds() + seconds)
        return new DateTime(d.toISOString())
    }

    public addHours(hours: number): DateTime {
        const d = this.toDate()
        d.setHours(d.getHours() + hours)
        return new DateTime(d.toISOString())
    }


    public elapsed(): number {
        return Math.floor((Date.now() - this.toDate().getTime()) / 1000)
    }


    public since(other: DateTime): number {
        return this.toDate().getTime() - other.toDate().getTime()
    }


    public format(): string {
        return this._value
    }
}