import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title should be of minimum 3 characters length')
    .required('Title is required'),
  description: Yup.string()
    .min(10, 'Description should be of minimum 10 characters length')
    .required('Description is required'),
  date: Yup.date()
    .min(new Date(), 'Event date must be in the future')
    .required('Date is required'),
  location: Yup.string()
    .required('Location is required'),
  category: Yup.string()
    .required('Category is required'),
  ticketPrice: Yup.number()
    .min(0, 'Price must be 0 or greater')
    .required('Price is required'),
  totalTickets: Yup.number()
    .min(1, 'Total tickets must be at least 1')
    .required('Total tickets is required'),
  images: Yup.array()
    .of(Yup.string().url('Must be a valid URL'))
    .required('At least one image URL is required'),
});

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/events/${id}`, {
        withCredentials: true
      });
      formik.setValues({
        title: response.data.title,
        description: response.data.description,
        date: new Date(response.data.date),
        location: response.data.location,
        category: response.data.category.toLowerCase(),
        ticketPrice: response.data.ticketPrice,
        totalTickets: response.data.totalTickets,
        images: response.data.images || [''],
      });
    } catch (err) {
      setError('Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      date: new Date(),
      location: '',
      category: 'other',
      ticketPrice: '',
      totalTickets: '',
      images: [''],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        setError('');

        const validCategories = ['music', 'sports', 'theater', 'business', 'comedy', 'education', 'technology', 'other'];
        const category = values.category.toLowerCase();
        
        if (!validCategories.includes(category)) {
          setError('Please select a valid category');
          return;
        }

        const eventData = {
          ...values,
          date: values.date.toISOString(),
          ticketPrice: Number(values.ticketPrice),
          totalTickets: Number(values.totalTickets),
          category: category,
          images: values.images.filter(img => img.trim() !== ''),
        };

        console.log('Submitting event data:', eventData);

        if (isEditing) {
          const response = await axios.put(`http://localhost:3000/api/v1/events/${id}`, eventData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          });
          console.log('Update response:', response.data);
        } else {
          const response = await axios.post('http://localhost:3000/api/v1/events', eventData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          });
          console.log('Create response:', response.data);
        }

        navigate('/my-events');
      } catch (err) {
        console.error('Error submitting event:', err.response?.data || err);
        console.error('Validation errors:', err.response?.data?.errors);
        setError(
          err.response?.data?.message || 
          (err.response?.data?.errors ? err.response.data.errors.join(', ') : 'Failed to save event')
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditing ? 'Edit Event' : 'Create Event'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Event Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Event Date & Time"
                  value={formik.values.date}
                  onChange={(newValue) => formik.setFieldValue('date', newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.date && Boolean(formik.errors.date),
                      helperText: formik.touched.date && formik.errors.date
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="location"
                name="location"
                label="Location"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase();
                    formik.setFieldValue('category', value);
                  }}
                  label="Category"
                >
                  <MenuItem value="music">Music</MenuItem>
                  <MenuItem value="sports">Sports</MenuItem>
                  <MenuItem value="theater">Theater</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="comedy">Comedy</MenuItem>
                  <MenuItem value="education">Education</MenuItem>
                  <MenuItem value="technology">Technology</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {formik.touched.category && formik.errors.category && (
                  <Typography color="error" variant="caption">
                    {formik.errors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="ticketPrice"
                name="ticketPrice"
                label="Price"
                type="number"
                value={formik.values.ticketPrice}
                onChange={formik.handleChange}
                error={formik.touched.ticketPrice && Boolean(formik.errors.ticketPrice)}
                helperText={formik.touched.ticketPrice && formik.errors.ticketPrice}
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="totalTickets"
                name="totalTickets"
                label="Total Tickets"
                type="number"
                value={formik.values.totalTickets}
                onChange={formik.handleChange}
                error={formik.touched.totalTickets && Boolean(formik.errors.totalTickets)}
                helperText={formik.touched.totalTickets && formik.errors.totalTickets}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="images"
                name="images"
                label="Image URL"
                value={formik.values.images[0]}
                onChange={(e) => formik.setFieldValue('images', [e.target.value])}
                error={formik.touched.images && Boolean(formik.errors.images)}
                helperText={formik.touched.images && formik.errors.images}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/my-events')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      {isEditing ? 'Saving...' : 'Creating...'}
                    </>
                  ) : (
                    isEditing ? 'Save Changes' : 'Create Event'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EventForm; 