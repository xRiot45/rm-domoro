import { CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OrderTypeEnum } from '@/enums/order-type';
import { Icon } from '@iconify/react';

interface OrderTypeSelectionProps {
    selectedOrderType: OrderTypeEnum | null;
    setSelectedOrderType: (value: OrderTypeEnum) => void;
}

const iconsOrderType = {
    DINEIN: <Icon icon="mdi:food" width={24} height={24} />,
    TAKEAWAY: <Icon icon="solar:bag-bold" width={24} height={24} />,
    DELIVERY: <Icon icon="mdi:truck-delivery" width={24} height={24} />,
    PICKUP: <Icon icon="tdesign:undertake-delivery-filled" width={24} height={24} />,
};

const OrderTypeSelection: React.FC<OrderTypeSelectionProps> = ({ selectedOrderType, setSelectedOrderType }) => {
    return (
        <div className="mt-2 space-y-3">
            <h1 className="mb-4 text-lg font-semibold">Metode Pemesanan</h1>
            <RadioGroup
                value={selectedOrderType || ''}
                onValueChange={(value) => setSelectedOrderType(value as OrderTypeEnum)}
                className="grid w-full md:grid-cols-2"
            >
                {Object.entries(OrderTypeEnum).map(([key, value]) => (
                    <CardContent
                        key={key}
                        className={`flex h-24 w-full cursor-pointer flex-row items-center gap-5 rounded-xl border px-8 py-6 shadow-none transition-colors ${selectedOrderType === value ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white text-black dark:bg-black dark:text-white'} `}
                        onClick={() => setSelectedOrderType(value)}
                    >
                        <RadioGroupItem
                            value={value}
                            id={key}
                            className={` ${selectedOrderType === value ? 'bg-white dark:bg-black' : 'bg-transparent'}`}
                        />
                        {iconsOrderType[key as keyof typeof iconsOrderType]}
                        <div>
                            <p className="font-bold">{key.replace('_', ' ')}</p>
                            <p className="text-sm font-normal capitalize opacity-70">{value}</p>
                        </div>
                    </CardContent>
                ))}
            </RadioGroup>
        </div>
    );
};

export default OrderTypeSelection;
