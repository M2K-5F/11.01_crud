import type { ICourseRepository } from "@applications/interfaces/itransaction-manager";
import { Status } from "@domain/common/value-objects/active-status";
import Course, { CourseDescription, CourseID, CourseTitle } from "@domain/contexts/content/course";
import { UserID } from "@domain/contexts/identity/user";
import { sql } from "@m2k-5f/pgtx";
import { AbstractRepository } from "@persistense/commands/common/abstract_repository";
import hydrate from "@persistense/commands/common/hydrator";
import type { Database } from "@persistense/shemas";

export class CourseRepository extends AbstractRepository<Course, Database['v_courses_w']> implements ICourseRepository {
    override table: any = sql.ident('v_courses_w')

    override toRow(agg: Course): Database['v_courses_w'] {
        return {
            created_by_id: agg['_createdBy']['_value'],
            id: agg['_id']['_value'],
            title: agg['_title']['_value'],
            description: agg['_description']['_value'],
            status: agg['_status']['_value'],
        }
    }

    override fromRow(row: Database['v_courses_w']): Course {
        return hydrate(Course, {
            _id: hydrate(CourseID, row.id),
            _title: hydrate(CourseTitle, row.title),
            _description: hydrate(CourseDescription, row.description),
            _status: hydrate(Status, row.status),
            _createdBy: hydrate(UserID, row.created_by_id),
        })
    }

    async checkCourseNameExists(userID: UserID, name: string): Promise<boolean> {
        const [res] = await this.tx.query<{col: number}>`
        select 1 as col from courses c
        inner join users u on c.created_by_id = u.id
        where c.title = ${name} and u.id = ${userID.id}
        limit 1;
        `
        return !!res
    }
}