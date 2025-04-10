import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo/logo1.png";
import cart from "../../assets/images/icons/cart.png";
import { ACCESS_TOKEN } from "../../constants";
import profileIcon from "../../assets/images/icons/user.png";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";
import api from "../../api";

const Navbar = () => {
  const navigate = useNavigate();
  const [placeholder, setPlaceholder] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const placeholderTexts = [
    "dog food...",
    "adoption centers...",
    "grooming services...",
    "training tips...",
  ];

  const [cartItemCount, setCartItemCount] = useState(0);

  // Fetch cart items and calculate the total count
  const fetchCartItemCount = async () => {
    try {
      const response = await api.get("/api/cart/");
      const distinctItems = new Set(response.data.map((item) => item.item));
      setCartItemCount(distinctItems.size);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItemCount();
  }, []);

  useEffect(() => {
    const currentText = placeholderTexts[index];
    if (!currentText) return;

    const updateText = () => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setPlaceholder(currentText.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      } else {
        if (charIndex > 0) {
          setPlaceholder(currentText.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % placeholderTexts.length);
        }
      }
    };

    const interval = setTimeout(updateText, isDeleting ? 30 : 50);
    return () => clearTimeout(interval);
  }, [charIndex, index, isDeleting]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg container">
        <div className="container-fluid px-3 px-md-4 px-lg-5">
          <Link className="navbar-brand" to="/">
            <img
              src={logo}
              alt="Logo"
              className="img-fluid"
              style={{ maxHeight: "40px", width: "auto" }}
            />
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
          >
            <div className="d-flex flex-column flex-lg-row align-items-center w-100">
              <div className="search-container w-100 mb-3 mb-lg-0 px-2 px-lg-0">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control rounded-start"
                    placeholder={`Search for ${placeholder}`}
                    style={{ height: "45px" }}
                  />
                  <span
                    className="input-group-text rounded-end"
                    style={{ backgroundColor: "#ffec00" }}
                  >
                    <i className="fa-solid fa-magnifying-glass bg-yellow"></i>
                  </span>
                </div>
              </div>

              <div className="d-flex align-items-center ms-lg-3 gap-3">
                <div className="position-relative">
                  <img
                    src={cart}
                    alt="Cart"
                    className="img-fluid"
                    style={{
                      maxHeight: "30px",
                      width: "auto",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/cart")}
                  />
                  {cartItemCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger p-1"
                      style={{
                        fontSize: "10px",
                        width: "18px",
                        height: "18px",
                        transform: "translate(50%, -50%)",
                      }}
                    >
                      {cartItemCount}
                    </span>
                  )}
                </div>
                {localStorage.getItem(ACCESS_TOKEN) ? (
                  <img
                    src={profileIcon}
                    alt="Profile"
                    className="img-fluid"
                    style={{
                      maxHeight: "30px",
                      width: "auto",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/profile")}
                  />
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="btn btn-dark rounded-0"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <nav className="navbar-expand-lg mb-4">
        <hr
          className="border-0"
          style={{ height: "1px", backgroundColor: "black" }}
        />
        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
          <ul className="navbar-nav mx-auto text-center px-3 px-md-4 px-lg-5">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Events
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/events/upcoming">
                    Upcoming Events
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/events/past">
                    Past Events
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Store Locator
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/storelocator">
                    Coming Soon .....
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/adoption">
                Adoption
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/shop">
                Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/blogs">
                Blogs
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/dog">
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/about">
                About us
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
