import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import EventDetails from './pages/EventDetails';
import Profile from './pages/Profile';
import UserBookings from './pages/UserBookings';
import MyEvents from './pages/MyEvents';
import EventForm from './pages/EventForm';
import NotFound from './pages/NotFound';
import BookTicket from './pages/BookTicket';

// Admin Components
import AdminUsers from './pages/admin/Users';
import AdminEvents from './pages/admin/Events';
import EditUser from './pages/admin/EditUser';
import EditEvent from './pages/admin/EditEvent';

const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

function App() {
  return (
    <BrowserRouter {...router}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <Navbar />
            <Box
              component="main"
              sx={{
                flex: 1,
                width: '100%',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/events/:id/book" element={<BookTicket />} />

                {/* Protected Routes */}
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/bookings" element={<ProtectedRoute><UserBookings /></ProtectedRoute>} />
                <Route path="/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
                <Route path="/my-events/new" element={<ProtectedRoute><EventForm /></ProtectedRoute>} />
                <Route path="/my-events/:id/edit" element={<ProtectedRoute><EventForm /></ProtectedRoute>} />
                {/* Admin Routes */}
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/users/:id/edit" element={<EditUser />} />
                <Route path="/admin/events" element={<AdminEvents />} />
                <Route path="/admin/events/:id/edit" element={<EditEvent />} />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
