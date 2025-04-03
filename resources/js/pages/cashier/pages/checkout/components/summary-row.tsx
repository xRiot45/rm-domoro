interface SummaryRowProps {
    label: string;
    value: string;
    isBold?: boolean;
    className?: string;
}

export default function SummaryRow({ label, value, isBold = false, className }: SummaryRowProps) {
    return (
        <div className={`flex justify-between ${isBold ? 'border-t pt-4 font-bold' : ''}`}>
            <span>{label}</span>
            <span className={`${className}`}>{value}</span>
        </div>
    );
}
