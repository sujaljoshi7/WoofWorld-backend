import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import user_img from "../assets/images/user.png";
import { useNavigate } from "react-router-dom";

function Sidebar({ user, onCollapse }) {
  const location = useLocation();
  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const toggleDropdown = (menu) => {
    setExpandedDropdown(expandedDropdown === menu ? null : menu);
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapse(newState);
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      name: "Home Page",
      icon: "fa-home",
      subItems: ["Hero Section", "Partner Company", "Navbar"],
    },
    {
      name: "Company Info",
      icon: "fa-building",
      subItems: ["About Us", "Contact Details"],
    },
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
      subItems: ["Category", "Sales", "View"],
    },
  ];

  return (
    <>
      <div
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobile ? "mobile" : ""
        }`}
        style={{
          width: isCollapsed ? "80px" : "280px",
          height: "100vh",
          transition: "all 0.3s ease-in-out",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1000,
          background: "linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        <div className="d-flex flex-column h-100">
          <div className="sidebar-header p-3 d-flex align-items-center justify-content-between">
            {!isCollapsed && (
              <NavLink to="/" className="text-white text-decoration-none">
                <span className="fs-4 fw-bold">WoofWorld</span>
              </NavLink>
            )}
            <button
              className="btn btn-link text-white p-0"
              onClick={toggleSidebar}
            >
              <i className={`fas fa-${isCollapsed ? "bars" : "times"}`}></i>
            </button>
          </div>

          <hr className="text-white-50 my-0" />

          <div className="sidebar-content flex-grow-1 overflow-auto">
            <ul className="nav nav-pills flex-column mb-auto p-3">
              <li className="nav-item">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `nav-link ${
                      isActive ? "active bg-primary" : "text-white"
                    } d-flex align-items-center`
                  }
                >
                  <i className="fa-solid fa-gauge-high"></i>
                  {!isCollapsed && <span className="ms-3">Dashboard</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `nav-link ${
                      isActive ? "active bg-primary" : "text-white"
                    } d-flex align-items-center`
                  }
                >
                  <i className="fa-solid fa-user"></i>
                  {!isCollapsed && <span className="ms-3">Users</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `nav-link ${
                      isActive ? "active bg-primary" : "text-white"
                    } d-flex align-items-center`
                  }
                >
                  <i className="fa-solid fa-box-open"></i>
                  {!isCollapsed && <span className="ms-3">Orders</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/blogs"
                  className={({ isActive }) =>
                    `nav-link ${
                      isActive ? "active bg-primary" : "text-white"
                    } d-flex align-items-center`
                  }
                >
                  <i className="fa-solid fa-note-sticky"></i>
                  {!isCollapsed && <span className="ms-3">Blogs</span>}
                </NavLink>
              </li>

              {menuItems.map((menu) => (
                <li key={menu.name} className="nav-item">
                  <a
                    href="#"
                    onClick={() => toggleDropdown(menu.name)}
                    className="nav-link text-white d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center">
                      <i className={`fa-solid ${menu.icon}`}></i>
                      {!isCollapsed && (
                        <span className="ms-3">{menu.name}</span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <i
                        className={`fa-solid ${
                          expandedDropdown === menu.name
                            ? "fa-chevron-up"
                            : "fa-chevron-down"
                        }`}
                      ></i>
                    )}
                  </a>
                  {!isCollapsed && expandedDropdown === menu.name && (
                    <ul className="nav flex-column ms-4">
                      {menu.subItems.map((sub, index) => (
                        <li key={index}>
                          <NavLink
                            to={
                              sub === "View"
                                ? `/${menu.name
                                    .toLowerCase()
                                    .replace(/\s+/g, "")}`
                                : `/${menu.name
                                    .toLowerCase()
                                    .replace(/\s+/g, "")}/${sub
                                    .toLowerCase()
                                    .replace(/\s+/g, "")}`
                            }
                            className={({ isActive }) =>
                              `nav-link ${
                                isActive ? "active bg-primary" : "text-white-50"
                              }`
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
          </div>

          <hr className="text-white-50 my-0" />

          <div className="sidebar-footer p-3">
            <div className="dropdown">
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
                {!isCollapsed && (
                  <strong>{user ? user.first_name : "Loading..."}</strong>
                )}
              </a>
              <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                <li>
                  <a className="dropdown-item" href="/profile">
                    <i className="fas fa-user me-2"></i> View Profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/logout">
                    <i className="fas fa-sign-out-alt me-2"></i> Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {isMobile && !isCollapsed && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
        />
      )}
    </>
  );
}

export default Sidebar;
