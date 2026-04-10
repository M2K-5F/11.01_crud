import type { TopicRow } from "@persistense/shemas/content/shema";
import type { Pool } from "@m2k-5f/pgtx";
import { Querier } from "@persistense/queries/common/abstract.querier";

export class TopicQuerier extends Querier<TopicRow> {
    constructor(pool: Pool) {super(pool, "topics")}
}