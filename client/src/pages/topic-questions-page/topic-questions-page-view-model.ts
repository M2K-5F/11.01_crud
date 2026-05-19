import { useQuery } from '@tanstack/react-query';
import { contentApi } from '@/entities/content/api';
import { QueryKeys } from '@/shared/lib/query-keys';

type TopicQuestionsPageVMPropsType = {
    topicID: string
}

export const useTopicQuestionsPageVM = ({topicID}: TopicQuestionsPageVMPropsType) => {

    const { data: topic, error: topicError } = useQuery({
        queryKey: QueryKeys.topicByID(topicID),
        queryFn: () => contentApi.getTopicByID(topicID)
    })

    const { data: questions, error: questionsError } = useQuery({
        queryKey: QueryKeys.questionsByTopic(topicID),
        queryFn: () => contentApi.getQuestionsByTopic(topicID),
    })


    return {
        topic,
        questions,
        error: topicError || questionsError,
    }
}