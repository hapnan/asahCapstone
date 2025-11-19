import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import Dashboard from '@/app/dashboard/page';

export const Route = createFileRoute('/')({
    component: Dashboard,
});
