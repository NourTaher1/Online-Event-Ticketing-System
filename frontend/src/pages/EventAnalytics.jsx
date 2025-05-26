import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Demo data for testing
const demoAnalytics = {
  event: {
    _id: '1',
    title: 'Summer Music Festival 2024',
    totalTickets: 1000,
    soldTickets: 750,
    revenue: 149992.50,
    averageTicketPrice: 199.99,
  },
  salesByDay: [
    { date: '2024-03-01', sales: 50, revenue: 9999.50 },
    { date: '2024-03-02', sales: 75, revenue: 14999.25 },
    { date: '2024-03-03', sales: 100, revenue: 19999.00 },
    { date: '2024-03-04', sales: 125, revenue: 24998.75 },
    { date: '2024-03-05', sales: 150, revenue: 29998.50 },
  ],
  salesByCategory: [
    { name: 'VIP', value: 200 },
    { name: 'Regular', value: 400 },
    { name: 'Early Bird', value: 150 },
  ],
  COLORS: ['#0088FE', '#00C49F', '#FFBB28'],
};

const EventAnalytics = () => {
  const { eventId } = useParams();
  const [analytics, setAnalytics] = useState(demoAnalytics);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/events/${eventId}/analytics`);
        if (response.data) {
          setAnalytics(response.data);
        }
        setError('');
      } catch (err) {
        setError('Failed to fetch analytics. Please try again later.');
        console.error('Error fetching analytics:', err);
        // Keep demo data on error
      } finally {
        setLoading(false);
      }
    };

    // Uncomment to enable API integration
    // fetchAnalytics();
  }, [eventId]);

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Event Analytics
      </Typography>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        {analytics.event.title}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Total Tickets
            </Typography>
            <Typography variant="h4">
              {analytics.event.totalTickets}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Sold Tickets
            </Typography>
            <Typography variant="h4">
              {analytics.event.soldTickets}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Total Revenue
            </Typography>
            <Typography variant="h4">
              {formatCurrency(analytics.event.revenue)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Average Ticket Price
            </Typography>
            <Typography variant="h4">
              {formatCurrency(analytics.event.averageTicketPrice)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales Over Time
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sales" name="Tickets Sold" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales by Category
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.salesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={analytics.COLORS[index % analytics.COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventAnalytics; 