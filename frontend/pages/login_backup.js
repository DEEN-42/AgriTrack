import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Alert,
  CircularProgress,
  Divider,
  Container,
  Fade,
  Slide,
  Zoom,
  keyframes,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Phone,
  Email,
  Lock,
  Agriculture,
  TrendingUp,
  Security,
} from '@mui/icons-material';
import Link from 'next/link';
import { login } from '../store/features/authSlice';
import { authAPI } from '../services/api';

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, role: userRole } = useSelector((state) => state.auth);
  
  const [tabValue, setTabValue] = useState(0); // 0: Farmer/Owner, 1: Admin
  const [role, setRole] = useState('farmer'); // farmer or owner
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && userRole) {
      if (userRole === 'farmer') {
        router.push('/');
      } else if (userRole === 'owner') {
        router.push('/owner/dashboard');
      } else if (userRole === 'admin') {
        router.push('/admin/dashboard');
      }
    }
  }, [isAuthenticated, userRole, router]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await authAPI.sendOTP(phone, role);
      // Navigate to OTP verification page
      router.push(`/auth/verify?phone=${phone}&role=${role}`);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.adminLogin(email, password);
      
      // Ensure we have the correct data structure
      if (response.success && response.token && response.user) {
        dispatch(login({
          token: response.token,
          user: response.user,
          role: response.role || 'admin',
        }));
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 100);
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Use password: admin123');
    } finally {
      setLoading(false);
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
          filter: 'brightness(0.6)',
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
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Left Side - Branding */}
          <Box sx={{ flex: 1, minWidth: 300, maxWidth: 500, color: 'white', display: { xs: 'none', md: 'block' } }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                letterSpacing: '-1px',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              Welcome to
              <br />
              AgriTrack CRM
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400, lineHeight: 1.6 }}>
              Modern agricultural machinery rental platform connecting farmers with equipment owners
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6">🚜</Typography>
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Book Equipment
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Access to 500+ agricultural machines
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6">📍</Typography>
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Real-time Tracking
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Track your booked machines live
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6">💰</Typography>
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Secure Payments
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Multiple payment options available
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Login Card */}
          <Box sx={{ flex: 1, minWidth: 300, maxWidth: 500 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(40px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Tabs */}
              <Box 
                sx={{ 
                  bgcolor: 'transparent',
                  pt: 3,
                  px: 3,
                }}
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    minHeight: 48,
                    '& .MuiTabs-flexContainer': {
                      gap: 1,
                    },
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.938rem',
                      minHeight: 48,
                      color: '#6b7280',
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(17, 24, 39, 0.05)',
                      },
                    },
                    '& .Mui-selected': {
                      color: 'white',
                      bgcolor: '#111827',
                      boxShadow: '0 4px 12px rgba(17, 24, 39, 0.3)',
                    },
                    '& .MuiTabs-indicator': {
                      display: 'none',
                    },
                  }}
                >
                  <Tab label="🌾 Farmer / Owner" />
                  <Tab label="👨‍💼 Admin" />
                </Tabs>
              </Box>

          {/* Form Content */}
          <CardContent sx={{ p: 4, pt: 3, bgcolor: 'transparent' }}>
            {/* Error Alert */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
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

            {/* Admin Login Form */}
            {tabValue === 1 ? (
              <Box component="form" onSubmit={handleAdminLogin}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
                    Welcome Back
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Sign in to your admin account
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  label="Email or Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  sx={{ 
                    mb: 2.5,
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#9ca3af', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#9ca3af', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 2,
                    bgcolor: '#111827',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: 2.5,
                    boxShadow: '0 10px 25px rgba(17, 24, 39, 0.3)',
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
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
                </Button>
                
                <Box 
                  sx={{ 
                    mt: 3, 
                    p: 2.5, 
                    bgcolor: 'rgba(243, 244, 246, 0.6)', 
                    borderRadius: 2.5, 
                    border: '1px solid rgba(229, 231, 235, 0.8)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#111827', display: 'block', mb: 1, fontWeight: 600 }}>
                    💡 Demo Credentials
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    Email: admin@agritrack.com
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    Password: admin123
                  </Typography>
                </Box>
              </Box>
            ) : (
              // Farmer/Owner Login Form
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
                    Get Started
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Book agricultural machinery in seconds
                  </Typography>
                </Box>

                {/* Role Selection */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#374151', fontSize: '0.813rem', letterSpacing: '0.5px' }}>
                    I AM A
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Button
                      fullWidth
                      variant={role === 'farmer' ? 'contained' : 'outlined'}
                      onClick={() => setRole('farmer')}
                      sx={{
                        py: 2.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.938rem',
                        borderRadius: 2.5,
                        transition: 'all 0.2s ease',
                        ...(role === 'farmer' && {
                          bgcolor: '#111827',
                          color: 'white',
                          boxShadow: '0 10px 25px rgba(17, 24, 39, 0.3)',
                          '&:hover': {
                            bgcolor: '#000000',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 15px 35px rgba(17, 24, 39, 0.4)',
                          },
                        }),
                        ...(role !== 'farmer' && {
                          borderColor: '#d1d5db',
                          color: '#374151',
                          borderWidth: 2,
                          bgcolor: 'rgba(249, 250, 251, 0.5)',
                          '&:hover': {
                            bgcolor: 'rgba(249, 250, 251, 0.9)',
                            borderColor: '#9ca3af',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          },
                        }),
                      }}
                    >
                      🌾 Farmer
                    </Button>
                    <Button
                      fullWidth
                      variant={role === 'owner' ? 'contained' : 'outlined'}
                      onClick={() => setRole('owner')}
                      sx={{
                        py: 2.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.938rem',
                        borderRadius: 2.5,
                        transition: 'all 0.2s ease',
                        ...(role === 'owner' && {
                          bgcolor: '#111827',
                          color: 'white',
                          boxShadow: '0 10px 25px rgba(17, 24, 39, 0.3)',
                          '&:hover': {
                            bgcolor: '#000000',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 15px 35px rgba(17, 24, 39, 0.4)',
                          },
                        }),
                        ...(role !== 'owner' && {
                          borderColor: '#d1d5db',
                          color: '#374151',
                          borderWidth: 2,
                          bgcolor: 'rgba(249, 250, 251, 0.5)',
                          '&:hover': {
                            bgcolor: 'rgba(249, 250, 251, 0.9)',
                            borderColor: '#9ca3af',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          },
                        }),
                      }}
                    >
                      🏢 Owner
                    </Button>
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  disabled={loading}
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
                  placeholder="Enter 10-digit mobile number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: '#9ca3af', fontSize: 20, mr: 0.5 }} />
                        <Typography sx={{ color: '#6b7280', fontWeight: 600, fontSize: '0.938rem' }}>
                          +91
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSendOTP}
                  disabled={loading}
                  sx={{
                    py: 2,
                    bgcolor: '#111827',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: 2.5,
                    boxShadow: '0 10px 25px rgba(17, 24, 39, 0.3)',
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
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send OTP'}
                </Button>

                {/* Signup Links */}
                <Divider sx={{ my: 3.5 }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', mb: 1.5, fontWeight: 500 }}>
                    Don't have an account?
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {role === 'farmer' && (
                      <Link href="/auth/farmer-signup" passHref legacyBehavior>
                        <MuiLink
                          sx={{
                            fontWeight: 600,
                            color: '#111827',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            '&:hover': { 
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          Sign up as Farmer →
                        </MuiLink>
                      </Link>
                    )}
                    {role === 'owner' && (
                      <Link href="/auth/owner-signup" passHref legacyBehavior>
                        <MuiLink
                          sx={{
                            fontWeight: 600,
                            color: '#111827',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            '&:hover': { 
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          Register as Owner →
                        </MuiLink>
                      </Link>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
        </Box>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            © 2025 AgriTrack CRM. All rights reserved.
          </Typography>
        </Box>
        </Box>
      </Container>
    </Box>
  );
}
