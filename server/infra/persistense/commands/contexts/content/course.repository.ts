
import type { ICourseRepository } from "@applications/interfaces/itransaction-manager";
import { Status } from "@domain/common/value-objects/active-status";
import { Course } from "@domain/contexts/content/aggregates/course";
import { CourseID } from "@domain/contexts/content/value-objects/course-id";
import { Description } from "@domain/contexts/content/value-objects/topic-description";
import { Title } from "@domain/contexts/content/value-objects/topic-title";
import { UserID } from "@domain/contexts/identity/value_objects/user-id";
import { sql } from "@m2k-5f/pgtx";
import { AbstractRepository } from "@persistense/commands/common/abstract_repository";
import hydrate from "@persistense/commands/common/hydrator";
import type { CourseW } from "@persistense/shemas/content/shema";

export class CourseRepository extends AbstractRepository<Course, CourseW> implements ICourseRepository {
    override table: any = sql.ident('v_courses_w')

    override toRow(agg: Course): CourseW {
        return {
            created_by: agg['_createdBy']['_value'],
            id: agg['_id']['_value'],
            title: agg['_title']['_value'],
            description: agg['_description']['_value'],
            status: agg['_status']['_value'],
        }
    }

    override fromRow(row: CourseW): Course {
        return hydrate(Course, {
            _id: hydrate(CourseID, row.id),
            _title: hydrate(Title, row.title),
            _description: hydrate(Description, row.description),
            _status: hydrate(Status, row.status),
            _createdBy: hydrate(UserID, row.created_by),
        })
    }

    async checkCourseNameExists(userID: UserID, name: string): Promise<boolean> {
        const [res] = await this.tx.query<{col: number}>`
        select 1 as col from courses c
        inner join users u on c.created_by = u.id
        where c.title = ${name} and u.id = ${userID.id}
        limit 1;
        `
        return !!res
    }
}