import axios from "axios";
import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { exportToCSV } from "../../utils/export";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";

function ViewOrders() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const itemsPerPage = 5;
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (allOrders) {
      const filtered = allOrders.filter((item) => {
        const searchableFields = [
          item.order.order_id?.toString() || "",
          item.order.payment_id?.toString() || "",
          item.order.payment_status?.toString() || "",
          item.order.status?.toString() || "",
          item.order.created_at?.toString() || "",
          item.order_type?.toString() || "",
        ];

        return searchableFields.some((field) =>
          field.toLowerCase().includes(value)
        );
      });
      setFilteredData(filtered);
    }
  };
  const date_format = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  const fetchUserData = async () => {
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
      console.log(sortedOrders);
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
    fetchUserData();

    const interval = setInterval(() => {
      fetchUserData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const token = localStorage.getItem(ACCESS_TOKEN);
      await api.patch(
        `/api/order/${orderId}/update-status/`,
        { order_status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUserData();
    } catch (error) {
      console.error("Error updating order status:", error);
      if (error.response && error.response.status === 401) {
        await handleTokenRefresh();
      }
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleRowClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleExport = () => {
    const exportData = filteredData.map((item) => ({
      "Order ID": item.order.order_id,
      "Order Type": item.order_type,
      "Payment ID": item.order.payment_id,
      "Payment Status": item.order.payment_status,
      "Order Status": item.order.status,
      "Total Amount": item.order.total,
      "Created At": new Date(item.order.created_at).toLocaleDateString(
        undefined,
        date_format
      ),
    }));

    exportToCSV(exportData, "orders");
  };

  const filterOrdersByType = (type) => {
    if (type === "all") return filteredData;
    return filteredData.filter((item) => item.order_type === type);
  };

  const getOrderTypeBadge = (type) => {
    const badges = {
      product: "bg-info",
      ticket: "bg-primary",
      mixed: "bg-secondary",
    };
    return badges[type] || "bg-secondary";
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      1: { class: "bg-warning", text: "Pending" },
      2: { class: "bg-info", text: "Processing" },
      3: { class: "bg-primary", text: "Shipped" },
      4: { class: "bg-success", text: "Out for Delivery" },
      5: { class: "bg-success", text: "Delivered" },
      6: { class: "bg-danger", text: "Cancelled" },
    };
    return statusMap[status] || { class: "bg-secondary", text: "Unknown" };
  };

  const pageCount = Math.ceil(
    filterOrdersByType(activeTab).length / itemsPerPage
  );
  const paginatedData = filterOrdersByType(activeTab).slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  if (isLoadingUser) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <div className="sidebar">
        <Sidebar user={user} />
      </div>
      <div
        className="main-content flex-grow-1 ms-2"
        style={{ marginLeft: "280px", padding: "20px" }}
      >
        <div className="container-fluid mt-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Orders</h2>
            <button className="btn btn-success" onClick={handleExport}>
              <i className="fas fa-file-export me-2"></i>Export to CSV
            </button>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text border-0">
                      <i className="fa fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control  custom-placeholder-dark"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="btn-group float-end" role="group">
                    <button
                      type="button"
                      className={`btn ${
                        activeTab === "all"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setActiveTab("all")}
                    >
                      All Orders
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        activeTab === "ticket"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setActiveTab("ticket")}
                    >
                      Ticket Orders
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        activeTab === "product"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setActiveTab("product")}
                    >
                      Product Orders
                    </button>
                    <button
                      type="button"
                      className={`btn ${
                        activeTab === "mixed"
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setActiveTab("mixed")}
                    >
                      Mixed Orders
                    </button>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table">
                    <tr>
                      <th>Order ID</th>
                      <th>Type</th>
                      <th>Payment Status</th>
                      <th>Order Status</th>
                      <th>Total Amount</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((item) => (
                        <tr
                          key={item.order.id}
                          onClick={() => handleRowClick(item.order.id)}
                          style={{ cursor: "pointer" }}
                          className="hover-highlight"
                        >
                          <td className="fw-medium">{item.order.order_id}</td>
                          <td>
                            <span
                              className={`badge ${getOrderTypeBadge(
                                item.order_type
                              )}`}
                            >
                              {item.order_type.charAt(0).toUpperCase() +
                                item.order_type.slice(1)}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                item.order.payment_status === 1
                                  ? "bg-success"
                                  : "bg-warning"
                              }`}
                            >
                              {item.order.payment_status === 1
                                ? "Completed"
                                : "Incomplete"}
                            </span>
                          </td>
                          <td>
                            <div className="position-relative">
                              <select
                                className={`form-select form-select-sm text-white`}
                                value={item.order.order_status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    item.order.id,
                                    parseInt(e.target.value)
                                  )
                                }
                                onClick={(e) => e.stopPropagation()}
                                disabled={updatingOrderId === item.order.id}
                              >
                                <option value={1}>Pending</option>
                                <option value={2}>Processing</option>
                                <option value={3}>Shipped</option>
                                <option value={4}>Out for Delivery</option>
                                <option value={5}>Delivered</option>
                                <option value={6}>Cancelled</option>
                              </select>
                              {updatingOrderId === item.order.id && (
                                <div className="position-absolute top-50 start-50 translate-middle">
                                  <div
                                    className="spinner-border spinner-border-sm text-light"
                                    role="status"
                                  >
                                    <span className="visually-hidden">
                                      Loading...
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="fw-bold">
                            ₹{item.order.total.toFixed(2)}
                          </td>
                          <td>
                            {new Date(item.order.created_at).toLocaleDateString(
                              undefined,
                              date_format
                            )}
                          </td>
                          <td onClick={(e) => e.stopPropagation()}>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleRowClick(item.order.id)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          <div className="text-muted">No orders found</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted">
                  Showing {paginatedData.length} of{" "}
                  {filterOrdersByType(activeTab).length} orders
                </div>
                <Pagination
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewOrders;
