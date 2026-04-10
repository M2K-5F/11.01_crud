import type { Pool } from "@m2k-5f/pgtx";
import { Querier } from "@persistense/queries/common/abstract.querier";
import type { QuestionRow, QuestionWithAnswersView } from "@persistense/shemas/content/shema";

export class QuestionQuerier extends Querier<QuestionWithAnswersView, QuestionRow> {
    constructor(pool: Pool) {super(pool, "questions_with_answers")}
}