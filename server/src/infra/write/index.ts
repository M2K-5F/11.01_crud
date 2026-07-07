import type { ICourseRepository, IEnrollmentRepository, IQuestionRepository, ITopicRepository, ITransactionManager, ITransactionWorkUnit, IUserRepository } from "@applications/interfaces/itransaction-manager";
import type { Pool } from "@m2k-5f/pgtx";
import { UserRepository } from "./identity/user.repository";
import { CourseRepository } from "./content/course.repository";
import { TopicRepository } from "./content/topic.repository";
import { QuestionRepository } from "./content/question.repository";
import { EnrollRepository } from "./learning/enroll.repository";

export class TransactionManager implements ITransactionManager {
    constructor(
        private readonly db: Pool
    ) {}

    async begin<T>(func: (ctx: ITransactionWorkUnit) => Promise<T>): Promise<T> {
        return await this.db.begin(async tx => {
            const uow = new TransactionWorkUnit(
                new UserRepository(tx),
                new CourseRepository(tx),
                new TopicRepository(tx),
                new QuestionRepository(tx),
                new EnrollRepository(tx)
            )
            
            return await func(uow) 
        })
    }
}

class TransactionWorkUnit implements ITransactionWorkUnit {
    constructor(
        readonly users: IUserRepository,
        readonly courses: ICourseRepository,    
        readonly topics: ITopicRepository,
        readonly questions: IQuestionRepository,
        readonly enrolls: IEnrollmentRepository
    ) {}
}