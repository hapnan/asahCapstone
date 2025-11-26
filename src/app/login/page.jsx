'use client';

import * as React from 'react';
import { GalleryVerticalEnd } from 'lucide-react'; // Atau ganti ikon Bank kalian
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { startAuthentication } from '@simplewebauthn/browser';
import { useAuth } from '@/lib/authContext';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { authAPI } from '@/lib/api';

const loginFormSchema = z.object({
    email: z.email('Invalid email address'),
});

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const search = useSearch({ from: '/login' });
    console.log('Search params:', search);
    const form = useForm({
        defaultValues: {
            email: '',
        },
        validators: {
            onSubmit: loginFormSchema,
        },
        onSubmit: async ({ value }) => {
            const email = value.email;

            try {
                // Fetch options from server
                const resp = await authAPI.getLoginOptions(email);
                const options = await resp.json();

                // Start passkey authentication
                let asseResp;
                try {
                    asseResp = await startAuthentication({ optionsJSON: options });
                } catch (error) {
                    console.error('Error during authentication:', error);
                    toast.error('Authentication failed. Please try again.');
                    return;
                }

                // Send response back to server for verification
                const verificationResp = await authAPI.verifyLogin(asseResp, email);

                if (verificationResp.ok) {
                    const userData = await verificationResp.json();
                    // Cookie is automatically set by server
                    await login(userData);
                    toast.success('Login successful!');

                    // Redirect to the page they were trying to access or dashboard
                    const redirectTo = search?.redirect || '/';
                    navigate({ to: redirectTo });
                } else {
                    toast.error('Login failed. Please try again.');
                }
            } catch (error) {
                console.error('Login error:', error);
                toast.error('An error occurred. Please try again.');
            }
        },
    });

    return (
        <div className='flex h-screen w-full items-center justify-center bg-muted/40 px-4'>
            <Card className='mx-auto max-w-sm w-full'>
                <CardHeader className='text-center'>
                    <div className='flex justify-center mb-4'>
                        <div className='flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground'>
                            {/* Logo Bank Holahop/Asah */}
                            <GalleryVerticalEnd className='size-6' />
                        </div>
                    </div>
                    <CardTitle className='text-2xl'>Bank Holahop</CardTitle>
                    <CardDescription>Sales Lead Scoring Portal</CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id='formLogin'
                        className='grid gap-4'
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                    >
                        <FieldGroup>
                            <form.Field
                                name='email'
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <>
                                            <FieldLabel>
                                                <Label htmlFor='email'>Email Address</Label>
                                            </FieldLabel>
                                            <Input
                                                id='email'
                                                type='email'
                                                placeholder='nama@bankholahop.com'
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.setValue(e.target.value)}
                                                aria-invalid={isInvalid}
                                                autoComplete='off'
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </>
                                    );
                                }}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className='text-center flex flex-col items-center'>
                    <Field>
                        <Button type='submit' className='w-full cursor-pointer' form='formLogin'>
                            Log in with Passkey
                        </Button>
                    </Field>
                    <span className='text-sm text-muted-foreground mb-2'>
                        Don't have an account?{' '}
                        <a href='/register' className='underline hover:text-primary'>
                            Register here
                        </a>
                    </span>
                    <br />
                    <span className='text-sm text-muted-foreground'>
                        © 2025 Bank Holahop. All rights reserved.
                    </span>
                </CardFooter>
            </Card>
        </div>
    );
}
