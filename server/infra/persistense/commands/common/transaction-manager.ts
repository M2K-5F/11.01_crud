import type { Pool } from "@m2k-5f/pgtx";
import type { ICourseRepository, IQuestionRepository, ITopicRepository, ITransactionManager, ITransactionWorkUnit, IUserRepository } from "../../../../applications/interfaces/itransaction-manager";
import { UserRepository } from "../contexts/identity/user.repository";
import { CourseRepository } from "../contexts/content/course.repository";
import { TopicRepository } from "../contexts/content/topic.repository";
import { QuestionRepository } from "../contexts/content/question.repository";

export class TransactionManager implements ITransactionManager {
    constructor(
        private readonly db: Pool
    ) {}

    async begin<T>(func: (ctx: ITransactionWorkUnit) => Promise<T>): Promise<T> {
        return await this.db.begin(async tx => {
            const uow = new TransactionWorkUnit(
                new UserRepository(tx, "users"),
                new CourseRepository(tx, "courses"),
                new TopicRepository(tx, "topics"),
                new QuestionRepository(tx, "questions_with_answers")
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
        readonly questions: IQuestionRepository
    ) {}
}