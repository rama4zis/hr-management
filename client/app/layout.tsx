'use client';

import '@/styles/globals.css';
import React from 'react'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme/muiTheme';
import AuthGuard from '@/components/AuthGuard';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AuthGuard>
                        {children}
                    </AuthGuard>
                </ThemeProvider>
            </body>
        </html>
    );
}
