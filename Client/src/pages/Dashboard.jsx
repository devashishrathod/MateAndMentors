import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  IndianRupee,
  TrendingUp,
  Activity,
  ShoppingCart,
  TestTube,
  Clipboard,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  UserCheck,
  Microscope,
  Stethoscope,
  Building,
  FlaskConical,
  Heart,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  ComposedChart,
} from "recharts";

// Consistent blue-purple theme
const COLORS = {
  primary: "#3B82F6",
  secondary: "#8B5CF6",
  accent: "#6366F1",
  warning: "#F59E0B",
  danger: "#EF4444",
  success: "#10B981",
  teal: "#14B8A6",
  pink: "#EC4899",
};

// Static dashboard data for demo
const staticDashboardData = {
  // Summary stats
  totalUsers: 1250,
  totalMentors: 85,
  totalMentees: 1100,
  totalCategories: 24,
  totalSessions: 450,
  
  // Status counts (for charts)
  statusCounts: [
    { _id: "active", count: 750 },
    { _id: "pending", count: 350 },
    { _id: "completed", count: 150 },
  ],
  
  // Test counts by status
  testCountsByStatus: [
    { _id: "completed", count: 280 },
    { _id: "pending", count: 120 },
    { _id: "cancelled", count: 50 },
  ],
  
  // Monthly data for sales chart
  selles: [
    { title: "Jan", revenue: 45000, quantity: 45, efficiency: 85 },
    { title: "Feb", revenue: 52000, quantity: 52, efficiency: 88 },
    { title: "Mar", revenue: 48000, quantity: 48, efficiency: 82 },
    { title: "Apr", revenue: 61000, quantity: 61, efficiency: 90 },
    { title: "May", revenue: 55000, quantity: 55, efficiency: 87 },
    { title: "Jun", revenue: 67000, quantity: 67, efficiency: 92 },
  ],
  
  // Users by role
  usersByRole: [
    { _id: "admin", count: 5 },
    { _id: "mentor", count: 85 },
    { _id: "mentee", count: 1100 },
    { _id: "staff", count: 60 },
  ],
  
  // Users by month
  usersByMonth: [
    { _id: 1, count: 120 },
    { _id: 2, count: 150 },
    { _id: 3, count: 180 },
    { _id: 4, count: 200 },
    { _id: 5, count: 250 },
    { _id: 6, count: 350 },
  ],
  
  // Sessions by category
  sessionsByCategory: [
    { name: "Web Development", value: 35 },
    { name: "Data Science", value: 25 },
    { name: "Mobile Dev", value: 20 },
    { name: "UI/UX Design", value: 15 },
    { name: "DevOps", value: 5 },
  ],
  
  // Today's data
  today: {
    totalTests: 45,
    totalRevenue: 12500,
  },
  todaysAppointments: [
    { _id: "1", name: "John Doe - Web Dev" },
    { _id: "2", name: "Sarah - Data Science" },
    { _id: "3", name: "Mike - Mobile Dev" },
    { _id: "4", name: "Emily - UI/UX" },
    { _id: "5", name: "David - Python" },
  ],
  todaySells: 28,
  todayRevenue: 8500,
  totalSells: 450,
  totalRevenue: 328000,
};

