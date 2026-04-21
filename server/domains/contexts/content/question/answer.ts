import { Entity } from "@domain/common/abstractions/abstract-entity"
import { ID } from "@domain/common/abstractions/abstract-identificator"
import { ValueObject } from "@domain/common/abstractions/abstract-value-object"
import { DomainError } from "@shared/error"


// #region Errors
export const ErrAnswerLength = new DomainError("ANSWER_TEXT_LENGTH")
// #endregion


// #region ID
export class AnswerID extends ID {}
// #endregion


// #region Text
export class AnswerText extends ValueObject<string> {
    static create(text: string) {
        if (text.length < 8 || text.length > 64) throw ErrAnswerLength

        return new this(text)
    }
}
// #endregion


// #region CorrectStatus
export class AnswerCorrectStatus extends ValueObject<boolean> {    
    static get correct() {return new this(true)}

    static get uncorrect() {return new this(false)}
}
// #endregion


// #region Answer
export class ChoiceAnswer extends Entity<AnswerID> {
    private constructor(
        id: AnswerID,
        private _text: AnswerText,
        private _isCorrect: AnswerCorrectStatus
    ) {super(id)}

    static create(text: AnswerText, status: AnswerCorrectStatus) {
        return new this(
            AnswerID.generate(),
            text, 
            status,
        )
    }

    get isCorrect() {return this._isCorrect}
}
// #endregion