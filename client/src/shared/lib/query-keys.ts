export const QueryKeys = {
    course: (courseID: string) => ['course', courseID],
    coursesMe: ['courses', 'me'],
    courseSearch: (query: string) => ['courses', 'search', query],

    courseTopics: (courseID: string) => ['topics', courseID],
    topic: (topicID: string) => ['topic', topicID],

    topicQuestions: (topicID: string) => ['questions', topicID],
    topicQuestionsToPass: (topicID: string) => ['questions', 'toPass', topicID],

    enrollment: (enrollmentID: string) => ['enrollment', enrollmentID],
    enrollmentsMe: ['enrollments', 'me'],
    enrollmentTopics: (enrollmentID: string) => ['topicEnrollments', enrollmentID],
    enrollmentByCourse: (courseID: string) => ['enrollment', 'byCourse', courseID],
}