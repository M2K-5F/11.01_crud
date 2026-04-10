import { AbstractRepository } from "@persistense/commands/common/abstract_repository";
import type { ITopicRepository } from "@applications/interfaces/itransaction-manager";
import { UserID } from "@domain/contexts/identity/value_objects/user-id";
import { Status } from "@domain/common/value-objects/active-status";
import type { TopicRow } from "@persistense/shemas/content/shema";
import { Topic } from "@domain/contexts/content/aggregates/topic";
import hydrate from "@persistense/commands/common/hydrator";
import { TopicID } from "@domain/contexts/content/value-objects/topic-id";
import { Title } from "@domain/contexts/content/value-objects/topic-title";
import { Description } from "@domain/contexts/content/value-objects/topic-description";
import { CourseID } from "@domain/contexts/content/value-objects/course-id";

export class TopicRepository extends AbstractRepository<Topic, TopicRow> implements ITopicRepository {
    override toRow(agg: Topic): TopicRow {
        return {
            id: agg['_id']['_value'],
            title: agg['_title']['_value'],
            description: agg['_description']['_value'],
            status: agg['_status']['_value'],
            created_by: agg['_createdBy']['_value'],
            by_course: agg['_byCourse']['_value'],
        }
    }

    override fromRow(row: TopicRow): Topic {
        return hydrate(Topic, {
            _id: hydrate(TopicID, row.id),
            _title: hydrate(Title, row.title),
            _description: hydrate(Description, row.description),
            _byCourse: hydrate(CourseID, row.by_course),
            _createdBy: hydrate(UserID, row.created_by),
            _status: hydrate(Status, row.status)
        })
    }
}