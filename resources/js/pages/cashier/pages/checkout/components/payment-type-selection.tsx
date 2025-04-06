import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PaymentTypeEnum } from '@/enums/payment-type';
import { Icon } from '@iconify/react';

interface PaymentTypeSelectionProps {
    selectedPaymentType: PaymentTypeEnum | null;
    setSelectedPaymentType: (value: PaymentTypeEnum) => void;
}

const iconsPaymentType = {
    CASH: <Icon icon="mdi:cash" width={24} height={24} />,
    ONLINE_PAYMENT: <Icon icon="mdi:wallet" width={24} height={24} />,
};

const PaymentTypeSelection: React.FC<PaymentTypeSelectionProps> = ({ selectedPaymentType, setSelectedPaymentType }) => {
    return (
        <div className="mt-2 space-y-3">
            <h1 className="mb-4 text-lg font-semibold">Metode Pembayaran</h1>
            <RadioGroup
                value={selectedPaymentType || ''}
                onValueChange={(value) => setSelectedPaymentType(value as PaymentTypeEnum)}
                className="grid w-full space-y-4 md:grid-cols-2"
            >
                {Object.entries(PaymentTypeEnum).map(([key, value]) => (
                    <Card
                        key={key}
                        className={`flex h-24 w-full cursor-pointer flex-row items-center gap-4 rounded-xl border px-8 py-6 shadow-none transition-colors ${selectedPaymentType === value ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white text-black dark:bg-black dark:text-white'} `}
                        onClick={() => setSelectedPaymentType(value)}
                    >
                        <RadioGroupItem
                            value={value}
                            id={key}
                            className={`${selectedPaymentType === value ? 'bg-white dark:bg-black' : 'bg-transparent'}`}
                        />
                        {iconsPaymentType[key as keyof typeof iconsPaymentType]}
                        <div>
                            <p className="font-bold">{key.replace('_', ' ')}</p>
                            <p className="text-sm font-normal capitalize opacity-70">{value}</p>
                        </div>
                    </Card>
                ))}
            </RadioGroup>
        </div>
    );
};

export default PaymentTypeSelection;
