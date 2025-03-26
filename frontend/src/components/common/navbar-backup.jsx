import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../api";
import logo from "../../assets/images/logo/logo1.png";
import down_arrow from "../../assets/images/icons/down-arrow.png";

const Navbar = () => {
  const [allNavbarItems, setAllNavbarItems] = useState([]);
  const [isLoadingNavbarItems, setIsLoadingNavbarItems] = useState(false);
  const location = useLocation();

  const fetchNavbarItems = async () => {
    setIsLoadingNavbarItems(true);
    try {
      const response = await api.get("/api/navbar/");
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Unexpected response format:", response.data);
        return;
      }
      const navbarItems = response.data.filter(
        (navItem) => navItem.status === 1
      );
      const structuredNavbar = processNavbarData(navbarItems);
      setAllNavbarItems(structuredNavbar);
    } catch (error) {
      console.error("Failed to fetch navbar items:", error);
    } finally {
      setIsLoadingNavbarItems(false);
    }
  };

  const processNavbarData = (items) => {
    const menu = [];
    const itemMap = {};

    items.forEach((item) => {
      itemMap[item.id] = { ...item, subItems: [] };
    });

    items.forEach((item) => {
      if (item.dropdown_parent) {
        if (itemMap[item.dropdown_parent]) {
          itemMap[item.dropdown_parent].subItems.push(itemMap[item.id]);
        }
      } else {
        menu.push(itemMap[item.id]);
      }
    });

    return menu;
  };

  useEffect(() => {
    fetchNavbarItems();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img src={logo} alt="Logo" height={40} />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileNavbar"
          aria-controls="mobileNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-center text-center"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {allNavbarItems.map((item) => (
              <li
                key={item.id}
                className={`nav-item ${
                  item.subItems.length > 0 ? "dropdown" : ""
                }`}
              >
                <Link
                  className={`nav-link ${
                    location.pathname === item.url ? "active" : ""
                  } 
                      ${item.subItems.length > 0 ? "dropdown-toggle" : ""}`}
                  to={item.url}
                  role="button"
                  data-bs-toggle={item.subItems.length > 0 ? "dropdown" : ""}
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
            ))}
          </ul>
        </div>

        <div className="d-none d-lg-block position-absolute top- end-0">
          <button className="btn btn-primary">Sign In</button>
        </div>

        <div
          className="offcanvas offcanvas-end d-lg-none"
          tabIndex="-1"
          id="mobileNavbar"
        >
          <div className="offcanvas-header">
            <a className="navbar-brand" href="#">
              <img src={logo} alt="Logo" height={40} />
            </a>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body d-flex flex-column align-items-start w-100">
            <ul className="navbar-nav text-start">
              {allNavbarItems.map((item) => (
                <li key={item.id} className="nav-item">
                  <a className="nav-link" href={item.url}>
                    {item.title}
                  </a>
                  {item.subItems.length > 0 && (
                    <ul className="dropdown-menu mb-2">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.id}>
                          <a className="dropdown-item" href={subItem.url}>
                            {subItem.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <button className="btn btn-primary mt-3">Sign In</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
