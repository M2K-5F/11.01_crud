export interface UserRead {
    id: string
    username: string
    telegramLink: string
    roles: string[]
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
    prerequisites: string[]; 
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
    userID: string
    courseID: string
    progress: number
    topicEnrollments: {
        id: string,
        topicID: string
        questionCount: number
        completedQuestions: number
    }[]
}

