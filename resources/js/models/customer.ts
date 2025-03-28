import { GenderEnum } from '@/enums/gender';
import { User } from './user';

interface Customer {
    id: number;
    birthplace: string;
    birthdate: Date;
    address: string;
    address_label: string;
    note: string;
    gender: GenderEnum.MALE | GenderEnum.FEMALE;
    user: User;
    created_at?: string;
    updated_at?: string;
}

interface CustomerForm {
    birthplace: string;
    birthdate: Date | null;
    address: string;
    address_label: string;
    note: string;
    gender: GenderEnum.MALE | GenderEnum.FEMALE;
}

export type { Customer, CustomerForm };
