import { PaymentTypeEnum } from '@/enums/payment-type';

export function formatPaymentType(value: string): string {
    const entry = Object.entries(PaymentTypeEnum).find(([, val]) => val === value);
    if (!entry) return value;
    const [key, label] = entry;
    return `${label.charAt(0).toUpperCase() + label.slice(1)} / ${key}`;
}
