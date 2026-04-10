import type { UserRow } from "@persistense/shemas/identity/shema";
import type { Pool } from "@m2k-5f/pgtx";
import { Querier } from "@persistense/queries/common/abstract.querier";

export class UserQuerier extends Querier<UserRow> {
    constructor(pool: Pool) {super(pool, "users")}
}

