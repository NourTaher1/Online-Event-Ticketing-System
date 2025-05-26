import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import axios from 'axios';

// Demo data for testing
const demoEvents = [
  {
    _id: '1',
    title: 'Summer Music Festival 2024',
    organizer: 'John Doe',
    date: '2024-07-15T10:00:00',
    location: 'Central Park, New York',
    category: 'Music',
    status: 'active',
    totalTickets: 1000,
    soldTickets: 750,
    revenue: 149992.50,
  },
  {
    _id: '2',
    title: 'Tech Conference 2024',
    organizer: 'Jane Smith',
    date: '2024-06-20T09:00:00',
    location: 'Convention Center, San Francisco',
    category: 'Technology',
    status: 'active',
    totalTickets: 500,
    soldTickets: 300,
    revenue: 89997.00,
  },
  {
    _id: '3',
    title: 'Food & Wine Festival',
    organizer: 'Bob Johnson',
    date: '2024-08-05T11:00:00',
    location: 'Downtown District, Chicago',
    category: 'Food & Drink',
    status: 'blocked',
    totalTickets: 800,
    soldTickets: 400,
    revenue: 59998.00,
  },
];

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState(demoEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/events');
        if (response.data && Array.isArray(response.data)) {
          setEvents(response.data);
        }
        setError('');
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        console.error('Error fetching events:', err);
        // Keep demo data on error
      } finally {
        setLoading(false);
      }
    };

    // Uncomment to enable API integration
    // fetchEvents();
  }, []);

  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;

    try {
      setDeleting(true);
      await axios.delete(`/api/admin/events/${selectedEvent._id}`);
      setEvents(events.filter(event => event._id !== selectedEvent._id));
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusToggle = async (event) => {
    try {
      const newStatus = event.status === 'active' ? 'blocked' : 'active';
      await axios.patch(`/api/admin/events/${event._id}/status`, { status: newStatus });
      setEvents(events.map(e => 
        e._id === event._id ? { ...e, status: newStatus } : e
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event status');
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
          Event Management
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Organizer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tickets</TableCell>
              <TableCell>Revenue</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.organizer}</TableCell>
                <TableCell>{formatDate(event.date)}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  <Chip label={event.category} size="small" />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {event.status === 'active' ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <BlockIcon color="error" fontSize="small" />
                    )}
                    {event.status}
                  </Box>
                </TableCell>
                <TableCell>
                  {event.soldTickets} / {event.totalTickets}
                </TableCell>
                <TableCell>{formatCurrency(event.revenue)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/my-events/${event._id}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleStatusToggle(event)}
                    color={event.status === 'active' ? 'error' : 'success'}
                  >
                    {event.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(event)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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