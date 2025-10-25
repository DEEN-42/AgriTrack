import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Build,
  Delete,
  Close,
  CloudUpload,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import AuthGuard from '../../components/AuthGuard';
import OwnerLayout from '../../components/owner/OwnerLayout';
import { ownerAPI } from '../../services/api';

const machineTypes = ['Happy Seeder', 'Rotavator', 'Mulcher', 'Baler', 'Planter', 'Cultivator'];

function OwnerMachines() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    type: '',
    price: '',
    priceUnit: 'per hour',
    description: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    setLoading(true);
    try {
      const response = await ownerAPI.getMyMachines();
      setMachines(response.machines);
    } catch (error) {
      console.error('Failed to load machines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setUploading(true);
    try {
      await ownerAPI.registerMachine(formData);
      setModalOpen(false);
      setFormData({
        name: '',
        model: '',
        type: '',
        price: '',
        priceUnit: 'per hour',
        description: '',
      });
      loadMachines();
    } catch (error) {
      console.error('Failed to register machine:', error);
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'pending':
        return 'default';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Machine Name',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.type}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value.toUpperCase()}
          size="small"
          color={getStatusColor(params.value)}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: 'bookings',
      headerName: 'Total Bookings',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981' }}>
          ₹{params.value.toLocaleString('en-IN')}
        </Typography>
      ),
    },
    {
      field: 'registrationDate',
      headerName: 'Registered On',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Edit />}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Edit
          </Button>
          <IconButton size="small" color="warning">
            <Build />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <AuthGuard allowedRoles={['owner']}>
      <OwnerLayout>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                My Machines
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your fleet of agricultural machines
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setModalOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                fontSize: '1rem',
              }}
            >
              Register New Machine
            </Button>
          </Box>

          {/* Quick Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Total Machines
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    {machines.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Active Machines
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    {machines.filter((m) => m.status === 'active').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Under Maintenance
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    {machines.filter((m) => m.status === 'maintenance').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                    Total Revenue
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    ₹{(machines.reduce((sum, m) => sum + m.revenue, 0) / 1000).toFixed(0)}K
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Machines Table */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Machine Fleet
            </Typography>
            <Box sx={{ height: 500 }}>
              <DataGrid
                rows={machines}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                loading={loading}
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-row:hover': {
                    bgcolor: '#f8fafc',
                  },
                }}
              />
            </Box>
          </Paper>

          {/* Register Machine Modal */}
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Paper
              sx={{
                width: '90%',
                maxWidth: 600,
                maxHeight: '90vh',
                overflow: 'auto',
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Register New Machine
                </Typography>
                <IconButton onClick={() => setModalOpen(false)} sx={{ color: 'white' }}>
                  <Close />
                </IconButton>
              </Box>

              <Box sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Machine Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Happy Seeder Pro"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="e.g., 2024"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Machine Type</InputLabel>
                      <Select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        label="Machine Type"
                      >
                        {machineTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="500"
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Price Unit</InputLabel>
                      <Select
                        value={formData.priceUnit}
                        onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                        label="Price Unit"
                      >
                        <MenuItem value="per hour">Per Hour</MenuItem>
                        <MenuItem value="per acre">Per Acre</MenuItem>
                        <MenuItem value="per day">Per Day</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your machine's features and capabilities..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      sx={{
                        py: 2,
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Upload Machine Photos & Documents
                    </Button>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Upload registration certificate, photos (Max 5 images)
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => setModalOpen(false)}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={uploading || !formData.name || !formData.type || !formData.price}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 4,
                    }}
                  >
                    {uploading ? <CircularProgress size={24} color="inherit" /> : 'Submit for Approval'}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Modal>
        </Box>
      </OwnerLayout>
    </AuthGuard>
  );
}

export default OwnerMachines;
