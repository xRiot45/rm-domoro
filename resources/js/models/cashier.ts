import { CashierStatusEnum } from '@/enums/cashier-status';
import { GenderEnum } from '@/enums/gender';
import { JobTypeEnum } from '@/enums/job-type';
import { ShiftEnum } from '@/enums/shift';
import { User } from './user';

interface Cashier {
    id: number;
    user_id: number;
    user: User;
    hired_at: Date | null;
    stopped_at: Date | null;
    salary: number;
    gender: GenderEnum.MALE | GenderEnum.FEMALE;
    shift: ShiftEnum.MORNING | ShiftEnum.EVENING | ShiftEnum.NIGHT;
    job_type: JobTypeEnum.FULL_TIME | JobTypeEnum.PART_TIME;
    status: CashierStatusEnum.WORK | CashierStatusEnum.LEAVE;
    created_at?: string;
    updated_at?: string;
}

interface CashierForm {
    user_id: number;
    hired_at: Date | null;
    stopped_at?: Date | null;
    salary: number | string;
    gender: GenderEnum.MALE | GenderEnum.FEMALE;
    shift: ShiftEnum.MORNING | ShiftEnum.EVENING | ShiftEnum.NIGHT;
    job_type: JobTypeEnum.FULL_TIME | JobTypeEnum.PART_TIME;
    status: CashierStatusEnum.WORK | CashierStatusEnum.LEAVE;
}

export type { Cashier, CashierForm };
