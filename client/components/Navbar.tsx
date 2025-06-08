'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          HR Management
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {/* Tambah avatar atau notifikasi jika perlu */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
