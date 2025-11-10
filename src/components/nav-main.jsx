import { IconCirclePlusFilled, IconMail } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain({ items }) {
    return (
        <SidebarGroup>
            <SidebarGroupContent className='flex flex-col gap-2'>
                <SidebarMenu>
                    <SidebarMenuItem className='flex items-center gap-2'>
                        <SidebarMenuButton
                            tooltip='Quick Create'
                            className='bg-accent! dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 dark:hover:text-primary-foreground dark:active:bg-primary/90 dark:active:text-primary-foreground min-w-8 duration-200 ease-linear'
                        >
                            <IconCirclePlusFilled />
                            <span>Quick Create</span>
                        </SidebarMenuButton>
                        <Button
                            size='icon'
                            className='bg-accent! size-8 group-data-[collapsible=icon]:opacity-0'
                            variant='outline'
                        >
                            <IconMail />
                            <span className='sr-only'>Inbox</span>
                        </Button>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                className='bg-accent! dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 dark:hover:text-primary-foreground dark:active:bg-primary/90 dark:active:text-primary-foreground duration-200 ease-linear'
                            >
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
