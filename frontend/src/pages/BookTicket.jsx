import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import axios from 'axios';

const BookTicket = () => {
  const { id } = useParams(); // event id
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch event details
  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/events/${id}`);
      setEvent(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch event on mount
  useState(() => {
    fetchEvent();
    // eslint-disable-next-line
  }, []);

  const handleQuantityChange = (e) => {
    const val = Math.max(1, Math.min(Number(e.target.value), event?.remainingTickets || 1));
    setQuantity(val);
  };

  // Update handleCheckout to not take event, just submit booking
  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(
        `/api/v1/bookings`,
        {
          event: id,
          quantity,
        },
        { withCredentials: true }
      );
      setSuccess('Booking successful!');
      setTimeout(() => navigate('/bookings'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book ticket');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !event) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !event) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        {event && (
          <>
            <Typography variant="h5" gutterBottom>Book Ticket</Typography>
            <Typography variant="h6">{event.title}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {new Date(event.date).toLocaleString()} | {event.location}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <form onSubmit={handleBooking}>
              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1, max: event.remainingTickets || 1 }}
                fullWidth
                margin="normal"
                required
              />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Price per ticket: <b>${event.ticketPrice}</b>
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>
                Total: ${(event.ticketPrice * quantity).toFixed(2)}
              </Typography>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading || quantity < 1 || quantity > event.remainingTickets}
              >
                {loading ? 'Booking...' : 'Book Now'}
              </Button>
            </form>
          </>
        )}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      </Paper>
    </Container>
  );
};

export default BookTicket;
