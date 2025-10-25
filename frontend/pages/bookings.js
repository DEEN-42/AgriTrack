import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Logout,
  Schedule,
  CalendarMonth,
  LocationOn,
  Engineering,
  Phone,
  CheckCircle,
  Cancel,
  Pending,
  Done,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/features/authSlice';
import AuthGuard from '../components/AuthGuard';
import { farmerAPI } from '../services/api';

function MyBookings() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await farmerAPI.getMyBookings();
      setBookings(response.bookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      confirmed: { label: 'Confirmed', color: '#10b981', icon: <CheckCircle /> },
      pending: { label: 'Pending', color: '#f59e0b', icon: <Pending /> },
      completed: { label: 'Completed', color: '#667eea', icon: <Done /> },
      cancelled: { label: 'Cancelled', color: '#ef4444', icon: <Cancel /> },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        sx={{
          bgcolor: config.color,
          color: 'white',
          fontWeight: 700,
        }}
      />
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    if (tabValue === 0) return true; // All
    if (tabValue === 1) return booking.status === 'pending' || booking.status === 'confirmed';
    if (tabValue === 2) return booking.status === 'completed';
    if (tabValue === 3) return booking.status === 'cancelled';
    return true;
  });

  return (
    <AuthGuard allowedRoles={['farmer']}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        {/* Top Navigation */}
        <AppBar position="sticky" elevation={2} sx={{ bgcolor: 'white' }}>
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => router.push('/')}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>

            <Typography
              variant="h5"
              sx={{
                flexGrow: 1,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              My Bookings
            </Typography>

            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: '#667eea' }}>
                {user?.name?.[0] || 'F'}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem disabled>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user?.name || 'Farmer'}
                </Typography>
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="caption" color="text.secondary">
                  {user?.phone}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <Logout fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          {/* Header Stats */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
                  {bookings.length}
                </Typography>
                <Typography variant="body2">Total Bookings</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
                  {bookings.filter((b) => b.status === 'completed').length}
                </Typography>
                <Typography variant="body2">Completed</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
                  {bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length}
                </Typography>
                <Typography variant="body2">Upcoming</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
                  {bookings.filter((b) => b.status === 'cancelled').length}
                </Typography>
                <Typography variant="body2">Cancelled</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Tabs */}
          <Paper sx={{ mb: 3, borderRadius: 3 }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
                '& .Mui-selected': { color: '#667eea' },
                '& .MuiTabs-indicator': { bgcolor: '#667eea' },
              }}
            >
              <Tab label={`All (${bookings.length})`} />
              <Tab
                label={`Upcoming (${bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length})`}
              />
              <Tab label={`Completed (${bookings.filter((b) => b.status === 'completed').length})`} />
              <Tab label={`Cancelled (${bookings.filter((b) => b.status === 'cancelled').length})`} />
            </Tabs>
          </Paper>

          {/* Bookings List */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : filteredBookings.length === 0 ? (
            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No bookings found
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push('/')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Browse Machines
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredBookings.map((booking) => (
                <Grid item xs={12} md={6} lg={4} key={booking.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: '2px solid #e2e8f0',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Booking ID: {booking.id}
                        </Typography>
                        {getStatusChip(booking.status)}
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                        {booking.machine}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Engineering sx={{ fontSize: 18, color: '#667eea' }} />
                        <Typography variant="body2" color="text.secondary">
                          {booking.owner}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CalendarMonth sx={{ fontSize: 18, color: '#667eea' }} />
                        <Typography variant="body2" color="text.secondary">
                          {booking.date}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Schedule sx={{ fontSize: 18, color: '#667eea' }} />
                        <Typography variant="body2" color="text.secondary">
                          {booking.time} • {booking.duration} hours
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Total Amount
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 900, color: '#667eea' }}>
                            ₹{booking.totalPrice}
                          </Typography>
                        </Box>

                        {booking.status === 'confirmed' && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<LocationOn />}
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              textTransform: 'none',
                              fontWeight: 600,
                            }}
                            onClick={() => router.push(`/track/${booking.id}`)}
                          >
                            Track
                          </Button>
                        )}

                        {booking.status === 'pending' && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                          >
                            Cancel
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </AuthGuard>
  );
}

export default MyBookings;
