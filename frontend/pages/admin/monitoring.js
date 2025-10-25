import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  CircularProgress,
  Fade,
  Slide,
  keyframes,
} from '@mui/material';
import Layout from '../../components/Layout';
import WithAuth from '../../components/WithAuth';
import { fetchData } from '../../store/features/dataSlice';

// Keyframe animations
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.05); }
`;

// Dynamic import for monitoring map
const MonitoringMap = dynamic(
  () => import('../../components/MonitoringMap'),
  { ssr: false }
);

function Monitoring() {
  const dispatch = useDispatch();
  const { machines, chcs, loading } = useSelector((state) => state.data);
  
  const [filters, setFilters] = useState({
    state: 'All',
    machineType: 'All',
    statuses: {
      Active: true,
      Idle: true,
      Maintenance: true,
    },
  });

  useEffect(() => {
    if (machines.length === 0) {
      dispatch(fetchData());
    }
  }, [dispatch, machines.length]);

  const filteredMachines = useMemo(() => {
    return machines.filter((machine) => {
      // Filter by state
      if (filters.state !== 'All') {
        const machineState = machine.location?.lat > 30.5 ? 'Punjab' : 
                            machine.location?.lat > 28.5 ? 'Haryana' : 'UP';
        if (machineState !== filters.state) return false;
      }

      // Filter by machine type
      if (filters.machineType !== 'All' && machine.type !== filters.machineType) {
        return false;
      }

      // Filter by status
      if (!filters.statuses[machine.status]) {
        return false;
      }

      return true;
    });
  }, [machines, filters]);

  const handleStateChange = (event) => {
    setFilters({ ...filters, state: event.target.value });
  };

  const handleTypeChange = (event) => {
    setFilters({ ...filters, machineType: event.target.value });
  };

  const handleStatusChange = (status) => {
    setFilters({
      ...filters,
      statuses: {
        ...filters.statuses,
        [status]: !filters.statuses[status],
      },
    });
  };

  if (loading) {
    return (
      <Layout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box className="fade-in">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 1,
            }}
          >
            Live Fleet Monitoring
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Real-time tracking and status of all agricultural machines
          </Typography>
        </Box>

        {/* Filter Bar */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}>
            Filter Options
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select
                  value={filters.state}
                  label="State"
                  onChange={handleStateChange}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="All">All States</MenuItem>
                  <MenuItem value="Punjab">Punjab</MenuItem>
                  <MenuItem value="Haryana">Haryana</MenuItem>
                  <MenuItem value="UP">Uttar Pradesh</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Machine Type</InputLabel>
                <Select
                  value={filters.machineType}
                  label="Machine Type"
                  onChange={handleTypeChange}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="All">All Types</MenuItem>
                  <MenuItem value="Happy Seeder">Happy Seeder</MenuItem>
                  <MenuItem value="Baler">Baler</MenuItem>
                  <MenuItem value="Rotavator">Rotavator</MenuItem>
                  <MenuItem value="Zero Till">Zero Till</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.statuses.Active}
                      onChange={() => handleStatusChange('Active')}
                      sx={{
                        color: '#10b981',
                        '&.Mui-checked': {
                          color: '#10b981',
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                      <Typography variant="body2" fontWeight={500}>Active</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.statuses.Idle}
                      onChange={() => handleStatusChange('Idle')}
                      sx={{
                        color: '#f59e0b',
                        '&.Mui-checked': {
                          color: '#f59e0b',
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                      <Typography variant="body2" fontWeight={500}>Idle</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.statuses.Maintenance}
                      onChange={() => handleStatusChange('Maintenance')}
                      sx={{
                        color: '#ef4444',
                        '&.Mui-checked': {
                          color: '#ef4444',
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444' }} />
                      <Typography variant="body2" fontWeight={500}>Maintenance</Typography>
                    </Box>
                  }
                />
              </FormGroup>
            </Grid>
          </Grid>
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2563eb' }}>
              Showing {filteredMachines.length} of {machines.length} machines
            </Typography>
          </Box>
        </Paper>

        {/* Map */}
        <Paper
          className="hover-lift"
          elevation={2}
          sx={{
            height: '650px',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <MonitoringMap machines={filteredMachines} chcs={chcs} />
        </Paper>
      </Box>
    </Layout>
  );
}

export default WithAuth(Monitoring);
