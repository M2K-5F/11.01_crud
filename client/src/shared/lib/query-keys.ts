export const QueryKeys = {
    createdCourse: (courseID: string) => ['createdCourse', courseID],
    createdCourses: ['createdCourses'],
    createdTopics: (courseID: string) => ['createdTopics', courseID],
    enrollments: ['enrollments'],
    enrollment: (enrollmentID: string) => ['enrollment', enrollmentID],
    enrollmentTopics: (enrollmentID: string) => ['enrollmentTopics', enrollmentID],
    courseSearch: (query: string) => ['courseSearch', query],
    enrollmentByCourse: (courseID: string) => ['enrollment', courseID],
    topicsByCourse: (courseID: string) => ['topics', courseID],
    topicByID: (topicID: string) => ['topic', topicID],
    questionsByTopic: (topicID: string) => ['questions', topicID],
    topicStart: (topicID: string) => ['topicStart', topicID]
}