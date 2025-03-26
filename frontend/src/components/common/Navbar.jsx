import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../api";
import logo from "../../assets/images/logo/logo1.png";
import cart from "../../assets/images/icons/cart.png";

const Navbar = () => {
  const [navbarItems, setNavbarItems] = useState([]);
  const location = useLocation();
  const [placeholder, setPlaceholder] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const placeholderTexts = [
    "Search for dog food...",
    "Find adoption centers...",
    "Explore grooming services...",
    "Discover training tips...",
  ];

  useEffect(() => {
    const currentText = placeholderTexts[index];

    if (!currentText) return; // Prevent undefined issues

    const updateText = () => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setPlaceholder(currentText.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 1000); // Pause before deleting
        }
      } else {
        if (charIndex > 0) {
          setPlaceholder(currentText.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        } else {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % placeholderTexts.length); // Move to next text
        }
      }
    };

    const interval = setTimeout(updateText, isDeleting ? 50 : 100); // Typing & deleting speed

    return () => clearTimeout(interval);
  }, [charIndex, index, isDeleting]);

  useEffect(() => {
    const fetchNavbarItems = async () => {
      try {
        const { data } = await api.get("/api/navbar/");
        if (Array.isArray(data)) {
          const structuredNavbar = processNavbarData(
            data.filter((item) => item.status === 1)
          );
          setNavbarItems(structuredNavbar);
        }
      } catch (error) {
        console.error("Failed to fetch navbar items:", error);
      }
    };
    fetchNavbarItems();
  }, []);

  const processNavbarData = (items) => {
    const itemMap = {};
    items.forEach((item) => (itemMap[item.id] = { ...item, subItems: [] }));
    return items.reduce((menu, item) => {
      if (item.dropdown_parent && itemMap[item.dropdown_parent]) {
        itemMap[item.dropdown_parent].subItems.push(itemMap[item.id]);
      } else {
        menu.push(itemMap[item.id]);
      }
      return menu;
    }, []);
  };

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
                placeholder={placeholder}
                style={{ height: "45px" }}
              />
              <span
                className="input-group-text"
                style={{ backgroundColor: "#fed91a" }}
              >
                <i
                  className="fa-solid fa-magnifying-glass"
                  style={{ color: "#fff" }}
                ></i>
              </span>
            </div>
          </div>
          <div className="d-none d-lg-block position-absolute end-0">
            <img src={cart} alt="Cart" height={30} className="me-4" />
            <button className="btn btn-primary">Sign In</button>
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
            {navbarItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <li
                  key={item.id}
                  className={`nav-item ${
                    item.subItems.length ? "dropdown" : ""
                  }`}
                >
                  <Link
                    className={`nav-link ${isActive ? "active" : ""} ${
                      item.subItems.length ? "dropdown-toggle" : ""
                    }`}
                    to={item.url}
                    role="button"
                    onMouseEnter={(e) => (e.target.style.color = "#fed91a")}
                    onMouseLeave={(e) => (e.target.style.color = "")}
                    data-bs-toggle={item.subItems.length ? "dropdown" : ""}
                  >
                    {item.title}
                  </Link>
                  {item.subItems.length > 0 && (
                    <ul className="dropdown-menu">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.id}>
                          <Link
                            className={`dropdown-item ${
                              location.pathname === subItem.url ? "active" : ""
                            }`}
                            to={subItem.url}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
