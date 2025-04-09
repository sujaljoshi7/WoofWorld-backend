import React, { useState, useEffect } from "react";
import logo from "../../../assets/images/logo/logo1.png";
import api from "../../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants";
import { useLocation, useNavigate } from "react-router-dom";

function OTPVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [messageType, setMessageType] = useState("success");

  // Get email from sessionStorage instead of localStorage
  const pendingRegistration = JSON.parse(
    sessionStorage.getItem("pendingRegistration") || "{}"
  );
  const email = pendingRegistration.email || "";

  // Timer effect for resend button
  useEffect(() => {
    let interval;
    if (timer > 0 && isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer, isResendDisabled]);

  const handleVerify = async (e) => {
    e.preventDefault();
    showMessage(""); // Clear previous messages

    if (!otp || otp.length !== 6) {
      showMessage("❌ Please enter a valid 6-digit OTP.", "danger");
      return;
    }

    try {
      // 🔹 Make the OTP verification request
      let response = await api.post("api/otp/verify-otp/", {
        email: email, // Use email from sessionStorage
        otp: otp,
      });

      if (response.status === 200) {
        // Get pending registration details from session storage
        if (
          pendingRegistration &&
          Object.keys(pendingRegistration).length > 0
        ) {
          try {
            // Complete the registration process
            const registerResponse = await api.post(
              "/api/user/register/",
              pendingRegistration
            );

            if (registerResponse.status === 201) {
              // Store tokens
              localStorage.setItem(ACCESS_TOKEN, registerResponse.data.access);
              localStorage.setItem(
                REFRESH_TOKEN,
                registerResponse.data.refresh
              );
              localStorage.setItem("email", registerResponse.data.email);

              // Clear session storage
              sessionStorage.removeItem("pendingRegistration");

              showMessage("✅ Registration Successful!", "success");
              navigate("/");
            } else {
              showMessage(
                "❌ Registration failed. Please try again.",
                "danger"
              );
            }
          } catch (registerError) {
            console.error("Registration error:", registerError);
            showMessage(
              "❌ " +
                (registerError.response?.data?.message ||
                  "Registration failed"),
              "danger"
            );
          }
        } else {
          showMessage(
            "❌ Registration details not found. Please register again.",
            "danger"
          );
          navigate("/register");
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showMessage(
        "❌ " + (error.response?.data?.error || "OTP verification failed"),
        "danger"
      );
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Allow only numbers & limit to 6 digits
    setOtp(value);
  };

  useEffect(() => {
    // Check if we have pending registration data
    if (!pendingRegistration || Object.keys(pendingRegistration).length === 0) {
      showMessage(
        "❌ No registration data found. Please register again.",
        "danger"
      );
      setTimeout(() => {
        navigate("/register");
      }, 2000);
    } else {
      showMessage("✅ OTP sent successfully!", "success"); // Show message when page loads
    }
  }, [navigate]);

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
      const response = await api.post("/api/otp/send-registration-otp/", {
        email,
      });

      if (response.status === 200) {
        showMessage("✅ A new OTP has been sent to your email.", "success");
        console.log("OTP resent successfully!");
      } else {
        showMessage(
          "❌ " +
            (response.data.error || "Failed to resend OTP. Please try again."),
          "danger"
        );
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      showMessage("❌ An error occurred. Please try again.", "danger");
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
