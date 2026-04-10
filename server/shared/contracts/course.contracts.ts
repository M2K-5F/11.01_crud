export type CourseResponse = { 
    id: string, 
    name: string, 
    description: string | null, 
    startTime: Date, 
    endTime: Date, 
    price: number
}