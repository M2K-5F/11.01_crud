import type { Pool } from "@m2k-5f/pgtx";
import { Querier } from "@persistense/queries/common/abstract.querier";
import type { CourseRow } from "@persistense/shemas/content/shema";

export class CourseQuerier extends Querier<CourseRow>  {
    constructor(pool: Pool) {super(pool, "courses")}
}