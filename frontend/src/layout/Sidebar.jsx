import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import user_img from "../assets/images/user.png";

function Sidebar({ user }) {
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownExpanded(!isDropdownExpanded);
  };

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style={{ width: "280px", height: "100vh" }}
    >
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <svg className="bi me-2" width="40" height="32">
          <use xlinkHref="#bootstrap"></use>
        </svg>
        <span className="fs-4">TechFlow CMS</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link text-white"
            }
          >
            <i className="fa-solid fa-gauge-high me-2"></i>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link text-white"
            }
          >
            <svg className="bi me-2" width="16" height="16">
              <use xlinkHref="#table"></use>
            </svg>
            Orders
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link text-white"
            }
          >
            <svg className="bi me-2" width="16" height="16">
              <use xlinkHref="#grid"></use>
            </svg>
            Products
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/customers"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link text-white"
            }
          >
            <svg className="bi me-2" width="16" height="16">
              <use xlinkHref="#people-circle"></use>
            </svg>
            Customers
          </NavLink>
        </li>

        {/* Expandable Dropdown Section */}
        <li className="nav-item">
          <a
            href="#"
            onClick={toggleDropdown}
            className="nav-link text-white d-flex justify-content-between align-items-center"
          >
            <span>
              <i className="fa-solid fa-cogs me-2"></i>
              More Options
            </span>
            <i
              className={`fa-solid ${
                isDropdownExpanded ? "fa-chevron-up" : "fa-chevron-down"
              }`}
            ></i>
          </a>
          {isDropdownExpanded && (
            <ul className="nav flex-column ms-3">
              <li>
                <NavLink to="/reports" className="nav-link text-white">
                  Reports
                </NavLink>
              </li>
              <li>
                <NavLink to="/analytics" className="nav-link text-white">
                  Analytics
                </NavLink>
              </li>
              <li>
                <NavLink to="/support" className="nav-link text-white">
                  Support
                </NavLink>
              </li>
            </ul>
          )}
        </li>
        <li>
          <NavLink
            to="/customers"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link text-white"
            }
          >
            <svg className="bi me-2" width="16" height="16">
              <use xlinkHref="#people-circle"></use>
            </svg>
            Customers
          </NavLink>
        </li>
      </ul>
      <hr />
      <div className="dropdown">
        <a
          href="#"
          className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          id="dropdownUser1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src={user_img}
            alt=""
            width="32"
            height="32"
            className="rounded-circle me-2"
          />
          <strong>{user ? user.first_name : "Loading..."}</strong>
        </a>
        <ul
          className="dropdown-menu dropdown-menu-dark text-small shadow"
          aria-labelledby="dropdownUser1"
        >
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
