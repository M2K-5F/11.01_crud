import { Entity, ID, ValueObject } from "@domain/common/abstractions"
import { DomainError } from "@shared/error"
import type { Topic } from "./topic"
import type { User } from "@domain/identity/user"
import type { Updatable } from "@shared/lib"
import { Serializable } from "nucleus-mold"
import { HashMap } from "@domain/common/value-objects/hash-map"


export const ErrAnswerLength = new DomainError("ANSWER_TEXT_LENGTH", "ANSWER_TEXT_LENGTH")
export const ErrQuestionTextLength = new DomainError("QUESTION_TEXT_LENGTH", "QUESTION_TEXT_LENGTH")
export const ErrQuestionAnswersCount = new DomainError("QUESTION_ANSWERS_COUNT", "QUESTION_ANSWERS_COUNT")
export const ErrQuestionNoCorrectAnswer = new DomainError("QUESTION_NO_CORRECT_ANSWER", "QUESTION_NO_CORRECT_ANSWER")


@Serializable()
export class AnswerText extends ValueObject<string> {
    static from(text: string) {
        if (text.length < 8 || text.length > 64) throw ErrAnswerLength

        return new AnswerText(text)
    }
}


@Serializable()
export class CorrectStatus extends ValueObject<boolean> {
    static get Correct() { return new CorrectStatus(true) }

    static get Wrong() { return new CorrectStatus(false) }

    isCorrect() { return this._value === true }
    isWrong() { return !this.isCorrect()}
}


@Serializable()
export class Answer extends Entity {
    private constructor(
        private _text: AnswerText,
        private _correctness: CorrectStatus
    ) {super()}

    static create(text: AnswerText, status: CorrectStatus) {
        return new Answer(text, status) as Updatable<Answer>
    }

    get correctness() { return this._correctness }
}


@Serializable()
export class QuestionText extends ValueObject<string> {
    static from(text: string) {
        if (text.length < 8 || text.length > 128) throw ErrQuestionTextLength

        return new QuestionText(text)
    }
}


@Serializable()
export class Question extends Entity {
    private constructor(
        private _text: QuestionText,
        private _byTopic: ID<Topic>,
        private _createdBy: ID<User>,
        private _answers: HashMap<ID<Answer>, Answer>
    ) { super()}


    static create(text: QuestionText, createdBy: ID<User>, byTopic: ID<Topic>, answers: Answer[]) {
        if (answers.length < 2) throw ErrQuestionAnswersCount

        if (!answers.some(a =>
            a.correctness.isCorrect()
        )) throw ErrQuestionNoCorrectAnswer

        return new Question(
            text,
            byTopic,
            createdBy,

            HashMap.fromEntries(answers.map(a => [a.id, a]))
        ) as Updatable<Question>
    }


    checkAnswers(selectedAnswerIDs: ID<Answer>[]) {
        const correctAnswers = this._answers.values()
            .filter(answer => answer.correctness.isCorrect())

        if (selectedAnswerIDs.length !== correctAnswers.length) return false

        return correctAnswers.every(correctAnswer =>
            selectedAnswerIDs.some(selected => correctAnswer.id.equals(selected))
        )
    }
}
