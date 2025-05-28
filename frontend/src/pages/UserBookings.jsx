import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  TextField,
} from '@mui/material';
import {
  Cancel as CancelIcon,
  Event as EventIcon,
  CalendarToday,
  LocationOn,
  ConfirmationNumber,
} from '@mui/icons-material';
import { format } from 'date-fns';

const UserBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]); // Start with empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/users/bookings', { withCredentials: true });
      if (response.data && Array.isArray(response.data)) {
        setBookings(response.data);
      }
      setError('');
    } catch (err) {
      setError('Failed to fetch bookings. Please try again later.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;
    try {
      setCancelling(true);
      await axios.put(
        `/api/v1/bookings/${selectedBooking._id}/cancel`,
        {},
        { withCredentials: true }
      );
      await fetchBookings();
      setCancelDialogOpen(false);
      setSelectedBooking(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const handleCancelClose = () => {
    setCancelDialogOpen(false);
    setSelectedBooking(null);
  };

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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>
      <Grid container spacing={3}>
        {!Array.isArray(bookings) || bookings.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">No bookings found.</Alert>
          </Grid>
        ) : (
          bookings.map((booking) => (
            <Grid item xs={12} key={booking._id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Box
                        component="img"
                        src={booking.event.imageUrl}
                        alt={booking.event.title}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={9}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" gutterBottom>
                          {booking.event.title}
                        </Typography>
                        <Chip
                          label={booking.status}
                          color={getStatusColor(booking.status)}
                          size="small"
                          sx={{ mb: 2 }}
                        />
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
                            <CalendarToday fontSize="small" />
                            {formatDate(booking.event.date)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
                            <LocationOn fontSize="small" />
                            {booking.event.location}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
                            <ConfirmationNumber fontSize="small" />
                            {booking.quantity} {booking.quantity === 1 ? 'ticket' : 'tickets'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total: ${booking.totalPrice.toFixed(2)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Booked on {formatDate(booking.bookingDate)}
                        </Typography>
                        <Box>
                          <Button
                            variant="outlined"
                            onClick={() => navigate(`/events/${booking.event._id}`)}
                            sx={{ mr: 1 }}
                          >
                            View Event
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            Checkout
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel your booking for{' '}
            <strong>{selectedBooking?.event.title}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose} disabled={cancelling}>
            No, Keep Booking
          </Button>
          <Button
            onClick={handleCancelConfirm}
            color="error"
            variant="contained"
            disabled={cancelling}
          >
            {cancelling ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Cancelling...
              </>
            ) : (
              'Yes, Cancel Booking'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Enter Card Details</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Checkout for <strong>{selectedBooking?.event.title}</strong></Typography>
          <TextField label="Card Number" fullWidth margin="normal" inputProps={{ maxLength: 19 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="MM/YY" margin="normal" inputProps={{ maxLength: 5 }} />
            <TextField label="CVC" margin="normal" inputProps={{ maxLength: 4 }} />
          </Box>
          <TextField label="Cardholder Name" fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedBooking(null)} color="secondary">Cancel</Button>
          <Button onClick={() => setSelectedBooking(null)} variant="contained" color="primary">
            Pay
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserBookings;