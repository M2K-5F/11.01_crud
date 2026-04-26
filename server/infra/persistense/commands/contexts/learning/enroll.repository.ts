import type { ForMutateParam, IEnrollmentRepository, Mutable } from "@applications/interfaces/itransaction-manager";
import { CourseID } from "@domain/contexts/content/course";
import { TopicID } from "@domain/contexts/content/topic";
import { UserID } from "@domain/contexts/identity/user";
import { Enrollment, EnrollmentID, EnrollmentProgress } from "@domain/contexts/learning/enrollment/aggregate";
import { TopicEnrollment, TopicEnrollmentAttempt, TopicEnrollmentID, TopicEnrollmentProgress } from "@domain/contexts/learning/enrollment/topic-enrollment";
import { sql } from "@m2k-5f/pgtx";
import { AbstractRepository } from "@persistense/commands/common/abstract_repository";
import hydrate from "@persistense/commands/common/hydrator";
import type { Database } from "@persistense/shemas";
import type { CourseEnrollmentRow, TopicAttemptRow, TopicEnrollmentRow } from "@persistense/shemas/learning/shema";
import type { EnrollmentW } from "@persistense/shemas/learning/view";


export class EnrollRepository extends AbstractRepository<Enrollment, Database['v_enrollments_w']> implements IEnrollmentRepository {
    override table = sql.ident('v_enrollments_w')

    override toRow(agg: Enrollment): EnrollmentW {
        return {
            id: agg['_id']['_value'],
            completed_topics: agg['_progress']['_value'].completedTopics,
            topics_count: agg["_progress"]['_value'].topicsCount,
            course_id: agg['_courseID']['_value'],
            user_id: agg['_userID']['_value'],

            topics: agg['_topicEnrollments']
                .values()
                .map(te => {
                    return {
                        topic: {
                            id: te['_id']['_value'],
                            enrollment_id: agg['_id']['_value'],
                            topic_id: te['_topicID']['_value'],
                            completed_questions: te['_progress']['_value']['completedQuestions'],
                            question_count: te['_progress']['_value']['questionCount'],
                        },

                        attempts: te['_attempts']
                            .map(ta => ({
                                topic_enrollment_id: te['_id']['_value'],
                                attempted_at: ta['_value']['attemptedAt'],
                                completed_questions: ta['_value']['completedQuestions'],
                                question_count: ta['_value']['questionCount']
                            }))
                    }
                })
                .toArray()
        }
    }

    override fromRow(row: EnrollmentW): Enrollment {        
        return hydrate(Enrollment, {
            _id: hydrate(EnrollmentID, row.id),
            _progress: hydrate(EnrollmentProgress, {
                completedTopics: row.completed_topics,
                topicsCount: row.topics_count,
            }),
            _courseID: hydrate(CourseID, row.course_id),
            _userID: hydrate(UserID, row.user_id),

            _topicEnrollments: new Map(row.topics.map(({topic: t, attempts: ats}) => [
                t.topic_id,
                hydrate(TopicEnrollment, {
                    _id: hydrate(TopicEnrollmentID, t.id),
                    _topicID: hydrate(TopicID, t.topic_id),
                    _progress: hydrate(TopicEnrollmentProgress, {
                        completedQuestions: t.completed_questions,
                        questionCount: t.question_count,
                    }),

                    _attempts: ats.map(at => hydrate(TopicEnrollmentAttempt, {
                        attemptedAt: at.attempted_at,
                        completedQuestions: at.completed_questions,
                        questionCount: at.question_count
                    }))
                })
            ]))
        })
    }

    override async save(agg: Enrollment): Promise<void> {
        const { topics, ...enroll } = this.toRow(agg)
        
        await this.tx.query`
        delete from topic_enrollments
        where enrollment_id = ${enroll.id}`


        await this.tx.query`
        insert into course_enrollments 
        ${sql.insert<CourseEnrollmentRow>(enroll)}
        on conflict (id) do update set
        ${sql.excluded(Object.keys(enroll).filter(k => k!=='id'))}`

        if (topics.length) {
            await this.tx.query`
            insert into topic_enrollments 
            ${sql.insert<TopicEnrollmentRow>(...topics.map(t => t.topic))};`

            const attempts = topics.flatMap(t => t.attempts)

            if (attempts.length) {
                await this.tx.query`
                insert into topic_attempts 
                ${sql.insert<TopicAttemptRow>(...attempts)};`
            }
        } 
    }

    
    async isUserEnrolled(userID: UserID, courseID: CourseID): Promise<boolean> {
        const [res] = await this.tx.query<{res: 1}>`
        select 1 as res from course_enrollments
        where course_id = ${courseID.id} and
        user_id = ${userID.id}
        limit 1;
        `
        return !!res
    }


    async getByUserAndCourse(userID: UserID, courseID: CourseID, param: ForMutateParam): Promise<Mutable<Enrollment> | null>;
    async getByUserAndCourse(userID: UserID, courseID: CourseID): Promise<Enrollment | null>;
    async getByUserAndCourse(userID: UserID, courseID: CourseID, param?: ForMutateParam): Promise<any> {
        const [res] = await this.tx.query<EnrollmentW>`
        select * from ${this.table}
        where user_id = ${userID.id} and course_id = ${courseID.id} 
        limit 1 
        ${param 
            ? sql.fragment`for update`
            : sql.empty
        };`

        return res ? this.fromRow(res) : null
    }   
}