// Modern 2025 Stat Card Component
const StatCard = ({
  icon: Icon,
  title,
  value,
  trend,
  trendType = "positive",
  color = "from-blue-500 to-purple-500",
}) => (
  <div className={`bg-gradient-to-r ${color} rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 relative overflow-hidden transform hover:scale-105 group`}>
    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center text-white bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
            {trendType === "positive" ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            <span className="ml-1 text-sm font-medium">{trend}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-white/80 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
    </div>
  </div>
);

// Modern Radial Chart for User Status
const UserStatusChart = ({ statusCounts }) => {
  const totalUsers = statusCounts.reduce((sum, status) => sum + status.count, 0);

  const radialData = statusCounts.map((status, index) => ({
    name: status._id,
    value: status.count,
    percentage: ((status.count / totalUsers) * 100).toFixed(1),
    fill: status._id === "active" ? "#10B981" : status._id === "pending" ? "#F59E0B" : "#EF4444",
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          User Status Distribution
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={radialData}>
          <RadialBar
            minAngle={15}
            label={{ position: "insideStart", fill: "#fff", fontSize: 12 }}
            background
            clockWise
            dataKey="value"
          />
          <Legend iconSize={12} layout="horizontal" verticalAlign="bottom" align="center" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
            formatter={(value, name) => [
              `${value} (${radialData.find((d) => d.name === name)?.percentage}%)`,
              name,
            ]}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Monthly Revenue Chart
const RevenueChart = ({ selles }) => {
  const chartData = selles.map((sale) => ({
    name: sale.title,
    revenue: sale.revenue,
    quantity: sale.quantity,
    efficiency: sale.efficiency,
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Monthly Revenue
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="revenue" fill="url(#blueGradient)" name="Revenue (₹)" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="left" dataKey="quantity" fill="url(#purpleGradient)" name="Sessions" radius={[4, 4, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#EC4899" strokeWidth={3} name="Efficiency %" />
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.3} />
            </linearGradient>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.3} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// Session Category Pie Chart
const CategoryPieChart = ({ sessionsByCategory }) => {
  const COLORS = ["#3B82F6", "#8B5CF6", "#14B8A6", "#EC4899", "#F59E0B"];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Sessions by Category
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={sessionsByCategory}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {sessionsByCategory.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// User Growth Area Chart
const UserGrowthChart = ({ usersByMonth }) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const chartData = usersByMonth.map((item) => ({
    name: monthNames[item._id - 1] || `Month ${item._id}`,
    users: item.count,
    growth: Math.floor(Math.random() * 20) + 10,
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
          <Users className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          User Growth
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
          />
          <Legend />
          <Area type="monotone" dataKey="users" stackId="1" stroke="#10B981" fill="url(#greenGradient)" name="New Users" />
          <Area type="monotone" dataKey="growth" stackId="1" stroke="#F59E0B" fill="url(#orangeGradient)" name="Growth %" />
          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.2} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Today's Stats Component
const TodayStats = ({
  statusCounts,
  today,
  todaysAppointments,
  todaySells,
  todayRevenue,
  totalSells,
}) => {
  const todayData = {
    activePatients: todaysAppointments?.length || 0,
    revenue: today?.totalRevenue || 0,
    todayRevenue: todayRevenue || 0,
    todaySells: todaySells || 0,
    totalSells: totalSells || 0,
    emergencies: 3,
    surgeries: 5,
  };

  const todayAppointments = statusCounts.map((status) => ({
    status: status._id,
    count: status.count,
    icon: status._id === "active" ? CheckCircle : status._id === "pending" ? Clock : XCircle,
    color: status._id === "active" ? "text-green-500" : status._id === "pending" ? "text-yellow-500" : "text-red-500",
    bgColor: status._id === "active" ? "bg-green-50" : status._id === "pending" ? "bg-yellow-50" : "bg-red-50",
  }));

  return (
    <div className="space-y-6">
      {/* Today's Sessions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Today's Sessions
        </h3>

        <div className="space-y-3">
          {todayAppointments.map((appointment, index) => (
            <div key={index} className={`flex items-center justify-between p-4 ${appointment.bgColor} rounded-lg border border-opacity-20`}>
              <div className="flex items-center">
                <appointment.icon className={`w-5 h-5 ${appointment.color} mr-3`} />
                <span className="font-medium text-gray-700 capitalize">{appointment.status}</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">{appointment.count}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-indigo-600 mr-3" />
              <span className="font-medium text-indigo-700">Today's Sessions</span>
            </div>
            <span className="text-2xl font-bold text-indigo-800">{todayData.activePatients}</span>
          </div>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Today's Performance
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <GraduationCap className="w-6 h-6" />
              <div className="text-right">
                <p className="text-sm opacity-80">Active Mentors</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <Users className="w-6 h-6" />
              <div className="text-right">
                <p className="text-sm opacity-80">Active Mentees</p>
                <p className="text-2xl font-bold">{todayData.activePatients}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <UserCheck className="w-6 h-6" />
              <div className="text-right">
                <p className="text-sm opacity-80">Completed Sessions</p>
                <p className="text-2xl font-bold">{todayData.todaySells}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <IndianRupee className="w-6 h-6" />
              <div className="text-right">
                <p className="text-sm opacity-80">Today's Revenue</p>
                <p className="text-2xl font-bold">₹{todayData.todayRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <ShoppingCart className="w-6 h-6" />
              <div className="text-right">
                <p className="text-sm opacity-80">Total Sessions</p>
                <p className="text-2xl font-bold">{todayData.totalSells}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Quick Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-red-700">350</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
            <Building className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-blue-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-blue-700">900</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  // Load static data on component mount
  useEffect(() => {
    setDashboardData(staticDashboardData);
  }, []);

  // Show loading state briefly
  if (!dashboardData) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-500 mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-r-purple-400 animate-ping mx-auto"></div>
          </div>
          <p className="text-xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-semibold">
            Loading....
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="container mx-auto">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} title="Total Users" value={dashboardData.totalUsers} trend={12} color="from-blue-500 to-blue-600" />
          <StatCard icon={GraduationCap} title="Total Mentors" value={dashboardData.totalMentors} trend={8} color="from-purple-500 to-purple-600" />
          <StatCard icon={UserCheck} title="Total Mentees" value={dashboardData.totalMentees} trend={15} color="from-teal-500 to-teal-600" />
          <StatCard icon={IndianRupee} title="Total Revenue" value={`₹${dashboardData.totalRevenue.toLocaleString()}`} trend={20} color="from-green-500 to-green-600" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Charts Section - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Top Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <UserStatusChart statusCounts={dashboardData.statusCounts} />
              <RevenueChart selles={dashboardData.selles} />
            </div>

            {/* Category Pie Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CategoryPieChart sessionsByCategory={dashboardData.sessionsByCategory} />
              <UserGrowthChart usersByMonth={dashboardData.usersByMonth} />
            </div>
          </div>

          {/* Right Sidebar - Today's Stats */}
          <div className="lg:col-span-1">
            <TodayStats
              statusCounts={dashboardData.statusCounts}
              today={dashboardData.today}
              todaysAppointments={dashboardData.todaysAppointments}
              todaySells={dashboardData.todaySells}
              todayRevenue={dashboardData.todayRevenue}
              totalSells={dashboardData.totalSells}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
