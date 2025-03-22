import { Role } from './role';

interface User {
    id: number;
    full_name: string;
    email: string;
    phone_number: string;
    password: string;
    password_confirmation: string;
    roles: Role[];
}

interface UserForm {
    full_name: string;
    email: string;
    phone_number: string;
    password: string;
    password_confirmation: string;
    roles: string[];
}

interface UserDeleteForm {
    password: string;
}

export type { User, UserDeleteForm, UserForm };
