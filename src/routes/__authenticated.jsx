import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/__authenticated')({
    beforeLoad: ({ context, location }) => {
        // Don't redirect if still loading auth state
        if (context.auth.isLoading) {
            return;
        }

        // Check if user is authenticated
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
