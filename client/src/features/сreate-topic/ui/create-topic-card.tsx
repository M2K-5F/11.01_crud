import { Card } from '@/shared/ui/card';
import { Plus } from 'lucide-react';

type CreateTopicCardProps = {
    onClick: () => void;
};

export const CreateTopicCard = ({ onClick }: CreateTopicCardProps) => {
    return (
        <Card
            onClick={onClick}
            className="border-dashed border-primary/40 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all cursor-pointer group flex items-center justify-center min-h-50"
        >
            <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Plus className="h-8 w-8 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">Создать тему</span>
            </div>
        </Card>
    );
};