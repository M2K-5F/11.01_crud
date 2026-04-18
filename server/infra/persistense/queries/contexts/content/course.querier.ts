import type { Pool } from "@m2k-5f/pgtx";
import { Querier } from "@persistense/queries/common/abstract.querier";
import type { CourseR } from "@persistense/shemas/content/shema";

export class CourseQuerier extends Querier<CourseR>  {
    constructor(pool: Pool) {super(pool, "v_courses_r")}
}