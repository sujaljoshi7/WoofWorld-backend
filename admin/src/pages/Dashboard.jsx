import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";
import Sidebar from "../layout/Sidebar";
import user_img from "../assets/images/user.png";
import blog_img from "../assets/images/blog.png";
import event_img from "../assets/images/event.png";
import webinar_img from "../assets/images/puppy.png";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [blogsCount, setBlogsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [webinarCount, setWebinarCount] = useState(0);
  const [location, setLocation] = useState({ country: "", city: "" });
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarCollapse = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const updateTime = () => setCurrentTime(new Date().toLocaleTimeString());

  const data = [
    { name: "Users", value: userCount },
    { name: "Blogs", value: blogsCount },
    { name: "Events", value: eventsCount },
    { name: "Adoptions", value: webinarCount },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const barData = [
    { name: "Users", count: userCount },
    { name: "Blogs", count: blogsCount },
    { name: "Events", count: eventsCount },
    { name: "Adoptioons", count: webinarCount },
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
      setUserCount(usersRes.data.length);
      setBlogsCount(blogsRes.data.length);
      setEventsCount(eventsRes.data.length);
      setWebinarCount(webinarRes.data.length);
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
    navigate(`/${name}`);
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
          marginLeft: isSidebarCollapsed ? '80px' : '280px',
          padding: window.innerWidth < 768 ? "1rem" : "2.5rem",
          transition: "all 0.3s ease-in-out",
          width: isSidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 280px)'
        }}
      >
        <div className="dashboard-header mb-4 mb-md-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div className="mb-3 mb-md-0">
              <h1 className="fw-bold text-primary mb-2" style={{ 
                fontSize: window.innerWidth < 576 ? "1.75rem" : "2.5rem" 
              }}>
                Welcome back, {user?.first_name}!
              </h1>
              <p className="text-muted" style={{ 
                fontSize: window.innerWidth < 576 ? "0.9rem" : "1.25rem" 
              }}>
                Here's what's happening with your platform today
              </p>
            </div>
            <div className="bg-primary bg-opacity-10 rounded-pill px-3 px-md-4 py-2">
              <span className="text-primary fw-medium" style={{ 
                fontSize: window.innerWidth < 576 ? "0.8rem" : "1rem" 
              }}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: window.innerWidth < 576 ? 'short' : 'long', 
                  year: 'numeric', 
                  month: window.innerWidth < 576 ? 'short' : 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="row g-3 g-md-4 mb-4 mb-md-5">
          <DashboardCard
            title="Users"
            count={userCount}
            image={user_img}
            onClick={handleRowClick}
            color="#4e73df"
            iconBg="#e3e6f0"
          />
          <DashboardCard
            title="Blogs"
            count={blogsCount}
            image={blog_img}
            onClick={handleRowClick}
            color="#1cc88a"
            iconBg="#e3f8f0"
          />
          <DashboardCard
            title="Events"
            count={eventsCount}
            image={event_img}
            onClick={handleRowClick}
            color="#36b9cc"
            iconBg="#e3f6f8"
          />
          <DashboardCard
            title="Adoption"
            count={webinarCount}
            image={webinar_img}
            onClick={handleRowClick}
            color="#f6c23e"
            iconBg="#f8f0e3"
          />
        </div>

        <div className="row g-3 g-md-4">
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-header bg-white py-2 py-md-3 border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0 text-primary fw-bold" style={{ 
                    fontSize: window.innerWidth < 576 ? "1rem" : "1.25rem" 
                  }}>
                    Revenue Analysis
                  </h5>
                  <div className="dropdown">
                    <button className="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#">View Details</a></li>
                      <li><a className="dropdown-item" href="#">Export Data</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body p-2 p-md-3">
                <ResponsiveContainer width="100%" height={window.innerWidth < 576 ? 200 : 300}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#6c757d" />
                    <YAxis stroke="#6c757d" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        padding: '12px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      fill="#4e73df" 
                      barSize={window.innerWidth < 576 ? 30 : 40}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-header bg-white py-2 py-md-3 border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0 text-primary fw-bold" style={{ 
                    fontSize: window.innerWidth < 576 ? "1rem" : "1.25rem" 
                  }}>
                    Order Analysis
                  </h5>
                  <div className="dropdown">
                    <button className="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#">View Details</a></li>
                      <li><a className="dropdown-item" href="#">Export Data</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body p-2 p-md-3">
                <ResponsiveContainer width="100%" height={window.innerWidth < 576 ? 200 : 300}>
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={window.innerWidth < 576 ? 80 : 100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        padding: '12px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
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
        borderRadius: "12px"
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
            <h6 className="text-white mb-1 mb-md-2" style={{ 
              opacity: 0.9,
              fontSize: window.innerWidth < 576 ? "0.8rem" : "1rem"
            }}>
              {title}
            </h6>
            <h2 className="text-white mb-0" style={{ 
              fontSize: window.innerWidth < 576 ? "1.5rem" : "2rem"
            }}>
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
              padding: window.innerWidth < 576 ? "0.5rem" : "1rem"
            }}
          >
            <img 
              src={image} 
              alt={title} 
              style={{ 
                width: window.innerWidth < 576 ? "20px" : "30px",
                height: window.innerWidth < 576 ? "20px" : "30px",
                filter: "none"
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
