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
  Fade,
  Slide,
  Zoom,
  keyframes,
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
  TrendingUp,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/features/authSlice';
import AuthGuard from '../components/AuthGuard';
import { farmerAPI } from '../services/api';

// Keyframe animations
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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
      confirmed: { 
        label: 'Confirmed', 
        color: '#10b981',
        bgColor: '#ecfdf5',
        icon: <CheckCircle sx={{ fontSize: 16 }} /> 
      },
      pending: { 
        label: 'Pending', 
        color: '#f59e0b',
        bgColor: '#fef3c7',
        icon: <Pending sx={{ fontSize: 16 }} /> 
      },
      completed: { 
        label: 'Completed', 
        color: '#3b82f6',
        bgColor: '#dbeafe',
        icon: <Done sx={{ fontSize: 16 }} /> 
      },
      cancelled: { 
        label: 'Cancelled', 
        color: '#ef4444',
        bgColor: '#fee2e2',
        icon: <Cancel sx={{ fontSize: 16 }} /> 
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        size="small"
        sx={{
          bgcolor: config.bgColor,
          color: config.color,
          fontWeight: 700,
          fontSize: '0.75rem',
          border: `1px solid ${config.color}30`,
          animation: status === 'pending' ? `${pulse} 2s ease-in-out infinite` : 'none',
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
        <AppBar 
          position="sticky" 
          elevation={0} 
          sx={{ 
            bgcolor: 'white',
            borderBottom: '1px solid #e2e8f0',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => router.push('/')}
              sx={{ 
                mr: 2,
                bgcolor: 'rgba(59, 130, 246, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(59, 130, 246, 0.2)',
                },
              }}
            >
              <ArrowBack sx={{ color: '#3b82f6' }} />
            </IconButton>

            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5,
                }}
              >
                My Bookings
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                Track and manage your machine rentals
              </Typography>
            </Box>

            <IconButton 
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                bgcolor: 'rgba(59, 130, 246, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(59, 130, 246, 0.2)',
                },
              }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  fontWeight: 700,
                }}
              >
                {user?.name?.[0] || 'F'}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 200,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                },
              }}
            >
              <MenuItem disabled>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {user?.name || 'Farmer'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.phone}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider sx={{ my: 1 }} />
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  color: '#ef4444',
                  '&:hover': {
                    bgcolor: '#fee2e2',
                  },
                }}
              >
                <Logout fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, md: 4 } }}>
          {/* Header Stats */}
          <Fade in timeout={600}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Zoom in timeout={800}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white',
                      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                          Total Bookings
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900 }}>
                          {bookings.length}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <TrendingUp sx={{ fontSize: 28 }} />
                      </Box>
                    </Box>
                  </Paper>
                </Zoom>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Zoom in timeout={900}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                          Completed
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900 }}>
                          {bookings.filter((b) => b.status === 'completed').length}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Done sx={{ fontSize: 28 }} />
                      </Box>
                    </Box>
                  </Paper>
                </Zoom>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Zoom in timeout={1000}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(245, 158, 11, 0.4)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                          Upcoming
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900 }}>
                          {bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Schedule sx={{ fontSize: 28 }} />
                      </Box>
                    </Box>
                  </Paper>
                </Zoom>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Zoom in timeout={1100}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(239, 68, 68, 0.4)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
                          Cancelled
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900 }}>
                          {bookings.filter((b) => b.status === 'cancelled').length}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          bgcolor: 'rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Cancel sx={{ fontSize: 28 }} />
                      </Box>
                    </Box>
                  </Paper>
                </Zoom>
              </Grid>
            </Grid>
          </Fade>

          {/* Tabs */}
          <Slide direction="up" in timeout={800}>
            <Paper 
              sx={{ 
                mb: 4, 
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0',
              }}
            >
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': { 
                    textTransform: 'none', 
                    fontWeight: 600,
                    fontSize: '0.938rem',
                    minHeight: 64,
                    transition: 'all 0.2s ease',
                  },
                  '& .Mui-selected': { 
                    color: '#3b82f6',
                  },
                  '& .MuiTabs-indicator': { 
                    bgcolor: '#3b82f6',
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                  },
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
          </Slide>

          {/* Bookings List */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} sx={{ color: '#3b82f6' }} />
            </Box>
          ) : filteredBookings.length === 0 ? (
            <Fade in timeout={800}>
              <Paper 
                sx={{ 
                  p: 8, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <CalendarMonth sx={{ fontSize: 48, color: '#3b82f6' }} />
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                  No bookings found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start booking machines to see them here
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => router.push('/')}
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      boxShadow: '0 15px 35px rgba(59, 130, 246, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Browse Machines
                </Button>
              </Paper>
            </Fade>
          ) : (
            <Grid container spacing={3}>
              {filteredBookings.map((booking, index) => (
                <Grid item xs={12} md={6} lg={4} key={booking.id}>
                  <Zoom in timeout={1000 + index * 100}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                          borderColor: '#3b82f6',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: booking.status === 'completed' 
                            ? 'linear-gradient(90deg, #10b981, #059669)'
                            : booking.status === 'confirmed'
                            ? 'linear-gradient(90deg, #3b82f6, #2563eb)'
                            : booking.status === 'pending'
                            ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                            : 'linear-gradient(90deg, #ef4444, #dc2626)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            ID: {booking.id}
                          </Typography>
                          {getStatusChip(booking.status)}
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#111827' }}>
                          {booking.machine}
                        </Typography>

                        <Box 
                          sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 1.5, 
                            mb: 3,
                            p: 2,
                            bgcolor: '#f9fafb',
                            borderRadius: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Engineering sx={{ fontSize: 18, color: '#3b82f6' }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                                Owner
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                                {booking.owner}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <CalendarMonth sx={{ fontSize: 18, color: '#3b82f6' }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                                Date
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                                {booking.date}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Schedule sx={{ fontSize: 18, color: '#3b82f6' }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="caption" sx={{ color: '#6b7280', display: 'block' }}>
                                Time & Duration
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                                {booking.time} • {booking.duration}h
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.5 }}>
                              Total Amount
                            </Typography>
                            <Typography 
                              variant="h5" 
                              sx={{ 
                                fontWeight: 900, 
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }}
                            >
                              ₹{booking.totalPrice}
                            </Typography>
                          </Box>

                          {booking.status === 'confirmed' && (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<LocationOn />}
                              sx={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 2,
                                py: 1,
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                  boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
                                  transform: 'translateY(-2px)',
                                },
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
                              sx={{ 
                                textTransform: 'none', 
                                fontWeight: 600,
                                borderColor: '#ef4444',
                                color: '#ef4444',
                                px: 2,
                                py: 1,
                                '&:hover': {
                                  borderColor: '#dc2626',
                                  bgcolor: '#fee2e2',
                                  transform: 'translateY(-2px)',
                                },
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Zoom>
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
