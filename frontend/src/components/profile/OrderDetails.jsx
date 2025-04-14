import React, { useState, useEffect } from "react";
import api from "../../api";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";

const OrderDetails = ({ orderId, onClose }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const response = await api.get(`/api/order/`);
        const orderData = response.data.find(
          (order) => order.order.id === orderId
        );

        if (orderData) {
          // Filter only product items (type 1) and they already have product details
          const productItems = orderData.order_items.filter(
            (item) => item.type === 1 && item.product
          );
          setOrderItems(productItems);
          setOrderData(orderData.order);
        } else {
          setError("Order not found");
        }
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const refreshed = await handleTokenRefresh();
            if (refreshed) {
              return fetchOrderItems();
            } else {
              console.error("Token refresh failed.");
              localStorage.clear();
              window.location.reload();
            }
          } catch (refreshError) {
            console.error("Error during token refresh:", refreshError);
            localStorage.clear();
            window.location.reload();
          }
        } else {
          console.error("Failed to fetch order items:", error);
          setError("Failed to load order details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [orderId]);

  // Calculate price breakdown
  const calculatePriceBreakdown = () => {
    if (!orderItems.length)
      return { subtotal: 0, tax: 0, shipping: 0, total: 0 };

    // Calculate subtotal
    const subtotal = orderItems.reduce((sum, item) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);

    // Calculate tax (assuming 10% tax rate)
    const tax = subtotal * 0.18;

    // Shipping is free for orders over ₹500, otherwise ₹50
    const shipping = 0;

    // Calculate total
    const total = subtotal + tax + shipping;

    return { subtotal, tax, shipping, total };
  };

  const priceBreakdown = calculatePriceBreakdown();

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Order Details</h5>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body">
        {orderItems.length > 0 ? (
          <>
            <div className="table-responsive mb-4">
              <table className="table table-hover">
                <thead className="bg-light">
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={
                              item.product?.image ||
                              "https://via.placeholder.com/50x50?text=No+Image"
                            }
                            alt={item.product?.name || "Product"}
                            className="me-2"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/50x50?text=No+Image";
                            }}
                          />
                          <span>{item.product?.name || "Unknown Product"}</span>
                        </div>
                      </td>
                      <td>{item.product?.category?.name || "N/A"}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.product?.price || 0}</td>
                      <td>₹{(item.product?.price || 0) * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Price Breakdown */}
            <div className="card border-0 bg-light">
              <div className="card-body">
                <h6 className="mb-3">Price Breakdown</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{priceBreakdown.subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (18%):</span>
                  <span>₹{priceBreakdown.tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>
                    {priceBreakdown.shipping === 0
                      ? "Free"
                      : `₹${priceBreakdown.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="d-flex justify-content-between fw-bold pt-2 border-top">
                  <span>Total:</span>
                  <span>₹{priceBreakdown.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="alert alert-info">No items found in this order.</div>
        )}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
