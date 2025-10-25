import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  alpha,
} from '@mui/material';
import {
  TrendingUp,
  GpsFixed as Gps,
  LocalFireDepartment,
  Grass as Agriculture,
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import WithAuth from '../../components/WithAuth';
import { fetchData } from '../../store/features/dataSlice';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register ECharts components
echarts.use([
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  CanvasRenderer,
]);

// Dynamic import for Leaflet map (SSR disabled)
const MapComponent = dynamic(() => import('../../components/MapComponent'), {
  ssr: false,
});

const KPICard = ({ title, value, icon, color, gradient }) => (
  <Paper
    elevation={0}
    sx={{
      p: 0,
      height: '100%',
      borderRadius: 2.5,
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 24px ${alpha(color, 0.12)}`,
        borderColor: alpha(color, 0.3),
        '& .icon-box': {
          transform: 'scale(1.05)',
        },
      },
    }}
  >
    <Box sx={{ p: 3 }}>
      {/* Icon and Label Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box
          className="icon-box"
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(gradient[0], 0.08)} 0%, ${alpha(gradient[1], 0.12)} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease',
          }}
        >
          {icon}
        </Box>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: color,
            boxShadow: `0 0 0 4px ${alpha(color, 0.1)}`,
          }}
        />
      </Box>

      {/* Value */}
      <Typography
        variant="h3"
        sx={{ 
          color: '#111827', 
          fontWeight: 700, 
          letterSpacing: '-1.2px',
          fontSize: '2rem',
          mb: 1,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>

      {/* Title */}
      <Typography
        variant="body2"
        sx={{ 
          color: '#6b7280', 
          fontWeight: 500, 
          fontSize: '0.875rem',
          lineHeight: 1.4,
        }}
      >
        {title}
      </Typography>
    </Box>

    {/* Bottom Accent Line */}
    <Box
      sx={{
        height: 3,
        width: '100%',
        background: `linear-gradient(90deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
      }}
    />
  </Paper>
);

function Dashboard() {
  const dispatch = useDispatch();
  const { machines, stats, loading } = useSelector((state) => state.data);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  // Calculate state-wise utilization
  const stateUtilization = useMemo(() => {
    const stateData = {};
    machines.forEach((machine) => {
      const state = machine.location?.lat > 30.5 ? 'Punjab' : 
                    machine.location?.lat > 28.5 ? 'Haryana' : 'UP';
      if (!stateData[state]) {
        stateData[state] = { total: 0, count: 0 };
      }
      stateData[state].total += machine.utilization_rate;
      stateData[state].count += 1;
    });
    
    return Object.keys(stateData).map((state) => ({
      state,
      utilization: (stateData[state].total / stateData[state].count) * 100,
    }));
  }, [machines]);

  // Calculate machine type distribution
  const machineTypes = useMemo(() => {
    const types = {};
    machines.forEach((machine) => {
      types[machine.type] = (types[machine.type] || 0) + 1;
    });
    return Object.keys(types).map((type) => ({
      name: type,
      value: types[type],
    }));
  }, [machines]);

  const barChartOption = {
    title: {
      text: 'State-wise Utilization',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 600,
        color: '#1e293b',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#1e293b',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: stateUtilization.map((d) => d.state),
      axisLine: {
        lineStyle: {
          color: '#cbd5e1',
        },
      },
      axisLabel: {
        color: '#64748b',
        fontWeight: 500,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Utilization %',
      axisLine: {
        lineStyle: {
          color: '#cbd5e1',
        },
      },
      axisLabel: {
        color: '#64748b',
      },
      splitLine: {
        lineStyle: {
          color: '#f1f5f9',
        },
      },
    },
    series: [
      {
        data: stateUtilization.map((d) => d.utilization.toFixed(1)),
        type: 'bar',
        barWidth: '50%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#2563eb' },
          ]),
          borderRadius: [8, 8, 0, 0],
        },
        label: {
          show: true,
          position: 'top',
          color: '#1e293b',
          fontWeight: 600,
          formatter: '{c}%',
        },
      },
    ],
  };

  const pieChartOption = {
    title: {
      text: 'Machine Distribution',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 600,
        color: '#1e293b',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#1e293b',
      },
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      textStyle: {
        color: '#64748b',
        fontWeight: 500,
      },
    },
    series: [
      {
        name: 'Machine Type',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          fontWeight: 600,
          color: '#1e293b',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        data: machineTypes,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
      },
    ],
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
          <CircularProgress size={60} thickness={4} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box className="fade-in">
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#0f172a',
              mb: 1,
              letterSpacing: '-1px',
            }}
          >
            Dashboard Overview
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500, fontSize: '1rem' }}>
            Real-time monitoring and analytics of agricultural machinery across India
          </Typography>
        </Box>
        
        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Total Machines"
              value={`${(stats.total_machines / 100000).toFixed(2)}L`}
              icon={<Agriculture sx={{ fontSize: 28, color: '#3b82f6' }} />}
              color="#3b82f6"
              gradient={['#3b82f6', '#2563eb']}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Overall Utilization"
              value={`${(stats.overall_utilization * 100).toFixed(0)}%`}
              icon={<TrendingUp sx={{ fontSize: 28, color: '#10b981' }} />}
              color="#10b981"
              gradient={['#10b981', '#059669']}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Active Today"
              value={`${(stats.active_machines_today / 1000).toFixed(1)}K`}
              icon={<Gps sx={{ fontSize: 28, color: '#f59e0b' }} />}
              color="#f59e0b"
              gradient={['#f59e0b', '#d97706']}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Burning Incidents"
              value={stats.stubble_burning_incidents}
              icon={<LocalFireDepartment sx={{ fontSize: 28, color: '#ef4444' }} />}
              color="#ef4444"
              gradient={['#ef4444', '#dc2626']}
            />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              className="hover-lift"
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3, 
                background: 'white',
                border: '1px solid #f1f5f9',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <ReactEChartsCore
                echarts={echarts}
                option={barChartOption}
                style={{ height: '400px' }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              className="hover-lift"
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 3, 
                background: 'white',
                border: '1px solid #f1f5f9',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <ReactEChartsCore
                echarts={echarts}
                option={pieChartOption}
                style={{ height: '400px' }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              className="hover-lift"
              elevation={0}
              sx={{ 
                p: 3, 
                height: '550px', 
                borderRadius: 3, 
                background: 'white',
                border: '1px solid #f1f5f9',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 4,
                    height: 24,
                    borderRadius: 2,
                    background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
                    mr: 2,
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.125rem' }}>
                  National Machine Distribution
                </Typography>
              </Box>
              <Box sx={{ height: 'calc(100% - 56px)', borderRadius: 2, overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                <MapComponent machines={machines} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default WithAuth(Dashboard);
