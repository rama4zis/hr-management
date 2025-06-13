'use client';

import '@/styles/globals.css';
import React from 'react'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme/muiTheme';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

import { Box, Toolbar } from '@mui/material';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                {children}
            </body>
        </html>
    );
}
