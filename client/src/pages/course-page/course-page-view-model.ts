// pages/course-page/view-model.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '@/entities/content/api';
import { learningApi } from '@/entities/learning/api';
import { QueryKeys } from '@/shared/lib/query-keys';
import type { ApiError } from '@/shared/errors';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type CoursePageVMProps = {
    courseID: string
}

export const useCoursePageVM = ({ courseID }: CoursePageVMProps) => {
    const navigate = useNavigate()
    const client = useQueryClient()

    const { data: course, error: courseError } = useQuery({
        queryKey: QueryKeys.createdCourse(courseID),
        queryFn: () => contentApi.getCourseByID(courseID),
    })

    const { data: isEnrolled, error: enrollmentError} = useQuery({
        queryKey: QueryKeys.enrollmentByCourse(courseID),
        queryFn: async () => learningApi.isEnrolled(courseID)
    })

    const { data: topics, error: topicsError } = useQuery({
        queryKey: QueryKeys.topicsByCourse(courseID),
        queryFn: () => contentApi.getCreatedTopicsByCourse(courseID),
    })

    const {mutate: onCourseEnroll, isPending} = useMutation({
        mutationFn: () => learningApi.enrollCourse(courseID),
        onError: (err: ApiError) => toast(err.message),
        onSuccess: enrollment => {
            client.invalidateQueries({queryKey: QueryKeys.enrollments})
            toast.success('Вы подписались на курс')
            navigate(`/enrollment/${enrollment.id}`)
        }
    })

    const error = courseError || topicsError || enrollmentError

    return {
        onCourseEnroll,
        isPending,
        course,
        topics,
        isEnrolled,
        error,
    }
}