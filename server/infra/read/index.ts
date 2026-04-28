import type { Pool } from "@m2k-5f/pgtx";
import { CourseReader, QuestionReader, TopicReader } from "./contexts/content";
import { EnrollmentReader } from "./contexts/learning";
import { UserReader } from "./contexts/identity";

export class ReadService {
    constructor(
        public pool: Pool,
        readonly user = new UserReader(pool),
        readonly course = new CourseReader(pool),
        readonly topics = new TopicReader(pool),
        readonly question = new QuestionReader(pool),
        readonly enroll = new EnrollmentReader(pool),
    ) {}
}
