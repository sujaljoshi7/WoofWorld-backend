import axios from "axios";
import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../../constants";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import useUser from "../../hooks/useUser";
import { useParams, useNavigate } from "react-router-dom";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";

const BASE_URL = import.meta.env.VITE_API_URL;

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [order, setOrder] = useState(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchOrderDetails = async () => {
    setIsLoadingOrder(true);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingOrder(false);
      return;
    }
    try {
      // Fetch order details from the API
      const response = await api.get(`/api/order/${orderId}/`);
      setOrder(response.data);
      console.log(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");
        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          return fetchOrderDetails();
        }
      } else {
        console.error("Failed to fetch order details:", error);
        setError("Failed to load order details. Please try again later.");
      }
    } finally {
      setIsLoadingOrder(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    if (message) {
      const toastElement = document.getElementById("liveToast");
      if (toastElement) {
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
      }
    }
  }, [message]);

  const handleUpdateStatus = async (newStatus) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      return;
    }

    try {
      const response = await api.patch(`/api/order/${orderId}/update-status/`, {
        status: newStatus,
      });
      setMessage(response.data.message);
      fetchOrderDetails();
    } catch (error) {
      setError(error.response?.data?.message || "Error updating order status");
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (isLoadingOrder) {
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
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "calc(100vh - 4rem)" }}
          >
            <div
              className="spinner-border text-primary"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
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
          <div className="alert alert-warning" role="alert">
            Order not found
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // Process order items to determine types
  const orderItems = order.order_items || [];
  const hasProducts = orderItems.some((item) => item.type === 1);
  const hasTickets = orderItems.some((item) => item.type === 2);

  let orderType = "Mixed";
  if (hasProducts && !hasTickets) orderType = "Product";
  if (!hasProducts && hasTickets) orderType = "Ticket";

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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">Order Details</h1>
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </button>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Order #{order.order.order_id}</h5>
              <span
                className={`badge ${getStatusBadgeClass(
                  order.order.order_status === 1 ? "completed" : "pending"
                )}`}
              >
                {order.order.order_status === 1 ? "Completed" : "Pending"}
              </span>
            </div>
          </div>
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <h6 className="text-muted mb-2">Order Information</h6>
                <p className="mb-1">
                  <strong>Order ID:</strong> {order.order.order_id}
                </p>
                <p className="mb-1">
                  <strong>Order Type:</strong> {orderType}
                </p>
                <p className="mb-1">
                  <strong>Date:</strong> {formatDate(order.order.created_at)}
                </p>
                <p className="mb-1">
                  <strong>Payment ID:</strong> {order.order.payment_id}
                </p>
                <p className="mb-1">
                  <strong>Payment Status:</strong>{" "}
                  {order.order.payment_status === 1 ? "Paid" : "Pending"}
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="text-muted mb-2">Customer Information</h6>
                <p className="mb-1">
                  <strong>User ID:</strong> {order.order.user_id}
                </p>
                <p className="mb-1">
                  <strong>Total Amount:</strong> ${order.order.total.toFixed(2)}
                </p>
                <p className="mb-1">
                  <strong>Total Items:</strong>{" "}
                  {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
            </div>

            <h6 className="text-muted mb-3">Order Items</h6>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => {
                    let itemName = "Unknown Item";
                    let itemPrice = 0;

                    if (item.type === 1 && item.product) {
                      itemName = item.product.name;
                      itemPrice = item.product.price;
                    } else if (item.type === 2) {
                      itemName = "Event Ticket";
                      // You might want to fetch ticket price separately
                    }

                    const itemTotal = itemPrice * item.quantity;

                    return (
                      <tr key={item.id}>
                        <td>{itemName}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.type === 1 ? "bg-info" : "bg-primary"
                            }`}
                          >
                            {item.type === 1 ? "Product" : "Ticket"}
                          </span>
                        </td>
                        <td>{item.quantity}</td>
                        <td>${itemPrice.toFixed(2)}</td>
                        <td>${itemTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <td colSpan="4" className="text-end">
                      <strong>Total:</strong>
                    </td>
                    <td>
                      <strong>${order.order.total.toFixed(2)}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-4">
              <h6 className="text-muted mb-3">Update Order Status</h6>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-warning"
                  onClick={() => handleUpdateStatus("pending")}
                  disabled={order.order.order_status === 0}
                >
                  Mark as Pending
                </button>
                <button
                  className="btn btn-info"
                  onClick={() => handleUpdateStatus("processing")}
                >
                  Mark as Processing
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleUpdateStatus("completed")}
                  disabled={order.order.order_status === 1}
                >
                  Mark as Completed
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleUpdateStatus("cancelled")}
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
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

export default OrderDetails;
