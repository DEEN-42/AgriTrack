import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Modal,
  Button,
  Grid,
  CircularProgress,
  Fade,
  Slide,
  Zoom,
  keyframes,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Layout from '../../components/Layout';
import WithAuth from '../../components/WithAuth';
import {
  fetchClaims,
  approveClaim,
  rejectClaim,
} from '../../store/features/claimsSlice';

// Keyframe animations
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.02); }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

function Subsidy() {
  const dispatch = useDispatch();
  const { claims, loading } = useSelector((state) => state.claims);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchClaims());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedClaim(null);
  };

  const handleApprove = () => {
    if (selectedClaim) {
      dispatch(approveClaim(selectedClaim.claimId));
      handleCloseModal();
    }
  };

  const handleReject = () => {
    if (selectedClaim) {
      dispatch(rejectClaim(selectedClaim.claimId));
      handleCloseModal();
    }
  };

  const statusTabs = ['Pending', 'Approved', 'Rejected'];
  const filteredClaims = claims.filter(
    (claim) => claim.status === statusTabs[activeTab]
  );

  const columns = [
    { field: 'claimId', headerName: 'Claim ID', width: 130, fontWeight: 600 },
    { field: 'chcName', headerName: 'CHC Name', width: 220 },
    {
      field: 'amount',
      headerName: 'Amount (₹)',
      width: 130,
      valueFormatter: (params) => `₹${params.toLocaleString()}`,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 600, color: 'primary.main' }}>
          ₹{params.value.toLocaleString()}
        </Typography>
      ),
    },
    { field: 'dateSubmitted', headerName: 'Date Submitted', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            bgcolor:
              params.value === 'Approved'
                ? 'success.light'
                : params.value === 'Rejected'
                ? 'error.light'
                : 'warning.light',
            color:
              params.value === 'Approved'
                ? 'success.dark'
                : params.value === 'Rejected'
                ? 'error.dark'
                : 'warning.dark',
            fontWeight: 700,
            fontSize: '0.75rem',
            textAlign: 'center',
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleViewDetails(params.row)}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 1.5,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            },
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

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
            Subsidy Management
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Review and process CHC subsidy claims based on verified usage data
          </Typography>
        </Box>

        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            background: 'white',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              px: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                minHeight: 60,
              },
              '& .Mui-selected': {
                color: 'primary.main',
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Pending
                  <Box
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      bgcolor: 'warning.light',
                      color: 'warning.dark',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {claims.filter((c) => c.status === 'Pending').length}
                  </Box>
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Approved
                  <Box
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      bgcolor: 'success.light',
                      color: 'success.dark',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {claims.filter((c) => c.status === 'Approved').length}
                  </Box>
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Rejected
                  <Box
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      bgcolor: 'error.light',
                      color: 'error.dark',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {claims.filter((c) => c.status === 'Rejected').length}
                  </Box>
                </Box>
              }
            />
          </Tabs>

          <Box sx={{ p: 2 }}>
            <DataGrid
              rows={filteredClaims}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              getRowId={(row) => row.claimId}
              disableSelectionOnClick
              autoHeight
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f1f5f9',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0',
                  borderRadius: 0,
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 600,
                  color: '#1e293b',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: '#f8fafc',
                },
              }}
            />
          </Box>
        </Paper>

        {/* Details Modal */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="claim-details-modal"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 600 },
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 3,
              p: 0,
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            {selectedClaim && (
              <>
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    p: 3,
                    color: 'white',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Claim Details
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Review the complete information for this subsidy claim
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Claim ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {selectedClaim.claimId}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Status
                      </Typography>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor:
                            selectedClaim.status === 'Approved'
                              ? 'success.light'
                              : selectedClaim.status === 'Rejected'
                              ? 'error.light'
                              : 'warning.light',
                          color:
                            selectedClaim.status === 'Approved'
                              ? 'success.dark'
                              : selectedClaim.status === 'Rejected'
                              ? 'error.dark'
                              : 'warning.dark',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                        }}
                      >
                        {selectedClaim.status}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        CHC Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {selectedClaim.chcName}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Amount
                      </Typography>
                      <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
                        ₹{selectedClaim.amount.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Date Submitted
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {selectedClaim.dateSubmitted}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e40af', mb: 2 }}>
                          Usage Proof
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#1e3a8a', fontWeight: 600 }}>
                              Total Hours
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#1e40af', fontWeight: 700 }}>
                              {selectedClaim.usage_proof.total_hours} hrs
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: '#1e3a8a', fontWeight: 600 }}>
                              Area Covered
                            </Typography>
                            <Typography variant="h6" sx={{ color: '#1e40af', fontWeight: 700 }}>
                              {selectedClaim.usage_proof.area_covered_acres} acres
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    {selectedClaim.status === 'Pending' && (
                      <>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={handleReject}
                          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                        >
                          Reject Claim
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleApprove}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          }}
                        >
                          Approve Claim
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outlined"
                      onClick={handleCloseModal}
                      sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                    >
                      Close
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </Layout>
  );
}

export default WithAuth(Subsidy);
