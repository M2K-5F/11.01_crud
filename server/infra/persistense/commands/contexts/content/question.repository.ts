import { Question } from "@domain/contexts/content/aggregates/question";
import type { IQuestionRepository } from "@applications/interfaces/itransaction-manager";
import { Text as QuestionText } from "@domain/contexts/content/value-objects/question-text";
import { Text as AnswerText } from "@domain/contexts/content/value-objects/answer-text";
import { AbstractRepository } from "@persistense/commands/common/abstract_repository";
import { sql } from "@m2k-5f/pgtx";
import type { AnswerRow, QuestionRow, QuestionWithAnswersView } from "@persistense/shemas/content/shema";
import { CorrectStatus } from "@domain/contexts/content/value-objects/answer-correct-status";
import { AnswerID } from "@domain/contexts/content/value-objects/answer-id";
import { QuestionID } from "@domain/contexts/content/value-objects/question-id";
import { TopicID } from "@domain/contexts/content/value-objects/topic-id";
import { UserID } from "@domain/contexts/identity/value_objects/user-id";
import hydrate from "@persistense/commands/common/hydrator";

export class QuestionRepository extends AbstractRepository<Question, QuestionWithAnswersView> implements IQuestionRepository {
    toRow(q: Question): QuestionWithAnswersView {
        return {
            id: q['_id']['_value'],
            text: q['_text']['_value'],
            created_by: q['_createdBy']['_value'],
            by_topic: q['_byTopic']['_value'],

            answers: q['_answers'].map(a => ({
                text: a['_text']['_value'],
                id: a['_id']['_value'],
                is_correct: a['_isCorrect']['_value'],
                question_id: q['_id']['_value'],
            }))
        }
    }

    fromRow(row: QuestionWithAnswersView) {
        return hydrate(Question, {
            _id: hydrate(QuestionID, row.id),
            _text: hydrate(QuestionText, row.text),
            _byTopic: hydrate(TopicID, row.by_topic),
            _createdBy: hydrate(UserID, row.created_by),
            _answers: row.answers.map(ans => ({
                _id: hydrate(AnswerID, ans.id),
                _text: hydrate(AnswerText, ans.text),
                _isCorrect: hydrate(CorrectStatus, ans.is_correct),
            }))
        })
    }

    override async save(root: Question): Promise<void> {
        const {answers, ...question} = this.toRow(root)

        await this.tx.query`
        insert into questions ${sql.insert(question)} 
        on conflict (id) do update set ${sql.excluded(["text", "by_topic", "created_by"])}`

        if (answers.length) {
            await this.tx.query`
            insert into answers ${sql.insert(...answers)} 
            on conflict (id) do update set ${sql.excluded(['text', 'is_correct', 'question_id'])}`

            await this.tx.query`
            delete from answers where question_id = ${question.id} and id not in (${sql.array(answers.map(a=>a.id))})`
        } 
        else {
            await this.tx.query`
            delete from answers where question_id = ${question.id}`
        }
    }

    override async lock(id: QuestionID, ...others: QuestionID[]): Promise<void> {
        await this.tx.query`select 1 as res from questions where id in (${sql.array([id, ...others].map(i => i.id).sort())}) for update`
    }
}