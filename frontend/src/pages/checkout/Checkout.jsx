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
  const [allCartItems, setAllCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const TAX_RATE = 0.18;
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    fetchUserAddress();
    fetchCart();
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

  const fetchCart = async () => {
    setLoading(true);

    try {
      const response = await api.get("/api/cart/");
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Unexpected response format:", response.data);
        return;
      }

      // Add default quantity of 1 if not present in the response
      const cartItemsWithQuantity = response.data.map((item) => ({
        ...item,
        quantity: item.quantity || 1, // Default to 1 if quantity is not provided
      }));

      setAllCartItems(cartItemsWithQuantity);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");

        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          return fetchCart(); // Retry after refreshing
        }
      } else {
        console.error("Failed to fetch user data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getSubtotal = () => {
    return allCartItems.reduce(
      (total, item) => total + item.item_data.price * (item.quantity || 1),
      0
    );
  };

  const getTaxAmount = () => {
    return getSubtotal() * TAX_RATE;
  };

  const getTotal = () => {
    return getSubtotal() + getTaxAmount();
  };

  const handlePlaceOrder = async () => {
    if (!address) {
      setError("Please add an address before placing your order.");
      return;
    }

    try {
      setLoading(true);
      handlePayment();
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Failed to place your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateOrderId = () => {
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const randomNumber = Math.floor(Math.random() * 10000); // Random number between 0 and 9999
    return `ORD${timestamp}${randomNumber}`; // Combine timestamp and random number to form a unique order ID
  };

  const handlePayment = async () => {
    setIsLoadingPayment(true);
    try {
      // Request order creation from backend
      const orderId = generateOrderId();
      const response = await api.post("/api/payments/order/", {
        event_id: orderId,
        amount: getTotal(), // Ensure event.price is defined
      });

      const { order_id, amount, currency } = response.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY, // Public Razorpay key
        amount,
        currency,
        name: "WoofWorld",
        description: "Order",
        order_id,
        handler: async function (response) {
          // Make handler async
          try {
            const payment_id = response.razorpay_payment_id;
            const payment_status = 1; // Assuming 1 means success

            // Send payment success details to the backend
            const paymentSuccessResponse = await api.post("/api/order/", {
              payment_id: payment_id,
              payment_status: payment_status,
              order_id: order_id,
              subtotal: getSubtotal(),
              total_price: getTotal(),
            });

            if (paymentSuccessResponse.status === 201) {
              localStorage.setItem("order_id", order_id);
              try {
                const res = await api.post(`/api/notifications/`, {
                  message: `You have received a new order ${order_id} and is waiting for confirmation`,
                  category: "Orders",
                });
                navigate("/orderplaced");
              } catch (error) {
                navigate("/orderplaced");
              }
            } else {
              alert("Failed to place order after payment.");
            }
          } catch (error) {
            console.error("Error sending payment details to backend:", error);
            alert("Payment failed, please try again.");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
    } finally {
      setIsLoadingPayment(false);
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
            <h1 className="fw-bold text-dark mb-2">Checkout</h1>
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
                {allCartItems.length > 0 ? (
                  <div>
                    {allCartItems.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex align-items-center mb-3 pb-3 border-bottom"
                      >
                        {console.log(allCartItems)}
                        <img
                          src={item.item_data.image}
                          alt={item.item_data.name}
                          className="rounded"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                        <div className="ms-3 flex-grow-1">
                          <h6 className="mb-1">{item.item_data.name}</h6>
                          <p className="text-muted mb-0">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-end">
                          <h6 className="mb-0">
                            ₹{(item.item_data.price * item.quantity).toFixed(2)}
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
                  <span>₹{getSubtotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="d-flex justify-content-between mb-3 pb-3 border-bottom">
                  <span>Tax</span>
                  <span>₹{getTaxAmount().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total</strong>
                  <strong>₹{getTotal().toFixed(2)}</strong>
                </div>

                {allCartItems.length > 0 && !isLoadingPayment && (
                  <button
                    className="btn btn-dark w-100 mb-3 mt-3 py-2"
                    disabled={loading || !address || allCartItems === 0}
                    onClick={handlePayment}
                  >
                    <i className="fas fa-shopping-cart me-2"></i>
                    Place Order
                  </button>
                )}

                {isLoadingPayment && (
                  <div className="text-center mb-3 mt-3">
                    <div className="spinner-border text-success" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                {/* <button
                  style={{ height: "50px" }}
                  className="btn btn-dark w-100"
                  onClick={handlePlaceOrder}
                  disabled={loading || !address || allCartItems.length === 0}
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
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
