import type { ID } from "./abstract-identificator";

export abstract class AggregateRoot<Tid extends ID<any>> {
    protected constructor(
        protected readonly _id: Tid,
    ) {}

    get id() {
        return this._id
    }
}
