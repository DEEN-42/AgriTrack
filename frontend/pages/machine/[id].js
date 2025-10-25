import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Rating,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  ImageList,
  ImageListItem,
  Card,
  CardContent,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  LocationOn,
  Star,
  ArrowBack,
  CalendarMonth,
  Schedule,
  CheckCircle,
  Block,
  Phone,
  Engineering,
} from '@mui/icons-material';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import AuthGuard from '../../components/AuthGuard';
import { farmerAPI } from '../../services/api';

const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM',
];

function MachineDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(4);

  useEffect(() => {
    if (id) {
      loadMachineDetails();
    }
  }, [id]);

  const loadMachineDetails = async () => {
    setLoading(true);
    try {
      const response = await farmerAPI.getMachineDetails(id);
      setMachine(response.machine);
    } catch (error) {
      console.error('Failed to load machine:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!selectedTime) {
      alert('Please select a time slot');
      return;
    }
    router.push({
      pathname: '/checkout',
      query: {
        machineId: id,
        machineName: machine.name,
        machineImage: machine.images[0],
        date: selectedDate.toISOString(),
        time: selectedTime,
        duration,
        pricePerHour: machine.price,
        totalPrice: machine.price * duration,
        ownerName: machine.owner.name,
      },
    });
  };
  
  // Check if a slot is booked
  const isSlotBooked = (time) => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return machine?.bookedSlots?.[dateKey]?.includes(time) || false;
  };

  if (loading) {
    return (
      <AuthGuard allowedRoles={['farmer']}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress size={60} />
        </Box>
      </AuthGuard>
    );
  }

  if (!machine) {
    return (
      <AuthGuard allowedRoles={['farmer']}>
        <Box sx={{ p: 3 }}>
          <Typography>Machine not found</Typography>
        </Box>
      </AuthGuard>
    );
  }

  const totalPrice = machine.price * duration;

  return (
    <AuthGuard allowedRoles={['farmer']}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 4 }}>
        {/* Back Button */}
        <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb' }}>
          <Box sx={{ maxWidth: 1400, mx: 'auto', p: 2.5 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.back()}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 500,
                color: '#374151',
                '&:hover': {
                  bgcolor: '#f3f4f6',
                },
              }}
            >
              Back to Machines
            </Button>
          </Box>
        </Box>

        <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
          <Grid container spacing={3}>
            {/* Left Column - Machine Details */}
            <Grid item xs={12} md={8}>
              {/* Image Gallery */}
              <Paper sx={{ p: 0, mb: 3, borderRadius: 2, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <ImageList cols={2} gap={2} sx={{ m: 0, height: 400 }}>
                  {machine.images.map((img, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={img}
                        alt={`${machine.name} ${index + 1}`}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Machine+Image';
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Paper>

              {/* Machine Info */}
              <Paper sx={{ p: 4, borderRadius: 2, mb: 3, border: '1px solid #e5e7eb' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#111827', letterSpacing: '-0.5px' }}>
                      {machine.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        icon={<Engineering />}
                        label={machine.type} 
                        sx={{ 
                          fontWeight: 500,
                          bgcolor: '#f3f4f6',
                          color: '#374151',
                          border: '1px solid #e5e7eb',
                        }} 
                      />
                      <Chip 
                        label={`₹${machine.price}/${machine.priceUnit}`} 
                        sx={{ 
                          fontWeight: 600,
                          bgcolor: '#111827',
                          color: 'white',
                        }}
                      />
                      <Chip 
                        icon={<CheckCircle />}
                        label="Verified" 
                        sx={{ 
                          fontWeight: 500,
                          bgcolor: '#d1fae5',
                          color: '#065f46',
                          border: '1px solid #a7f3d0',
                        }} 
                      />
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Star sx={{ color: '#f59e0b', mr: 0.5, fontSize: 28 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
                        {machine.rating}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                      {machine.reviews} reviews
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Description */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  About this Machine
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {machine.description}
                </Typography>

                {/* Specifications */}
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5, color: '#111827' }}>
                  Specifications
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {Object.entries(machine.specs).map(([key, value]) => (
                    <Grid item xs={6} sm={4} key={key}>
                      <Paper 
                        sx={{ 
                          p: 2.5, 
                          bgcolor: '#f9fafb',
                          borderRadius: 1.5,
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            letterSpacing: '0.5px',
                            color: '#6b7280',
                            fontSize: '0.75rem',
                          }}
                        >
                          {key}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5, color: '#111827' }}>
                          {value}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {/* Location */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Location
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {machine.location.address}
                </Typography>
              </Paper>

              {/* Owner Info */}
              <Paper 
                sx={{ 
                  p: 3.5, 
                  borderRadius: 2,
                  bgcolor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5, color: '#111827' }}>
                  Owner Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Avatar 
                    sx={{ 
                      width: 64, 
                      height: 64, 
                      bgcolor: '#111827',
                      fontSize: '1.5rem',
                      fontWeight: 600,
                    }}
                  >
                    {machine.owner.name[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 0.5 }}>
                      {machine.owner.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ fontSize: 16, color: '#f59e0b' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#6b7280' }}>
                          {machine.owner.rating}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#d1d5db' }}>•</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#6b7280' }}>
                        {machine.owner.machines} Machines
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<Phone />}
                    sx={{
                      bgcolor: '#111827',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      borderRadius: 1.5,
                      '&:hover': {
                        bgcolor: '#000000',
                      },
                    }}
                  >
                    Contact
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Right Column - Booking Widget */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 2,
                  position: 'sticky',
                  top: 20,
                  border: '1px solid #e5e7eb',
                  bgcolor: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    color: '#111827',
                    letterSpacing: '-0.5px',
                  }}
                >
                  Book this Machine
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, color: '#6b7280' }}>
                  Select date and time to book
                </Typography>

                {/* Date Picker */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151', fontSize: '0.875rem' }}>
                    SELECT DATE
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <StaticDatePicker
                      displayStaticWrapperAs="desktop"
                      value={selectedDate}
                      onChange={(newValue) => {
                        setSelectedDate(newValue);
                        setSelectedTime(''); // Reset time when date changes
                      }}
                      renderInput={() => null}
                      minDate={new Date()}
                      sx={{
                        '& .MuiPickersDay-root': {
                          fontWeight: 500,
                          '&.Mui-selected': {
                            bgcolor: '#111827',
                            '&:hover': {
                              bgcolor: '#000000',
                            },
                          },
                        },
                        '& .MuiPickersCalendarHeader-label': {
                          fontWeight: 600,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Time Slot Selection */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151', fontSize: '0.875rem' }}>
                  SELECT TIME SLOT
                </Typography>
                <Alert 
                  severity="warning" 
                  sx={{ 
                    mb: 2, 
                    fontSize: '0.813rem',
                    bgcolor: '#fef3c7',
                    color: '#92400e',
                    border: '1px solid #fde68a',
                    '& .MuiAlert-icon': {
                      color: '#f59e0b',
                    },
                  }}
                >
                  Red slots are already booked
                </Alert>
                <Grid container spacing={1} sx={{ mb: 3 }}>
                  {timeSlots.map((time) => {
                    const isBooked = isSlotBooked(time);
                    const isSelected = selectedTime === time;
                    
                    return (
                      <Grid item xs={6} key={time}>
                        <Tooltip 
                          title={isBooked ? 'Already booked' : 'Available'}
                          arrow
                        >
                          <span>
                            <Button
                              fullWidth
                              variant={isSelected ? 'contained' : 'outlined'}
                              onClick={() => !isBooked && setSelectedTime(time)}
                              disabled={isBooked}
                              sx={{
                                textTransform: 'none',
                                fontWeight: 500,
                                py: 1.2,
                                fontSize: '0.875rem',
                                borderRadius: 1.5,
                                ...(isBooked && {
                                  bgcolor: '#fecaca',
                                  borderColor: '#ef4444',
                                  color: '#991b1b',
                                  fontWeight: 600,
                                  '&:hover': {
                                    bgcolor: '#fca5a5',
                                  },
                                }),
                                ...(isSelected && !isBooked && {
                                  bgcolor: '#111827',
                                  color: 'white',
                                  '&:hover': {
                                    bgcolor: '#000000',
                                  },
                                }),
                                ...(!isSelected && !isBooked && {
                                  borderColor: '#d1d5db',
                                  color: '#374151',
                                  '&:hover': {
                                    bgcolor: '#f3f4f6',
                                    borderColor: '#9ca3af',
                                  },
                                }),
                              }}
                            >
                              {time}
                            </Button>
                          </span>
                        </Tooltip>
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Duration */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#374151', fontSize: '0.875rem' }}>
                  DURATION (HOURS)
                </Typography>
                <Grid container spacing={1} sx={{ mb: 3 }}>
                  {[2, 4, 6, 8].map((hrs) => (
                    <Grid item xs={3} key={hrs}>
                      <Button
                        fullWidth
                        variant={duration === hrs ? 'contained' : 'outlined'}
                        onClick={() => setDuration(hrs)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 1.5,
                          fontSize: '0.875rem',
                          borderRadius: 1.5,
                          ...(duration === hrs && {
                            bgcolor: '#111827',
                            color: 'white',
                            '&:hover': {
                              bgcolor: '#000000',
                            },
                          }),
                          ...(duration !== hrs && {
                            borderColor: '#d1d5db',
                            color: '#374151',
                            '&:hover': {
                              bgcolor: '#f3f4f6',
                              borderColor: '#9ca3af',
                            },
                          }),
                        }}
                      >
                        {hrs}h
                      </Button>
                    </Grid>
                  ))}
                </Grid>

                {/* Price Summary */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Price per hour</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ₹{machine.price}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Duration</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {duration} hours
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Total
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#667eea' }}>
                      ₹{totalPrice}
                    </Typography>
                  </Box>
                </Box>

                {/* Book Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleBooking}
                  disabled={!selectedTime}
                  sx={{
                    py: 2,
                    bgcolor: !selectedTime ? '#e5e7eb' : '#111827',
                    color: !selectedTime ? '#9ca3af' : 'white',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: 1.5,
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: !selectedTime ? '#e5e7eb' : '#000000',
                      boxShadow: 'none',
                    },
                    '&:disabled': {
                      bgcolor: '#f3f4f6',
                      color: '#9ca3af',
                    },
                  }}
                >
                  {!selectedTime ? 'Select Time Slot First' : 'Proceed to Checkout'}
                </Button>
                
                {!selectedTime && (
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mt: 2, 
                      fontSize: '0.813rem',
                      bgcolor: '#e0f2fe',
                      color: '#075985',
                      border: '1px solid #bae6fd',
                      '& .MuiAlert-icon': {
                        color: '#0284c7',
                      },
                    }}
                  >
                    Please select a time slot to proceed
                  </Alert>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </AuthGuard>
  );
}

export default MachineDetails;
