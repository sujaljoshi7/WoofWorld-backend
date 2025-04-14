import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo/logo1.png";
import api from "../../../api";
import LoadingIndicator from "../../../components/common/LoadingIndicator";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const ACCESS_TOKEN = "access_token";
  const REFRESH_TOKEN = "refresh_token";
  const user_email = "email";

  const [message, setMessage] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one capital letter";
    }
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const getPasswordValidationStatus = (password) => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear previous messages
    sessionStorage.clear();

    // Validate password before proceeding
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setMessage(passwordValidationError);
      setLoading(false);
      return;
    }

    try {
      // 🔹 Check if the user exists
      const checkRes = await api.get(
        `/api/user/check-email/${encodeURIComponent(email)}/`
      );

      console.log("API Response:", checkRes.data); // Debugging response

      if (checkRes?.data?.can_register === false) {
        setMessage(checkRes.data.message); // Show "Email already exists"
        setLoading(false);
        return;
      }

      // 🔹 Store user details in session storage
      const userDetails = {
        username: email.trim().toLowerCase(),
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        last_login: "",
      };
      sessionStorage.setItem(
        "pendingRegistration",
        JSON.stringify(userDetails)
      );

      // 🔹 Send OTP
      const otpRes = await api.post("/api/otp/send-otp/", { email });

      if (otpRes.status === 200) {
        // 🔹 Navigate to OTP verification page
        navigate("/otp");
      } else {
        setMessage("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error Response:", error.response?.data || error.message); // Debugging
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Error occurred during registration"
      );
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
                className={`toast ${
                  message ? "show" : "hide"
                } bg-danger text-white`}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                <div className="toast-header bg-danger text-white">
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
                <h2 className="h1 mb-4">
                  Everything for Your Dog, All in One Place!
                </h2>
                <p className="lead mb-5">
                  We provide top-notch dog care services, premium products,
                  adoption listings, exciting events, and expert blogs—all
                  designed to give your furry friend the best life possible.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-5">
            <div className="card border-0 rounded-4">
              <div className="card-body p-3 p-md-4 p-xl-5">
                <div className="mb-4">
                  <h3>Sign Up</h3>
                  <p>
                    Already have an account?{" "}
                    <span
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => navigate(`/login`)}
                    >
                      sign in
                    </span>
                  </p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row gy-3">
                    <div className="col-lg-6">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="first-name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First Name"
                          required
                        />
                        <label htmlFor="first-name">First Name</label>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="last-name"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                        <label htmlFor="last-name">Last Name</label>
                      </div>
                    </div>
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
                      <div className="form-floating mb-3 position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control pe-5"
                          id="password"
                          value={password}
                          placeholder="Password"
                          onChange={handlePasswordChange}
                          required
                        />
                        <label htmlFor="password">Password</label>
                        <button
                          type="button"
                          className="btn btn-link position-absolute end-0 d-flex align-items-center justify-content-center"
                          onClick={togglePasswordVisibility}
                          style={{
                            width: "40px",
                            color: "#6c757d",
                            padding: "0",
                            border: "none",
                            background: "none",
                            zIndex: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        >
                          {showPassword ? (
                            <FaEyeSlash size={18} />
                          ) : (
                            <FaEye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="remember_me"
                        />
                        <label
                          className="form-check-label text-secondary"
                          htmlFor="remember_me"
                        >
                          Keep me logged in
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-grid text-center">
                        {loading ? (
                          <div className="d-flex justify-content-center">
                            <LoadingIndicator />
                          </div>
                        ) : (
                          <button
                            className="btn btn-dark btn-lg"
                            type="submit"
                            disabled={!!passwordError}
                          >
                            Register
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

export default Register;
