import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Fade,
  Slide,
  Zoom,
  keyframes,
} from '@mui/material';
import {
  TrendingUp,
  CalendarMonth,
  Agriculture,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AuthGuard from '../../components/AuthGuard';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { ownerAPI } from '../../services/api';

// Keyframe animations
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.02); }
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

const StatCard = ({ title, value, icon, color, gradient, delay = 0 }) => (
  <Zoom in timeout={800 + delay}>
    <Card
      sx={{
        background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
        color: 'white',
        height: '100%',
        borderRadius: 3,
        boxShadow: `0 10px 30px ${gradient[0]}40`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 20px 40px ${gradient[0]}50`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {value}
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
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1) rotate(10deg)',
              },
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Zoom>
);

function OwnerDashboard() {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsResponse, requestsResponse] = await Promise.all([
        ownerAPI.getDashboardStats(),
        ownerAPI.getBookingRequests(),
      ]);
      setStats(statsResponse.stats);
      setRequests(requestsResponse.requests);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      await ownerAPI.updateBookingStatus(bookingId, action);
      loadDashboardData(); // Reload data
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  if (loading) {
    return (
      <AuthGuard allowedRoles={['owner']}>
        <OwnerLayout>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        </OwnerLayout>
      </AuthGuard>
    );
  }

  const chartData = stats?.monthlyRevenue?.map((revenue, index) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index],
    revenue,
  })) || [];

  return (
    <AuthGuard allowedRoles={['owner']}>
      <OwnerLayout>
        <Box>
          <Fade in timeout={600}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome back! Here's what's happening with your machines today.
              </Typography>
            </Box>
          </Fade>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Revenue"
                value={`₹${(stats.totalRevenue / 1000).toFixed(0)}K`}
                icon={<TrendingUp sx={{ fontSize: 28 }} />}
                color="#3b82f6"
                gradient={['#3b82f6', '#2563eb']}
                delay={0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Bookings"
                value={stats.pendingBookings}
                icon={<CalendarMonth sx={{ fontSize: 28 }} />}
                color="#f59e0b"
                gradient={['#f59e0b', '#d97706']}
                delay={100}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Machines Active"
                value={stats.machinesActive}
                icon={<Agriculture sx={{ fontSize: 28 }} />}
                color="#10b981"
                gradient={['#10b981', '#059669']}
                delay={200}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completed Jobs"
                value={stats.completedJobs}
                icon={<CheckCircle sx={{ fontSize: 28 }} />}
                color="#8b5cf6"
                gradient={['#8b5cf6', '#7c3aed']}
                delay={300}
              />
            </Grid>
          </Grid>

          {/* Charts and Booking Requests */}
          <Grid container spacing={3}>
            {/* Revenue Chart */}
            <Grid item xs={12} md={7}>
              <Slide direction="up" in timeout={1000}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Revenue This Month
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Slide>
            </Grid>

            {/* Recent Booking Requests */}
            <Grid item xs={12} md={5}>
              <Slide direction="up" in timeout={1200}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Recent Booking Requests
                  </Typography>
                  {requests.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      No pending requests
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {requests.slice(0, 3).map((request, index) => (
                        <Zoom key={request.id} in timeout={1400 + index * 100}>
                          <Paper 
                            sx={{ 
                              p: 2, 
                              bgcolor: '#f8fafc',
                              borderRadius: 2,
                              border: '1px solid #e2e8f0',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                bgcolor: 'white',
                                borderColor: '#3b82f6',
                                transform: 'translateX(4px)',
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
                              },
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {request.farmer}
                              </Typography>
                              <Chip 
                                label="Pending" 
                                size="small" 
                                sx={{
                                  bgcolor: '#fef3c7',
                                  color: '#92400e',
                                  fontWeight: 600,
                                  animation: `${pulse} 2s ease-in-out infinite`,
                                }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {request.machine}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              📅 {request.date} at {request.time}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                              📍 {request.location}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                              <Button
                                size="small"
                                variant="contained"
                                fullWidth
                                onClick={() => handleBookingAction(request.id, 'accepted')}
                                startIcon={<CheckCircle />}
                                sx={{ 
                                  textTransform: 'none',
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
                                  },
                                }}
                              >
                                Accept
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                fullWidth
                                onClick={() => handleBookingAction(request.id, 'rejected')}
                                startIcon={<Cancel />}
                                sx={{ 
                                  textTransform: 'none',
                                  borderColor: '#ef4444',
                                  color: '#ef4444',
                                  '&:hover': {
                                    borderColor: '#dc2626',
                                    bgcolor: '#fef2f2',
                                    transform: 'translateY(-2px)',
                                  },
                                }}
                              >
                                Reject
                              </Button>
                            </Box>
                          </Paper>
                        </Zoom>
                      ))}
                    </Box>
                  )}
                </Paper>
              </Slide>
            </Grid>
          </Grid>
        </Box>
      </OwnerLayout>
    </AuthGuard>
  );
}

export default OwnerDashboard;
