import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import type { EnrollmentRead } from "@contracts";
import { BookOpen } from "lucide-react";
import type { FC } from "react";

export const EnrollmentCard: FC<{enrollment: EnrollmentRead}> = ({enrollment}) => {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-secondary/20 rounded-lg">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-base">{enrollment.course_title}</CardTitle>
                        <CardDescription className="text-xs mt-1">Прогресс: {enrollment.progress || 0}%</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <Progress value={enrollment.progress || 0} className="h-2" />
            </CardContent>
            <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                    Продолжить
                </Button>
            </CardFooter>
        </Card>
    );
};