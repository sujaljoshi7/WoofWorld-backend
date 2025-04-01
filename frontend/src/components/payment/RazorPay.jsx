import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logo/logo1.png";
import api from "../../api"; // Import API utility

const RazorpayCheckout = () => {
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Fetch the order data from the backend using api.fetch
    const fetchOrderData = async () => {
      try {
        const data = await api.get("/api/payments/order");
        setOrderData(data);
      } catch (error) {
        console.error("Failed to fetch order data:", error);
      }
    };

    fetchOrderData();
  }, []);

  const initiatePayment = () => {
    console.log("Checking orderData:", orderData); // Debugging

    if (orderData) {
      console.log("Order Data Exists:", orderData); // Debugging

      const options = {
        key: "rzp_test_RJaa2N22UrDs5b",
        amount: orderData.data.amount,
        currency: orderData.currency,
        name: "WoofWorld",
        description: "Payment for Dog Services",
        image: logo,
        order_id: orderData.id,
        handler: function (response) {
          alert(
            "Payment successful! Payment ID: " + response.razorpay_payment_id
          );
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "1234567890",
        },
        notes: {
          address: "Customer Address",
        },
        theme: {
          color: "#F37254",
        },
      };

      console.log("Initializing Razorpay:", options); // Debugging

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } else {
      console.error("Order data not loaded");
      alert("Order data not loaded");
    }
  };

  return (
    <div>
      {orderData ? (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <div
            className="card shadow-lg p-4 border-0"
            style={{ maxWidth: "450px" }}
          >
            <div className="card-body text-center">
              <h3 className="card-title mb-4 text-primary">Order Details</h3>
              {orderData ? (
                <>
                  <p className="fw-bold">
                    Order ID:{" "}
                    <span className="text-muted">{orderData.data.id}</span>
                  </p>
                  <p className="fw-bold">
                    Amount:{" "}
                    <span className="text-success">
                      ₹{orderData.data.amount / 100}
                    </span>
                  </p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={initiatePayment}
                  >
                    Pay Now
                  </button>
                </>
              ) : (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
};

export default RazorpayCheckout;
