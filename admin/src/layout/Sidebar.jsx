import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import user_img from "../assets/images/user.png";
import { useNavigate } from "react-router-dom";

function Sidebar({ user }) {
  const location = useLocation();
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const toggleDropdown = (menu) => {
    setExpandedDropdown(expandedDropdown === menu ? null : menu);
  };

  useEffect(() => {
    if (location.pathname.startsWith("/products"))
      setExpandedDropdown("Products");
    else if (location.pathname.startsWith("/services"))
      setExpandedDropdown("Services");
    else if (location.pathname.startsWith("/blogs"))
      setExpandedDropdown("Blogs");
    else if (location.pathname.startsWith("/events"))
      setExpandedDropdown("Events");
    else if (location.pathname.startsWith("/adoption"))
      setExpandedDropdown("Adoption");
    else if (location.pathname.startsWith("/news")) setExpandedDropdown("News");
    else if (location.pathname.startsWith("/companyinfo"))
      setExpandedDropdown("Company Info");
    else if (location.pathname.startsWith("/homepage"))
      setExpandedDropdown("Home Page");
  }, [location.pathname]);

  const menuItems = [
    {
      name: "Adoption",
      icon: "fa-dog",
      subItems: ["Breeds", "View"],
    },
    {
      name: "Products",
      icon: "fa-box-open",
      subItems: ["Category", "View"],
    },
    {
      name: "Services",
      icon: "fa-cogs",
      subItems: ["Category", "View"],
    },
    {
      name: "Events",
      icon: "fa-calendar-days",
      subItems: ["Category", "View"],
    },
    {
      name: "Home Page",
      icon: "fa-gear",
      subItems: [
        "Hero Section",
        "Partner Company",
        "Contact Details",
        "Banner",
        "Testimonials",
        "Gallery",
      ],
    },
    {
      name: "Company Info",
      icon: "fa-building",
      subItems: ["About Us", "Partner Company", "Contact Details"],
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
        <li>
          <NavLink
            to="/blogs"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link text-white"
            }
          >
            <i className="fa-solid fa-note-sticky me-3"></i> Blogs
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
                      to={
                        sub === "View"
                          ? `/${menu.name.toLowerCase().replace(/\s+/g, "")}`
                          : `/${menu.name
                              .toLowerCase()
                              .replace(/\s+/g, "")}/${sub
                              .toLowerCase()
                              .replace(/\s+/g, "")}`
                      }
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link text-white"
                      }
                      end
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
