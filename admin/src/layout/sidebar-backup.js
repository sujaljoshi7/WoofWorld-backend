import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import user_img from "../assets/images/user.png";

function Sidebar({ user }) {
  const location = useLocation();
  const [expandedDropdown, setExpandedDropdown] = useState("");

  const toggleDropdown = (menu) => {
    setExpandedDropdown(expandedDropdown === menu ? "" : menu);
  };

  useEffect(() => {
    if (location.pathname.startsWith("/products"))
      setExpandedDropdown("products");
    else if (location.pathname.startsWith("/services"))
      setExpandedDropdown("services");
    else if (location.pathname.startsWith("/blogs"))
      setExpandedDropdown("blogs");
    else if (location.pathname.startsWith("/events"))
      setExpandedDropdown("events");
    else if (location.pathname.startsWith("/webinars"))
      setExpandedDropdown("webinars");
    else if (location.pathname.startsWith("/news")) setExpandedDropdown("news");

    // Keep parent dropdown expanded when inside category
    if (location.pathname.includes("/category")) {
      if (location.pathname.startsWith("/events"))
        setIsEventDropdownExpanded(true);
      if (location.pathname.startsWith("/products"))
        setIsProductDropdownExpanded(true);
      if (location.pathname.startsWith("/services"))
        setIsServiceDropdownExpanded(true);
      if (location.pathname.startsWith("/blogs"))
        setIsBlogDropdownExpanded(true);
      if (location.pathname.startsWith("/webinars"))
        setIsWebinarDropdownExpanded(true);
      if (location.pathname.startsWith("/news"))
        setIsNewsDropdownExpanded(true);
    }
  }, [location.pathname]);

  const menuItems = [
    {
      name: "Products",
      icon: "fa-box-open",
      subItems: ["Add Category", "Add Product", "View Products"],
    },
    {
      name: "Services",
      icon: "fa-cogs",
      subItems: ["Add Category", "Add Service", "View Services"],
    },
    {
      name: "Blogs",
      icon: "fa-note-sticky",
      subItems: ["Add Category", "Add Blog", "View Blogs"],
    },
    {
      name: "Events",
      icon: "fa-calendar-days",
      subItems: ["Category", "Add Event", "View Events"],
    },
    {
      name: "Webinars",
      icon: "fa-laptop",
      subItems: ["Add Category", "Add Webinar", "View Webinars"],
    },
    {
      name: "News",
      icon: "fa-newspaper",
      subItems: ["Add Category", "Add News", "View News"],
    },
  ];

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style={{ width: "280px", height: "100vh" }}
    >
      <NavLink
        to="/"
        className="d-flex align-items-center mb-3 text-white text-decoration-none"
      >
        <span className="fs-4">WoofWorld Admin</span>
      </NavLink>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link text-white"
            }
          >
            <i className="fa-solid fa-gauge-high me-3"></i> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link text-white"
            }
          >
            <i className="fa-solid fa-user me-3"></i> Users
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link text-white"
            }
          >
            <i className="fa-solid fa-box-open me-3"></i> Orders
          </NavLink>
        </li>

        {menuItems.map((menu) => (
          <li key={menu.name} className="nav-item">
            <a
              href="#"
              onClick={() => toggleDropdown(menu.name)}
              className="nav-link text-white d-flex justify-content-between align-items-center"
            >
              <span>
                <i className={`fa-solid ${menu.icon} me-3`}></i> {menu.name}
              </span>
              <i
                className={`fa-solid ${
                  expandedDropdown === menu.name
                    ? "fa-chevron-up"
                    : "fa-chevron-down"
                }`}
              ></i>
            </a>
            {expandedDropdown === menu.name && (
              <ul className="nav flex-column ms-3">
                {menu.subItems.map((sub, index) => (
                  <li key={index}>
                    <NavLink
                      to={`/${menu.name.toLowerCase().replace(" ", "")}/${sub
                        .toLowerCase()
                        .replace(" ", "")}`}
                      className="nav-link text-white"
                    >
                      {sub}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <hr />
      <div className="dropdown pb-3">
        <a
          href="#"
          className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          data-bs-toggle="dropdown"
        >
          <img
            src={user_img}
            alt=""
            width="32"
            height="32"
            className="rounded-circle me-3"
          />
          <strong>{user ? user.first_name : "Loading..."}</strong>
        </a>
        <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
          <li>
            <a className="dropdown-item" href="#">
              New project...
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Settings
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Profile
            </a>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a className="dropdown-item" href="/logout">
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
