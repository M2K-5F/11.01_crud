import type { Pool } from "@m2k-5f/pgtx";
import { Querier } from "@persistense/queries/common/abstract.querier";
import type { Database } from "@persistense/shemas";

export class TopicQuerier extends Querier<Database['v_topics_r']> {
    constructor(pool: Pool) {super(pool, "v_topics_r")}
}