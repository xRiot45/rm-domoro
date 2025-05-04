import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@iconify/react';

interface CardSummaryStatisticsProps {
    data: number | string;
    title: string;
    subtitle?: string;
    description: string;
    icon: string;
}

const CardSummaryStatistics: React.FC<CardSummaryStatisticsProps> = ({ data, title, subtitle, description, icon }) => {
    return (
        <Card className="px-2 py-5 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon icon={icon} className="h-5 w-5 text-black dark:text-white" />
            </CardHeader>
            <CardContent>
                <h1 className="text-2xl font-bold">
                    {data} {subtitle}
                </h1>
                <p className="text-muted-foreground text-xs">{description}</p>
            </CardContent>
        </Card>
    );
};

export default CardSummaryStatistics;
