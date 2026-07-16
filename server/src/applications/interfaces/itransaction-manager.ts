import type { Entity, ID } from "@domain/common/abstractions"
import type { Course, CourseTitle } from "@domain/content/course"
import type { Question } from "@domain/content/question"
import type { Topic } from "@domain/content/topic"
import type { Session } from "@domain/identity/session"
import type { User, UserUsername } from "@domain/identity/user"
import type { Enrollment } from "@domain/learning/course-enrollment"
import type { Updatable } from "@shared/lib"

export interface ITransactionWorkUnit {
    readonly users: IUserRepository
    readonly courses: ICourseRepository
    readonly topics: ITopicRepository
    readonly questions: IQuestionRepository
    readonly enrolls: IEnrollmentRepository
    readonly sessions: ISessionRepository
}

export interface ITransactionManager {
    begin<T>(func: (ctx: ITransactionWorkUnit) => Promise<T>): Promise<T>
}

export interface IRepository<Tentity extends Entity, TID = ID<Tentity>> {
    save(...root: Array<Updatable<Tentity>>): Promise<void>

    getByIDForUpdate(id: TID): Promise<Updatable<Tentity> | null>
    getByID(id: TID): Promise<Tentity | null>
}

export interface IUserRepository extends IRepository<User> {
    checkNameExists(name: UserUsername): Promise<boolean>
    getByName(name: UserUsername): Promise<User | null>
}

export interface ICourseRepository extends IRepository<Course> {
    checkCourseExistsOnUser(userID: ID<User>, title: CourseTitle): Promise<boolean>
}

export interface ITopicRepository extends IRepository<Topic> {
    countByCourse(courseID: ID<Course>): Promise<number>
    listByCourse(courseID: ID<Course>): Promise<Array<Topic>>
}

export interface IQuestionRepository extends IRepository<Question> {
    listByTopic(topicID: ID<Topic>): Promise<Array<Question>>
    countByTopic(topicID: ID<Topic>): Promise<number>
}

export interface IEnrollmentRepository extends IRepository<Enrollment> {
    isUserEnrolled(userID: ID<User>, courseID: ID<Course>): Promise<boolean>

    getByUserAndCourseForUpdate(userID: ID<User>, courseID: ID<Course>): Promise<Updatable<Enrollment> | null>
    getByUserAndCourse(userID: ID<User>, courseID: ID<Course>): Promise<Enrollment | null>

    listByCourseForUpdate(courseID: ID<Course>): Promise<Array<Updatable<Enrollment>>>
}

export interface ISessionRepository extends IRepository<Session> {}