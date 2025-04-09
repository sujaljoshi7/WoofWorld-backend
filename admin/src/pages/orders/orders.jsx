import axios from "axios";
import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { exportToCSV } from "../../utils/export";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";

const BASE_URL = import.meta.env.VITE_API_URL;

function ViewOrders() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [allOrders, setAllOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState("all"); // "all", "tickets", "products"
  const itemsPerPage = 5;

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (allOrders) {
      const filtered = allOrders.filter((item) =>
        `${item.order_id} ${item.customer_name} ${item.status} ${item.type}`
          .toLowerCase()
          .includes(value)
      );
      setFilteredData(filtered);
    }
  };

  const date_format = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingOrders(false);
      return;
    }
    try {
      // Fetch all orders from a single endpoint
      const response = await api.get("/api/order/all/");

      // Process the orders
      const processedOrders = response.data.map((orderWrapper) => {
        const order = orderWrapper.order;
        const orderItems = orderWrapper.order_items;

        // Calculate total quantity
        const totalQuantity = orderItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        // Process items
        const items = orderItems
          .map((item) => {
            if (item.type === 1) {
              // Product
              return {
                name: item.product ? item.product.name : "Unknown Product",
                quantity: item.quantity,
                price: item.product ? item.product.price : 0,
                type: "product",
              };
            } else if (item.type === 2) {
              // Event ticket
              return {
                name: "Event Ticket", // You might want to fetch event details separately
                quantity: item.quantity,
                price: 0, // You might want to fetch ticket price separately
                type: "ticket",
              };
            }
            return null;
          })
          .filter(Boolean);

        // Determine if it's a mixed order (contains both products and tickets)
        const hasProducts = orderItems.some((item) => item.type === 1);
        const hasTickets = orderItems.some((item) => item.type === 2);

        let orderType = "mixed";
        if (hasProducts && !hasTickets) orderType = "product";
        if (!hasProducts && hasTickets) orderType = "ticket";

        return {
          ...order,
          type: orderType,
          order_id: order.order_id,
          total_amount: order.total,
          total_quantity: totalQuantity,
          items: items,
          created_at: order.created_at,
          status: order.order_status === 1 ? "completed" : "pending",
        };
      });

      // Sort by date (newest first)
      const sortedOrders = processedOrders.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setAllOrders(sortedOrders);
      setFilteredData(sortedOrders);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");
        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          return fetchOrders();
        }
      } else {
        console.error("Failed to fetch orders data:", error);
      }
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (message) {
      const toastElement = document.getElementById("liveToast");
      if (toastElement) {
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
      }
    }

    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 60000);

    return () => clearInterval(interval);
  }, [message]);

  useEffect(() => {
    // Filter orders based on active tab
    if (allOrders.length > 0) {
      if (activeTab === "all") {
        setFilteredData(allOrders);
      } else if (activeTab === "tickets") {
        setFilteredData(allOrders.filter((order) => order.type === "ticket"));
      } else if (activeTab === "products") {
        setFilteredData(allOrders.filter((order) => order.type === "product"));
      }
    }
  }, [activeTab, allOrders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      return;
    }

    try {
      const order = allOrders.find((o) => o.order_id === orderId);
      const isTicketOrder = order.type === "ticket";
      const baseId = orderId.split("-")[1];

      const endpoint = isTicketOrder
        ? `/api/orders/tickets/${baseId}/update-status/`
        : `/api/orders/products/${baseId}/update-status/`;

      const response = await api.patch(endpoint, { status: newStatus });
      setMessage(response.data.message);
      fetchOrders();
    } catch (error) {
      setError(error.response?.data?.message || "Error updating order status");
    }
  };

  const handleExport = () => {
    const formattedData = filteredData.map((item) => ({
      order_id: item.order_id,
      type: item.type === "ticket" ? "Ticket" : "Product",
      customer_name: item.customer_name,
      customer_email: item.customer_email,
      total_amount: item.total_amount,
      status: item.status,
      created_at: new Date(item.created_at).toLocaleDateString(
        "en-GB",
        date_format
      ),
      items: item.items
        .map((item) => `${item.name} (${item.quantity} x $${item.price})`)
        .join(", "),
    }));

    exportToCSV(
      formattedData,
      [
        "Order ID",
        "Type",
        "Customer Name",
        "Customer Email",
        "Total Amount",
        "Status",
        "Date",
        "Items",
      ],
      [
        "order_id",
        "type",
        "customer_name",
        "customer_email",
        "total_amount",
        "status",
        "created_at",
        "items",
      ],
      "orders.csv"
    );
  };

  const handleRowClick = (order_id) => {
    navigate(`/orders/${order_id}`);
  };

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning";
      case "processing":
        return "bg-info";
      case "completed":
        return "bg-success";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  if (isLoading) {
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
      <Sidebar user={user} />
      <div
        className="main-content flex-grow-1"
        style={{
          marginLeft: "280px",
          padding: "2rem",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h1 className="h3 mb-0">Orders</h1>
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <button className="btn btn-success" onClick={handleExport}>
              Export to CSV
            </button>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                  onClick={() => setActiveTab("all")}
                >
                  All Orders
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "tickets" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("tickets")}
                >
                  Ticket Orders
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "products" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("products")}
                >
                  Product Orders
                </button>
              </li>
            </ul>

            <div className="table-responsive">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Type</th>
                    <th>Customer</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((order) => (
                    <tr
                      key={order.order_id}
                      onClick={() => handleRowClick(order.order_id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <span className="fw-medium">{order.order_id}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            order.type === "ticket"
                              ? "bg-primary"
                              : order.type === "product"
                              ? "bg-info"
                              : "bg-secondary"
                          }`}
                        >
                          {order.type === "ticket"
                            ? "Ticket"
                            : order.type === "product"
                            ? "Product"
                            : "Mixed"}
                        </span>
                      </td>
                      <td>
                        <div className="fw-medium">
                          User ID: {order.user_id}
                        </div>
                        <small className="text-muted">
                          Order ID: {order.id}
                        </small>
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          {order.total_quantity} items
                        </span>
                      </td>
                      <td>
                        <span className="fw-medium">
                          ₹{order.total_amount.toFixed(2)}
                        </span>
                      </td>
                      <td>
                        {new Date(order.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Update Status
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(order.order_id, "pending");
                                }}
                              >
                                Pending
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(
                                    order.order_id,
                                    "processing"
                                  );
                                }}
                              >
                                Processing
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(
                                    order.order_id,
                                    "completed"
                                  );
                                }}
                              >
                                Completed
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateStatus(
                                    order.order_id,
                                    "cancelled"
                                  );
                                }}
                              >
                                Cancelled
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Pagination
            pageCount={pageCount}
            onPageChange={handlePageClick}
            currentPage={currentPage}
          />
        </div>

        <div
          className="toast-container position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 11 }}
        >
          <div
            id="liveToast"
            className="toast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="me-auto">Notification</strong>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body">{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewOrders;
