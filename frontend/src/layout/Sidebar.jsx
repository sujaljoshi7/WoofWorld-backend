import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import user_img from "../assets/images/user.png";

function Sidebar({ user }) {
  const [isBlogDropdownExpanded, setIsBlogDropdownExpanded] = useState(false);
  const [isEventDropdownExpanded, setIsEventDropdownExpanded] = useState(false);
  const [isWebinarDropdownExpanded, setIsWebinarDropdownExpanded] =
    useState(false);
  const [isNewsDropdownExpanded, setIsNewsDropdownExpanded] = useState(false);
  const [isProductDropdownExpanded, setIsProductDropdownExpanded] =
    useState(false);
  const [isServiceDropdownExpanded, setIsServiceDropdownExpanded] =
    useState(false);

  const toggleBlogDropdown = () => {
    setIsBlogDropdownExpanded(!isBlogDropdownExpanded);
    setIsEventDropdownExpanded(false);
    setIsWebinarDropdownExpanded(false);
    setIsNewsDropdownExpanded(false);
    setIsProductDropdownExpanded(false);
    isServiceDropdownExpanded(false);
  };
  const toggleEventDropdown = () => {
    setIsEventDropdownExpanded(!isEventDropdownExpanded);
    setIsBlogDropdownExpanded(false);
    setIsWebinarDropdownExpanded(false);
    setIsNewsDropdownExpanded(false);
    setIsProductDropdownExpanded(false);
    isServiceDropdownExpanded(false);
  };
  const toggleWebinarDropdown = () => {
    setIsWebinarDropdownExpanded(!isWebinarDropdownExpanded);
    setIsEventDropdownExpanded(false);
    setIsBlogDropdownExpanded(false);
    setIsNewsDropdownExpanded(false);
    setIsProductDropdownExpanded(false);
    isServiceDropdownExpanded(false);
  };
  const toggleNewsDropdown = () => {
    setIsNewsDropdownExpanded(!isNewsDropdownExpanded);
    setIsEventDropdownExpanded(false);
    setIsBlogDropdownExpanded(false);
    setIsWebinarDropdownExpanded(false);
    setIsProductDropdownExpanded(false);
    isServiceDropdownExpanded(false);
  };
  const toggleProductDropdown = () => {
    setIsProductDropdownExpanded(!isProductDropdownExpanded);
    setIsEventDropdownExpanded(false);
    setIsBlogDropdownExpanded(false);
    setIsWebinarDropdownExpanded(false);
    setIsNewsDropdownExpanded(false);
    isServiceDropdownExpanded(false);
  };
  const toggleServiceDropdown = () => {
    setIsServiceDropdownExpanded(!isServiceDropdownExpanded);
    setIsEventDropdownExpanded(false);
    setIsBlogDropdownExpanded(false);
    setIsWebinarDropdownExpanded(false);
    setIsNewsDropdownExpanded(false);
    setIsProductDropdownExpanded(false);
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
            <i className="fa-solid fa-gauge-high me-3"></i>
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link text-white"
            }
          >
            <i className="fa-solid fa-user me-3"></i>
            Users
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link text-white"
            }
          >
            <i className="fa-solid fa-box-open me-3"></i>
            Orders
          </NavLink>
        </li>

        <li className="nav-item">
          <a
            href="#"
            onClick={toggleProductDropdown}
            className="nav-link text-white d-flex justify-content-between align-items-center"
          >
            <span>
              <i className="fa-solid fa-newspaper me-3"></i>
              Products
            </span>
            <i
              className={`fa-solid ${
                isProductDropdownExpanded ? "fa-chevron-up" : "fa-chevron-down"
              }`}
            ></i>
          </a>
          {isProductDropdownExpanded && (
            <ul className="nav flex-column ms-3">
              <li>
                <NavLink to="/reports" className="nav-link text-white">
                  Add Category
                </NavLink>
              </li>
              <li>
                <NavLink to="/analytics" className="nav-link text-white">
                  Add Product
                </NavLink>
              </li>
              <li>
                <NavLink to="/support" className="nav-link text-white">
                  View Products
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li className="nav-item">
          <a
            href="#"
            onClick={toggleServiceDropdown}
            className="nav-link text-white d-flex justify-content-between align-items-center"
          >
            <span>
              <i className="fa-solid fa-cogs me-3"></i>
              Services
            </span>
            <i
              className={`fa-solid ${
                isServiceDropdownExpanded ? "fa-chevron-up" : "fa-chevron-down"
              }`}
            ></i>
          </a>
          {isServiceDropdownExpanded && (
            <ul className="nav flex-column ms-3">
              <li>
                <NavLink to="/reports" className="nav-link text-white">
                  Add Category
                </NavLink>
              </li>
              <li>
                <NavLink to="/analytics" className="nav-link text-white">
                  Add Service
                </NavLink>
              </li>
              <li>
                <NavLink to="/support" className="nav-link text-white">
                  View Services
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li className="nav-item">
          <a
            href="#"
            onClick={toggleBlogDropdown}
            className="nav-link text-white d-flex justify-content-between align-items-center"
          >
            <span>
              <i className="fa-solid fa-note-sticky me-3"></i>
              Blogs
            </span>
            <i
              className={`fa-solid ${
                isBlogDropdownExpanded ? "fa-chevron-up" : "fa-chevron-down"
              }`}
            ></i>
          </a>
          {isBlogDropdownExpanded && (
            <ul className="nav flex-column ms-3">
              <li>
                <NavLink to="/reports" className="nav-link text-white">
                  Add Category
                </NavLink>
              </li>
              <li>
                <NavLink to="/analytics" className="nav-link text-white">
                  Add Blogs
                </NavLink>
              </li>
              <li>
                <NavLink to="/support" className="nav-link text-white">
                  View Blogs
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li className="nav-item">
          <a
            href="#"
            onClick={toggleEventDropdown}
            className="nav-link text-white d-flex justify-content-between align-items-center"
          >
            <span>
              <i className="fa-solid fa-calendar-days me-3"></i>
              Events
            </span>
            <i
              className={`fa-solid ${
                isEventDropdownExpanded ? "fa-chevron-up" : "fa-chevron-down"
              }`}
            ></i>
          </a>
          {isEventDropdownExpanded && (
            <ul className="nav flex-column ms-3">
              <li>
                <NavLink to="/reports" className="nav-link text-white">
                  Add Category
                </NavLink>
              </li>
              <li>
                <NavLink to="/analytics" className="nav-link text-white">
                  Add Event
                </NavLink>
              </li>
              <li>
                <NavLink to="/support" className="nav-link text-white">
                  View Events
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li className="nav-item">
          <a
            href="#"
            onClick={toggleWebinarDropdown}
            className="nav-link text-white d-flex justify-content-between align-items-center"
          >
            <span>
              <i className="fa-solid fa-laptop me-3"></i>
              Webinar
            </span>
            <i
              className={`fa-solid ${
                isWebinarDropdownExpanded ? "fa-chevron-up" : "fa-chevron-down"
              }`}
            ></i>
          </a>
          {isWebinarDropdownExpanded && (
            <ul className="nav flex-column ms-3">
              <li>
                <NavLink to="/reports" className="nav-link text-white">
                  Add Category
                </NavLink>
              </li>
              <li>
                <NavLink to="/analytics" className="nav-link text-white">
                  Add Webinar
                </NavLink>
              </li>
              <li>
                <NavLink to="/support" className="nav-link text-white">
                  View Webinars
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li className="nav-item">
          <a
            href="#"
            onClick={toggleNewsDropdown}
            className="nav-link text-white d-flex justify-content-between align-items-center"
          >
            <span>
              <i className="fa-solid fa-newspaper me-3"></i>
              News
            </span>
            <i
              className={`fa-solid ${
                isNewsDropdownExpanded ? "fa-chevron-up" : "fa-chevron-down"
              }`}
            ></i>
          </a>
          {isNewsDropdownExpanded && (
            <ul className="nav flex-column ms-3">
              <li>
                <NavLink to="/reports" className="nav-link text-white">
                  Add Category
                </NavLink>
              </li>
              <li>
                <NavLink to="/analytics" className="nav-link text-white">
                  Add News
                </NavLink>
              </li>
              <li>
                <NavLink to="/support" className="nav-link text-white">
                  View News
                </NavLink>
              </li>
            </ul>
          )}
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
            className="rounded-circle me-3"
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
