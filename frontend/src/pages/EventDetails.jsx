import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  AttachMoney,
  Person,
  ConfirmationNumber,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/events/${id}`);
        setEvent(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch event details. Please try again later.');
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleBookClick = () => {
    if (!user) {
      setLoginDialogOpen(true);
    } else {
      navigate(`/events/${event._id}/book`);
    }
  };

  const handleLoginClick = () => {
    setLoginDialogOpen(false);
    navigate('/login', { state: { from: `/events/${id}` } });
  };

  const handleRegisterClick = () => {
    setLoginDialogOpen(false);
    navigate('/register', { state: { from: `/events/${id}` } });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">Event not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {event.title}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                color="primary"
                sx={{ mr: 1 }}
              />
              <Chip
                label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                color={event.status === 'upcoming' ? 'success' : 'default'}
              />
            </Box>
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
            <Divider sx={{ my: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CalendarToday color="primary" />
                  <Typography variant="body1">
                    {formatDate(event.date)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <LocationOn color="primary" />
                  <Typography variant="body1">
                    {event.location}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AttachMoney color="primary" />
                  <Typography variant="body1">
                    ${event.ticketPrice.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <ConfirmationNumber color="primary" />
                  <Typography variant="body1">
                    {event.remainingTickets} tickets remaining
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Event Details
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Organized by
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" />
                <Typography variant="body1">
                  {event.organizer?.name || 'Unknown Organizer'}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleBookClick}
              disabled={event.remainingTickets === 0}
            >
              {event.remainingTickets === 0 ? 'Sold Out' : 'Book Tickets'}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)}>
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          <Typography>
            Please login or create an account to book tickets for this event.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRegisterClick} color="primary">
            Register
          </Button>
          <Button onClick={handleLoginClick} variant="contained" color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetails; 