import type { ID } from "./abstract-identificator";

export abstract class Entity<Tid extends ID> {
    protected constructor(
        protected readonly _id: Tid
    ) {}

    get id(): Tid {
        return this._id
    }
}
