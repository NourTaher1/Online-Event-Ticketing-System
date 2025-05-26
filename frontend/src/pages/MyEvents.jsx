import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import EventCard from '../components/EventCard';

const MyEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/v1/events/my-events', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.data && Array.isArray(response.data)) {
          setEvents(response.data);
        }
        setError('');
      } catch (err) {
        console.error('Error fetching events:', err);
        if (err.response?.status === 401) {
          setError('Please log in to view your events');
          navigate('/login');
        } else {
          setError('Failed to fetch events. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [navigate]);

  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;

    try {
      setDeleting(true);
      await axios.delete(`http://localhost:3000/api/v1/events/${selectedEvent._id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setEvents(events.filter(event => event._id !== selectedEvent._id));
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedEvent(null);
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
        <Typography variant="h4">
          My Events
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/my-events/new')}
        >
          Create Event
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {!Array.isArray(events) || events.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">
              You haven't created any events yet. Click the "Create Event" button to get started!
            </Alert>
          </Grid>
        ) : (
          events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event._id}>
              <EventCard
                event={event}
                showActions={true}
                onDelete={handleDeleteClick}
              />
            </Grid>
          ))
        )}
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
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
          <Button onClick={handleDeleteClose} disabled={deleting}>
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

export default MyEvents; 