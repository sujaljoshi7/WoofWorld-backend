import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const [orderId, setOrderId] = useState("");
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    // Generate a random order ID

    setOrderId(localStorage.getItem("order_id"));

    // Countdown timer for redirection
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate("/"); // Redirect to home page
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div
      className="container d-flex justify-content-center align-items-center vh-100"
      style={{ height: "100%" }}
    >
      <div
        className="card bg-success text-light text-center p-4 shadow-lg rounded-4"
        style={{ width: "100%", height: "80%" }}
      >
        <div className="card-body d-flex flex-column justify-content-center align-items-center">
          <h2 className="card-title fw-bold">🎉 Order Confirmed! 🎉</h2>
          <p className="card-text fs-5">
            Thank you for your purchase! Your order is on its way. 🚀
          </p>
          <h4 className="mt-3">
            Order ID: <strong>{orderId}</strong>
          </h4>
          <p className="mt-3">
            Redirecting to the home page in <strong>{countdown}</strong>{" "}
            seconds... ⏳
          </p>
          <p className="mt-2">
            We appreciate your trust in us. Stay tuned for updates! 😊
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
