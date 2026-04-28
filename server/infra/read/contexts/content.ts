import type { Pool } from "@m2k-5f/pgtx"
import type { CourseRead, QuestionRead, TopicRead } from "../views"
import { AbstractReader } from "../common/abstract.reader"

export class CourseReader extends AbstractReader<CourseRead>  {
    constructor(pool: Pool) {super(pool, "v_courses_r")}
}

export class TopicReader extends AbstractReader<TopicRead> {
    constructor(pool: Pool) {super(pool, "v_topics_r")}
}

export class QuestionReader extends AbstractReader<QuestionRead> {
    constructor(pool: Pool) {super(pool, "v_questions_r")}
}