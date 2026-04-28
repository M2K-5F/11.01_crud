import type { IQuestionRepository, Mutable } from "@applications/interfaces/itransaction-manager";
import { AbstractRepository } from "@index/infra/write/common/abstract_repository";
import { sql } from "@m2k-5f/pgtx";
import hydrate from "@index/infra/write/common/hydrator";
import Question, { AnswerCorrectStatus, AnswerID, AnswerText, ChoiceAnswer, QuestionID, QuestionText } from "@domain/contexts/content/question";
import { TopicID } from "@domain/contexts/content/topic";
import { UserID } from "@domain/contexts/identity/user";
import type { AnswerRow, QuestionRow, QuestionWrite } from "@index/infra/write/contexts/content/shema";

export class QuestionRepository extends AbstractRepository<Question, QuestionWrite> implements IQuestionRepository {
    override table: any = sql.ident("v_questions_w")
    
    toRow(q: Question): QuestionWrite {
        return {
            id: q['_id']['_value'],
            text: q['_text']['_value'],
            created_by_id: q['_createdBy']['_value'],
            by_topic_id: q['_byTopic']['_value'],

            answers: q['_answers'].values().map(a => ({
                text: a['_text']['_value'],
                id: a['_id']['_value'],
                is_correct: a['_isCorrect']['_value'],
                question_id: q['_id']['_value'],
            })).toArray()
        }
    }

    fromRow(row: QuestionWrite) {
        return hydrate(Question, {
            _id: hydrate(QuestionID, row.id),
            _text: hydrate(QuestionText, row.text),
            _byTopic: hydrate(TopicID, row.by_topic_id),
            _createdBy: hydrate(UserID, row.created_by_id),
            _answers: new Map(row.answers.map(ans => [
                ans.id,
                hydrate(ChoiceAnswer , {
                    _id: hydrate(AnswerID, ans.id),
                    _text: hydrate(AnswerText, ans.text),
                    _isCorrect: hydrate(AnswerCorrectStatus, ans.is_correct),
                })
            ])) as Map<string, ChoiceAnswer>
        })
    }

    override async save(...aggs: Array<Mutable<Question>>): Promise<void> {
        const rows = aggs.map(this.toRow)
        const ids = rows.map(r => r.id)

        const answers: Array<AnswerRow> = rows.flatMap(r => r.answers)

        const questions: Array<QuestionRow> = rows.map(({answers, ...question}) => question)

        questions.length && await this.tx.query
        `insert into questions
        ${sql.insert<QuestionRow>(...questions)}
        on conflict (id) do update set 
        ${sql.excluded(Object.keys(questions[0]!))}` 

        
        await this.tx.query
        `delete from answers
        where question_id in (${sql.array(ids)})`

        answers.length && await this.tx.query
        `insert into answers
        ${sql.insert<AnswerRow>(...answers)}`
    }

    async listByTopic(topicID: TopicID): Promise<Array<Question>> {
        const res = await this.tx.query<QuestionWrite>`
        select * from ${this.table}
        where by_topic_id = ${topicID.id};`

        return res.map(this.fromRow)
    }
}