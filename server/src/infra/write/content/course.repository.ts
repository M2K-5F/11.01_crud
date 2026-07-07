import type { Course, CourseTitle } from "@domain/content/course"
import { AbstractRepository } from "../common/abstract_repository"
import type { ICourseRepository } from "@applications/interfaces/itransaction-manager"
import type { User } from "@domain/identity/user"
import type { ID } from "@domain/common/abstractions"

export class CourseRepository extends AbstractRepository<Course> implements ICourseRepository {
    protected override tablename: string = 'courses'

    async checkCourseExistsOnUser(userID: ID<User>, title: CourseTitle): Promise<boolean> {
        const [res] = await this.tx.query`
        select 1 from courses
        where data->'_title' = ${title} 
        and 
        data->'_createdBy' = ${userID}
        limit 1;
        `
        return !!res
    }
}