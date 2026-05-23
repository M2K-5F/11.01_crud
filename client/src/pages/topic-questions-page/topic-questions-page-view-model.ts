import { useQuery } from '@tanstack/react-query';
import { contentApi } from '@/entities/content/api';
import { QueryKeys } from '@/shared/lib/query-keys';
import { composeKeys } from '@/shared/lib/composed-key';
import { Bind } from 'fluent-future';

type TopicQuestionsPageVMPropsType = {
    topicID: string
}

export const useTopicQuestionsPageVM = ({topicID}: TopicQuestionsPageVMPropsType) => {

    const {data, error} = useQuery({
        queryKey: composeKeys(
            QueryKeys.topic(topicID),
            QueryKeys.topicQuestions(topicID)
        ),
        queryFn: () => Bind({
            topic: contentApi.getTopicByID(topicID),
            questions: contentApi.getQuestionsByTopic(topicID)
        })
    })


    return {
        data,
        error
    }
}