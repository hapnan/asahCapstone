import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { ThemeProvider } from './lib/themeContext.jsx';
import { routeTree } from './routeTree.gen';
import './index.css';
import Page from './app/dashboard/page.jsx';
import LoginPage from './app/login/page.jsx';
import RegisterPage from './app/register/page.jsx';
import { Toaster } from '@/components/ui/sonner';

const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <RouterProvider router={router} />
            <Toaster />
        </ThemeProvider>
    </React.StrictMode>
);
