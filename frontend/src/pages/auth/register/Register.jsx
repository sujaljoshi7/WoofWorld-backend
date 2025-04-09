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

  const ACCESS_TOKEN = "access_token";
  const REFRESH_TOKEN = "refresh_token";
  const user_email = "email";

  const [message, setMessage] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear previous messages
    sessionStorage.clear();

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
              style={{ zIndex: 11 }} // React style syntax
            >
              <div
                id="liveToast"
                className={`toast ${
                  message ? "show" : "hide"
                } bg-danger text-white`} // ✅ Ensure toast is visible
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
                    onClick={() => setMessage("")} // ✅ Close on click
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
                          className="form-control"
                          id="password"
                          value={password}
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label htmlFor="password">Password</label>
                        <button
                          type="button"
                          className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-2"
                          onClick={togglePasswordVisibility}
                          style={{ zIndex: 10, color: "#6c757d" }}
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
                          <button className="btn btn-dark btn-lg" type="submit">
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
