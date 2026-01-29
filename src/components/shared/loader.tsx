import { LoaderCircle } from 'lucide-react';

interface LoaderProps {
	loadingRequest?: boolean;
	text?: string;
}

export function Loader({
	loadingRequest = false,
	text = 'Loading...',
}: LoaderProps) {
	return (
		<div
			className={`w-full h-screen flex items-center justify-center fixed top-0 left-0 z-999 ${loadingRequest && 'bg-black/70'}`}
		>
			<LoaderCircle
				className={`animate-spin size-6 ${loadingRequest ? 'text-gray-100' : 'text-muted-foreground'}`}
			/>
			<span
				className={`ml-2 text-sm ${loadingRequest ? 'text-gray-100' : 'text-muted-foreground'}`}
			>
				{text}
			</span>
		</div>
	);
}
