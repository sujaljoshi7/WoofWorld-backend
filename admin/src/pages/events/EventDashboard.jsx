import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import event_img from "../../assets/images/event.png";
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
  BarChart,
  Bar,
} from "recharts";

function EventDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  const [allOrders, setAllOrders] = useState([]);

  const handleSidebarCollapse = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const fetchEventsOrders = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingUser(false);
      return;
    }

    try {
      const userResponse = api.get("/api/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allOrdersResponse = api.get("/api/order/all/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const [userData, allOrdersData] = await Promise.all([
        userResponse,
        allOrdersResponse,
      ]);

      setUser(userData.data);

      // Process orders to determine type
      const processedOrders = allOrdersData.data.map((order) => {
        const hasProducts = order.order_items.some((item) => item.type === 1);
        const hasTickets = order.order_items.some((item) => item.type === 2);

        let orderType = "mixed";
        if (hasProducts && !hasTickets) orderType = "product";
        if (!hasProducts && hasTickets) orderType = "ticket";

        return {
          ...order,
          order_type: orderType,
        };
      });

      // Sort orders by created_at in ascending order
      const sortedOrders = processedOrders.sort(
        // (a, b) => new Date(a.order.created_at) - new Date(b.order.created_at)
        (a, b) => new Date(b.order.created_at) - new Date(a.order.created_at)
      );

      setAllOrders(sortedOrders);
      setFilteredData(sortedOrders);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.warn("Access token expired, attempting to refresh...");
        await handleTokenRefresh();
      } else {
        console.error("Failed to fetch data:", error);
      }
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch event statistics
        const [eventsRes, ordersRes] = await Promise.all([
          api.get("/api/events/event/"),
          api.get("/api/order/all/"),
        ]);

        const events = eventsRes.data;
        const today = new Date().toISOString().split("T")[0];
        // Calculate event statistics
        const totalEventsCount = events.length;
        const upcomingEventsCount = events.filter(
          (event) => event.date > today
        ).length;

        // Calculate revenue and tickets from orders
        const eventOrders = ordersRes.data || []; // Changed from ordersRes.data.orders_by_status
        console.log("Orders data:", eventOrders);

        const totalTicketsCount = eventOrders.reduce((sum, order) => {
          // Filter for ticket items (type 2) and sum their quantities
          const ticketItems =
            order.order_items?.filter((item) => item.type === 2) || [];
          const ticketSum = ticketItems.reduce(
            (itemSum, item) => itemSum + item.quantity,
            0
          );
          console.log(
            "Order ID:",
            order.order.id,
            "Ticket items:",
            ticketItems,
            "Sum:",
            ticketSum
          );
          return sum + ticketSum;
        }, 0);

        const totalRevenueCount = eventOrders.reduce((sum, order) => {
          // Calculate revenue only from ticket items
          const ticketItems =
            order.order_items?.filter((item) => item.type === 2) || [];
          return (
            sum +
            ticketItems.reduce(
              (itemSum, item) => itemSum + (item.quantity * item.price || 0),
              0
            )
          );
        }, 0);

        console.log("Total tickets count:", totalTicketsCount);
        console.log("Total revenue count:", totalRevenueCount);

        setTotalEvents(totalEventsCount);
        setUpcomingEvents(upcomingEventsCount);
        setTotalTickets(totalTicketsCount);
        setTotalRevenue(totalRevenueCount);
        setDashboardData({
          events,
          orders: eventOrders,
          monthly_data: ordersRes.data.monthly_orders || [],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Transform monthly data for line chart
  const monthlyData =
    dashboardData?.monthly_data?.map((item) => ({
      name: item.month,
      tickets: item.orders,
    })) || [];

  // Transform event status data for pie chart
  const eventStatusData = [
    { name: "Upcoming", value: upcomingEvents },
    { name: "Past", value: totalEvents - upcomingEvents },
  ];

  const COLORS = ["#FF9F1C", "#2EC4B6", "#E71D36", "#011627"];

  const statsData = [
    {
      name: "Total Events",
      count: totalEvents,
      color: "#FF9F1C",
      gradient: "linear-gradient(135deg, #FF9F1C 0%, #FFBF69 100%)",
    },
    {
      name: "Upcoming Events",
      count: upcomingEvents,
      color: "#2EC4B6",
      gradient: "linear-gradient(135deg, #2EC4B6 0%, #CBF3F0 100%)",
    },
    {
      name: "Total Tickets",
      count: totalTickets,
      color: "#E71D36",
      gradient: "linear-gradient(135deg, #E71D36 0%, #FF9F1C 100%)",
    },
    {
      name: "Total Revenue",
      count: `₹${totalRevenue}`,
      color: "#011627",
      gradient: "linear-gradient(135deg, #011627 0%, #2EC4B6 100%)",
    },
  ];

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
            <div className="mb-3 mb-md-0">
              <h1
                className="fw-bold mb-2"
                style={{
                  fontSize: window.innerWidth < 576 ? "1.75rem" : "2.5rem",
                  color: "#2EC4B6",
                }}
              >
                Event Sales Dashboard
              </h1>
              <p
                className="text-muted"
                style={{
                  fontSize: window.innerWidth < 576 ? "0.9rem" : "1.25rem",
                  color: "#666",
                }}
              >
                Track your event performance and sales metrics
              </p>
            </div>
          </div>
        </div>

        <div className="row g-3 g-md-4 mb-4 mb-md-5">
          {statsData.map((stat, index) => (
            <div key={index} className="col-6 col-md-6 col-lg-3">
              <div
                className="card shadow-sm h-100 border-0"
                style={{
                  background: stat.gradient,
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div className="card-body p-3 p-md-4">
                  <div className="d-flex flex-column">
                    <h6
                      className="text-white mb-2"
                      style={{
                        opacity: 0.9,
                        fontSize: window.innerWidth < 576 ? "0.8rem" : "1rem",
                        fontWeight: "500",
                      }}
                    >
                      {stat.name}
                    </h6>
                    <h2
                      className="text-white mb-0"
                      style={{
                        fontSize: window.innerWidth < 576 ? "1.5rem" : "2rem",
                        fontWeight: "600",
                      }}
                    >
                      {stat.count}
                    </h2>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: "100px",
                      height: "100px",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "50%",
                      transform: "translate(30%, 30%)",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-3 g-md-4">
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-header bg-white py-2 py-md-3 border-0">
                <h5
                  className="card-title mb-0 fw-bold"
                  style={{
                    fontSize: window.innerWidth < 576 ? "1rem" : "1.25rem",
                    color: "#FF6B6B",
                  }}
                >
                  Monthly Ticket Sales
                </h5>
              </div>
              <div className="card-body p-2 p-md-3">
                <ResponsiveContainer
                  width="100%"
                  height={window.innerWidth < 576 ? 200 : 300}
                >
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis
                      dataKey="name"
                      stroke="#6c757d"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="#6c757d" tick={{ fontSize: 12 }} />
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
                      dataKey="tickets"
                      stroke="#FF6B6B"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#FF6B6B" }}
                      activeDot={{ r: 6 }}
                      name="Tickets Sold"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-header bg-white py-2 py-md-3 border-0">
                <h5
                  className="card-title mb-0 fw-bold"
                  style={{
                    fontSize: window.innerWidth < 576 ? "1rem" : "1.25rem",
                    color: "#FF6B6B",
                  }}
                >
                  Event Status Distribution
                </h5>
              </div>
              <div className="card-body p-2 p-md-3">
                <ResponsiveContainer
                  width="100%"
                  height={window.innerWidth < 576 ? 200 : 300}
                >
                  <PieChart>
                    <Pie
                      data={eventStatusData}
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
                      {eventStatusData.map((entry, index) => (
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
                <h5 className="card-title mb-4" style={{ color: "#2EC4B6" }}>
                  Recent Events
                </h5>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Event Name</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Price</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.events
                        ?.sort((a, b) => new Date(a.date) - new Date(b.date))
                        ?.slice(-5)
                        ?.map((event, index) => (
                          <tr key={index}>
                            <td>{event.name}</td>
                            <td>
                              {new Date(event.date).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td>{event.address_line_1}</td>
                            <td>₹{event.price}</td>
                            <td>
                              <span
                                className={`badge ${
                                  event.date >
                                  new Date().toISOString().split("T")[0]
                                    ? "bg-success"
                                    : "bg-secondary"
                                }`}
                              >
                                {event.date >
                                new Date().toISOString().split("T")[0]
                                  ? "Upcoming"
                                  : "Past"}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4" style={{ color: "#2EC4B6" }}>
                  Top Selling Events
                </h5>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Event Name</th>
                        <th>Date</th>
                        <th>Tickets Sold</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.events
                        ?.map((event) => {
                          // Find orders for this event
                          const eventOrders =
                            dashboardData.orders?.filter(
                              (order) => order.event_id === event.id
                            ) || [];

                          // Calculate total tickets and revenue
                          const ticketsSold = eventOrders.reduce(
                            (sum, order) => {
                              // Filter for ticket items (type 2) and sum their quantities
                              const ticketItems =
                                order.order_items?.filter(
                                  (item) =>
                                    item.type === 2 && item.item === event.id
                                ) || [];
                              return (
                                sum +
                                ticketItems.reduce(
                                  (itemSum, item) => itemSum + item.quantity,
                                  0
                                )
                              );
                            },
                            0
                          );
                          const revenue = ticketsSold * event.price;

                          return {
                            ...event,
                            ticketsSold,
                            revenue,
                          };
                        })
                        ?.filter(
                          (event) =>
                            event.date > new Date().toISOString().split("T")[0]
                        )
                        ?.sort((a, b) => new Date(a.date) - new Date(b.date))
                        ?.map((event, index) => (
                          <tr key={index}>
                            <td>{event.name}</td>
                            <td>
                              {new Date(event.date).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td>{event.ticketsSold}</td>
                            <td>₹{event.revenue}</td>
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

export default EventDashboard;
