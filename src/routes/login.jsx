import { createFileRoute, redirect } from '@tanstack/react-router';
import * as React from 'react';
import Login from '@/app/login/page';

export const Route = createFileRoute('/login')({
    validateSearch: (search) => ({
        redirect: (search.redirect) || '/',
    }),
    beforeLoad: ({ context, search }) => {
        // Redirect if already authenticated
        if (context.auth.isAuthenticated) {
            throw redirect({ to: search.redirect })
        }
    },
    component: Login,
});
