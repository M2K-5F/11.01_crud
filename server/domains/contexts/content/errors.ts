import { DomainError } from "../../../shared/error";


export const ErrCourseTitleExist = new DomainError("COURSE_TITLE_EXISTS")
export const ErrCourseNotCreatedBy = new DomainError("COURSE_NOT_CREATED_BY")
export const ErrTopicNotCreatedBy = new DomainError("TOPIC_NOT_CREATED_BY")