"use client";

import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import Link from "next/link";
import { EventAvailable, EventNote, Payment } from "@mui/icons-material";

const drawerWidth = 240;

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />

      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Employees
          </ListSubheader>
        }
      >
        <ListItemButton component={Link} href="/employees">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Employees" />
        </ListItemButton>
        <ListItemButton component={Link} href="/employees/attendance">
          <ListItemIcon>
            <EventAvailable />
          </ListItemIcon>
          <ListItemText primary="Attendance" />
        </ListItemButton>
        <ListItemButton component={Link} href="/employees/leave-requests">
          <ListItemIcon>
            <EventNote />
          </ListItemIcon>
          <ListItemText primary="Leave Requests" />
        </ListItemButton>
        <ListItemButton component={Link} href="/employees/payroll">
          <ListItemIcon>
            <Payment />
          </ListItemIcon>
          <ListItemText primary="Payroll" />
        </ListItemButton>
      </List>
      <Divider />
      <nav aria-label="secondary mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton component="a" href="/logout">
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Drawer>
  );
};

export default Sidebar;
