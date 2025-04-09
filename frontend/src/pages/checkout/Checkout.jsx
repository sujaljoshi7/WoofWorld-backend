import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../admin/src/api";
import Navbar from "../../components/common/Navbar";
import "../../styles/Home.css";
import useUser from "../../../../admin/src/hooks/useUser";

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    fetchUserAddress();
    fetchCartItems();
  }, []);

  const fetchUserAddress = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/user/address/");
      if (response.data) {
        setAddress(response.data); // Use the first address
      } else {
        setError("No address found. Please add an address before checkout.");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setError("Failed to load your address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await api.get("/api/cart/");
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
        calculateTotal(response.data.items);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load your cart items. Please try again.");
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    setTotalAmount(total);
  };

  const handlePlaceOrder = async () => {
    if (!address) {
      setError("Please add an address before placing your order.");
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        address_id: address.id,
        items: cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      await api.post("/api/orders/create/", orderData);
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Failed to place your order. Please try again.");
    } finally {
      setLoading(false);
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
    <div className="main-content">
      <Navbar />
      <div className="container py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <div>
            <h1 className="fw-bold text-primary mb-2">Checkout</h1>
            <p className="text-muted">Complete your order</p>
          </div>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/cart")}
          >
            <i className="fas fa-arrow-left me-2"></i>Back to Cart
          </button>
        </div>

        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
            ></button>
          </div>
        )}

        <div className="row">
          <div className="col-md-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0">Shipping Address</h5>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="d-flex justify-content-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : address ? (
                  <div>
                    <p className="mb-1">
                      <strong>{address.name}</strong>
                    </p>
                    <p className="mb-1">{address.address_line_1}</p>
                    {address.address_line_2 && (
                      <p className="mb-1">{address.address_line_2}</p>
                    )}
                    <p className="mb-1">
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                    <p className="mb-1">{address.country}</p>
                    <p className="mb-0">Phone: {address.phone}</p>
                    <div className="mt-3">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => navigate("/profile")}
                      >
                        <i className="fas fa-edit me-1"></i>Edit Address
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="mb-3">No address found</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/profile/address")}
                    >
                      <i className="fas fa-plus me-1"></i>Add Address
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                {cartItems.length > 0 ? (
                  <div>
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex align-items-center mb-3 pb-3 border-bottom"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="rounded"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="ms-3 flex-grow-1">
                          <h6 className="mb-1">{item.product.name}</h6>
                          <p className="text-muted mb-0">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-end">
                          <h6 className="mb-0">
                            ${(item.price * item.quantity).toFixed(2)}
                          </h6>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="mb-0">Your cart is empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0">Order Total</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                  <span>Tax</span>
                  <span>${(totalAmount * 0.1).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total</strong>
                  <strong>${(totalAmount * 1.1).toFixed(2)}</strong>
                </div>
                <button
                  className="btn btn-primary w-100"
                  onClick={handlePlaceOrder}
                  disabled={loading || !address || cartItems.length === 0}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <i className="fas fa-shopping-cart me-2"></i>
                  )}
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
