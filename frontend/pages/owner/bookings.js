import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Schedule,
  LocalShipping,
  Done,
  Block,
  Phone,
  LocationOn,
  CalendarMonth,
  Notes,
} from '@mui/icons-material';
import AuthGuard from '../../components/AuthGuard';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { ownerAPI } from '../../services/api';

function OwnerBookings() {
  const [activeTab, setActiveTab] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const tabs = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
  const tabStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

  useEffect(() => {
    loadBookings(tabStatuses[activeTab]);
  }, [activeTab]);

  const loadBookings = async (status) => {
    setLoading(true);
    try {
      const response = await ownerAPI.getAllBookings(status);
      setBookings(response.bookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      await ownerAPI.updateBookingStatus(bookingId, 'accepted');
      loadBookings(tabStatuses[activeTab]);
    } catch (error) {
      console.error('Failed to accept booking:', error);
    }
  };

  const handleReject = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const confirmReject = async () => {
    try {
      await ownerAPI.updateBookingStatus(selectedBooking.id, 'rejected');
      setDialogOpen(false);
      setRejectReason('');
      loadBookings(tabStatuses[activeTab]);
    } catch (error) {
      console.error('Failed to reject booking:', error);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'warning', icon: <Schedule />, label: 'Pending' },
      confirmed: { color: 'info', icon: <CheckCircle />, label: 'Confirmed' },
      completed: { color: 'success', icon: <Done />, label: 'Completed' },
      cancelled: { color: 'error', icon: <Block />, label: 'Cancelled' },
    };
    return configs[status] || configs.pending;
  };

  const BookingCard = ({ booking }) => {
    const statusConfig = getStatusConfig(booking.status);

    return (
      <Card
        sx={{
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          transition: 'all 0.2s',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            transform: 'translateY(-4px)',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: '#667eea',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                }}
              >
                {booking.farmer[0]}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {booking.farmer}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Booking ID: {booking.id}
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              color={statusConfig.color}
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <LocalShipping sx={{ color: '#667eea', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                    Machine
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {booking.machine}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <CalendarMonth sx={{ color: '#667eea', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                    Date & Time
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {booking.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {booking.time} • {booking.duration}h duration
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <Phone sx={{ color: '#667eea', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                    Contact
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    +91 98765 43210
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <Notes sx={{ color: '#667eea', mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                    Amount
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>
                    ₹{booking.amount}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {booking.status === 'pending' && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={() => handleAccept(booking.id)}
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    py: 1.2,
                  }}
                >
                  Accept Booking
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => handleReject(booking)}
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    py: 1.2,
                  }}
                >
                  Reject
                </Button>
              </Box>
            </>
          )}

          {booking.status === 'confirmed' && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Phone />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 600,
                    textTransform: 'none',
                    py: 1.2,
                  }}
                >
                  Contact Farmer
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LocationOn />}
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    py: 1.2,
                  }}
                >
                  View Location
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <AuthGuard allowedRoles={['owner']}>
      <OwnerLayout>
        <Box>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Bookings Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage booking requests and appointments
            </Typography>
          </Box>

          {/* Tabs */}
          <Paper sx={{ borderRadius: 3, mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  minHeight: 64,
                },
                '& .Mui-selected': {
                  color: '#667eea',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#667eea',
                  height: 3,
                },
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={tab}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tab}
                      <Chip
                        label={bookings.length}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Paper>

          {/* Booking Cards */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : bookings.length === 0 ? (
            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No {tabs[activeTab].toLowerCase()} bookings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bookings will appear here once farmers make requests
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {bookings.map((booking) => (
                <Grid item xs={12} md={6} key={booking.id}>
                  <BookingCard booking={booking} />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Reject Dialog */}
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ fontWeight: 700 }}>
              Reject Booking Request
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Please provide a reason for rejecting this booking. This will be shared with the farmer.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="e.g., Machine not available, under maintenance, etc."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button
                onClick={() => setDialogOpen(false)}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={confirmReject}
                disabled={!rejectReason.trim()}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Confirm Rejection
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </OwnerLayout>
    </AuthGuard>
  );
}

export default OwnerBookings;
