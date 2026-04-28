import { AbstractRepository } from "@index/infra/write/common/abstract_repository";
import type { ITopicRepository } from "@applications/interfaces/itransaction-manager";
import hydrate from "@index/infra/write/common/hydrator";
import { sql } from "@m2k-5f/pgtx";
import Topic, { TopicDescription, TopicID, TopicNumber, TopicTitle } from "@domain/contexts/content/topic";
import { CourseID } from "@domain/contexts/content/course";
import { UserID } from "@domain/contexts/identity/user";
import { Status } from "@domain/common/value-objects/active-status";
import type { TopicWrite } from "./shema";

export class TopicRepository extends AbstractRepository<Topic, TopicWrite> implements ITopicRepository {
    override table: any = sql.ident("v_topics_w")


    override toRow(agg: Topic): TopicWrite {        
        return {
            id: agg['_id']['_value'],
            title: agg['_title']['_value'],
            description: agg['_description']['_value'],
            status: agg['_status']['_value'],
            created_by_id: agg['_createdBy']['_value'],
            by_course_id: agg['_byCourse']['_value'],
            number: agg['_number']['_value']
        }
    }

    override fromRow(row: TopicWrite): Topic {
        return hydrate(Topic, {
            _id: hydrate(TopicID, row.id),
            _title: hydrate(TopicTitle, row.title),
            _description: hydrate(TopicDescription, row.description),
            _byCourse: hydrate(CourseID, row.by_course_id),
            _createdBy: hydrate(UserID, row.created_by_id),
            _status: hydrate(Status, row.status),
            _number: hydrate(TopicNumber, row.number)
        })
    }


    async countByCourse(courseID: CourseID): Promise<number> {
        const [res] = await this.tx.query<{count: number}>`
        select count(*) as count from topics 
        where by_course_id = ${courseID.id}`
        
        return res!.count
    }

    async getPrevious(topicID: TopicID): Promise<Topic | null> {
        const getTopicFrag = sql.fragment`
        select number from ${this.table} where id = ${topicID.id}`


        const [res] = await this.tx.query<TopicWrite>`
        select * from  ${this.table} 
        where number = (${getTopicFrag}) - 1;`
        
        return res ? this.fromRow(res) : null
    }
}