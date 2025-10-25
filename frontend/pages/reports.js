import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Layout from '../components/Layout';
import WithAuth from '../components/WithAuth';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  CanvasRenderer,
]);

function Reports() {
  const [startDate, setStartDate] = useState(new Date(2025, 0, 1));
  const [endDate, setEndDate] = useState(new Date());

  // Mock data for utilization over time
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const utilizationData = [45, 52, 58, 63, 68, 72, 75, 71, 69, 68];

  // Mock data for impact analysis (Punjab)
  const stubbleBurningData = [2800, 2650, 2400, 2150, 1900, 1700, 1550, 1650, 1580, 1502];
  const machineUtilizationData = [42, 48, 55, 60, 65, 69, 72, 70, 68, 68];

  const utilizationChartOption = {
    title: {
      text: 'Machine Utilization Over Time',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 600,
        color: '#1e293b',
      },
    },
    tooltip: {
      trigger: 'axis',
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
      data: months,
      boundaryGap: false,
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
      min: 0,
      max: 100,
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
        name: 'Utilization',
        type: 'line',
        data: utilizationData,
        smooth: true,
        lineStyle: {
          width: 3,
        },
        itemStyle: {
          color: '#3b82f6',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
          ]),
        },
        symbol: 'circle',
        symbolSize: 8,
      },
    ],
  };

  const impactChartOption = {
    title: {
      text: 'Impact Analysis - Punjab',
      subtext: 'Inverse Correlation: Machine Utilization vs Stubble Burning',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 600,
        color: '#1e293b',
      },
      subtextStyle: {
        color: '#64748b',
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#1e293b',
      },
    },
    legend: {
      data: ['Stubble Burning Incidents', 'Machine Utilization'],
      bottom: 10,
      textStyle: {
        color: '#64748b',
        fontWeight: 500,
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '20%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: months,
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
    yAxis: [
      {
        type: 'value',
        name: 'Incidents',
        position: 'left',
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
      {
        type: 'value',
        name: 'Utilization %',
        position: 'right',
        min: 0,
        max: 100,
        axisLine: {
          lineStyle: {
            color: '#cbd5e1',
          },
        },
        axisLabel: {
          color: '#64748b',
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: 'Stubble Burning Incidents',
        type: 'bar',
        data: stubbleBurningData,
        barWidth: '50%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#f87171' },
            { offset: 1, color: '#dc2626' },
          ]),
          borderRadius: [8, 8, 0, 0],
        },
      },
      {
        name: 'Machine Utilization',
        type: 'line',
        yAxisIndex: 1,
        data: machineUtilizationData,
        smooth: true,
        lineStyle: {
          width: 3,
        },
        itemStyle: {
          color: '#10b981',
        },
        symbol: 'circle',
        symbolSize: 8,
      },
    ],
  };

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
            Reports & Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Comprehensive insights into scheme performance and environmental impact
          </Typography>
        </Box>

        {/* Date Filter */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
            Date Range Filter
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Paper>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              className="hover-lift"
              elevation={2}
              sx={{ p: 3, borderRadius: 3, background: 'white' }}
            >
              <ReactEChartsCore
                echarts={echarts}
                option={utilizationChartOption}
                style={{ height: '400px' }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              className="hover-lift"
              elevation={2}
              sx={{ p: 3, borderRadius: 3, background: 'white' }}
            >
              <ReactEChartsCore
                echarts={echarts}
                option={impactChartOption}
                style={{ height: '450px' }}
              />
              <Box
                sx={{
                  mt: 3,
                  p: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                  border: '2px solid #93c5fd',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e40af', mb: 1 }}>
                  💡 Key Insight
                </Typography>
                <Typography variant="body1" sx={{ color: '#1e3a8a', fontWeight: 500, lineHeight: 1.7 }}>
                  As machine utilization increased from <strong>42%</strong> (Jan) to <strong>68%</strong> (Oct),
                  stubble burning incidents decreased by <strong>46%</strong> (from 2,800 to 1,502). This demonstrates the
                  significant positive impact of the CRM scheme on reducing agricultural residue burning and improving air quality.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default WithAuth(Reports);
