import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import { REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";
import bg_image from "../assets/images/signin-image.webp";
import { Eye, EyeOff } from "lucide-react";

function Form({ route, method }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        const userRes = await api.get("/api/user/", {
          headers: { Authorization: `Bearer ${res.data.access}` },
        });

        const user = userRes.data;
        if (!user.is_staff) {
          alert("Only admins are allowed to log in.");
          localStorage.clear(); // Clear tokens if user is not admin
          setLoading(false);
          return;
        }
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log("Error Details:", error.response.data);
      alert(error.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-3 p-md-4 p-xl-5">
      <div className="container">
        <div className="card border-light-subtle shadow-sm">
          <div className="row g-0">
            <div className="col-12 col-md-5">
              <div className="d-flex align-items-start h-100">
                <img
                  className="img-fluid rounded-start w-80 object-fit-cover me-auto"
                  loading="lazy"
                  src={bg_image}
                  alt="BootstrapBrain Logo"
                  style={{
                    height: "550px",
                  }}
                />
              </div>
            </div>

            <div className="col-12 col-md-7">
              <div className="card-body p-3 p-md-4 p-xl-5">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-5">
                      <h2 className="h3">Login</h2>
                      <h3 className="fs-6 fw-normal text-secondary m-0">
                        Enter your details to login
                      </h3>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row gy-3 gy-md-4 overflow-hidden">
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
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="password" className="form-label">
                        Password <span className="text-danger">*</span>
                      </label>
                      <div className="position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control pe-5"
                          name="password"
                          id="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary position-absolute end-0 top-50 translate-middle-y me-2"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ border: "none", background: "transparent" }}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="col-12">
                      {loading && <LoadingIndicator />}
                      <div className="d-grid">
                        <button
                          className="btn bsb-btn-xl btn-primary"
                          type="submit"
                        >
                          Login
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row">
                  <div className="col-12">
                    <hr className="mt-5 mb-4 border-secondary-subtle" />
                    <p className="m-0 text-secondary text-center">
                      Dont have an account?{" "}
                      <span
                        onClick={() => navigate("/register")}
                        style={{ cursor: "pointer" }}
                        className="link-primary text-decoration-none"
                      >
                        Sign up
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

export default Form;
