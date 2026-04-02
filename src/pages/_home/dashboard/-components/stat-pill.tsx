import { cn } from '@/lib/utils';

interface StatPillProps {
	label: string;
	value: string;
	tone: 'positive' | 'negative' | 'neutral';
}

export function StatPill({ label, value, tone }: StatPillProps) {
	return (
		<div
			className={cn('rounded-lg border p-4', {
				'border-green-200 bg-green-500/10': tone === 'positive',
				'border-red-200 bg-red-500/10': tone === 'negative',
				'border-border bg-muted/40': tone === 'neutral',
			})}
		>
			<p className="text-xs text-muted-foreground uppercase tracking-wider">
				{label}
			</p>
			<p className="text-xl font-semibold mt-1">{value}</p>
		</div>
	);
}
