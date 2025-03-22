import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Icon } from '@iconify/react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Logo from '../logo';
import mainNavItems from './main-nav-items';

function SidebarGroupContent({ item }: { item: NavItem }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex w-full items-center justify-between px-4 py-6">
                    <div className="flex min-w-0 items-center gap-x-3 px-3">
                        <Icon icon={item.icon} />
                        <span className="truncate">{item.title}</span>
                    </div>
                    <ChevronDown className={cn('h-4 w-4 flex-shrink-0 transition-transform', isOpen && 'rotate-180')} />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-6">
                {item.menu?.map((subItem) => (
                    <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="flex items-center gap-x-2 rounded-md px-4 py-3 text-sm font-light text-black hover:bg-gray-100 dark:text-white dark:hover:bg-[#2a2a2a]"
                    >
                        <span className="h-1 w-1 flex-shrink-0 rounded-full bg-gray-500" />
                        <span className="truncate">{subItem.title}</span>
                    </Link>
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}

function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.href === page.url} className="px-4 py-6">
                            <Link href={item.href} prefetch className="flex min-w-0 items-center gap-x-3">
                                <Icon icon={item.icon} />
                                <span className="truncate">{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

export function HydrogenSidebar() {
    return (
        <Sidebar collapsible="offcanvas" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="lg">
                            <Link href="/admin/dashboard" prefetch>
                                <Logo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="no-scrollbar">
                {mainNavItems.map(({ group, items }) => (
                    <SidebarGroup key={group}>
                        <SidebarGroupLabel>{group}</SidebarGroupLabel>
                        <SidebarMenu>
                            {items.map((item) =>
                                item.menu ? <SidebarGroupContent key={item.title} item={item} /> : <NavMain key={item.title} items={[item]} />,
                            )}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
