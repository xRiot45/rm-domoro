import AuthLayoutTemplate from '@/layouts/auth/layouts/auth-split-layout';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
}

export default function AuthLayout({ children, title, description, ...props }: AuthLayoutProps) {
    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}
