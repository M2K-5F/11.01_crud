export interface UserRead {
    id: string
    username: string
    telegramLink: string
  roles: ("Student" | "Teacher" )[]
}


export interface CourseRead {
    id: string;
    title: string;
    description: string;
    status: 'active' | 'archived';
    createdBy: string;
    createdByName: string;
    topicsCount: number;
    studentsCount: number;
}


export interface TopicRead {
    id: string;
    number: number;
    title: string;
    description: string;
    status: 'active' | 'archived'
    courseID: string;
    createdBy: string;
    prerequisites: number[];
    questionsCount: number
}


export interface AnswerRead {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface QuestionRead {
    id: string;
    text: string;
    topicID: string;
    createdBy: string;
    answers: AnswerRead[];
}

export interface EnrollmentRead {
    id: string
    title: string
    userID: string
    courseID: string
    progress: number
    topicEnrollments: TopicEnrollmentRead[]
    topicsCount: number
}


export interface TopicEnrollmentRead {
    id: string
    topicID: string
    questionCount: number
    completedQuestions: number
    number: number
    isCompleted: boolean
}
