import type { Pool } from "@m2k-5f/pgtx";
import { Querier } from "@persistense/queries/common/abstract.querier";
import type { QuestionR } from "@persistense/shemas/content/shema";

export class QuestionQuerier extends Querier<QuestionR> {
    constructor(pool: Pool) {super(pool, "v_questions_r")}
}