import { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate"
import { ID } from "@domain/common/abstractions/abstract-identificator"
import { ValueObject } from "@domain/common/abstractions/abstract-value-object"
import { DomainError } from "@shared/error"
import type { TopicID } from "../topic"
import { AnswerCorrectStatus, type ChoiceAnswer } from "./answer"
import type { UserID } from "@domain/contexts/identity/user"


// #region Errors
export const ErrQuestionTextLength = new DomainError("QUESTION_TEXT_LENGTH")
export const ErrQuestionAnswersCount = new DomainError("QUESTION_ANSWERS_COUNT")
export const ErrQuestionNoCorrectAnswer = new DomainError("QUESTION_NO_CORRECT_ANSWER")
// #endregion


// #region ID
export class QuestionID extends ID {}
// #endregion


// #region Text
export class QuestionText extends ValueObject<string> {
    static create(text: string) {
        if (text.length < 8 || text.length > 128) throw ErrQuestionTextLength

        return new this(text)
    }
}
// #endregion


// #region Question
export default class Question extends AggregateRoot<QuestionID> {
    private constructor(
        id: QuestionID,
        private _text: QuestionText,
        private _byTopic: TopicID,
        private _createdBy: UserID,
        private _answers: ChoiceAnswer[]
    ) {super(id)}

    static create(text: QuestionText, createdBy: UserID, byTopic: TopicID, answers: ChoiceAnswer[]) {
        if (answers.length < 2) throw ErrQuestionAnswersCount

        if (!answers.some(a => 
            a.isCorrect.equal(AnswerCorrectStatus.correct)
        )) throw ErrQuestionNoCorrectAnswer

        return new this(
            QuestionID.generate(),
            text, byTopic, createdBy, answers
        )
    }
}
// #endregion