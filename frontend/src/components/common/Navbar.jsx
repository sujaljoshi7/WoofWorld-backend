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
      // Count distinct items in the cart
      const distinctItems = new Set(response.data.map((item) => item.item)); // Assuming `item` is the unique identifier for each item
      setCartItemCount(distinctItems.size); // Set the number of unique items
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Fetch the cart item count when the component mounts
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
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="Logo" height={40} />
          </Link>

          <div className="position-absolute start-50 translate-middle-x w-50">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder={`Search for ${placeholder}`}
                style={{ height: "45px" }}
              />
              <span
                className="input-group-text"
                style={{ backgroundColor: "#ffec00" }}
              >
                <i className="fa-solid fa-magnifying-glass bg-yellow"></i>
              </span>
            </div>
          </div>

          <div className="d-none d-lg-block position-relative">
            <img
              src={cart}
              alt="Cart"
              height={30}
              className="me-4"
              onClick={() => navigate("/cart")}
              style={{ cursor: "pointer" }}
            />
            {/* {cartItemCount > 0 && (
              <span
                className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger p-1"
                style={{
                  fontSize: "10px",
                  width: "18px",
                  height: "18px",
                  transform: "translate(50%, -50%)",
                }}
              >
                {cartItemCount}
              </span>
            )} */}
            {localStorage.getItem(ACCESS_TOKEN) ? (
              // If token exists, show profile icon
              <img
                src={profileIcon}
                alt="Profile"
                height={30}
                className="me-4"
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer" }}
              />
            ) : (
              // If token does not exist, show Sign In button
              <button
                onClick={() => navigate("/login")}
                className="btn btn-dark"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <nav className="navbar-expand-lg mb-4">
        <hr
          className="border-0"
          style={{ height: "1px", backgroundColor: "black" }}
        />
        <div className="collapse navbar-collapse w-100 mt-4 d-flex justify-content-center">
          <ul className="navbar-nav mx-auto">
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
            {/* <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Shop by Dog
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/dog">
                    Dry food
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/dog">
                    Wet food
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/dog">
                    Treats
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/dog">
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/dog">
                    Health Suppliment
                  </Link>
                </li>
              </ul>
            </li> */}
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
