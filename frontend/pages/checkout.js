import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  CreditCard,
  AccountBalance,
  Phone as PhoneIcon,
  LocationOn,
  CalendarMonth,
  Schedule,
  Engineering,
} from '@mui/icons-material';
import { format } from 'date-fns';
import AuthGuard from '../components/AuthGuard';
import { farmerAPI } from '../services/api';

const steps = ['Review Booking', 'Payment', 'Confirmation'];

function Checkout() {
  const router = useRouter();
  const {
    machineId,
    machineName,
    machineImage,
    date,
    time,
    duration,
    pricePerHour,
    totalPrice,
    ownerName,
  } = router.query;

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    landmark: '',
    pincode: '',
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      // Validate farmer details
      if (!formData.name || !formData.phone || !formData.address) {
        alert('Please fill all required fields');
        return;
      }
      setActiveStep(1);
    } else if (activeStep === 1) {
      // Process payment
      setLoading(true);
      try {
        const bookingData = {
          machineId,
          date,
          time,
          duration,
          totalPrice,
          farmerDetails: {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            landmark: formData.landmark,
            pincode: formData.pincode,
          },
          paymentMethod,
        };

        const response = await farmerAPI.createBooking(bookingData);
        
        if (response.success) {
          setBookingConfirmed(true);
          setActiveStep(2);
        }
      } catch (error) {
        console.error('Booking failed:', error);
        alert('Booking failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (activeStep === 2) {
      // Go to bookings page
      router.push('/bookings');
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    } else {
      router.back();
    }
  };

  return (
    <AuthGuard allowedRoles={['farmer']}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 4 }}>
        {/* Header */}
        <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb' }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBack}
              sx={{ 
                mb: 2.5, 
                textTransform: 'none', 
                fontWeight: 500,
                color: '#374151',
                '&:hover': {
                  bgcolor: '#f3f4f6',
                },
              }}
            >
              Back
            </Button>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                color: '#111827',
                letterSpacing: '-0.5px',
              }}
            >
              Complete Your Booking
            </Typography>
          </Box>
        </Box>

        <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
          {/* Stepper */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e5e7eb' }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        '&.Mui-active': {
                          color: '#111827',
                        },
                        '&.Mui-completed': {
                          color: '#111827',
                        },
                      },
                    }}
                  >
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          <Grid container spacing={3}>
            {/* Left Column - Form */}
            <Grid item xs={12} md={8}>
              {activeStep === 0 && (
                <Paper sx={{ p: 4, borderRadius: 2, border: '1px solid #e5e7eb' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#111827' }}>
                    Delivery Details
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name *"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number *"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Complete Address *"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        multiline
                        rows={3}
                        variant="outlined"
                        placeholder="House/Field number, Village, District"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Landmark"
                        value={formData.landmark}
                        onChange={(e) => handleInputChange('landmark', e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Pincode *"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>

                  <Alert severity="info" sx={{ mt: 3 }}>
                    The machine will be delivered to this address at the selected time.
                  </Alert>
                </Paper>
              )}

              {activeStep === 1 && (
                <Paper sx={{ p: 4, borderRadius: 2, border: '1px solid #e5e7eb' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#111827' }}>
                    Payment Method
                  </Typography>

                  <FormControl component="fieldset">
                    <RadioGroup
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <Paper 
                        sx={{ 
                          p: 2.5, 
                          mb: 2, 
                          border: '1px solid',
                          borderColor: paymentMethod === 'upi' ? '#111827' : '#e5e7eb',
                          borderRadius: 1.5,
                          cursor: 'pointer',
                          bgcolor: paymentMethod === 'upi' ? '#f9fafb' : 'white',
                          '&:hover': { borderColor: '#9ca3af' },
                        }}
                        onClick={() => setPaymentMethod('upi')}
                      >
                        <FormControlLabel
                          value="upi"
                          control={<Radio sx={{ '&.Mui-checked': { color: '#111827' } }} />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PhoneIcon sx={{ fontSize: 20 }} />
                              <Typography sx={{ fontWeight: 500, fontSize: '0.938rem' }}>UPI / PhonePe / GPay</Typography>
                            </Box>
                          }
                        />
                        {paymentMethod === 'upi' && (
                          <TextField
                            fullWidth
                            label="UPI ID"
                            value={formData.upiId}
                            onChange={(e) => handleInputChange('upiId', e.target.value)}
                            placeholder="yourname@upi"
                            sx={{ mt: 2, ml: 4 }}
                            size="small"
                          />
                        )}
                      </Paper>

                      <Paper 
                        sx={{ 
                          p: 2.5, 
                          mb: 2, 
                          border: '1px solid',
                          borderColor: paymentMethod === 'card' ? '#111827' : '#e5e7eb',
                          borderRadius: 1.5,
                          cursor: 'pointer',
                          bgcolor: paymentMethod === 'card' ? '#f9fafb' : 'white',
                          '&:hover': { borderColor: '#9ca3af' },
                        }}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <FormControlLabel
                          value="card"
                          control={<Radio sx={{ '&.Mui-checked': { color: '#111827' } }} />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CreditCard sx={{ fontSize: 20 }} />
                              <Typography sx={{ fontWeight: 500, fontSize: '0.938rem' }}>Credit / Debit Card</Typography>
                            </Box>
                          }
                        />
                        {paymentMethod === 'card' && (
                          <Grid container spacing={2} sx={{ mt: 1, ml: 4 }}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Card Number"
                                value={formData.cardNumber}
                                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                placeholder="1234 5678 9012 3456"
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                label="Expiry (MM/YY)"
                                value={formData.cardExpiry}
                                onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                                placeholder="12/25"
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                label="CVV"
                                value={formData.cardCvv}
                                onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                                placeholder="123"
                                type="password"
                                size="small"
                              />
                            </Grid>
                          </Grid>
                        )}
                      </Paper>

                      <Paper 
                        sx={{ 
                          p: 2.5, 
                          border: '1px solid',
                          borderColor: paymentMethod === 'cod' ? '#111827' : '#e5e7eb',
                          borderRadius: 1.5,
                          cursor: 'pointer',
                          bgcolor: paymentMethod === 'cod' ? '#f9fafb' : 'white',
                          '&:hover': { borderColor: '#9ca3af' },
                        }}
                        onClick={() => setPaymentMethod('cod')}
                      >
                        <FormControlLabel
                          value="cod"
                          control={<Radio sx={{ '&.Mui-checked': { color: '#111827' } }} />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AccountBalance sx={{ fontSize: 20 }} />
                              <Typography sx={{ fontWeight: 500, fontSize: '0.938rem' }}>Cash on Delivery</Typography>
                            </Box>
                          }
                        />
                      </Paper>
                    </RadioGroup>
                  </FormControl>

                  <Alert severity="success" sx={{ mt: 3 }}>
                    💳 Secure payment powered by Razorpay
                  </Alert>
                </Paper>
              )}

              {activeStep === 2 && (
                <Paper 
                  sx={{ 
                    p: 6, 
                    borderRadius: 2,
                    textAlign: 'center',
                    bgcolor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <CheckCircle 
                    sx={{ 
                      fontSize: 80, 
                      color: '#059669',
                      mb: 2,
                    }} 
                  />
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#111827' }}>
                    Booking Confirmed!
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 4, maxWidth: 500, mx: 'auto', color: '#6b7280' }}>
                    Your booking has been confirmed successfully. The machine owner will contact you shortly.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => router.push('/')}
                      sx={{ 
                        textTransform: 'none', 
                        fontWeight: 600,
                        borderColor: '#d1d5db',
                        color: '#374151',
                        borderRadius: 1.5,
                        px: 3,
                        '&:hover': {
                          borderColor: '#9ca3af',
                          bgcolor: '#f3f4f6',
                        },
                      }}
                    >
                      Book Another Machine
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => router.push('/bookings')}
                      sx={{ 
                        textTransform: 'none', 
                        fontWeight: 600,
                        bgcolor: '#111827',
                        borderRadius: 1.5,
                        px: 3,
                        '&:hover': {
                          bgcolor: '#000000',
                        },
                      }}
                    >
                      View My Bookings
                    </Button>
                  </Box>
                </Paper>
              )}
            </Grid>

            {/* Right Column - Booking Summary */}
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
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#111827' }}>
                  Booking Summary
                </Typography>

                {/* Machine Card */}
                <Card sx={{ mb: 3, borderRadius: 1.5, border: '1px solid #e5e7eb' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={machineImage || 'https://via.placeholder.com/400x300?text=Machine'}
                    alt={machineName}
                    sx={{ objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Machine+Image';
                    }}
                  />
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#111827', fontSize: '1rem' }}>
                      {machineName}
                    </Typography>
                    <Chip 
                      icon={<Engineering />}
                      label={ownerName}
                      size="small"
                      sx={{ fontWeight: 500, bgcolor: '#f3f4f6', color: '#374151', fontSize: '0.813rem' }}
                    />
                  </CardContent>
                </Card>

                {/* Booking Details */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
                    <CalendarMonth sx={{ mr: 1.5, color: '#667eea', mt: 0.3 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {date && format(new Date(date), 'MMMM dd, yyyy')}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
                    <Schedule sx={{ mr: 1.5, color: '#667eea', mt: 0.3 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Time & Duration
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {time} • {duration} hours
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Price Breakdown */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2">
                      ₹{pricePerHour} × {duration} hours
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ₹{totalPrice}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2">Platform Fee</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ₹0
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2">GST (18%)</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ₹{Math.round(totalPrice * 0.18)}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Total Amount
                    </Typography>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      ₹{Math.round(totalPrice * 1.18)}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleNext}
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    bgcolor: '#111827',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: 1.5,
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#000000',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : activeStep === 2 ? (
                    'View My Bookings'
                  ) : activeStep === 1 ? (
                    'Confirm Payment'
                  ) : (
                    'Continue to Payment'
                  )}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </AuthGuard>
  );
}

export default Checkout;
