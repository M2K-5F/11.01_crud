import type { IQuestionRepository } from "@applications/interfaces/itransaction-manager";
import { AbstractRepository } from "@persistense/commands/common/abstract_repository";
import { sql } from "@m2k-5f/pgtx";
import hydrate from "@persistense/commands/common/hydrator";
import Question, { AnswerCorrectStatus, AnswerID, AnswerText, ChoiceAnswer, QuestionID, QuestionText } from "@domain/contexts/content/question";
import { TopicID } from "@domain/contexts/content/topic";
import { UserID } from "@domain/contexts/identity/user";
import type { Database } from "@persistense/shemas";

export class QuestionRepository extends AbstractRepository<Question, Database['v_questions_w']> implements IQuestionRepository {
    override table: any = sql.ident("v_questions_w")
    
    toRow(q: Question): Database['v_questions_w'] {
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

    fromRow(row: Database['v_questions_w']) {
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

    override async save(root: Question): Promise<void> {
        const {answers, ...question} = this.toRow(root)

        await this.tx.query`
        insert into questions ${sql.insert(question)} 
        on conflict (id) do update 
        set ${sql.excluded(["text", "by_topic_id", "created_by_id"])}`

        await this.tx.query`
        delete from answers where question_id = ${question.id}`

        if (answers.length) {
            await this.tx.query`
            insert into answers ${sql.insert(...answers)}`
        }
    }

    async listByTopic(topicID: TopicID): Promise<Array<Question>> {
        const res = await this.tx.query<Database['v_questions_w']>`
        select * from ${this.table}
        where by_topic_id = ${topicID.id};`

        return res.map(this.fromRow)
    }
}