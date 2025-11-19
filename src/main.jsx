import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { ThemeProvider } from './lib/themeContext.jsx';
import './index.css';
import Page from './app/dashboard/page.jsx';
import LoginPage from './app/login/page.jsx';
import RegisterPage from './app/register/page.jsx';
import { Toaster } from '@/components/ui/sonner';
const router = createBrowserRouter([
    {
        path: '/',
        element: <Page />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider>
            <RouterProvider router={router} />
            <Toaster />
        </ThemeProvider>
    </StrictMode>
);
