import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import logo from './image32.png';
import { Divider } from '@mui/material';
import App from './App';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    backgroundColor: 'white',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function HeadMenu() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
        <IconButton onClick={handleDrawerClose} color="error" sx={{ mr: 2, ...(!open && { display: 'none' }) }}> 
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          <IconButton
            color="error"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <img src={logo} alt="Logo" style={{width: "50px", height: '50px'}} />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <List>
            <ListItem key={"Imóveis"} disablePadding>
              <ListItemButton onClick={() => window.location.href = '/'}>
                <ListItemIcon>
                 <HomeOutlinedIcon color="error" />
                </ListItemIcon>
                <ListItemText primary={"Imóveis"} />
              </ListItemButton>
            </ListItem>
            <Divider/>
            <ListItem key={"Reservas"} disablePadding>
              <ListItemButton  onClick={() => window.location.href = '/reservas'}>
                <ListItemIcon >
                 <Person2OutlinedIcon color="error" />
                </ListItemIcon>
                <ListItemText primary={"Reservas"} />
              </ListItemButton>
            </ListItem>
            <Divider/>
            <ListItem key={"Mensagens"} disablePadding>
              <ListItemButton color="error" >
                <ListItemIcon>
                 <ChatOutlinedIcon color="error" />
                </ListItemIcon>
                <ListItemText primary={"Mensagens"} />
              </ListItemButton>
            </ListItem>
            <Divider/>
            <ListItem key={"Erros"} disablePadding>
              <ListItemButton color="error" >
                <ListItemIcon>
                 <ErrorOutlineOutlinedIcon color="error" />
                </ListItemIcon>
                <ListItemText primary={"Erros"} />
              </ListItemButton>
            </ListItem>

        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <App />
      </Main>
    </Box>
  );
}