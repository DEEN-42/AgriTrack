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
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  Schedule,
  CheckCircle,
  Search,
  Download,
  Add,
} from '@mui/icons-material';
import AuthGuard from '../../components/AuthGuard';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { ownerAPI } from '../../services/api';

const StatCard = ({ title, value, subtitle, icon, gradient }) => (
  <Card
    sx={{
      background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
      color: 'white',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
      },
    }}
  >
    <CardContent sx={{ position: 'relative', zIndex: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>
            {value}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {subtitle}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: 3,
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

function OwnerPayments() {
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    setLoading(true);
    try {
      const response = await ownerAPI.getPaymentHistory();
      setPaymentData(response);
    } catch (error) {
      console.error('Failed to load payment data:', error);
    } finally {
      setLoading(false);
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

  const filteredPayments = paymentData?.payments?.filter((payment) =>
    payment.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.farmer.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid_out':
        return 'success';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <AuthGuard allowedRoles={['owner']}>
      <OwnerLayout>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                Payments & Earnings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track your revenue and payout status
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              Withdrawal Request
            </Button>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Total Earned"
                value={`₹${(paymentData.summary.totalEarned / 1000).toFixed(0)}K`}
                subtitle="Lifetime earnings"
                icon={<TrendingUp sx={{ fontSize: 32 }} />}
                gradient={['#667eea', '#764ba2']}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Last Payout"
                value={`₹${(paymentData.summary.lastPayout / 1000).toFixed(0)}K`}
                subtitle="Received on Oct 15, 2025"
                icon={<AccountBalance sx={{ fontSize: 32 }} />}
                gradient={['#10b981', '#059669']}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Pending Payout"
                value={`₹${(paymentData.summary.pendingPayout / 1000).toFixed(1)}K`}
                subtitle="Available to withdraw"
                icon={<Schedule sx={{ fontSize: 32 }} />}
                gradient={['#f59e0b', '#d97706']}
              />
            </Grid>
          </Grid>

          {/* Bank Account Section */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Payout Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your bank account for receiving payments
                </Typography>
              </Box>
              <Button
                variant="outlined"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Edit Account
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  Bank Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  State Bank of India
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  Account Number
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  •••• •••• 4567
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  IFSC Code
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  SBIN0001234
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  Account Status
                </Typography>
                <Chip
                  label="Verified"
                  size="small"
                  color="success"
                  icon={<CheckCircle />}
                  sx={{ mt: 0.5 }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Transaction History */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Transaction History
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  size="small"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 250 }}
                />
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Export
                </Button>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Booking ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Farmer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow
                      key={payment.id}
                      sx={{
                        '&:hover': { bgcolor: '#f8fafc' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                          {payment.bookingId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(payment.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {payment.farmer}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981' }}>
                          ₹{payment.amount.toLocaleString('en-IN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status.replace('_', ' ').toUpperCase()}
                          size="small"
                          color={getStatusColor(payment.status)}
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredPayments.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary">
                  No transactions found
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </OwnerLayout>
    </AuthGuard>
  );
}

export default OwnerPayments;
