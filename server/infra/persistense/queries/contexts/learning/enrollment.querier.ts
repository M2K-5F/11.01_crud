import type { Pool } from "@m2k-5f/pgtx";
import { Querier } from "@persistense/queries/common/abstract.querier";
import type { Database } from "@persistense/shemas";

export class EnrollmentQuerier extends Querier<Database['v_enrollments_r']> {
    constructor(pool: Pool) { super(pool, "v_enrollments_r") }
}