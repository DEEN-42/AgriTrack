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
} from '@mui/icons-material';
import Link from 'next/link';
import { login } from '../store/features/authSlice';
import { authAPI } from '../services/api';

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
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

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
  }
`;

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, role: userRole } = useSelector((state) => state.auth);
  
  const [tabValue, setTabValue] = useState(0);
  const [role, setRole] = useState('farmer');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      
      if (response.success && response.token && response.user) {
        dispatch(login({
          token: response.token,
          user: response.user,
          role: response.role || 'admin',
        }));
        
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
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
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
          opacity: 0.15,
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          animation: `${float} 6s ease-in-out infinite`,
          zIndex: 0,
        },
      }}
    >
      {/* Animated Background Particles */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {[...Array(30)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              borderRadius: '50%',
              bgcolor: i % 3 === 0 ? 'rgba(59, 130, 246, 0.4)' : i % 3 === 1 ? 'rgba(147, 197, 253, 0.3)' : 'rgba(96, 165, 250, 0.35)',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `${pulse} ${Math.random() * 4 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
              boxShadow: '0 0 10px currentColor',
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Left Side - Branding */}
          <Fade in timeout={800}>
            <Box 
              sx={{ 
                flex: 1, 
                minWidth: 300, 
                maxWidth: 500, 
                color: 'white', 
                display: { xs: 'none', md: 'block' },
                animation: `${slideInLeft} 0.8s ease-out`,
              }}
            >
              {/* Logo/Title */}
              <Box sx={{ mb: 4 }}>
                <Box 
                  sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 3,
                    p: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Agriculture sx={{ fontSize: 40, color: '#3b82f6' }} />
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: '-1.5px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    AgriTrack
                  </Typography>
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    letterSpacing: '-0.5px',
                    lineHeight: 1.2,
                  }}
                >
                  Your Gateway to Modern
                  <br />
                  Agricultural Solutions
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.85, 
                    fontWeight: 400, 
                    lineHeight: 1.8,
                    fontSize: '1.1rem',
                  }}
                >
                  Connect with the largest network of agricultural machinery. Book equipment, track usage, and grow your farm efficiently.
                </Typography>
              </Box>

              {/* Feature Cards */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {[
                  { icon: '🚜', title: '500+ Machines', desc: 'Wide range of agricultural equipment' },
                  { icon: '📍', title: 'Real-time Tracking', desc: 'Monitor your bookings live' },
                  { icon: '💰', title: 'Secure Payments', desc: 'Multiple payment options available' },
                ].map((feature, index) => (
                  <Zoom in timeout={1000 + index * 200} key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2.5,
                        p: 2.5,
                        borderRadius: 2.5,
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateX(10px)',
                          borderColor: 'rgba(59, 130, 246, 0.5)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.75rem',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.05rem' }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.75, fontSize: '0.9rem' }}>
                          {feature.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </Zoom>
                ))}
              </Box>
            </Box>
          </Fade>

          {/* Right Side - Login Card */}
          <Slide direction="left" in timeout={800}>
            <Box sx={{ flex: 1, minWidth: 300, maxWidth: 500, animation: `${slideInRight} 0.8s ease-out` }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 5,
                  overflow: 'visible',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.1) 100%)',
                  backdropFilter: 'blur(30px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                  boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.35), 0 0 80px rgba(59, 130, 246, 0.15)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
                    opacity: 0.6,
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 197, 253, 0.2))',
                    borderRadius: 5,
                    zIndex: -1,
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                  },
                  '&:hover': {
                    boxShadow: '0 40px 80px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.45), 0 0 120px rgba(59, 130, 246, 0.25)',
                    transform: 'translateY(-10px) scale(1.01)',
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                    '&::after': {
                      opacity: 1,
                    },
                  },
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
                        color: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.9)',
                        },
                      },
                      '& .Mui-selected': {
                        color: 'white',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        boxShadow: '0 8px 16px rgba(59, 130, 246, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(59, 130, 246, 0.5)',
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
                <CardContent sx={{ p: 4.5, pt: 4, bgcolor: 'transparent' }}>
                  {/* Error Alert */}
                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 3,
                        borderRadius: 2,
                        background: 'rgba(239, 68, 68, 0.15)',
                        backdropFilter: 'blur(10px)',
                        color: '#fca5a5',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        animation: `${slideInRight} 0.3s ease`,
                        '& .MuiAlert-icon': {
                          color: '#fca5a5',
                        },
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  {/* Admin Login Form */}
                  {tabValue === 1 ? (
                    <Box component="form" onSubmit={handleAdminLogin}>
                      <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 900, 
                            color: 'white', 
                            mb: 1.5,
                            letterSpacing: '-0.5px',
                            background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          Welcome Back
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.75)',
                            fontSize: '1rem',
                            fontWeight: 500,
                          }}
                        >
                          Sign in to your admin account
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 700, 
                            mb: 2.5, 
                            color: 'rgba(255, 255, 255, 0.9)', 
                            fontSize: '0.875rem', 
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                          }}
                        >
                          Email or Username
                        </Typography>
                        <TextField
                          fullWidth
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              background: 'rgba(255, 255, 255, 0.08)',
                              backdropFilter: 'blur(10px)',
                              color: 'white',
                              fontSize: '1.05rem',
                              fontWeight: 500,
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.25)',
                                borderWidth: 2,
                              },
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.12)',
                                transform: 'translateY(-2px)',
                                '& fieldset': {
                                  borderColor: 'rgba(59, 130, 246, 0.6)',
                                },
                              },
                              '&.Mui-focused': {
                                background: 'rgba(255, 255, 255, 0.15)',
                                boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.25), 0 8px 16px rgba(0, 0, 0, 0.2)',
                                transform: 'translateY(-2px)',
                                '& fieldset': {
                                  borderColor: '#3b82f6',
                                  borderWidth: 2,
                                },
                              },
                            },
                          }}
                          placeholder="Enter your email"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email sx={{ color: '#60a5fa', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                      <Box sx={{ mb: 3.5 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 700, 
                            mb: 2.5, 
                            color: 'rgba(255, 255, 255, 0.9)', 
                            fontSize: '0.875rem', 
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                          }}
                        >
                          Password
                        </Typography>
                        <TextField
                          fullWidth
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={loading}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              background: 'rgba(255, 255, 255, 0.08)',
                              backdropFilter: 'blur(10px)',
                              color: 'white',
                              fontSize: '1.05rem',
                              fontWeight: 500,
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.25)',
                                borderWidth: 2,
                              },
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.12)',
                                transform: 'translateY(-2px)',
                                '& fieldset': {
                                  borderColor: 'rgba(59, 130, 246, 0.6)',
                                },
                              },
                              '&.Mui-focused': {
                                background: 'rgba(255, 255, 255, 0.15)',
                                boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.25), 0 8px 16px rgba(0, 0, 0, 0.2)',
                                transform: 'translateY(-2px)',
                                '& fieldset': {
                                  borderColor: '#3b82f6',
                                  borderWidth: 2,
                                },
                              },
                            },
                          }}
                          placeholder="Enter your password"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock sx={{ color: '#60a5fa', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  size="small"
                                  sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                                >
                                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{
                          py: 2.5,
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          textTransform: 'none',
                          borderRadius: 3,
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: '0 12px 28px rgba(59, 130, 246, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                          border: '1px solid rgba(59, 130, 246, 0.5)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                            transition: 'left 0.5s ease',
                          },
                          '&:hover': {
                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            boxShadow: '0 16px 36px rgba(59, 130, 246, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                            transform: 'translateY(-3px) scale(1.02)',
                            '&::before': {
                              left: '100%',
                            },
                          },
                          '&:active': {
                            transform: 'translateY(-1px) scale(1.01)',
                          },
                          '&:disabled': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.4)',
                            boxShadow: 'none',
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={26} sx={{ color: 'white' }} />
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <span>Sign In</span>
                            <Box
                              component="span"
                              sx={{
                                display: 'inline-flex',
                                fontSize: '1.2rem',
                                animation: `${float} 2s ease-in-out infinite`,
                              }}
                            >
                              →
                            </Box>
                          </Box>
                        )}
                      </Button>
                      
                      <Box 
                        sx={{ 
                          mt: 3, 
                          p: 2.5, 
                          background: 'rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: 2.5, 
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                        }}
                      >
                        <Typography variant="caption" sx={{ color: 'white', display: 'block', mb: 1, fontWeight: 600 }}>
                          💡 Demo Credentials
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          Email: admin@agritrack.com
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', display: 'block', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          Password: admin123
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    // Farmer/Owner Login Form
                    <Box>
                      <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 900, 
                            color: 'white', 
                            mb: 1.5,
                            letterSpacing: '-0.5px',
                            background: 'linear-gradient(135deg, #ffffff 0%, #93c5fd 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
                          }}
                        >
                          Get Started
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.75)',
                            fontSize: '1rem',
                            fontWeight: 500,
                          }}
                        >
                          Book agricultural machinery in seconds
                        </Typography>
                      </Box>

                      {/* Role Selection */}
                      <Box sx={{ mb: 3.5 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 700, 
                            mb: 2.5, 
                            color: 'rgba(255, 255, 255, 0.9)', 
                            fontSize: '0.875rem', 
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                          }}
                        >
                          I am a
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                          <Button
                            fullWidth
                            variant={role === 'farmer' ? 'contained' : 'outlined'}
                            onClick={() => setRole('farmer')}
                            sx={{
                              py: 3,
                              textTransform: 'none',
                              fontWeight: 700,
                              fontSize: '1rem',
                              borderRadius: 3,
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              position: 'relative',
                              overflow: 'hidden',
                              ...(role === 'farmer' && {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                color: 'white',
                                boxShadow: '0 10px 20px rgba(59, 130, 246, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                                border: '1px solid rgba(59, 130, 246, 0.5)',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  top: 0,
                                  left: '-100%',
                                  width: '100%',
                                  height: '100%',
                                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                                  transition: 'left 0.5s ease',
                                },
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                  transform: 'translateY(-3px) scale(1.02)',
                                  boxShadow: '0 15px 30px rgba(59, 130, 246, 0.5)',
                                  '&::before': {
                                    left: '100%',
                                  },
                                },
                              }),
                              ...(role !== 'farmer' && {
                                borderColor: 'rgba(255, 255, 255, 0.25)',
                                color: 'rgba(255, 255, 255, 0.7)',
                                borderWidth: 2,
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                  background: 'rgba(255, 255, 255, 0.12)',
                                  borderColor: 'rgba(59, 130, 246, 0.6)',
                                  color: 'white',
                                  transform: 'translateY(-3px) scale(1.02)',
                                  boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
                                },
                              }),
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <span style={{ fontSize: '1.25rem' }}>🌾</span>
                              <span>Farmer</span>
                            </Box>
                          </Button>
                          <Button
                            fullWidth
                            variant={role === 'owner' ? 'contained' : 'outlined'}
                            onClick={() => setRole('owner')}
                            sx={{
                              py: 3,
                              textTransform: 'none',
                              fontWeight: 700,
                              fontSize: '1rem',
                              borderRadius: 3,
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              position: 'relative',
                              overflow: 'hidden',
                              ...(role === 'owner' && {
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                color: 'white',
                                boxShadow: '0 10px 20px rgba(59, 130, 246, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                                border: '1px solid rgba(59, 130, 246, 0.5)',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  top: 0,
                                  left: '-100%',
                                  width: '100%',
                                  height: '100%',
                                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                                  transition: 'left 0.5s ease',
                                },
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                  transform: 'translateY(-3px) scale(1.02)',
                                  boxShadow: '0 15px 30px rgba(59, 130, 246, 0.5)',
                                  '&::before': {
                                    left: '100%',
                                  },
                                },
                              }),
                              ...(role !== 'owner' && {
                                borderColor: 'rgba(255, 255, 255, 0.25)',
                                color: 'rgba(255, 255, 255, 0.7)',
                                borderWidth: 2,
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                  background: 'rgba(255, 255, 255, 0.12)',
                                  borderColor: 'rgba(59, 130, 246, 0.6)',
                                  color: 'white',
                                  transform: 'translateY(-3px) scale(1.02)',
                                  boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
                                },
                              }),
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <span style={{ fontSize: '1.25rem' }}>🏢</span>
                              <span>Owner</span>
                            </Box>
                          </Button>
                        </Box>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 700, 
                            mb: 2.5, 
                            color: 'rgba(255, 255, 255, 0.9)', 
                            fontSize: '0.875rem', 
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                          }}
                        >
                          Phone Number
                        </Typography>
                        <TextField
                          fullWidth
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          disabled={loading}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              background: 'rgba(255, 255, 255, 0.08)',
                              backdropFilter: 'blur(10px)',
                              color: 'white',
                              fontSize: '1.05rem',
                              fontWeight: 500,
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '& fieldset': {
                                borderColor: 'rgba(255, 255, 255, 0.25)',
                                borderWidth: 2,
                              },
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.12)',
                                transform: 'translateY(-2px)',
                                '& fieldset': {
                                  borderColor: 'rgba(59, 130, 246, 0.6)',
                                },
                              },
                              '&.Mui-focused': {
                                background: 'rgba(255, 255, 255, 0.15)',
                                boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.25), 0 8px 16px rgba(0, 0, 0, 0.2)',
                                transform: 'translateY(-2px)',
                                '& fieldset': {
                                  borderColor: '#3b82f6',
                                  borderWidth: 2,
                                },
                              },
                            },
                            '& input::placeholder': {
                              color: 'rgba(255, 255, 255, 0.4)',
                              opacity: 1,
                            },
                          }}
                          placeholder="Enter 10-digit mobile number"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 1.5,
                                    py: 0.75,
                                    borderRadius: 2,
                                    background: 'rgba(59, 130, 246, 0.15)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                  }}
                                >
                                  <Phone sx={{ color: '#60a5fa', fontSize: 20 }} />
                                  <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>
                                    +91
                                  </Typography>
                                </Box>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleSendOTP}
                        disabled={loading}
                        sx={{
                          py: 2.5,
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          textTransform: 'none',
                          borderRadius: 3,
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: '0 12px 28px rgba(59, 130, 246, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                          border: '1px solid rgba(59, 130, 246, 0.5)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                            transition: 'left 0.5s ease',
                          },
                          '&:hover': {
                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            boxShadow: '0 16px 36px rgba(59, 130, 246, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                            transform: 'translateY(-3px) scale(1.02)',
                            '&::before': {
                              left: '100%',
                            },
                          },
                          '&:active': {
                            transform: 'translateY(-1px) scale(1.01)',
                          },
                          '&:disabled': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.4)',
                            boxShadow: 'none',
                          },
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={26} sx={{ color: 'white' }} />
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <span>Send OTP</span>
                            <Box
                              component="span"
                              sx={{
                                display: 'inline-flex',
                                fontSize: '1.2rem',
                                animation: `${float} 2s ease-in-out infinite`,
                              }}
                            >
                              →
                            </Box>
                          </Box>
                        )}
                      </Button>

                      {/* Signup Links */}
                      <Divider sx={{ my: 3.5, borderColor: 'rgba(255, 255, 255, 0.15)' }} />
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1.5, fontWeight: 500 }}>
                          Don't have an account?
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                          {role === 'farmer' && (
                            <Link href="/auth/farmer-signup" passHref legacyBehavior>
                              <MuiLink
                                sx={{
                                  fontWeight: 600,
                                  color: '#60a5fa',
                                  textDecoration: 'none',
                                  fontSize: '0.875rem',
                                  transition: 'all 0.2s ease',
                                  '&:hover': { 
                                    color: '#93c5fd',
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
                                  color: '#60a5fa',
                                  textDecoration: 'none',
                                  fontSize: '0.875rem',
                                  transition: 'all 0.2s ease',
                                  '&:hover': { 
                                    color: '#93c5fd',
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

              {/* Footer */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  © 2025 AgriTrack CRM. All rights reserved.
                </Typography>
              </Box>
            </Box>
          </Slide>
        </Box>
      </Container>
    </Box>
  );
}
