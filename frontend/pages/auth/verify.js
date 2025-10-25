import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { login } from '../../store/features/authSlice';
import { authAPI } from '../../services/api';

export default function VerifyOTP() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { phone, role } = router.query;

  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    if (!phone || !role) {
      router.push('/login');
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [phone, role, router]);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.verifyOTP(phone, otp, role);
      dispatch(login(response));
      
      // Redirect based on role
      if (role === 'farmer') {
        router.push('/');
      } else if (role === 'owner') {
        router.push('/owner/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      await authAPI.sendOTP(phone, role);
      setResendTimer(30);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && otp.length === 6) {
      handleVerifyOTP();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(17,24,39,0.8) 100%)',
          zIndex: 0,
        },
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 500,
          mx: 2,
          borderRadius: 4,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(40px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <CardContent sx={{ p: 5 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            {/* Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 3,
                bgcolor: 'rgba(17, 24, 39, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Typography variant="h2" sx={{ fontSize: '2.5rem' }}>
                📱
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#111827',
                mb: 1.5,
                letterSpacing: '-0.5px',
              }}
            >
              Verify OTP
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280', fontWeight: 500, mb: 0.5 }}>
              We've sent a 6-digit code to
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
              +91 {phone}
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2.5,
                bgcolor: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                '& .MuiAlert-icon': {
                  color: '#dc2626',
                },
              }}
            >
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
            onKeyPress={handleKeyPress}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                bgcolor: 'rgba(249, 250, 251, 0.8)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#9ca3af',
                  },
                },
                '&.Mui-focused': {
                  bgcolor: 'white',
                  boxShadow: '0 0 0 3px rgba(17, 24, 39, 0.1)',
                },
              },
            }}
            disabled={loading}
            placeholder="000000"
            inputProps={{
              style: {
                textAlign: 'center',
                fontSize: '2rem',
                letterSpacing: '0.8rem',
                fontWeight: 700,
                fontFamily: 'monospace',
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleVerifyOTP}
            disabled={loading || otp.length !== 6}
            sx={{
              py: 2,
              bgcolor: '#111827',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              borderRadius: 2.5,
              boxShadow: '0 10px 25px rgba(17, 24, 39, 0.3)',
              mb: 2.5,
              '&:hover': {
                bgcolor: '#000000',
                boxShadow: '0 15px 35px rgba(17, 24, 39, 0.4)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&:disabled': {
                bgcolor: '#e5e7eb',
                color: '#9ca3af',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Verify & Continue'}
          </Button>

          <Box 
            sx={{ 
              textAlign: 'center',
              p: 2.5,
              bgcolor: 'rgba(243, 244, 246, 0.6)',
              borderRadius: 2.5,
              border: '1px solid rgba(229, 231, 235, 0.8)',
              backdropFilter: 'blur(10px)',
              mb: 2,
            }}
          >
            {resendTimer > 0 ? (
              <Box>
                <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, mb: 0.5 }}>
                  Didn't receive the code?
                </Typography>
                <Typography variant="body2" sx={{ color: '#111827', fontWeight: 700, fontFamily: 'monospace' }}>
                  Resend in {resendTimer}s
                </Typography>
              </Box>
            ) : (
              <Button
                variant="text"
                onClick={handleResendOTP}
                disabled={loading}
                sx={{
                  fontWeight: 600,
                  color: '#111827',
                  textTransform: 'none',
                  fontSize: '0.938rem',
                  '&:hover': {
                    bgcolor: 'rgba(17, 24, 39, 0.05)',
                  },
                }}
              >
                🔄 Resend OTP
              </Button>
            )}
          </Box>

          <Button
            fullWidth
            variant="text"
            onClick={() => router.push('/login')}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: '#6b7280',
              py: 1.5,
              borderRadius: 2.5,
              '&:hover': {
                bgcolor: 'rgba(107, 114, 128, 0.1)',
                color: '#111827',
              },
            }}
          >
            ← Back to Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
