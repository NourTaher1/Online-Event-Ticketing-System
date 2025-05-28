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
  Paper
} from '@mui/material';
import axios from 'axios';

const roles = [
  { value: 'user', label: 'User' },
  { value: 'organizer', label: 'Organizer' },
  { value: 'admin', label: 'Admin' },
];

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/users/${id}`);
        setUser(res.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`/api/v1/users/${id}`, user);
      setSuccess('User updated successfully');
      setTimeout(() => navigate('/admin/users'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
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

  if (!user) {
    return <Alert severity="error">User not found</Alert>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Edit User</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={user.name || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            value={user.email || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            type="email"
          />
          <TextField
            label="Role"
            name="role"
            value={user.role || ''}
            onChange={handleChange}
            select
            fullWidth
            margin="normal"
            required
          >
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Avatar URL"
            name="avatar"
            value={user.avatar || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/admin/users')}>Cancel</Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditUser;
