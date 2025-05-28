import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/events');
        if (response.data && Array.isArray(response.data)) {
          setEvents(response.data);
        }
        setError('');
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;
    try {
      setDeleting(true);
      await axios.delete(`/api/v1/events/${selectedEvent._id}`);
      setEvents(events.filter(event => event._id !== selectedEvent._id));
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Event Management</Typography>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardMedia
                component="img"
                height="180"
                image={event.images && event.images.length > 0 ? event.images[0] : '/img/defaultEvent1.png'}
                alt={event.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>{event.title}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {event.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  <Chip label={event.category} size="small" />
                  <Chip label={event.status} size="small" color={event.status === 'upcoming' ? 'success' : event.status === 'completed' ? 'primary' : event.status === 'cancelled' ? 'error' : 'default'} />
                </Box>
                <Typography variant="body2"><b>Date:</b> {formatDate(event.date)}</Typography>
                <Typography variant="body2"><b>Location:</b> {event.location}</Typography>
                <Typography variant="body2"><b>Price:</b> ${event.ticketPrice}</Typography>
                <Typography variant="body2"><b>Tickets:</b> {event.remainingTickets} / {event.totalTickets}</Typography>
                <Typography variant="body2"><b>Organizer:</b> {event.organizer?.name || event.organizer}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/admin/events/${event._id}/edit`)} startIcon={<EditIcon />}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDeleteClick(event)} startIcon={<DeleteIcon />}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the event "{selectedEvent?.title}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Events;