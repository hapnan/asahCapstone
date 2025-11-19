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
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { startRegistration } from '@simplewebauthn/browser';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { useNavigate } from '@tanstack/react-router';

const registerFormSchema = z.object({
    email: z.email('Invalid email address'),
    name: z.string().min(1, 'Name is required'),
});

export default function RegisterPage() {
    let navigate = useNavigate();
    const form = useForm({
        defaultValues: {
            email: '',
            name: '',
        },
        validators: {
            onSubmit: registerFormSchema,
        },
        onSubmit: async (value) => {
            const email = value.value.email;
            const name = value.value.name;

            const resp = await fetch(
                `http://localhost:3000/auth/register/options?username=${email}&name=${name}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const options = await resp.json();
            let attResp;
            try {
                attResp = await startRegistration({ optionsJSON: options });
            } catch (error) {
                if (error.name === 'InvalidStateError') {
                    console.log('Error: Authenticator was probably already registered by user');
                } else {
                    console.log(error);
                }
            }

            const verifyResp = await fetch('http://localhost:3000/auth/register/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    registrationResponse: attResp,
                    username: email,
                }),
            });

            const verificationJSON = await verifyResp.json();

            console.log(verificationJSON);

            if (verificationJSON === true) {
                toast.success('Registration successful!', {
                    description: new Date().toLocaleTimeString('id-ID'),
                });

                navigate({ to: '/login' });
            } else {
                toast.error('Registration failed');
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
                        id='formRegister'
                        className='grid gap-4'
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                    >
                        {/* Input Email */}
                        <FieldGroup>
                            <form.Field
                                name='email'
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                            <Input
                                                id={field.name}
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
                                        </Field>
                                    );
                                }}
                            />

                            <form.Field
                                name='name'
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                            <Input
                                                id={field.name}
                                                type='text'
                                                placeholder='Your Name'
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.setValue(e.target.value)}
                                                aria-invalid={isInvalid}
                                                autoComplete='off'
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className='text-center flex flex-col items-center'>
                    <Field>
                        <Button type='submit' className='w-full' form='formRegister'>
                            Register with Passkey
                        </Button>
                    </Field>
                    <span className='text-sm text-muted-foreground mb-2'>
                        Have an account?{' '}
                        <a href='#' className='underline hover:text-primary'>
                            Log in here
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
