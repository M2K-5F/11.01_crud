import { AnswerID } from "../value-objects/answer-id";
import { Text } from "../value-objects/answer-text";
import { CorrectStatus } from "../value-objects/answer-correct-status";
import { Entity } from "@domain/common/abstractions/abstract-entity";


export class ChoiceAnswer extends Entity<AnswerID> {
    private constructor(
        id: AnswerID,
        private _text: Text,
        private _isCorrect: CorrectStatus
    ) {super(id)}

    static create(text: Text, status: CorrectStatus) {
        return new this(
            AnswerID.generate(),
            text, 
            status,
        )
    }

    get isCorrect() {return this._isCorrect}
}
