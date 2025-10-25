import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Card,
  CardContent,
  IconButton,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  Edit,
  PhotoCamera,
  LocationOn,
  Phone,
  Email,
  Business,
  Save,
  Notifications,
  Security,
  Language,
  CheckCircle,
  AccountBalance,
  VerifiedUser,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import AuthGuard from '../../components/AuthGuard';
import OwnerLayout from '../../components/owner/OwnerLayout';

function OwnerProfile() {
  const { user } = useSelector((state) => state.auth);
  
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'CHC Punjab Owner',
    phone: user?.phone || '+91 98765 43210',
    email: user?.email || 'owner@chcpunjab.com',
    businessName: 'CHC Punjab - Agricultural Services',
    gstNumber: '03AABCU9603R1ZM',
    address: 'Village Khanna, District Ludhiana, Punjab - 141401',
    description: 'Premium agricultural machinery rental services across Punjab region with 15+ years of experience.',
  });

  const [bankDetails, setBankDetails] = useState({
    bankName: 'State Bank of India',
    accountNumber: '1234567890',
    ifsc: 'SBIN0001234',
    accountHolder: 'CHC Punjab',
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    bookingAlerts: true,
    paymentAlerts: true,
  });

  const handleSave = () => {
    // Save profile data
    setEditMode(false);
  };

  return (
    <AuthGuard allowedRoles={['owner']}>
      <OwnerLayout>
        <Box>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Profile Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your account information and preferences
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Left Column - Profile Info */}
            <Grid item xs={12} md={8}>
              {/* Profile Header */}
              <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'start', gap: 3, mb: 3 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        fontSize: '3rem',
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    >
                      {profileData.name[0]}
                    </Avatar>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'white',
                        border: '3px solid #f8fafc',
                        '&:hover': { bgcolor: 'white' },
                      }}
                    >
                      <PhotoCamera fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        {profileData.name}
                      </Typography>
                      <Chip
                        icon={<VerifiedUser />}
                        label="Verified"
                        size="small"
                        color="success"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {profileData.businessName}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Chip icon={<CheckCircle />} label="15 Machines" size="small" />
                      <Chip icon={<CheckCircle />} label="234 Bookings" size="small" />
                      <Chip icon={<CheckCircle />} label="4.8 Rating" size="small" />
                    </Box>
                  </Box>
                  <Button
                    variant={editMode ? 'contained' : 'outlined'}
                    startIcon={editMode ? <Save /> : <Edit />}
                    onClick={() => (editMode ? handleSave() : setEditMode(true))}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      ...(editMode && {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }),
                    }}
                  >
                    {editMode ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Profile Fields */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="GST Number"
                      value={profileData.gstNumber}
                      onChange={(e) => setProfileData({ ...profileData, gstNumber: e.target.value })}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Business Name"
                      value={profileData.businessName}
                      onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      multiline
                      rows={2}
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Business Description"
                      multiline
                      rows={3}
                      value={profileData.description}
                      onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                      disabled={!editMode}
                      placeholder="Tell farmers about your services..."
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Bank Details */}
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      Bank Account Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      For receiving payments from bookings
                    </Typography>
                  </Box>
                  <Chip
                    icon={<CheckCircle />}
                    label="Verified"
                    color="success"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bank Name"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: <AccountBalance sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Account Number"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="IFSC Code"
                      value={bankDetails.ifsc}
                      onChange={(e) => setBankDetails({ ...bankDetails, ifsc: e.target.value })}
                      disabled={!editMode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Account Holder Name"
                      value={bankDetails.accountHolder}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                      disabled={!editMode}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Right Column - Settings & Stats */}
            <Grid item xs={12} md={4}>
              {/* Notification Settings */}
              <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Notifications sx={{ color: '#667eea' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Notifications
                  </Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Email Notifications"
                      secondary="Receive booking updates via email"
                    />
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) =>
                        setSettings({ ...settings, emailNotifications: e.target.checked })
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="SMS Alerts"
                      secondary="Get SMS for urgent updates"
                    />
                    <Switch
                      checked={settings.smsNotifications}
                      onChange={(e) =>
                        setSettings({ ...settings, smsNotifications: e.target.checked })
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Booking Alerts"
                      secondary="New booking request notifications"
                    />
                    <Switch
                      checked={settings.bookingAlerts}
                      onChange={(e) =>
                        setSettings({ ...settings, bookingAlerts: e.target.checked })
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Payment Alerts"
                      secondary="Payment received notifications"
                    />
                    <Switch
                      checked={settings.paymentAlerts}
                      onChange={(e) =>
                        setSettings({ ...settings, paymentAlerts: e.target.checked })
                      }
                    />
                  </ListItem>
                </List>
              </Paper>

              {/* Account Stats */}
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Account Statistics
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Member Since
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      January 2024
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Total Machines
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      15 Machines
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Completed Bookings
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      234 Bookings
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Average Rating
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                      ⭐ 4.8 / 5.0
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </OwnerLayout>
    </AuthGuard>
  );
}

export default OwnerProfile;
