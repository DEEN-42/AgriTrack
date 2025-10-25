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
  Fade,
  Slide,
  Zoom,
  keyframes,
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
  AttachMoney,
} from '@mui/icons-material';
import AuthGuard from '../../components/AuthGuard';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { ownerAPI } from '../../services/api';

// Keyframe animations
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.02); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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
      pending: { 
        color: '#f59e0b',
        bgColor: '#fef3c7',
        icon: <Schedule sx={{ fontSize: 18 }} />, 
        label: 'Pending Review' 
      },
      confirmed: { 
        color: '#3b82f6',
        bgColor: '#dbeafe',
        icon: <CheckCircle sx={{ fontSize: 18 }} />, 
        label: 'Confirmed' 
      },
      completed: { 
        color: '#10b981',
        bgColor: '#d1fae5',
        icon: <Done sx={{ fontSize: 18 }} />, 
        label: 'Completed' 
      },
      cancelled: { 
        color: '#ef4444',
        bgColor: '#fee2e2',
        icon: <Block sx={{ fontSize: 18 }} />, 
        label: 'Cancelled' 
      },
    };
    return configs[status] || configs.pending;
  };

  const BookingCard = ({ booking }) => {
    const statusConfig = getStatusConfig(booking.status);

    return (
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
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            transform: 'translateY(-8px)',
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
                }}
              >
                {booking.farmer[0]}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827' }}>
                  {booking.farmer}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ID: {booking.id}
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              size="small"
              sx={{
                bgcolor: statusConfig.bgColor,
                color: statusConfig.color,
                fontWeight: 700,
                fontSize: '0.75rem',
                border: `1px solid ${statusConfig.color}30`,
                animation: booking.status === 'pending' ? `${pulse} 2s ease-in-out infinite` : 'none',
              }}
            />
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2,
              p: 2.5,
              bgcolor: '#f9fafb',
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LocalShipping sx={{ color: '#3b82f6', fontSize: 20 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>
                  Machine
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#111827' }}>
                  {booking.machine}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CalendarMonth sx={{ color: '#3b82f6', fontSize: 20 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>
                  Date & Time
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#111827' }}>
                  {booking.date}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {booking.time} • {booking.duration}h duration
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Phone sx={{ color: '#3b82f6', fontSize: 20 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>
                  Contact
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#111827' }}>
                  +91 98765 43210
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box 
            sx={{ 
              p: 2.5,
              bgcolor: 'rgba(16, 185, 129, 0.05)',
              borderRadius: 2,
              border: '1px solid rgba(16, 185, 129, 0.2)',
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AttachMoney sx={{ color: '#10b981', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>
                    Booking Amount
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    ₹{booking.amount}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {booking.status === 'pending' && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleAccept(booking.id)}
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  fontWeight: 700,
                  textTransform: 'none',
                  py: 1.5,
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Accept Booking
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setSelectedBooking(booking);
                  setDialogOpen(true);
                }}
                sx={{
                  borderColor: '#ef4444',
                  borderWidth: 2,
                  color: '#ef4444',
                  fontWeight: 700,
                  textTransform: 'none',
                  py: 1.5,
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#dc2626',
                    borderWidth: 2,
                    bgcolor: '#fee2e2',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Reject
              </Button>
            </Stack>
          )}

          {booking.status === 'confirmed' && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Phone />}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  fontWeight: 700,
                  textTransform: 'none',
                  py: 1.5,
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Contact Farmer
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<LocationOn />}
                sx={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  fontWeight: 700,
                  textTransform: 'none',
                  py: 1.5,
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                    boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                View Location
              </Button>
            </Stack>
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
            <Fade in timeout={600}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 900,
                  mb: 1,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Bookings Management
              </Typography>
            </Fade>
            <Fade in timeout={800}>
              <Typography variant="body1" sx={{ color: '#6b7280', fontSize: '1.05rem' }}>
                Manage booking requests and appointments
              </Typography>
            </Fade>
          </Box>

          {/* Tabs */}
          <Slide direction="up" in timeout={800}>
            <Paper 
              sx={{ 
                borderRadius: 3, 
                mb: 4, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    minHeight: 64,
                    color: '#6b7280',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#3b82f6',
                      bgcolor: 'rgba(59, 130, 246, 0.04)',
                    },
                  },
                  '& .Mui-selected': {
                    color: '#3b82f6',
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#3b82f6',
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                  },
                }}
              >
                {tabs.map((tab, index) => (
                  <Tab
                    key={tab}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {tab}
                        <Chip
                          label={bookings.length}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            bgcolor: activeTab === index ? 'rgba(59, 130, 246, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                            color: activeTab === index ? '#3b82f6' : '#6b7280',
                            border: `1px solid ${activeTab === index ? 'rgba(59, 130, 246, 0.3)' : 'rgba(107, 114, 128, 0.2)'}`,
                          }}
                        />
                      </Box>
                    }
                  />
                ))}
              </Tabs>
            </Paper>
          </Slide>

          {/* Booking Cards */}
          {loading ? (
            <Fade in timeout={600}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12 }}>
                <CircularProgress size={60} thickness={4} sx={{ color: '#3b82f6', mb: 3 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#6b7280' }}>
                  Loading bookings...
                </Typography>
              </Box>
            </Fade>
          ) : bookings.length === 0 ? (
            <Fade in timeout={800}>
              <Paper 
                sx={{ 
                  p: 8, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
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
                    margin: '0 auto',
                    mb: 3,
                  }}
                >
                  <Notes sx={{ fontSize: 48, color: '#3b82f6' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#111827' }}>
                  No {tabs[activeTab].toLowerCase()} bookings
                </Typography>
                <Typography variant="body1" sx={{ color: '#6b7280', mb: 4 }}>
                  Bookings will appear here once farmers make requests
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    fontWeight: 700,
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  View All Machines
                </Button>
              </Paper>
            </Fade>
          ) : (
            <Grid container spacing={3}>
              {bookings.map((booking, index) => (
                <Grid item xs={12} md={6} key={booking.id}>
                  <Zoom in timeout={1000 + index * 100} style={{ transitionDelay: `${index * 50}ms` }}>
                    <Box>
                      <BookingCard booking={booking} />
                    </Box>
                  </Zoom>
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
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              }
            }}
          >
            <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', pb: 1 }}>
              Reject Booking Request
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Typography variant="body1" sx={{ mb: 3, color: '#6b7280' }}>
                Please provide a reason for rejecting this booking. This will be shared with the farmer.
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="e.g., Machine not available, under maintenance, etc."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#3b82f6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => setDialogOpen(false)}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 700,
                  color: '#6b7280',
                  px: 3,
                  '&:hover': {
                    bgcolor: 'rgba(107, 114, 128, 0.1)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={confirmReject}
                disabled={!rejectReason.trim()}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 700,
                  px: 3,
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
                  },
                  '&:disabled': {
                    background: 'rgba(107, 114, 128, 0.2)',
                    color: 'rgba(107, 114, 128, 0.5)',
                    boxShadow: 'none',
                  },
                }}
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
