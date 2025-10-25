# FieldSync - Government Monitoring Portal

A comprehensive frontend-only application built with Next.js, React, Material-UI, Redux Toolkit, ECharts, and Leaflet for monitoring and managing agricultural machinery under the Custom Hiring Center (CHC) scheme.

## 🚀 Features

### 1. **Dashboard (Home Page)**
- **KPI Cards**: Display key metrics including total machines, overall utilization, active machines today, and stubble burning incidents
- **State-wise Utilization Bar Chart**: Shows average utilization rates across Punjab, Haryana, and UP
- **Machine Type Distribution Pie Chart**: Visualizes the distribution of different machine types
- **National Map**: Interactive map displaying machine locations across India

### 2. **Live Monitoring**
- **Real-time Fleet Tracking**: Interactive map showing all machines with custom status-based markers
- **Advanced Filters**: Filter by state, machine type, and status (Active, Idle, Maintenance)
- **Detailed Popups**: Click on markers to view machine details including ID, type, operator, CHC, and utilization

### 3. **Reports & Analytics**
- **Date Range Filter**: Select custom date ranges for analysis
- **Utilization Trends**: Line chart showing machine utilization over time
- **Impact Analysis**: Multi-axis chart demonstrating the inverse correlation between machine utilization and stubble burning incidents
- **Key Insights**: Data-driven insights highlighting the scheme's impact

### 4. **Subsidy Management**
- **Tabbed Interface**: Separate views for Pending, Approved, and Rejected claims
- **Data Grid**: Comprehensive table showing all claim details
- **Details Modal**: View complete claim information including usage proof
- **Approval Workflow**: Approve or reject claims with a single click

### 5. **Authentication**
- **Login Page**: Secure entry point (simulation for demo purposes)
- **Route Protection**: All pages except login are protected with authentication checks
- **Logout Functionality**: Available from the user menu in the AppBar

## 🛠️ Technology Stack

- **Framework**: Next.js 14+
- **UI Library**: Material-UI (MUI v5) with MUI X components
- **State Management**: Redux Toolkit
- **Charts**: Apache ECharts (via echarts-for-react)
- **Maps**: React-Leaflet 4+
- **Date Handling**: date-fns with MUI X Date Pickers
- **Styling**: Emotion (MUI's built-in)

## 📦 Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

4. **Login**:
   - Go to the login page (will auto-redirect if not authenticated)
   - Enter any username and password (no validation for demo)
   - Click "Login" to access the dashboard

## 🗂️ Project Structure

```
frontend/
├── components/           # Reusable React components
│   ├── Layout.js        # Main layout with AppBar and Drawer
│   ├── WithAuth.js      # HOC for route protection
│   ├── MapComponent.js  # Dashboard map component
│   └── MonitoringMap.js # Live monitoring map with filters
├── pages/               # Next.js pages (routes)
│   ├── _app.js         # App wrapper with Redux and MUI providers
│   ├── index.js        # Dashboard page
│   ├── login.js        # Login page
│   ├── monitoring.js   # Live monitoring page
│   ├── reports.js      # Reports and analytics page
│   └── subsidy.js      # Subsidy management page
├── public/
│   └── mockdata/       # JSON files with mock data
│       ├── machines.json    # 50 machine records
│       ├── chcs.json        # 15 CHC records
│       ├── claims.json      # 70 claim records
│       └── stats.json       # Overall statistics
├── store/              # Redux store configuration
│   ├── store.js        # Store setup
│   └── features/       # Redux slices
│       ├── authSlice.js    # Authentication state
│       ├── dataSlice.js    # Machines, CHCs, and stats
│       └── claimsSlice.js  # Claims and approval logic
└── styles/
    └── globals.css     # Global styles
```

## 🎯 User Guide

### Login
- Navigate to `/login`
- Enter any username and password (no validation for demo)
- Click "Login" to access the dashboard

### Dashboard
- View overall statistics at a glance
- Analyze state-wise utilization and machine distribution
- Explore the national map showing machine locations

### Live Monitoring
- Use filters to narrow down machines by state, type, or status
- Click on map markers to view detailed machine information
- Monitor real-time fleet status

### Reports
- Select date ranges for custom analysis
- Review utilization trends over time
- Study the impact analysis showing how increased machine usage reduces stubble burning

### Subsidy Management
- Switch between Pending, Approved, and Rejected tabs
- Click "View Details" to see complete claim information
- Approve or reject pending claims directly from the modal

## 📊 Mock Data

The application uses realistic mock data:
- **50 machines** spread across Punjab, Haryana, and UP
- **15 CHC locations** with machine assignments
- **70 subsidy claims** with varying statuses
- **Statistical data** showing overall scheme performance

## 🔒 Security Note

This is a frontend-only prototype. Authentication is simulated for demonstration purposes. In a production environment, implement proper backend authentication and authorization.

## 🎨 Design Philosophy

- **Clean and Professional**: Material Design components ensure consistency
- **Data-Rich**: Multiple visualization types for comprehensive insights
- **Responsive**: Works seamlessly across desktop and tablet devices
- **Interactive**: Filters, maps, and modals provide engaging user experience
- **Government-Focused**: Tailored for official monitoring and administrative workflows

## 🚀 Deployment

To build for production:

```bash
npm run build
npm start
```

The application can be deployed to Vercel, Netlify, or any Node.js hosting platform.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
