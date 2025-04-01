import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator";
import bg_image from "../assets/images/signin-image.webp";
import { useEffect } from "react";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

function RegisterForm(route) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      const toastElement = document.getElementById("liveToast");
      if (toastElement) {
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
      }
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear previous messages

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

      // 🔹 Proceed with registration
      const username = email.trim().toLowerCase();
      const res = await api.post("/api/user/register/", {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });

      // 🔹 Store tokens
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

      // 🔹 Navigate to homepage or dashboard
      navigate("/");
    } catch (error) {
      console.error("Error Response:", error.response?.data || error.message); // Debugging

      if (error.response) {
        setMessage(
          error.response.data.message ||
            "An error occurred during registration."
        );
      } else if (error.request) {
        setMessage("No response from server. Please try again later.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-3 p-md-4 p-xl-5">
      <div className="container">
        {message && (
          <div className="col-12 col-sm-auto mt-4 mt-sm-0">
            <div
              className="position-fixed bottom-0 end-0 p-3"
              style={{ zIndex: 11 }} // React style syntax
            >
              <div
                id="liveToast"
                className="toast hide"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                <div className="toast-header">
                  <strong className="me-auto">WoofWorld Admin</strong>
                  <small>Just Now</small>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="toast-body">{message}</div>
              </div>
            </div>
          </div>
        )}
        <div className="card border-light-subtle shadow-sm">
          <div className="row g-0">
            <div className="col-12 col-md-6">
              <div className="d-flex justify-content-center align-items-center h-100">
                <img
                  className="img-fluid rounded-start w-80 object-fit-cover"
                  loading="lazy"
                  src={bg_image}
                  alt="BootstrapBrain Logo"
                  style={{
                    height: "100%",
                  }}
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card-body p-3 p-md-4 p-xl-5">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-5">
                      <h2 className="h3">Registration</h2>
                      <h3 className="fs-6 fw-normal text-secondary m-0">
                        Enter your details to register
                      </h3>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row gy-3 gy-md-4 overflow-hidden">
                    <div className="col-6">
                      <label htmlFor="firstName" className="form-label">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        id="firstName"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="lastName" className="form-label">
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        id="lastName"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="email" className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        id="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="new-email"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="password" className="form-label">
                        Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    <div className="col-12">
                      {loading && <LoadingIndicator />}
                      <div className="d-grid">
                        <button
                          className="btn bsb-btn-xl btn-primary"
                          type="submit"
                        >
                          Sign up
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-12">
                    <hr className="mt-5 mb-4 border-secondary-subtle" />
                    <p className="m-0 text-secondary text-center">
                      Already have an account?{" "}
                      <span
                        className="link-primary text-decoration-none"
                        onClick={() => navigate("/login")}
                        style={{ cursor: "pointer" }}
                      >
                        Sign in
                      </span>
                    </p>
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

export default RegisterForm;
