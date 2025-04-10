import React, { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import Sidebar from "../../layout/Sidebar";
import useUser from "../../hooks/useUser";
import api from "../../api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const { user, isLoading } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/api/orders/dashboard-stats/");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading || loading) {
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

  const stats = [
    {
      title: "Total Orders",
      value: dashboardData?.stats?.total_orders || 0,
      icon: "fas fa-shopping-cart",
      color: "primary",
    },
    {
      title: "Total Revenue",
      value: `₹${dashboardData?.stats?.total_revenue?.toLocaleString() || 0}`,
      icon: "fas fa-rupee-sign",
      color: "success",
    },
    {
      title: "Total Products",
      value: dashboardData?.stats?.total_products || 0,
      icon: "fas fa-box",
      color: "info",
    },
    {
      title: "Total Users",
      value: dashboardData?.stats?.total_users || 0,
      icon: "fas fa-users",
      color: "warning",
    },
  ];

  const monthlyOrdersData = {
    labels:
      dashboardData?.monthly_orders?.map((item) => {
        const date = new Date(item.month);
        return date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
      }) || [],
    datasets: [
      {
        label: "Orders",
        data: dashboardData?.monthly_orders?.map((item) => item.orders) || [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const ordersByStatusData = {
    labels: dashboardData?.orders_by_status?.map((item) => item.status) || [],
    datasets: [
      {
        label: "Orders by Status",
        data: dashboardData?.orders_by_status?.map((item) => item.count) || [],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 205, 86, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const topProductsData = {
    labels: dashboardData?.top_products?.map((item) => item.name) || [],
    datasets: [
      {
        label: "Top Selling Products",
        data: dashboardData?.top_products?.map((item) => item.quantity) || [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return value;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        tension: 0.4,
      },
    },
  };

  const ordersByStatusPieData = {
    labels:
      dashboardData?.orders_by_status?.map((item) => {
        // Convert status to title case
        return item.status.charAt(0).toUpperCase() + item.status.slice(1);
      }) || [],
    datasets: [
      {
        data: dashboardData?.orders_by_status?.map((item) => item.count) || [],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)", // Completed
          "rgba(255, 99, 132, 0.6)", // Pending
          "rgba(255, 205, 86, 0.6)", // Processing
          "rgba(54, 162, 235, 0.6)", // Shipped
          "rgba(153, 102, 255, 0.6)", // Cancelled
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 12,
          },
          padding: 20,
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => ({
                text: `${label}: ${data.datasets[0].data[i]}`,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].borderColor[i],
                lineWidth: 1,
                hidden: isNaN(data.datasets[0].data[i]),
                index: i,
              }));
            }
            return [];
          },
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="d-flex">
      <Sidebar user={user} />
      <div
        className="main-content flex-grow-1"
        style={{
          marginLeft: "280px",
          padding: "2rem",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <div className="container-fluid">
          <h1 className="fw-bold text-primary mb-4">Dashboard</h1>

          <div className="row mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3 mb-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">{stat.title}</h6>
                        <h3 className="mb-0">{stat.value}</h3>
                      </div>
                      <div
                        className={`icon-circle bg-${stat.color}-subtle text-${stat.color}`}
                      >
                        <i className={stat.icon}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-md-8 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary mb-4">
                    Monthly Orders Trend
                  </h5>
                  <div style={{ height: "300px" }}>
                    <Line
                      data={monthlyOrdersData}
                      options={lineChartOptions}
                      redraw={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary mb-4">
                    Orders Distribution
                  </h5>
                  <div style={{ height: "300px" }}>
                    <Pie
                      data={ordersByStatusPieData}
                      options={pieChartOptions}
                      redraw={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
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
    </div>
  );
}

export default Dashboard;
