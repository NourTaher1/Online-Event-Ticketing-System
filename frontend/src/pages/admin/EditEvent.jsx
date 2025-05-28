import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  MenuItem,
  Paper,
  Chip,
  Grid
} from '@mui/material';
import axios from 'axios';

const categories = [
  'music', 'sports', 'theater', 'business', 'comedy', 'education', 'technology', 'other'
];
const statuses = ['pending', 'upcoming', 'completed', 'cancelled'];

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/events/${id}`);
        setEvent(res.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, idx) => {
    const newImages = [...(event.images || [])];
    newImages[idx] = e.target.value;
    setEvent({ ...event, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`/api/v1/events/${id}`, event);
      setSuccess('Event updated successfully');
      setTimeout(() => navigate('/admin/events'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return <Alert severity="error">Event not found</Alert>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Edit Event</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            value={event.title || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            name="description"
            value={event.description || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            minRows={3}
            required
          />
          <TextField
            label="Date"
            name="date"
            type="datetime-local"
            value={event.date ? new Date(event.date).toISOString().slice(0,16) : ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Location"
            name="location"
            value={event.location || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Category"
            name="category"
            value={event.category || ''}
            onChange={handleChange}
            select
            fullWidth
            margin="normal"
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Status"
            name="status"
            value={event.status || ''}
            onChange={handleChange}
            select
            fullWidth
            margin="normal"
            required
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Ticket Price"
            name="ticketPrice"
            type="number"
            value={event.ticketPrice || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Total Tickets"
            name="totalTickets"
            type="number"
            value={event.totalTickets || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Remaining Tickets"
            name="remainingTickets"
            type="number"
            value={event.remainingTickets || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0 }}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Images</Typography>
            <Grid container spacing={1}>
              {(event.images || []).map((img, idx) => (
                <Grid item xs={12} key={idx}>
                  <TextField
                    label={`Image URL #${idx + 1}`}
                    value={img}
                    onChange={e => handleImageChange(e, idx)}
                    fullWidth
                    margin="dense"
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/admin/events')}>Cancel</Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditEvent;
