import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import Register from '@/app/register/page';

export const Route = createFileRoute('/register')({
    component: Register,
});
