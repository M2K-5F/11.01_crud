export const Routes = {
    homepage: "/",
    coursePage: (courseID: string) => `courses/${courseID}`,
    courseEditPage: (courseID: string) => `/courses/${courseID}/edit`,
    courseStaticticsPage: (courseID: string) => `/courses/${courseID}/stats`,
    topicEditPage: (topicID: string) => `/topics/${topicID}/edit`,
    topicPassingPage: (topicID: string) => `/topics/${topicID}/passing`,
    enrollmentPage: (enrollmentID: string) => `/enrollments/${enrollmentID}`,
    loginPage: '/identity/login',
    registerPage: '/identity/register'
} as const