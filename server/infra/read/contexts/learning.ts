import type { Pool } from "@m2k-5f/pgtx";
import { AbstractReader } from "../common/abstract.reader";
import type { EnrollmentRead, EnrollmentTopicWithStatus } from "../views";
import type { EnrollmentID } from "@domain/contexts/learning/enrollment/aggregate";

export class EnrollmentReader extends AbstractReader<EnrollmentRead> {
    constructor(pool: Pool) { super(pool, "v_enrollments_r") }

    async getEnrollmentTopics(enrollmentID: EnrollmentID) {
        return this.pool.query<EnrollmentTopicWithStatus>`
            with completed_topics_count as (
                SELECT
                    count(*)
                from
                    topic_enrollments
                where
                    enrollment_id = ${enrollmentID.id}
                    and 
                    (
                        completed_questions = question_count
                        and question_count > 0
                    )
            ),
            topic_enrollments_with_answers as (
                select ta.topic_enrollment_id, count(*)  FROM topic_attempts ta group by ta.topic_enrollment_id
            )

            SELECT
                te.id,
                te.completed_questions, 
                te.question_count,
                t.title,
                t.description,
                t.id as topic_id,
                t.number,
                t.status,
                ((t.number <= cc.count + 1) and te.question_count > 0) as is_available,
                ((te.completed_questions = te.question_count) and te.question_count > 0) as is_completed,
                (tea.count > 0) is true as is_attempted
            from
                topic_enrollments te
            left join topics t on te.topic_id = t.id
            left join topic_enrollments_with_answers tea on tea.topic_enrollment_id = te.id 
            cross join completed_topics_count cc
            where
                te.enrollment_id = ${enrollmentID.id}`
    }
}