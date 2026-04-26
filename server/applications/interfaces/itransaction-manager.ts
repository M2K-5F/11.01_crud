
import type { ID } from "@domain/common/abstractions/abstract-identificator"
import type { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate"
import type { UserID } from "@domain/contexts/identity/user"
import type User from "@domain/contexts/identity/user"
import type { CourseID } from "@domain/contexts/content/course"
import type Course from "@domain/contexts/content/course"
import type Topic from "@domain/contexts/content/topic"
import type { TopicID } from "@domain/contexts/content/topic"
import type Question from "@domain/contexts/content/question"
import type { QuestionID } from "@domain/contexts/content/question"
import type { Enrollment } from "@domain/contexts/learning/enrollment/aggregate"
import type { FreshableType } from "typescript"

export interface ITransactionWorkUnit {
    readonly users: IUserRepository
    readonly courses: ICourseRepository
    readonly topics: ITopicRepository
    readonly questions: IQuestionRepository
    readonly enrolls: IEnrollmentRepository
}


class ExecuteParam {}
export class ForMutateParam extends ExecuteParam {}

export const ForMutate = new ForMutateParam()

export type Mutable<T> = T & { __brand: "Mutable" }


export interface ITransactionManager {
    begin<T>(func: (ctx: ITransactionWorkUnit) => Promise<T>): Promise<T>
}

export interface IRepository<Tentity extends AggregateRoot<TID>, TID extends ID = Tentity extends AggregateRoot<infer U> ? U : never> {
    save(root: Mutable<Tentity>): Promise<void>

    getByID(id: TID, param: ForMutateParam): Promise<Mutable<Tentity> | null>
    getByID(id: TID): Promise<Tentity | null>
}

export interface IUserRepository extends IRepository<User> {
    checkNameExists(name: string): Promise<boolean>
    getByName(name: string, param: ForMutateParam): Promise<Mutable<User> | null>
    getByName(name: string): Promise<User | null>
}

export interface ICourseRepository extends IRepository<Course> {
    checkCourseNameExists(userID: UserID, name: string): Promise<boolean>
}

export interface ITopicRepository extends IRepository<Topic> {
    countByCourse(courseID: CourseID): Promise<number>
    getPrevious(topicID: TopicID): Promise<Topic | null>
}

export interface IQuestionRepository extends IRepository<Question> {
    listByTopic(topicID: TopicID): Promise<Array<Question>>
}

export interface IEnrollmentRepository extends IRepository<Enrollment> {
    isUserEnrolled(userID: UserID, courseID: CourseID): Promise<boolean>
    
    getByUserAndCourse(userID: UserID, courseID: CourseID, param: ForMutateParam): Promise<Mutable<Enrollment> | null>
    getByUserAndCourse(userID: UserID, courseID: CourseID): Promise<Enrollment | null>
}