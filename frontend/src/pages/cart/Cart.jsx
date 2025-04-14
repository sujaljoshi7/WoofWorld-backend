import { useState, useEffect } from "react";
import Trash from "../../assets/images/icons/remove.png";
import Navbar from "../../components/common/Navbar";
import image from "../../assets/images/hero/image1.jpg";
import api from "../../api";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";
import { ACCESS_TOKEN } from "../../constants";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [allCartItems, setAllCartItems] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const TAX_RATE = 0.18; // 18% tax rate
  const navigate = useNavigate();

  const fetchCart = async () => {
    setIsLoadingCart(true);

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
      setIsLoadingCart(false);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    // Ensure quantity stays between 1 and 10
    const updatedQuantity = Math.min(10, Math.max(1, newQuantity));

    setAllCartItems(
      allCartItems.map((item) =>
        item.id === id ? { ...item, quantity: updatedQuantity } : item
      )
    );

    // Update the quantity on the server
    updateCartItemQuantity(id, updatedQuantity);
  };

  // Optionally add a function to update the quantity on the server
  const updateCartItemQuantity = async (id, newQuantity) => {
    const updatedQuantity = Math.max(1, newQuantity);
    try {
      const response = await api.patch(
        "api/cart/",
        {
          item_id: id,
          quantity: updatedQuantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN}`, // Replace with actual token
          },
        }
      );

      setAllCartItems(
        allCartItems.map((item) =>
          item.id === id ? { ...item, quantity: response.data.quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = (id) => {
    setAllCartItems(allCartItems.filter((item) => item.id !== id));

    // You may want to remove the item on the server as well
    removeCartItemFromServer(id);
  };

  // Optionally add a function to remove the item on the server
  const removeCartItemFromServer = async (id) => {
    try {
      await api.delete("/api/cart/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`, // Add auth token
        },
        data: { item_id: id }, // Send item_id properly
      });
      navigate(0);
    } catch (error) {
      console.error("Failed to remove item from server:", error);
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
              total_price: getTotal(),
            });

            if (paymentSuccessResponse.status === 201) {
              localStorage.setItem("order_id", order_id);
              navigate("/orderplaced");
              // Optionally, navigate to order confirmation page or clear cart
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

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div>
      <div className="main-content">
        <Navbar />
        <div className="container mt-5">
          <h5 className="text-center text-bold">Your Shopping Cart</h5>
          <p className="mb-4 text-center text-secondary">
            Review your products before checkout
          </p>
          {isLoadingCart ? (
            <p className="text-center">Loading your cart...</p>
          ) : allCartItems.length === 0 ? (
            <p className="text-muted text-center">Your cart is empty.</p>
          ) : (
            <div className="row">
              <div className="col-md-8">
                {allCartItems.map((item) => (
                  <div
                    key={item.id}
                    className="card shadow-sm p-3 d-flex align-items-center mb-3 border-0"
                  >
                    <div className="d-flex align-items-center w-100">
                      <img
                        src={item.item_data?.image}
                        alt={item.id}
                        className="me-3 rounded"
                        style={{
                          width: "200px",
                          height: "130px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="flex-grow-1">
                        <h5 className="mb-1 fw-semibold">
                          {item.item_data?.name}
                        </h5>
                        <p className="text-muted mb-1 small">
                          {item.type === 2 ? "Event Ticket" : "Product"}
                        </p>
                        <p className="fw-bold text-primary">
                          ₹{item.item_data.price}
                        </p>
                      </div>
                      <div className="d-flex align-items-center ms-auto gap-2">
                        <div className="input-group" style={{ width: "120px" }}>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() =>
                              updateQuantity(item.id, (item.quantity || 1) - 1)
                            }
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={item.quantity || 1}
                            readOnly
                            className="form-control text-center border-secondary"
                          />
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() =>
                              updateQuantity(item.id, (item.quantity || 1) + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="btn"
                          onClick={() => removeItem(item.id)}
                        >
                          <img
                            src={Trash}
                            alt="Delete"
                            style={{ width: "20px", height: "20px" }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order summary card */}
              <div className="col-md-4">
                <div className="card shadow">
                  <div className="card-body">
                    <h5 className="card-title text-bold">Order summary </h5>
                    <div className="card-content mt-4">
                      <div className="d-flex justify-content-between mb-1">
                        <p className="card-text m-0">Subtotal</p>
                        <p className="card-text m-0 text-end">
                          ₹{getSubtotal().toFixed(2)}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <p className="card-text m-0">Shipping</p>
                        <p className="card-text m-0 text-success text-end">
                          ₹0.00
                        </p>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <p className="card-text m-0">Tax (18%)</p>
                        <p className="card-text m-0 text-end">
                          ₹{getTaxAmount().toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <hr
                      className="border-0"
                      style={{ height: "1px", backgroundColor: "black" }}
                    />
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <h5 className="text-bold m-0">Total</h5>
                      <h5 className="text-bold m-0">
                        ₹{getTotal().toFixed(2)}
                      </h5>
                    </div>
                  </div>
                </div>

                {allCartItems.length > 0 && !isLoadingPayment && (
                  <button
                    className="btn btn-success w-100 mb-3 mt-3 py-2 fw-bold"
                    // onClick={handlePayment}
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed to Checkout
                  </button>
                )}

                {isLoadingPayment && (
                  <div className="text-center mb-3 mt-3">
                    <div className="spinner-border text-success" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
