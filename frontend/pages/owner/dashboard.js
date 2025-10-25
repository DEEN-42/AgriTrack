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

const StatCard = ({ title, value, icon, color, gradient }) => (
  <Card
    sx={{
      background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
      color: 'white',
      height: '100%',
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
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
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
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
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Welcome back! Here's what's happening with your machines today.
          </Typography>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Revenue"
                value={`₹${(stats.totalRevenue / 1000).toFixed(0)}K`}
                icon={<TrendingUp sx={{ fontSize: 28 }} />}
                color="#3b82f6"
                gradient={['#3b82f6', '#2563eb']}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Pending Bookings"
                value={stats.pendingBookings}
                icon={<CalendarMonth sx={{ fontSize: 28 }} />}
                color="#f59e0b"
                gradient={['#f59e0b', '#d97706']}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Machines Active"
                value={stats.machinesActive}
                icon={<Agriculture sx={{ fontSize: 28 }} />}
                color="#10b981"
                gradient={['#10b981', '#059669']}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Completed Jobs"
                value={stats.completedJobs}
                icon={<CheckCircle sx={{ fontSize: 28 }} />}
                color="#8b5cf6"
                gradient={['#8b5cf6', '#7c3aed']}
              />
            </Grid>
          </Grid>

          {/* Charts and Booking Requests */}
          <Grid container spacing={3}>
            {/* Revenue Chart */}
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Revenue This Month
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#667eea" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Recent Booking Requests */}
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Recent Booking Requests
                </Typography>
                {requests.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No pending requests
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {requests.slice(0, 3).map((request) => (
                      <Paper key={request.id} sx={{ p: 2, bgcolor: '#f8fafc' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {request.farmer}
                          </Typography>
                          <Chip label="Pending" size="small" color="warning" />
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
                            color="success"
                            fullWidth
                            onClick={() => handleBookingAction(request.id, 'accepted')}
                            startIcon={<CheckCircle />}
                            sx={{ textTransform: 'none' }}
                          >
                            Accept
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={() => handleBookingAction(request.id, 'rejected')}
                            startIcon={<Cancel />}
                            sx={{ textTransform: 'none' }}
                          >
                            Reject
                          </Button>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </OwnerLayout>
    </AuthGuard>
  );
}

export default OwnerDashboard;
