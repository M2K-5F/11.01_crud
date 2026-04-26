import type { Pool } from "@m2k-5f/pgtx";
import { Querier } from "@persistense/queries/common/abstract.querier";
import type { Database } from "@persistense/shemas";

export class CourseQuerier extends Querier<Database['v_courses_r']>  {
    constructor(pool: Pool) {super(pool, "v_courses_r")}
}