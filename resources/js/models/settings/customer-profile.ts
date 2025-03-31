import { GenderEnum } from '@/enums/gender';

interface CustomerProfileForm {
    full_name: string;
    email: string;
    phone_number: string;
    avatar: File | null;
    birthplace: string;
    birthdate: Date | null;
    address: string;
    address_label: string;
    note: string;
    gender: GenderEnum.MALE | GenderEnum.FEMALE;
}

export type { CustomerProfileForm };
