import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Event as EventIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const { user, logout, isAdmin, isOrganizer } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
    navigate('/');
  };

  const renderAuthButtons = () => {
    if (!user) {
      return (
        <>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/register">
            Register
          </Button>
        </>
      );
    }

    return (
      <>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem component={Link} to="/profile" onClick={handleClose}>
            Profile
          </MenuItem>
          {isOrganizer && (
            <MenuItem component={Link} to="/my-events" onClick={handleClose}>
              My Events
            </MenuItem>
          )}
          {isAdmin && (
            <>
              <MenuItem component={Link} to="/admin/events" onClick={handleClose}>
                Manage Events
              </MenuItem>
              <MenuItem component={Link} to="/admin/users" onClick={handleClose}>
                Manage Users
              </MenuItem>
            </>
          )}
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </>
    );
  };

  const renderMobileMenu = () => (
    <Menu
      id="mobile-menu"
      anchorEl={mobileMenuAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(mobileMenuAnchorEl)}
      onClose={handleClose}
    >
      <MenuItem component={Link} to="/" onClick={handleClose}>
        Home
      </MenuItem>
      {user ? (
        <>
          <MenuItem component={Link} to="/profile" onClick={handleClose}>
            Profile
          </MenuItem>
          {isOrganizer && (
            <MenuItem component={Link} to="/my-events" onClick={handleClose}>
              My Events
            </MenuItem>
          )}
          {isAdmin && (
            <>
              <MenuItem component={Link} to="/admin/events" onClick={handleClose}>
                Manage Events
              </MenuItem>
              <MenuItem component={Link} to="/admin/users" onClick={handleClose}>
                Manage Users
              </MenuItem>
            </>
          )}
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </>
      ) : (
        <>
          <MenuItem component={Link} to="/login" onClick={handleClose}>
            Login
          </MenuItem>
          <MenuItem component={Link} to="/register" onClick={handleClose}>
            Register
          </MenuItem>
        </>
      )}
    </Menu>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <EventIcon sx={{ mr: 1 }} />
          F-Ticket
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenu}
            >
              <MenuIcon />
            </IconButton>
            {renderMobileMenu()}
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user && isOrganizer && (
              <Button
                color="inherit"
                component={Link}
                to="/my-events"
                startIcon={<DashboardIcon />}
              >
                My Events
              </Button>
            )}
            {user && isAdmin && (
              <Button
                color="inherit"
                component={Link}
                to="/admin/events"
                startIcon={<DashboardIcon />}
              >
                Admin Dashboard
              </Button>
            )}
            {renderAuthButtons()}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 