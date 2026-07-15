import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '@/entities/content/api';
import { learningApi } from '@/entities/learning/api';
import { QueryKeys } from '@/shared/lib/query-keys';
import type { ApiError } from '@/shared/errors';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Bind } from 'fluent-future';
import { composeKeys } from '@/shared/lib/composed-key';
import { useGuardedCurrentUser } from '@/entities/identity/providers/current-user-provider';

type CoursePageVMProps = {
    courseID: string
}


export const useCoursePageVM = ({ courseID }: CoursePageVMProps) => {
    const navigate = useNavigate()
    const client = useQueryClient()
    const {user} = useGuardedCurrentUser()


    const {data, error} = useQuery({
        queryKey: composeKeys(
            QueryKeys.enrollmentByCourse(courseID),
            QueryKeys.course(courseID),
            QueryKeys.courseTopics(courseID)
        ),
        queryFn: () => Bind({
            course: contentApi.getCourseByID(courseID),
            topics: contentApi.getTopicsByCourse(courseID),
            enrollment: learningApi.getUserEnrollmentByCourse(courseID, user.id)
        }),
    })


    const {mutate: onCourseEnroll, isPending} = useMutation({
        mutationFn: learningApi.enrollCourse,
        onError: (err: ApiError) => toast(err.message),
        onSuccess: enrollment => {
            client.invalidatePartial(
                QueryKeys.enrollmentsMe,
                QueryKeys.enrollmentByCourse(courseID)
            ),

            toast.success('Вы подписались на курс')
            navigate(`/enrollment/${enrollment.id}`)
        }
    })


    return {
        onCourseEnroll: () => onCourseEnroll(courseID),
        isPending,
        data,
        error,
    }
}