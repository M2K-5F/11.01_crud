import { DomainError } from "../../../shared/error";

export const 
ErrCourseTitleLength = new DomainError("COURSE_TITLE_LENGTH", "Название курса должно быть от 8 до 64 символов в длину"),
ErrCourseDescriptionLength = new DomainError("COURSE_DESCRIPTION_LENGTH", "Описание курса должно быть от 8 до 128 символов в длину"),
ErrCourseTitleExist = new DomainError("COURSE_TITLE_EXISTS"),
ErrCourseArchived = new DomainError("COURSE_ARCHIVED"),
ErrCourseActive = new DomainError("COURSE_ACTIVE"),
ErrCourseNotCreatedBy = new DomainError("COURSE_NOT_CREATED_BY"),

ErrTopicTitleLength = new DomainError("TOPIC_TITLE_LENGTH"),
ErrTopicDescriptionLength = new DomainError("TOPIC_DESCRIPTION_LENGTH"),
ErrTopicNotCreatedBy = new DomainError("TOPIC_NOT_CREATED_BY"),
ErrTopicArchived = new DomainError("TOPIC_ARCHIVED"),
ErrTopicActive = new DomainError("TOPIC_ACTIVE"),

ErrQuestionTextLength = new DomainError("QUESTION_TEXT_LENGTH"),
ErrQuestionAnswersCount = new DomainError("QUESTION_ANSWERS_COUNT"),
ErrQuestionNoCorrectAnswer = new DomainError("QUESTION_NO_CORRECT_ANSWER"),

ErrAnswerLength = new DomainError("ANSWER_TEXT_LENGTH")