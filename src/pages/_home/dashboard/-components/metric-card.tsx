import { Decimal } from 'decimal.js';
import CountUp from '@/components/CountUp';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
	title: string;
	value: Decimal | number | string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	isPositive?: boolean;
}

export function MetricCard({
	title,
	value,
	description,
	icon: Icon,
	isPositive,
}: MetricCardProps) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardDescription>{title}</CardDescription>
				<Icon
					className={cn('size-4 text-muted-foreground', {
						'text-green-600 dark:text-green-400': isPositive === true,
						'text-red-600 dark:text-red-400': isPositive === false,
					})}
				/>
			</CardHeader>
			<CardContent>
				<p className="text-2xl font-bold">
					$
					<CountUp
						from={0}
						to={Number(new Decimal(value).toNumber().toFixed(2))}
						direction="up"
						duration={0.1}
						separator=","
						className="count-up-text"
					/>
				</p>
				<p className="text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}
