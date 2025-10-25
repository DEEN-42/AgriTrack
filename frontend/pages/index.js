import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Slider,
  Button,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  FilterList,
  ViewModule,
  ViewList,
  Logout,
  CalendarMonth,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/features/authSlice';
import { farmerAPI } from '../services/api';
import AuthGuard from '../components/AuthGuard';

// Dynamic import for Google Maps to avoid SSR issues
const GoogleMapComponent = dynamic(
  () => import('../components/farmer/MachineMap'),
  { ssr: false, loading: () => <CircularProgress /> }
);

const machineTypes = ['Happy Seeder', 'Rotavator', 'Mulcher', 'Baler', 'Planter'];

function FarmerHome() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [anchorEl, setAnchorEl] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadMachines();
    }
  }, [selectedTypes, priceRange, mounted]);

  const loadMachines = async () => {
    setLoading(true);
    try {
      const response = await farmerAPI.getMachines({
        types: selectedTypes,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      });
      setMachines(response.machines);
    } catch (error) {
      console.error('Failed to load machines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const filteredMachines = machines.filter((machine) =>
    machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    machine.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    machine.location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) {
    return null;
  }

  return (
    <AuthGuard allowedRoles={['farmer']}>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        {/* Top Navigation */}
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb' }}>
          <Toolbar sx={{ py: 1 }}>
            <Typography
              variant="h5"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                color: '#111827',
                letterSpacing: '-0.5px',
              }}
            >
              FieldSync
            </Typography>

            <Button
              startIcon={<CalendarMonth />}
              onClick={() => router.push('/bookings')}
              sx={{ 
                mr: 2, 
                textTransform: 'none',
                color: '#374151',
                fontWeight: 500,
              }}
            >
              My Bookings
            </Button>

            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: '#111827', fontWeight: 600 }}>
                {user?.name?.[0] || 'F'}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem disabled>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user?.name || 'Farmer'}
                </Typography>
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="caption" color="text.secondary">
                  {user?.phone}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <Logout fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Filters Sidebar */}
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 80, border: '1px solid #e5e7eb' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#111827' }}>
                  Filters
                </Typography>

                {/* Machine Type Filter */}
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: '#374151', fontSize: '0.875rem' }}>
                  MACHINE TYPE
                </Typography>
                <FormGroup sx={{ mb: 3 }}>
                  {machineTypes.map((type) => (
                    <FormControlLabel
                      key={type}
                      control={
                        <Checkbox
                          checked={selectedTypes.includes(type)}
                          onChange={() => handleTypeChange(type)}
                          sx={{
                            color: '#9ca3af',
                            '&.Mui-checked': { color: '#111827' },
                          }}
                        />
                      }
                      label={<Typography variant="body2" sx={{ color: '#374151' }}>{type}</Typography>}
                    />
                  ))}
                </FormGroup>

                <Divider sx={{ my: 3 }} />

                {/* Price Range Filter */}
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: '#374151', fontSize: '0.875rem' }}>
                  PRICE RANGE (₹/HOUR)
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={(e, newValue) => setPriceRange(newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={2000}
                  step={50}
                  sx={{
                    color: '#111827',
                    mb: 1,
                    '& .MuiSlider-thumb': {
                      width: 20,
                      height: 20,
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>₹{priceRange[0]}</Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>₹{priceRange[1]}</Typography>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ 
                    textTransform: 'none',
                    borderColor: '#d1d5db',
                    color: '#374151',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#111827',
                      bgcolor: '#f9fafb',
                    },
                  }}
                  onClick={() => {
                    setSelectedTypes([]);
                    setPriceRange([0, 2000]);
                  }}
                >
                  Reset Filters
                </Button>
              </Paper>
            </Grid>

            {/* Main Content Area */}
            <Grid item xs={12} md={9}>
              {/* Search Bar */}
              <Paper sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #e5e7eb' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    placeholder="Search machines, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: '#9ca3af' }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { border: 'none' },
                      },
                      '& input': {
                        fontSize: '0.95rem',
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 0.5, borderLeft: '1px solid #e5e7eb', pl: 2 }}>
                    <IconButton
                      onClick={() => setViewMode('grid')}
                      size="small"
                      sx={{
                        bgcolor: viewMode === 'grid' ? '#111827' : 'transparent',
                        color: viewMode === 'grid' ? 'white' : '#6b7280',
                        borderRadius: 1,
                        '&:hover': { 
                          bgcolor: viewMode === 'grid' ? '#111827' : '#f3f4f6',
                        },
                      }}
                    >
                      <ViewModule fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => setViewMode('map')}
                      size="small"
                      sx={{
                        bgcolor: viewMode === 'map' ? '#111827' : 'transparent',
                        color: viewMode === 'map' ? 'white' : '#6b7280',
                        borderRadius: 1,
                        '&:hover': { 
                          bgcolor: viewMode === 'map' ? '#111827' : '#f3f4f6',
                        },
                      }}
                    >
                      <ViewList fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>

              {/* Results */}
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress size={60} />
                </Box>
              ) : viewMode === 'grid' ? (
                <Grid container spacing={3}>
                  {filteredMachines.map((machine) => (
                    <Grid item xs={12} sm={6} lg={4} key={machine.id}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          overflow: 'hidden',
                          border: '1px solid #e5e7eb',
                          bgcolor: 'white',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                            borderColor: '#d1d5db',
                          },
                        }}
                        onClick={() => router.push(`/machine/${machine.id}`)}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={machine.image}
                            alt={machine.name}
                            sx={{ 
                              bgcolor: '#f9fafb',
                              objectFit: 'cover',
                            }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=Machine+Image';
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                            }}
                          >
                            {machine.available ? (
                              <Chip 
                                label="Available" 
                                size="small" 
                                sx={{ 
                                  bgcolor: '#059669',
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                  height: 24,
                                }}
                              />
                            ) : (
                              <Chip 
                                label="Booked" 
                                size="small" 
                                sx={{ 
                                  bgcolor: '#dc2626',
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                  height: 24,
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#111827', fontSize: '1.1rem' }}>
                            {machine.name}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2, color: '#6b7280', fontSize: '0.875rem' }}>
                            {machine.type}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Rating value={machine.rating} precision={0.1} size="small" readOnly sx={{ color: '#f59e0b' }} />
                            <Typography variant="caption" sx={{ ml: 1, fontWeight: 500, color: '#6b7280' }}>
                              {machine.rating.toFixed(1)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ mb: 3, color: '#6b7280', fontSize: '0.875rem' }}>
                            📍 {machine.location.address}
                          </Typography>
                          <Divider sx={{ mb: 2.5 }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 500 }}>
                                Starting from
                              </Typography>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', letterSpacing: '-0.5px' }}>
                                ₹{machine.price}
                                <Typography component="span" variant="body2" sx={{ fontWeight: 400, color: '#6b7280' }}>
                                  /hr
                                </Typography>
                              </Typography>
                            </Box>
                            <Button
                              size="medium"
                              variant="contained"
                              sx={{
                                bgcolor: '#111827',
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                py: 1,
                                borderRadius: 1.5,
                                fontSize: '0.875rem',
                                '&:hover': {
                                  bgcolor: '#000000',
                                },
                              }}
                            >
                              Book Now
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper sx={{ p: 0, height: 600, borderRadius: 3, overflow: 'hidden' }}>
                  <GoogleMapComponent machines={filteredMachines} />
                </Paper>
              )}

              {!loading && filteredMachines.length === 0 && (
                <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
                  <Typography variant="h6" color="text.secondary">
                    No machines found matching your criteria
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </AuthGuard>
  );
}

export default FarmerHome;
