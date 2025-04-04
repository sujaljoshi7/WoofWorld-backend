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
  const [isScrolled, setIsScrolled] = useState(false);

  const placeholderTexts = [
    "dog food...",
    "adoption centers...",
    "grooming services...",
    "training tips...",
  ];

  const [cartItemCount, setCartItemCount] = useState(0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const navItems = [
    { name: "Home", path: "/", dropdown: false },
    {
      name: "Events",
      path: "#",
      dropdown: true,
      items: [
        { name: "Upcoming Events", path: "/events/upcoming" },
        { name: "Past Events", path: "/events/past" },
      ],
    },
    {
      name: "Store Locator",
      path: "#",
      dropdown: true,
      items: [{ name: "Coming Soon .....", path: "#" }],
    },
    { name: "Adoption", path: "/adoption", dropdown: false },
    {
      name: "Shop",
      path: "#",
      dropdown: true,
      items: [
        { name: "Dry food", path: "#" },
        { name: "Wet food", path: "#" },
        { name: "Treats", path: "#" },
        { name: "Accessories", path: "#" },
        { name: "Health Supplement", path: "#" },
      ],
    },
    { name: "Blog", path: "/blog", dropdown: false },
    { name: "Services", path: "/services", dropdown: false },
    { name: "About", path: "/about", dropdown: false },
  ];

  return (
    <div
      className="navbar-wrapper"
      style={{
        width: "100%",
        zIndex: 1000,
        transition: "all 0.3s ease",
      }}
    >
      <nav
        className={`navbar navbar-expand-lg ${isScrolled ? "scrolled" : ""}`}
        style={{
          padding: "1rem 2rem",
          background: isScrolled ? "rgba(10, 10, 10, 0.95)" : "transparent",
          backdropFilter: "blur(10px)",
          transition: "all 0.3s ease",
        }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              src={logo}
              alt="Logo"
              height={45}
              style={{
                filter:
                  "brightness(1.2) drop-shadow(0 2px 4px rgba(246, 173, 85, 0.3))",
                transition: "transform 0.3s ease",
              }}
            />
          </Link>

          <div
            className="position-relative d-none d-lg-block"
            style={{ width: "40%" }}
          >
            <div
              className="search-container"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                overflow: "hidden",
                display: "flex",
              }}
            >
              <input
                type="text"
                className="search-input"
                placeholder={`Search for ${placeholder}`}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "0.75rem 1rem",
                  color: "white",
                  width: "100%",
                  fontSize: "0.95rem",
                }}
              />
              <button
                className="search-button"
                style={{
                  background:
                    "linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  color: "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>

          <div className="d-flex align-items-center gap-4">
            <div className="position-relative">
              <img
                src={cart}
                alt="Cart"
                height={28}
                onClick={() => navigate("/cart")}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  filter:
                    "invert(1) drop-shadow(0 2px 4px rgba(246, 173, 85, 0.3))",
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              />
              {cartItemCount > 0 && (
                <span
                  className="cart-badge"
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background:
                      "linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)",
                    color: "white",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    fontSize: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(246, 173, 85, 0.4)",
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
                height={28}
                onClick={() => navigate("/profile")}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  filter:
                    "invert(1) drop-shadow(0 2px 4px rgba(246, 173, 85, 0.3))",
                }}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              />
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="sign-in-btn"
                style={{
                  background: "transparent",
                  color: "#f6ad55",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "12px",
                  fontWeight: "500",
                  border: "2px solid #f6ad55",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#f6ad55";
                  e.target.style.color = "white";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#f6ad55";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <div
        className={`nav-menu ${isScrolled ? "scrolled" : ""}`}
        style={{
          background: isScrolled ? "rgba(10, 10, 10, 0.95)" : "transparent",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          transition: "all 0.3s ease",
        }}
      >
        <div className="container">
          <ul
            className="nav-links"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              margin: 0,
              padding: "1rem 0",
              listStyle: "none",
            }}
          >
            {navItems.map((item) => (
              <li
                key={item.name}
                className={item.dropdown ? "nav-item dropdown" : ""}
                style={{
                  position: "relative",
                }}
              >
                {item.dropdown ? (
                  <>
                    <Link
                      className="nav-link dropdown-toggle"
                      to={item.path}
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        textDecoration: "none",
                        fontSize: "0.95rem",
                        fontWeight: "500",
                        transition: "all 0.3s ease",
                        position: "relative",
                        paddingBottom: "1.5rem",
                        marginBottom: "-1.5rem",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.color = "#f6ad55";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.color = "rgba(255, 255, 255, 0.7)";
                      }}
                    >
                      {item.name}
                    </Link>
                    <ul
                      className="dropdown-menu"
                      style={{
                        background: "rgba(10, 10, 10, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        padding: "0.5rem",
                        marginTop: "1.5rem",
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        minWidth: "200px",
                        opacity: 0,
                        visibility: "hidden",
                        transition: "all 0.2s ease-in-out",
                        top: "100%",
                      }}
                    >
                      {item.items.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            className="dropdown-item"
                            to={subItem.path}
                            style={{
                              color: "rgba(255, 255, 255, 0.7)",
                              padding: "0.5rem 1rem",
                              fontSize: "0.9rem",
                              transition: "all 0.3s ease",
                              borderRadius: "8px",
                            }}
                            onMouseOver={(e) => {
                              e.target.style.color = "#f6ad55";
                              e.target.style.background =
                                "rgba(246, 173, 85, 0.1)";
                            }}
                            onMouseOut={(e) => {
                              e.target.style.color = "rgba(255, 255, 255, 0.7)";
                              e.target.style.background = "transparent";
                            }}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      textDecoration: "none",
                      fontSize: "0.95rem",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                      position: "relative",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.color = "#f6ad55";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = "rgba(255, 255, 255, 0.7)";
                    }}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .navbar-wrapper {
          transform: translateY(${isScrolled ? 0 : "0"});
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .search-input:focus {
          outline: none;
        }

        .search-button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .dropdown-menu {
          min-width: 200px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          pointer-events: none;
        }

        .dropdown-item:hover {
          background: rgba(246, 173, 85, 0.1) !important;
        }

        .nav-item.dropdown:hover .dropdown-menu {
          opacity: 1 !important;
          visibility: visible !important;
          pointer-events: auto;
        }

        @media (max-width: 992px) {
          .navbar {
            padding: 1rem;
          }

          .nav-menu {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Navbar;
