import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { useAuth } from '@/lib/authContext';
import { redirect, useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';

export function SiteHeader() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const logoutResult = await logout();
        if(logoutResult.ok){
            navigate({ to: '/login' });
        }
        
    };

    return (
        <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
            <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
                <SidebarTrigger className='-ml-1' />
                <Separator
                    orientation='vertical'
                    className='mx-2 data-[orientation=vertical]:h-4'
                />
                <h1 className='text-base font-medium'>Dashboard</h1>
                <div className='ml-auto flex items-center gap-2'>
                    {user && (
                        <span className='text-sm text-muted-foreground hidden sm:inline'>
                            {user.email}
                        </span>
                    )}
                    <ModeToggle />
                    <Button variant='ghost' size='icon' onClick={handleLogout} title='Logout'>
                        <LogOut className='h-[1.2rem] w-[1.2rem]' />
                        <span className='sr-only'>Logout</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
