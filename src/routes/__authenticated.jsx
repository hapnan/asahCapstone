import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/__authenticated')({
    beforeLoad: ({ context, location }) => {
        if (!context.auth.isAuthenticated) {
            // Redirect to login with the current location to return after login
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            });
        }
    },
    component: () => <Outlet />,
});
