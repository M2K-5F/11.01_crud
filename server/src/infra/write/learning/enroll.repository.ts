import type { IEnrollmentRepository } from "@applications/interfaces/itransaction-manager"
import type { Enrollment } from "@domain/learning/course-enrollment"
import { AbstractRepository, type Row } from "../common/abstract_repository"
import type { Course } from "@domain/content/course"
import type { Updatable } from "@shared/lib"
import { sql } from "@m2k-5f/pgtx"
import type { ID } from "@domain/common/abstractions"
import type { User } from "@domain/identity/user"

export class EnrollRepository extends AbstractRepository<Enrollment> implements IEnrollmentRepository {
    protected override tablename: string = 'enrollments'

    
    async isUserEnrolled(userID: ID<User>, courseID: ID<Course>): Promise<boolean> {
        const [res] = await this.tx.query`
        select 1 as res from ${sql.ident(this.tablename)}
        where data->'_courseID' = ${courseID} 
        and data->'_userID' = ${userID};`

        return !!res
    }


    async listByCourseForUpdate(courseID: ID<Course>): Promise<Array<Updatable<Enrollment>>> {
        const res = await this.tx.query<Row>`
        select  fdata::textrom ${sql.ident(this.tablename)}
        where data->'_courseID' = ${courseID}
        for update`

        return res.map(this.fromRow) as Array<Updatable<Enrollment>>
    }


    async getByUserAndCourseForUpdate(userID: ID<User>, courseID: ID<Course>): Promise<Updatable<Enrollment> | null> {
        const [res] = await this.tx.query<Row>`
        select data::text from ${sql.ident(this.tablename)}
        where 
            data->'_userID' = ${userID} 
            and 
            data->'_courseID' = ${courseID} 
        for update;`

        return res ? this.fromRow(res) as Updatable<Enrollment> : null
    }
    

    async getByUserAndCourse(userID: ID<User>, courseID: ID<Course>): Promise<Enrollment | null> {
        const [res] = await this.tx.query<Row>`
        select data::text from ${sql.ident(this.tablename)}
        where
            data->'_userID' = ${userID}
            and
            data->'_courseID' = ${courseID};`

        return res ? this.fromRow(res) : null
    }
}