import { QuestionID } from "../value-objects/question-id";
import { Text } from "../value-objects/question-text";
import { TopicID } from "../value-objects/topic-id";
import { UserID } from "@domain/contexts/identity/value_objects/user-id";
import { ErrQuestionAnswersCount, ErrQuestionNoCorrectAnswer } from "../errors";
import { CorrectStatus } from "../value-objects/answer-correct-status";
import type { ChoiceAnswer } from "./answer";
import { AggregateRoot } from "@domain/common/abstractions/abstract-aggregate";

export class Question extends AggregateRoot<QuestionID> {
    private constructor(
        id: QuestionID,
        private _text: Text,
        private _byTopic: TopicID,
        private _createdBy: UserID,
        private _answers: ChoiceAnswer[]
    ) {super(id)}

    static create(text: Text, createdBy: UserID, byTopic: TopicID, answers: ChoiceAnswer[]) {
        if (answers.length < 2) throw ErrQuestionAnswersCount

        if (!answers.some(a => 
            a.isCorrect.equal(CorrectStatus.correct)
        )) throw ErrQuestionNoCorrectAnswer

        return new this(
            QuestionID.generate(),
            text, byTopic, createdBy, answers
        )
    }
}