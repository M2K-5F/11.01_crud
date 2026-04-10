
import type { ID } from "@domain/common/abstractions/abstract-identificator"
import type { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate"
import type { Course } from "@domain/contexts/content/aggregates/course"
import type { Question } from "@domain/contexts/content/aggregates/question"
import type { Topic } from "@domain/contexts/content/aggregates/topic"
import type { CourseID } from "@domain/contexts/content/value-objects/course-id"
import type { QuestionID } from "@domain/contexts/content/value-objects/question-id"
import type { TopicID } from "@domain/contexts/content/value-objects/topic-id"
import type { User } from "@domain/contexts/identity/aggregates/user"
import type { UserID } from "@domain/contexts/identity/value_objects/user-id"

export interface ITransactionWorkUnit {
    readonly users: IUserRepository
    readonly courses: ICourseRepository
    readonly topics: ITopicRepository
    readonly questions: IQuestionRepository
}

export interface ITransactionManager {
    begin<T>(func: (ctx: ITransactionWorkUnit) => Promise<T>): Promise<T>
}

export interface IRepository<Tentity extends AggregateRoot<Tid>, Tid extends ID> {
    save(root: Tentity): Promise<void>
    getByID(id: Tid): Promise<Tentity | null>
    lock(id: Tid, ...others: Tid[]): Promise<void>
}

export interface IUserRepository extends IRepository<User, UserID> {
    checkNameExists(name: string): Promise<boolean>
    getByName(name: string): Promise<User | null>
}

export interface ICourseRepository extends IRepository<Course, CourseID> {
    checkCourseNameExists(userID: UserID, name: string): Promise<boolean>
}

export interface ITopicRepository extends IRepository<Topic, TopicID> {}

export interface IQuestionRepository extends IRepository<Question, QuestionID> {}