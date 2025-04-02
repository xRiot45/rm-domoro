import EmptyImg from '@/assets/errors/empty.svg';

interface EmptyStateProps {
    description: string;
}

export default function EmptyState({ description }: EmptyStateProps) {
    return (
        <div className="mx-auto flex h-full w-full flex-col items-center justify-center">
            <img src={EmptyImg} alt="Empty" className="w-7h-72 mx-auto h-72" />
            <p className="text-md text-center font-black text-gray-500">{description}</p>
        </div>
    );
}
