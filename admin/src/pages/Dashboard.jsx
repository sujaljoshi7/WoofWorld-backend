import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";
import Sidebar from "../layout/Sidebar";
import user_img from "../assets/images/user.png";
import blog_img from "../assets/images/blog.png";
import event_img from "../assets/images/event.png";
import order from "../assets/images/order.png";
import notification from "../assets/images/notification.png";
import sales from "../assets/images/sales.png";
import box from "../assets/images/box.png";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [totalRevenueCount, setTotalRevenueCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [location, setLocation] = useState({ country: "", city: "" });
  const [currentTime, setCurrentTime] = useState("");
  const [unreadNotificationCount, setUnreadNotificationCount] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [dashboardData, setDashboardData] = useState(null);

  const handleSidebarCollapse = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const updateTime = () => setCurrentTime(new Date().toLocaleTimeString());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/api/order/dashboard-stats/");
        setDashboardData(response.data);
        setTotalRevenueCount(response.data.stats.total_revenue);
        setProductsCount(response.data.stats.total_products);
        setUserCount(response.data.stats.total_users);
        setTotalOrdersCount(response.data.stats.total_orders);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    countUnreadNotifications();
  }, []);

  // Transform orders_by_status data for pie chart
  console.log(dashboardData?.orders_by_status);
  const pieChartData =
    dashboardData?.orders_by_status?.map((item) => {
      return {
        name: item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1),
        value: item.count,
      };
    }) || [];

  // Transform monthly orders data for line chart
  const monthlyOrdersData =
    dashboardData?.monthly_orders
      ?.map((item) => ({
        name: item.month,
        orders: item.orders,
        date: new Date(item.date), // Add date for sorting
      }))
      ?.sort((a, b) => b.date - a.date) // Sort in descending order
      ?.map((item) => ({
        name: item.name,
        orders: item.orders,
      })) || [];

  // Sample data in case API data is not available
  const sampleMonthlyData = [
    { name: "Apr", orders: 0 },
    { name: "Mar", orders: 0 },
    { name: "Feb", orders: 0 },
    { name: "Jan", orders: 0 },
    { name: "Dec", orders: 0 },
    { name: "Nov", orders: 0 },
  ];

  // Use actual data if available, otherwise use sample data
  const displayOrdersData =
    monthlyOrdersData.length > 0 ? monthlyOrdersData : sampleMonthlyData;

  const COLORS = ["#4D96FF", "#FF9F1C", "#FF5C5C", "#FFC107", "#28A745"];

  const barData = [
    { name: "Users", count: userCount },
    { name: "Blogs", count: totalRevenueCount },
    { name: "Events", count: productsCount },
    { name: "Adoptioons", count: totalOrdersCount },
  ];

  const fetchLocation = async () => {
    try {
      const response = await fetch(
        "https://ipinfo.io/json?token=f48a68ebe13b9a"
      );
      const data = await response.json();
      setLocation({ country: data.country, city: data.city });
    } catch (error) {
      console.error("Failed to fetch location:", error);
      setLocation({ country: "Unknown", city: "Unknown" });
    }
  };

  const fetchDashboardData = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setLoading(false);
      return;
    }

    try {
      const [userRes, usersRes, blogsRes, eventsRes, webinarRes] =
        await Promise.all([
          api.get("/api/user/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/user/all-users/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/blogs/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/events/event/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/adoption/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
      setUser(userRes.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");
        await handleTokenRefresh();
      } else {
        console.error("Failed to fetch dashboard data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const countUnreadNotifications = async () => {
    try {
      const response = await api.get("/api/notifications/");
      const unreadNotifications = response.data.filter(
        (notification) => notification.is_read === false
      );
      setUnreadNotificationCount(unreadNotifications.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleTokenRefresh = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      console.error("No refresh token found, redirecting...");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      console.log("Token refreshed successfully");
      await fetchDashboardData();
    } catch (error) {
      console.error("Failed to refresh token:", error);
      window.location.href = "/login";
    }
  };

  const handleRowClick = (name) => {
    // navigate(`/${name}`);
    console.log(name);
  };

  useEffect(() => {
    const timer = setInterval(updateTime, 1000);
    fetchLocation();
    fetchDashboardData();
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar user={user} onCollapse={handleSidebarCollapse} />
      <div
        className="main-content flex-grow-1"
        style={{
          marginLeft: isSidebarCollapsed ? "80px" : "280px",
          padding: window.innerWidth < 768 ? "1rem" : "2.5rem",
          transition: "all 0.3s ease-in-out",
          width: isSidebarCollapsed
            ? "calc(100% - 80px)"
            : "calc(100% - 280px)",
        }}
      >
        <div className="dashboard-header mb-4 mb-md-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            {/* Left Section: Welcome Message */}
            <div className="mb-3 mb-md-0">
              <h1
                className="fw-bold text-primary mb-2"
                style={{
                  fontSize: window.innerWidth < 576 ? "1.75rem" : "2.5rem",
                }}
              >
                Welcome back, {user?.first_name}!
              </h1>
              <p
                className="text-muted"
                style={{
                  fontSize: window.innerWidth < 576 ? "0.9rem" : "1.25rem",
                }}
              >
                Here's what's happening with your platform today
              </p>
            </div>

            {/* Right Section: Notification Above Date */}
            <div className="d-flex flex-column align-items-end gap-2">
              <div
                className="position-relative"
                onClick={() => navigate("/notification")}
                style={{ cursor: "pointer" }}
              >
                <img src={notification} alt="Notifications" height={30} />
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.6rem" }}
                >
                  {unreadNotificationCount || 0}
                </span>
              </div>
              {/* Date Display */}
              <div className="bg-primary bg-opacity-10 rounded-pill px-3 px-md-4 py-2">
                <span
                  className="text-primary fw-medium"
                  style={{
                    fontSize: window.innerWidth < 576 ? "0.8rem" : "1rem",
                  }}
                >
                  {new Date().toLocaleDateString("en-US", {
                    weekday: window.innerWidth < 576 ? "short" : "long",
                    year: "numeric",
                    month: window.innerWidth < 576 ? "short" : "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3 g-md-4 mb-4 mb-md-5">
          <DashboardCard
            title="Total Orders"
            count={totalOrdersCount}
            image={order}
            onClick={handleRowClick}
            color="#4e73df"
            iconBg="#4e73df"
          />

          <DashboardCard
            title="Total Revenue"
            count={totalRevenueCount}
            image={sales}
            onClick={handleRowClick}
            color="#1cc88a"
            iconBg="#1cc88a"
          />
          <DashboardCard
            title="Total Products"
            count={productsCount}
            image={box}
            onClick={handleRowClick}
            color="#36b9cc"
            iconBg="#36b9cc"
          />
          <DashboardCard
            title="Total Users"
            count={userCount}
            image={user_img}
            onClick={handleRowClick}
            color="#f6c23e"
            iconBg="#f6c23e"
          />
        </div>

        <div className="row g-3 g-md-4">
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-header bg-white py-2 py-md-3 border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5
                    className="card-title mb-0 text-primary fw-bold"
                    style={{
                      fontSize: window.innerWidth < 576 ? "1rem" : "1.25rem",
                    }}
                  >
                    Monthly Orders
                  </h5>
                  <div className="dropdown">
                    <button
                      className="btn btn-link text-muted p-0"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          View Details
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Export Data
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body p-2 p-md-3">
                <ResponsiveContainer
                  width="100%"
                  height={window.innerWidth < 576 ? 200 : 300}
                >
                  <LineChart data={displayOrdersData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis
                      dataKey="name"
                      stroke="#6c757d"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#6c757d"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => Math.round(value)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        padding: "12px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#4D96FF"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#4D96FF" }}
                      activeDot={{ r: 6 }}
                      name="Orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-header bg-white py-2 py-md-3 border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5
                    className="card-title mb-0 text-primary fw-bold"
                    style={{
                      fontSize: window.innerWidth < 576 ? "1rem" : "1.25rem",
                    }}
                  >
                    Order Analysis
                  </h5>
                  <div className="dropdown">
                    <button
                      className="btn btn-link text-muted p-0"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          View Details
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Export Data
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body p-2 p-md-3">
                <ResponsiveContainer
                  width="100%"
                  height={window.innerWidth < 576 ? 200 : 300}
                >
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={window.innerWidth < 576 ? 80 : 100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        padding: "12px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary mb-4">
                  Top Selling Products
                </h5>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Image</th>
                        <th>Quantity Sold</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.top_products?.map((product, index) => (
                        <tr key={index}>
                          <td>{product.name}</td>
                          <td>
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>{product.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DashboardCard = ({ title, count, image, onClick, color, iconBg }) => (
  <div className="col-6 col-md-6 col-lg-3">
    <div
      className="card shadow-sm h-100 border-0"
      style={{
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        background: `linear-gradient(135deg, ${color} 0%, ${color}40 100%)`,
        borderRadius: "12px",
      }}
      onClick={() => onClick(title.toLowerCase())}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
      }}
    >
      <div className="card-body p-2 p-md-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6
              className="text-white mb-1 mb-md-2"
              style={{
                opacity: 0.9,
                fontSize: window.innerWidth < 576 ? "0.8rem" : "1rem",
              }}
            >
              {title}
            </h6>
            <h2
              className="text-white mb-0"
              style={{
                fontSize: window.innerWidth < 576 ? "1.5rem" : "2rem",
              }}
            >
              {count}
            </h2>
          </div>
          <div
            className="rounded-circle"
            style={{
              backgroundColor: iconBg,
              width: window.innerWidth < 576 ? "40px" : "60px",
              height: window.innerWidth < 576 ? "40px" : "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: window.innerWidth < 576 ? "0.5rem" : "1rem",
            }}
          >
            <img
              src={image}
              alt={title}
              style={{
                width: window.innerWidth < 576 ? "20px" : "30px",
                height: window.innerWidth < 576 ? "20px" : "30px",
                filter: "none",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
