import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import type { EnrollmentRead } from "@contracts";
import { BookOpen } from "lucide-react";
import type { FC } from "react";


type EnrollmentCardPropsType = {
    enrollment: EnrollmentRead
    onSelect: () => void
}


export const EnrollmentCard: FC<EnrollmentCardPropsType> = ({enrollment, onSelect}) => {
    const progress = enrollment.progress / enrollment.topicsCount * 100 || 0
    
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-secondary/20 rounded-lg">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-base">{enrollment.title}</CardTitle>
                        <CardDescription className="text-xs mt-1">Прогресс: {progress}%</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <Progress value={progress} className="h-2" />
            </CardContent>
            <CardFooter>
                <Button variant="outline" size="sm" onClick={onSelect} className="w-full">
                    Продолжить
                </Button>
            </CardFooter>
        </Card>
    );
};