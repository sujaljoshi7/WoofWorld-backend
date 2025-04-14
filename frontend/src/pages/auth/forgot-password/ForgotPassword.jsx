import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo/logo1.png";
import api from "../../../api";
import LoadingIndicator from "../../../components/common/LoadingIndicator";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Send password reset request to the API
      const response = await api.post("/api/user/forgot-password/", { email });

      setSuccess(true);
      setMessage("Password reset instructions have been sent to your email.");
    } catch (error) {
      console.error("Error Response:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Error sending password reset link. Please try again."
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="bg-warning py-3 py-md-5 py-xl-8"
      style={{ height: "100vh" }}
    >
      <div className="container h-100">
        {message && (
          <div className="col-12 col-sm-auto mt-4 mt-sm-0">
            <div
              className="position-fixed top-0 end-0 p-3"
              style={{ zIndex: 11 }}
            >
              <div
                id="liveToast"
                className={`toast ${message ? "show" : "hide"} bg-${
                  success ? "success" : "danger"
                } text-white`}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                <div
                  className={`toast-header bg-${
                    success ? "success" : "danger"
                  } text-white`}
                >
                  <strong className="me-auto">WoofWorld</strong>
                  <small>Just Now</small>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                    onClick={() => setMessage("")}
                  ></button>
                </div>
                <div className="toast-body">{message}</div>
              </div>
            </div>
          </div>
        )}

        <div className="row gy-4 align-items-center justify-content-center h-100">
          <div className="col-12 col-md-6 col-xl-7">
            <div className="d-flex justify-content-center text-bg-warning">
              <div className="col-12 col-xl-9">
                <img
                  className="img-fluid rounded mb-4"
                  loading="lazy"
                  src={logo}
                  width="245"
                  height="80"
                  alt="Logo"
                />
                <hr className="border-primary-subtle mb-4" />
                <h2 className="h1 mb-4">Forgot Your Password?</h2>
                <p className="lead mb-5">
                  No worries! Enter your email address below and we'll send you
                  instructions to reset your password.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-5">
            <div className="card border-0 rounded-4">
              <div className="card-body p-3 p-md-4 p-xl-5">
                <div className="mb-4">
                  <h3>Password Reset</h3>
                  <p>
                    Remembered your password?{" "}
                    <span
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => navigate(`/login`)}
                    >
                      Sign In
                    </span>
                  </p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row gy-3">
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          value={email}
                          placeholder="Email"
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label htmlFor="email">Email</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-grid text-center">
                        {loading ? (
                          <div className="d-flex justify-content-center">
                            <LoadingIndicator />
                          </div>
                        ) : (
                          <button className="btn btn-dark btn-lg" type="submit">
                            Send Reset Link
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
