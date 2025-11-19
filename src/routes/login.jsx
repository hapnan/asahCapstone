import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import Login from '@/app/login/page';

export const Route = createFileRoute('/login')({
    component: Login,
});
