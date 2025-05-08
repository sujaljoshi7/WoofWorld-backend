import axios from "axios";
import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../../constants";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import useUser from "../../hooks/useUser";
import { useParams, useNavigate } from "react-router-dom";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
      case "Placed":
        return "bg-warning";
      case "Packed":
        return "bg-info";
      case "in transit":
        return "bg-info";
      case "out for delivery":
        return "bg-success";
      case "delivered":
        return "bg-success";
      case "cancel":
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
          <div>
            <button
              className="btn btn-success me-2"
              onClick={() => navigate(`/invoice/${orderId}`)}
            >
              <i className="fas fa-file-download me-2"></i>Download Invoice
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/orders")}
            >
              Back to Orders
            </button>
          </div>
        </div>

        {isLoadingOrder ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {/* Order Information */}
            <div className="col-md-8">
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 text-dark">
                      Order #{order.order.order_id}
                    </h5>
                    <span
                      className={`badge ${getStatusBadgeClass(
                        order.order.order_status
                      )}`}
                    >
                      {order.order.order_status === 1
                        ? "Pending"
                        : order.order.order_status === 2
                        ? "Processing"
                        : order.order.order_status === 3
                        ? "Shipped"
                        : order.order.order_status === 4
                        ? "Delivered"
                        : order.order.order_status === 5
                        ? "Cancelled"
                        : order.order.order_status === 6
                        ? "Refunded"
                        : "Unknown"}
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
                        <strong>Date:</strong>{" "}
                        {formatDate(order.order.created_at)}
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
                      <h6 className="text-muted mb-2">Order Summary</h6>
                      <p className="mb-1">
                        <strong>Total Amount:</strong> ₹
                        {order.order.total.toFixed(2)}
                      </p>
                      <p className="mb-1">
                        <strong>Total Items:</strong>{" "}
                        {orderItems.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}
                      </p>
                      <p className="mb-1">
                        <strong>Order Type:</strong> {orderType}
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
                            itemName = item.event_details.title;
                            itemPrice = item.event_details.price;
                          }

                          const itemTotal = itemPrice * item.quantity;

                          return (
                            <tr key={item.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  {item.type === 1 && item.product?.image && (
                                    <img
                                      src={item.product.image}
                                      alt={itemName}
                                      className="me-2"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        objectFit: "cover",
                                      }}
                                    />
                                  )}
                                  <div>
                                    <div className="fw-bold">{itemName}</div>
                                    {item.type === 1 && item.product?.sku && (
                                      <small className="text-muted">
                                        SKU: {item.product.sku}
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </td>
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
                              <td>₹{itemPrice.toFixed(2)}</td>
                              <td>₹{itemTotal.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Price Breakdown */}
                  <div className="mt-4">
                    <h6 className="text-muted mb-3">Price Breakdown</h6>
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6 offset-md-3">
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-muted">Subtotal</span>
                              <span className="fw-medium">
                                ₹{((order.order.total / 118) * 100).toFixed(2)}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-muted">Shipping</span>
                              <span className="fw-medium">
                                ₹{order.shipping_charge || 0}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-muted">Tax</span>
                              <span className="fw-medium">
                                ₹
                                {(
                                  order.order.total -
                                  (order.order.total / 118) * 100
                                ).toFixed(2)}
                              </span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                              <span className="fw-bold">Total Amount</span>
                              <span className="fw-bold">
                                ₹{order.order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="col-md-4">
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-light text-dark">
                  <h5 className="card-title mb-0">Customer Information</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Contact Details</h6>
                    <p className="mb-1">
                      <strong>Name:</strong> {order.user?.first_name}{" "}
                      {order.user?.last_name}
                    </p>
                    <p className="mb-1">
                      <strong>Email:</strong> {order.user?.email}
                    </p>
                    <p className="mb-1">
                      <strong>Username:</strong> {order.user?.username}
                    </p>
                  </div>

                  <div>
                    <h6 className="text-muted mb-2">Shipping Address</h6>
                    {order.user?.address ? (
                      <>
                        <p className="mb-1">
                          <strong>Name:</strong> {order.user.address.name}
                        </p>
                        <p className="mb-1">
                          <strong>Address:</strong>{" "}
                          {order.user.address.address_line_1}
                          {order.user.address.address_line_2 && (
                            <>, {order.user.address.address_line_2}</>
                          )}
                        </p>
                        <p className="mb-1">
                          <strong>City:</strong> {order.user.address.city}
                        </p>
                        <p className="mb-1">
                          <strong>State:</strong> {order.user.address.state}
                        </p>
                        <p className="mb-1">
                          <strong>Country:</strong> {order.user.address.country}
                        </p>
                        <p className="mb-1">
                          <strong>Postal Code:</strong>{" "}
                          {order.user.address.postal_code}
                        </p>
                        <p className="mb-1">
                          <strong>Phone:</strong> {order.user.address.phone}
                        </p>
                      </>
                    ) : (
                      <p className="text-muted">No address available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Status Update */}
              <div className="card shadow-sm">
                <div className="card-header bg-light text-dark">
                  <h5 className="card-title mb-0">Update Order Status</h5>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleUpdateStatus(1)}
                      disabled={order.order.order_status === 1}
                    >
                      Mark as Pending
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleUpdateStatus(2)}
                      disabled={order.order.order_status === 2}
                    >
                      Mark as Packed
                    </button>
                    <button
                      className="btn btn-info"
                      onClick={() => handleUpdateStatus(3)}
                      disabled={order.order.order_status === 3}
                    >
                      Mark as In Transit
                    </button>
                    <button
                      className="btn btn-light"
                      onClick={() => handleUpdateStatus(4)}
                      disabled={order.order.order_status === 4}
                    >
                      Mark as Out for Delivery
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => handleUpdateStatus(5)}
                      disabled={order.order.order_status === 5}
                    >
                      Mark as Delivered
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleUpdateStatus(6)}
                      disabled={order.order.order_status === 6}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
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
