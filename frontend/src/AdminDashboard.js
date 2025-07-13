import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  Avatar,
  Badge,
  Stack,
  Container,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Chat as ChatIcon,
  Help as HelpIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Download as DownloadIcon,
  PlayArrow as PlayArrowIcon,
  Description as DescriptionIcon,
  Language as LanguageIcon,
  CameraAlt as CameraIcon,
  PhotoCamera as PhotoCameraIcon,
  Send as SendIcon,
  AttachMoney as MoneyIcon,
  Menu as MenuIcon,
  Event as EventIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Announcement as AnnouncementIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart
} from "recharts";
import axios from "axios";

const AdminDashboard = ({ userData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [activeTab, setActiveTab] = useState("audits");
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Real data states
  const [audits, setAudits] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch data on component mount
  useEffect(() => {
    if (userData && userData.id) {
      fetchAdminData();
    }
  }, [userData]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [auditsRes, coordinatorsRes, volunteersRes, profileRes] = await Promise.all([
        axios.get('http://localhost:5000/api/campaigns'),
        axios.get('http://localhost:5000/api/coordinators'),
        axios.get('http://localhost:5000/api/users?role=volunteer'),
        axios.get(`http://localhost:5000/api/user/${userData.id}`)
      ]);

      setAudits(auditsRes.data.data || []);
      setCoordinators(coordinatorsRes.data.data || []);
      setVolunteers(volunteersRes.data.data || []);

      // Add dummy badges to admin profile
      const adminWithBadges = {
        ...profileRes.data.data,
        badges: [
          { icon: "👑", name: "System Admin", description: "Full system administration privileges" },
          { icon: "📊", name: "Data Analyst", description: "Expert in data analysis and reporting" },
          { icon: "🔧", name: "System Manager", description: "Manages system configuration and settings" },
          { icon: "📈", name: "Performance Monitor", description: "Monitors system performance metrics" },
          { icon: "🛡️", name: "Security Admin", description: "Manages system security and access control" },
          { icon: "📋", name: "Audit Master", description: "Oversees all audit operations" }
        ]
      };
      setUserProfile(adminWithBadges);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  // Chart data based on real data
  const auditTrendData = [
    { month: 'Jan', completed: 12, inProgress: 3, pending: 2 },
    { month: 'Feb', completed: 15, inProgress: 4, pending: 1 },
    { month: 'Mar', completed: 18, inProgress: 2, pending: 3 },
    { month: 'Apr', completed: 22, inProgress: 5, pending: 1 },
    { month: 'May', completed: 25, inProgress: 3, pending: 2 },
    { month: 'Jun', completed: 28, inProgress: 4, pending: 1 },
    { month: 'Jul', completed: 30, inProgress: 2, pending: 0 }
  ];

  const volunteerPerformanceData = volunteers.map(volunteer => ({
    name: volunteer.name,
    completed: volunteer.completedTasks || 0,
    total: volunteer.totalTasks || 0,
    attendance: volunteer.attendance || 0
  }));

  const coordinatorPerformanceData = coordinators.map(coordinator => ({
    name: coordinator.name,
    completed: coordinator.completedAudits || 0,
    total: coordinator.totalAudits || 0,
    performance: coordinator.performance || 0
  }));

  const wardDistributionData = [
    { name: 'Ward 1', volunteers: 8, audits: 12 },
    { name: 'Ward 2', volunteers: 5, audits: 8 },
    { name: 'Ward 3', volunteers: 6, audits: 10 },
    { name: 'Ward 4', volunteers: 4, audits: 6 },
    { name: 'Ward 5', volunteers: 7, audits: 9 }
  ];

  const taskCompletionData = [
    { name: 'Completed', value: 85, color: '#10b981' },
    { name: 'In Progress', value: 10, color: '#f59e0b' },
    { name: 'Pending', value: 5, color: '#ef4444' }
  ];

  const monthlyAuditData = [
    { month: 'Jan', audits: 12, completion: 75 },
    { month: 'Feb', audits: 15, completion: 80 },
    { month: 'Mar', audits: 18, completion: 85 },
    { month: 'Apr', audits: 22, completion: 90 },
    { month: 'May', audits: 25, completion: 88 },
    { month: 'Jun', audits: 28, completion: 92 },
    { month: 'Jul', audits: 30, completion: 95 }
  ];

  // Mock data for cost predictions (not yet supported by backend)
  const costPredictionsData = [
    {
      id: 1,
      volunteerName: "Rahul Kumar",
      location: "Church Street, Bengaluru",
      category: "Road Repair",
      predictedCost: 45000,
      confidence: 0.85,
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW5mcmFzdHJ1Y3R1cmUgUGhvdG8gMSA8L3RleHQ+Cjwvc3ZnPgo=",
      date: "2025-07-12",
      status: "pending",
      description: "Pothole on main road requiring immediate attention"
    },
    {
      id: 2,
      volunteerName: "Priya Sharma",
      location: "Brigade Road, Bengaluru",
      category: "Street Light",
      predictedCost: 28000,
      confidence: 0.92,
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW5mcmFzdHJ1Y3R1cmUgUGhvdG8gMiA8L3RleHQ+Cjwvc3ZnPgo=",
      date: "2025-07-11",
      status: "approved",
      description: "Broken street light pole needs replacement"
    },
    {
      id: 3,
      volunteerName: "Amit Patel",
      location: "Commercial Street, Bengaluru",
      category: "Drainage",
      predictedCost: 35000,
      confidence: 0.78,
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW5mcmFzdHJ1Y3R1cmUgUGhvdG8gMyA8L3RleHQ+Cjwvc3ZnPgo=",
      date: "2025-07-10",
      status: "rejected",
      description: "Clogged drainage system requiring cleaning"
    },
    {
      id: 4,
      volunteerName: "Sneha Reddy",
      location: "MG Road, Bengaluru",
      category: "Signage",
      predictedCost: 15000,
      confidence: 0.95,
      image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzM4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW5mcmFzdHJ1Y3R1cmUgUGhvdG8gNCA8L3RleHQ+Cjwvc3ZnPgo=",
      date: "2025-07-09",
      status: "pending",
      description: "Missing traffic sign needs replacement"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "#10b981";
      case "in-progress": return "#f59e0b";
      case "pending": return "#6b7280";
      default: return "#6b7280";
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case "Excellent": return "#10b981";
      case "Good": return "#3b82f6";
      case "Average": return "#f59e0b";
      case "Poor": return "#ef4444";
      default: return "#6b7280";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Audit detail view
  if (selectedAudit) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar>
            <Button
              startIcon={<CloseIcon />}
              onClick={() => setSelectedAudit(null)}
              sx={{ color: 'text.primary', mr: 2 }}
            >
              Back to Dashboard
            </Button>
            <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>
              {selectedAudit.title}
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Audit Info */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Chip
                      label={selectedAudit.status}
                      color={selectedAudit.status === 'completed' ? 'success' : 'warning'}
                      variant="outlined"
                    />
                    <Typography variant="h6">{selectedAudit.title}</Typography>
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EventIcon color="primary" />
                        <Typography>{selectedAudit.date}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon color="primary" />
                        <Typography>{selectedAudit.coordinator}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PeopleIcon color="primary" />
                        <Typography>{selectedAudit.totalVolunteers} volunteers</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Stats Cards */}
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Present
                  </Typography>
                  <Typography variant="h3" sx={{ color: 'success.main' }}>
                    {selectedAudit.presentVolunteers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Absent
                  </Typography>
                  <Typography variant="h3" sx={{ color: 'error.main' }}>
                    {selectedAudit.absentVolunteers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Added
                  </Typography>
                  <Typography variant="h3" sx={{ color: 'primary.main' }}>
                    {selectedAudit.addedVolunteers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Replaced
                  </Typography>
                  <Typography variant="h3" sx={{ color: 'warning.main' }}>
                    {selectedAudit.replacementVolunteers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Tasks */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Tasks
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Task</TableCell>
                          <TableCell>Volunteer</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedAudit.tasks.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell>{task.name}</TableCell>
                            <TableCell>{task.volunteer}</TableCell>
                            <TableCell>
                              <Chip
                                label={task.completed ? "Completed" : "Pending"}
                                color={task.completed ? "success" : "warning"}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  // Main dashboard view
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          <Typography variant="h6" sx={{
            flexGrow: 1,
            color: 'text.primary',
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}>
            Admin Dashboard
          </Typography>
          <IconButton
            onClick={() => setShowProfile(true)}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            <PersonIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2 } }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Stats Cards */}
          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" sx={{
                  mb: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  Total Audits
                </Typography>
                <Typography variant="h3" sx={{
                  color: 'primary.main',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' }
                }}>
                  {audits.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" sx={{
                  mb: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  Coordinators
                </Typography>
                <Typography variant="h3" sx={{
                  color: 'secondary.main',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' }
                }}>
                  {coordinators.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" sx={{
                  mb: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  Volunteers
                </Typography>
                <Typography variant="h3" sx={{
                  color: 'success.main',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' }
                }}>
                  {volunteers.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={3}>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" sx={{
                  mb: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}>
                  Completion Rate
                </Typography>
                <Typography variant="h3" sx={{
                  color: 'info.main',
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' }
                }}>
                  {Math.round((audits.filter(a => a.status === 'completed').length / audits.length) * 100)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Charts Section */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimelineIcon />
                  Audit Trends (Last 7 Months)
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={auditTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="completed" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                    <Bar dataKey="inProgress" fill="#f59e0b" />
                    <Line type="monotone" dataKey="pending" stroke="#ef4444" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PieChartIcon />
                  Task Completion Status
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={taskCompletionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {taskCompletionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BarChartIcon />
                  Volunteer Performance
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={volunteerPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#10b981" name="Completed Tasks" />
                    <Bar dataKey="total" fill="#3b82f6" name="Total Tasks" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon />
                  Ward Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={wardDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="volunteers" fill="#8b5cf6" name="Volunteers" />
                    <Bar dataKey="audits" fill="#06b6d4" name="Audits" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon />
                  Monthly Audit Completion Rate
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyAuditData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="completion" stroke="#10b981" strokeWidth={3} name="Completion Rate (%)" />
                    <Line type="monotone" dataKey="audits" stroke="#3b82f6" strokeWidth={2} name="Total Audits" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Tabs */}
          <Grid item xs={12}>
            <Paper sx={{ width: '100%' }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  '& .MuiTab-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    minWidth: { xs: 'auto', sm: '120px' },
                    padding: { xs: '8px 12px', sm: '12px 16px' }
                  }
                }}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons={isMobile ? "auto" : false}
              >
                <Tab label="Audits" value="audits" />
                <Tab label="Coordinators" value="coordinators" />
                <Tab label="Volunteers" value="volunteers" />
                <Tab label="Cost Predictions" value="costPredictions" />
              </Tabs>
            </Paper>
          </Grid>

          {/* Tab Content */}
          {activeTab === "audits" && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Recent Audits
                  </Typography>
                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                    {audits.map((audit) => (
                      <Grid item xs={12} sm={6} lg={4} key={audit.id}>
                        <Card
                          variant="outlined"
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'grey.50' },
                            height: '100%'
                          }}
                          onClick={() => setSelectedAudit(audit)}
                        >
                          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                            <Box sx={{
                              display: 'flex',
                              flexDirection: { xs: 'column', sm: 'row' },
                              justifyContent: 'space-between',
                              alignItems: { xs: 'flex-start', sm: 'center' },
                              mb: 1,
                              gap: { xs: 1, sm: 0 }
                            }}>
                              <Typography variant="h6" sx={{
                                fontSize: { xs: '1rem', sm: '1.25rem' },
                                flex: 1
                              }}>
                                {audit.title}
                              </Typography>
                              <Chip
                                label={audit.status}
                                color={audit.status === 'completed' ? 'success' : 'warning'}
                                size="small"
                                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                              />
                            </Box>

                            <Stack spacing={1}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <EventIcon fontSize="small" color="action" />
                                <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                  {audit.date}
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <PersonIcon fontSize="small" color="action" />
                                <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                  {audit.coordinator}
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <PeopleIcon fontSize="small" color="action" />
                                <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                  {audit.totalVolunteers} volunteers
                                </Typography>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {activeTab === "coordinators" && (
            <>
              <Grid item xs={12} lg={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AssessmentIcon />
                      Coordinator Performance Overview
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={coordinatorPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" fill="#10b981" name="Completed Audits" />
                        <Bar dataKey="total" fill="#3b82f6" name="Total Audits" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUpIcon />
                      Performance Metrics
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={coordinatorPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="performance" stroke="#10b981" strokeWidth={3} name="Performance %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Coordinators Details
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Wards</TableCell>
                            <TableCell>Audits</TableCell>
                            <TableCell>Performance</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {coordinators.map((coordinator) => (
                            <TableRow key={coordinator.id}>
                              <TableCell>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Avatar sx={{ width: 32, height: 32 }}>
                                    {coordinator.name.charAt(0)}
                                  </Avatar>
                                  <Typography>{coordinator.name}</Typography>
                                </Stack>
                              </TableCell>
                              <TableCell>{coordinator.email}</TableCell>
                              <TableCell>{coordinator.assignedWards.join(", ")}</TableCell>
                              <TableCell>{coordinator.completedAudits}/{coordinator.totalAudits}</TableCell>
                              <TableCell>
                                <Chip
                                  label={coordinator.performance}
                                  color={coordinator.performance === 'Excellent' ? 'success' : 'primary'}
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          {activeTab === "volunteers" && (
            <>
              <Grid item xs={12} lg={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BarChartIcon />
                      Volunteer Task Completion
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={volunteerPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" fill="#10b981" name="Completed" />
                        <Bar dataKey="total" fill="#3b82f6" name="Total" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUpIcon />
                      Attendance Rates
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={volunteerPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} name="Attendance %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Volunteers Details
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Ward</TableCell>
                            <TableCell>Tasks</TableCell>
                            <TableCell>Attendance</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {volunteers.map((volunteer) => (
                            <TableRow key={volunteer.id}>
                              <TableCell>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Avatar sx={{ width: 32, height: 32 }}>
                                    {volunteer.name.charAt(0)}
                                  </Avatar>
                                  <Typography>{volunteer.name}</Typography>
                                </Stack>
                              </TableCell>
                              <TableCell>{volunteer.email}</TableCell>
                              <TableCell>{volunteer.ward}</TableCell>
                              <TableCell>{volunteer.completedTasks}/{volunteer.totalTasks}</TableCell>
                              <TableCell>{volunteer.attendance}</TableCell>
                              <TableCell>
                                <Chip
                                  label={volunteer.status}
                                  color="success"
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          {activeTab === "costPredictions" && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Cost Prediction Overview
                  </Typography>
                  <Grid container spacing={2}>
                    {costPredictionsData.map((prediction) => (
                      <Grid item xs={12} md={6} lg={4} key={prediction.id}>
                        <Card
                          variant="outlined"
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 2,
                            '&:hover': { bgcolor: 'grey.50' }
                          }}
                        >
                          <Box
                            sx={{
                              width: 100,
                              height: 100,
                              mb: 1,
                              borderRadius: 1,
                              overflow: 'hidden',
                              bgcolor: 'grey.100'
                            }}
                          >
                            <img
                              src={prediction.image}
                              alt={`Infrastructure photo by ${prediction.volunteerName}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          </Box>
                          <Typography variant="h6" sx={{ mb: 0.5 }}>{prediction.volunteerName}</Typography>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>{prediction.location}</Typography>
                          <Chip
                            label={prediction.category}
                            color="primary"
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="body2" sx={{ mb: 0.5 }}>Predicted Cost: ₹{prediction.predictedCost.toLocaleString()}</Typography>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>Confidence: {(prediction.confidence * 100).toFixed(1)}%</Typography>
                          <Chip
                            label={prediction.status}
                            color={prediction.status === 'approved' ? 'success' : prediction.status === 'pending' ? 'warning' : 'error'}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>{prediction.description}</Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>Date: {prediction.date}</Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Profile Dialog */}
      <Dialog
        open={showProfile}
        onClose={() => setShowProfile(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Profile
            <IconButton onClick={() => setShowProfile(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Basic Information
              </Typography>
              <Stack spacing={2}>
                <Typography><strong>Name:</strong> {userProfile?.name}</Typography>
                <Typography><strong>Email:</strong> {userProfile?.email}</Typography>
                <Typography><strong>Phone:</strong> {userProfile?.phone}</Typography>
                <Typography><strong>Role:</strong> {userProfile?.role}</Typography>
                <Typography><strong>Join Date:</strong> {userProfile?.joinDate}</Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Badges
              </Typography>
              <Stack spacing={1}>
                {userProfile?.badges?.map((badge, index) => (
                  <Chip
                    key={index}
                    label={`${badge.icon} ${badge.name}`}
                    variant="outlined"
                    size="small"
                    title={badge.description}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard; 