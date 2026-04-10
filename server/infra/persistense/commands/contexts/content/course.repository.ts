
import type { ICourseRepository } from "@applications/interfaces/itransaction-manager";
import { Status } from "@domain/common/value-objects/active-status";
import { Course } from "@domain/contexts/content/aggregates/course";
import { CourseID } from "@domain/contexts/content/value-objects/course-id";
import { Description } from "@domain/contexts/content/value-objects/topic-description";
import { Title } from "@domain/contexts/content/value-objects/topic-title";
import { UserID } from "@domain/contexts/identity/value_objects/user-id";
import { AbstractRepository } from "@persistense/commands/common/abstract_repository";
import hydrate from "@persistense/commands/common/hydrator";
import type { CourseRow } from "@persistense/shemas/content/shema";

export class CourseRepository extends AbstractRepository<Course, CourseRow> implements ICourseRepository {
    override toRow(agg: Course): CourseRow {
        return {
            created_by: agg['_createdBy']['_value'],
            id: agg['_id']['_value'],
            title: agg['_title']['_value'],
            description: agg['_description']['_value'],
            status: agg['_status']['_value'],
        }
    }

    override fromRow(row: CourseRow): Course {
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