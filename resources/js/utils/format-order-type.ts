import { OrderTypeEnum } from '@/enums/order-type';

export function formatOrderType(value: string): string {
    const entry = Object.entries(OrderTypeEnum).find(([, val]) => val === value);
    if (!entry) return value;
    const [key, label] = entry;
    return `${label.charAt(0).toUpperCase() + label.slice(1)} / ${key}`;
}
