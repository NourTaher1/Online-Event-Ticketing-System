import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  AttachMoney,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const EventCard = ({ event, onDelete, showActions = false }) => {
  const navigate = useNavigate();

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

  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'Price not set';
    return `$${Number(price).toFixed(2)}`;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={event.imageUrl}
        alt={event.title}
        sx={{ cursor: 'pointer' }}
        onClick={() => navigate(`/events/${event._id}`)}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.main',
              },
            }}
            onClick={() => navigate(`/events/${event._id}`)}
          >
            {event.title}
          </Typography>
          {showActions && (
            <Box>
              <IconButton
                size="small"
                onClick={() => navigate(`/my-events/${event._id}/edit`)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(event)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {event.description}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 'auto' }}>
          <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
            <CalendarToday fontSize="small" />
            {formatDate(event.date)}
          </Typography>
          <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
            <LocationOn fontSize="small" />
            {event.location}
          </Typography>
          <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
            <AttachMoney fontSize="small" />
            {formatPrice(event.ticketPrice)}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Chip
            label={event.category?.charAt(0).toUpperCase() + event.category?.slice(1) || 'Uncategorized'}
            size="small"
            sx={{ mr: 1 }}
          />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          {showActions && (
            <>
              <Button
                size="small"
                color="primary"
                onClick={() => navigate(`/my-events/${event._id}/edit`)}
              >
                Edit
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;