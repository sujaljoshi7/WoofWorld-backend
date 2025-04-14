import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants";
import api from "../../../api";
import logo from "../../../assets/images/logo/logo1.png";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingIndicator from "../../../components/common/LoadingIndicator";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(false);
  const route = "/api/token/";

  const forgot_password = async (e) => {
    navigate("/forgot-password");
  };

  const handleSubmit = async (e) => {
    const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
    localStorage.removeItem("redirectAfterLogin"); // Clean up
    localStorage.clear();
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log("Sending data:", { username, password }); // Debugging

      const res = await api.post(
        route,
        { username, password }, // Ensure correct field names
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

      const userRes = await api.get("/api/user/", {
        headers: { Authorization: `Bearer ${res.data.access}` },
      });

      navigate(redirectUrl);

      // navigate("/");
    } catch (error) {
      setMessage(error.response.data?.detail || "Something went wrong.");
      console.log("Error Details:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (message) {
      const toastElement = document.getElementById("liveToast");
      if (toastElement) {
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
      }
    }
  }, [message]);

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
                className={`toast 
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
                  alt="BootstrapBrain Logo"
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
                <div className="row">
                  <div className="col-12">
                    <div className="mb-4">
                      <h3>Sign in</h3>
                      <p>
                        Don't have an account?{" "}
                        <span
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => navigate(`/register`)}
                        >
                          Sign up
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row gy-3 overflow-hidden">
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          id="email"
                          value={username}
                          placeholder="name@example.com"
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3 position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          name="password"
                          id="password"
                          value={password}
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
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
                          value=""
                          name="remember_me"
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
                            Login
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-end mt-4">
                      <button
                        onClick={forgot_password}
                        className="btn btn-link p-0"
                        style={{
                          color: "#0d6efd",
                          textDecoration: "underline",
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
