import React, { useState, useEffect } from "react";
import logo from "../../../assets/images/logo/logo1.png";
import api from "../../../api";
import { ACCESS_TOKEN } from "../../../constants";
import { useLocation, useNavigate } from "react-router-dom";
function OTPVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const email = localStorage.getItem("email") || "";

  const handleVerify = async (e) => {
    e.preventDefault();
    showMessage(""); // Clear previous messages

    if (!otp || otp.length !== 6) {
      showMessage("❌ Please enter a valid 6-digit OTP.", "danger");
      return;
    }

    let token = localStorage.getItem("access_token"); // Get token

    try {
      // 🔹 Make the OTP verification request
      let response = await api.post(
        "api/otp/verify-otp/",
        {
          email: localStorage.getItem("email"),
          otp: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        showMessage("✅ OTP Verified Successfully!", "success");
        navigate("/");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);

      if (error.response && error.response.status === 401) {
        console.log("🔄 Token expired, refreshing...");

        // 🔹 Refresh the token
        try {
          const refreshResponse = await api.post("/api/token/refresh/", {
            refresh: localStorage.getItem("refresh_token"),
          });

          const newToken = refreshResponse.data.access;
          localStorage.setItem("access_token", newToken);
          token = newToken; // Update token

          // 🔹 Retry OTP Verification with the new token
          const retryResponse = await api.post(
            "api/otp/verify-otp/",
            {
              email: localStorage.getItem("email"),
              otp: otp,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (retryResponse.status === 200) {
            showMessage("✅ OTP Verified Successfully!", "success");
            navigate("/");
          } else {
            showMessage("❌ OTP verification failed. Try again.", "danger");
          }
        } catch (refreshError) {
          console.log("❌ Refresh token expired. Redirecting to login.");
          localStorage.clear();
          showMessage("❌ Session expired. Please log in again.", "danger");
          navigate("/login");
        }
      } else {
        showMessage("❌ " + error.response.data.error, "danger");
        // setMessage("❌ Server error. Please try again later.");
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Allow only numbers & limit to 6 digits
    setOtp(value);
  };

  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    showMessage("✅ OTP sent successfully!", "success"); // Show message when page loads
  }, []);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
    }, 3000); // Hide message after 3 seconds
  };

  const handleResendOTP = () => {
    handleResend();
    setTimer(30);
    setIsResendDisabled(true);
  };

  const handleResend = async () => {
    try {
      const response = await api.post("/api/user/resend-otp/", { email });

      if (response.status === 200) {
        alert("A new OTP has been sent to your email.");
        console.log("OTP resent successfully!");
      } else {
        alert(response.data.error || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "0 15px",
        backgroundColor: "#fff7e6",
      }}
    >
      {message && (
        <div className="col-12 col-sm-auto mt-4 mt-sm-0">
          <div
            className="position-fixed top-0 end-0 p-3"
            style={{ zIndex: 11 }} // React style syntax
          >
            <div
              id="liveToast"
              className={`toast show ${
                messageType === "success" ? "bg-success" : "bg-danger"
              } text-white`} // ✅ Ensure toast is visible
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <div
                className={`toast-header ${
                  messageType === "success"
                    ? "bg-success text-white"
                    : "bg-danger"
                }`}
              >
                <strong className="me-auto">WoofWorld</strong>
                <small>Just Now</small>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="toast"
                  aria-label="Close"
                  onClick={() => showMessage("")} // ✅ Close on click
                ></button>
              </div>
              <div className="toast-body">{message}</div>
            </div>
          </div>
        </div>
      )}
      <img src={logo} alt="Logo" width={100} style={{ marginBottom: "20px" }} />
      <div
        className="card shadow-lg border-0 rounded-3 p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="card-body text-center">
          <h2 className="fw-bold mb-3">OTP Verification</h2>
          <p className="text-secondary mb-4">
            We sent a 6-digit code to <br />
            <strong>{email}</strong>
          </p>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleInputChange}
            style={{
              padding: "12px",
              width: "100%",
              fontSize: "18px",
              textAlign: "center",
              letterSpacing: "4px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              marginBottom: "15px",
            }}
            maxLength={6}
          />

          <button
            onClick={handleVerify}
            className="btn btn-dark w-100"
            style={{ padding: "10px", fontSize: "16px", borderRadius: "8px" }}
          >
            Verify OTP
          </button>

          <p className="mt-3 text-secondary">
            {isResendDisabled
              ? `Resend OTP in ${timer}s`
              : "Didn't receive the code?"}
          </p>

          <button
            onClick={handleResendOTP}
            className="btn btn-link"
            disabled={isResendDisabled}
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              color: isResendDisabled ? "gray" : "blue",
            }}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;
