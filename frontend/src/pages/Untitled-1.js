import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
import api from "../api";

const Sidebar = ({ isCollapsed, toggleSidebar, user }) => (
  <div
    className={`d-flex flex-column flex-shrink-0 p-3 text-white bg-dark ${
      isCollapsed ? "collapsed" : ""
    }`}
    style={{ width: isCollapsed ? "80px" : "280px", height: "100vh" }}
  >
    <button
      className="btn btn-outline-light mb-3"
      onClick={toggleSidebar}
      style={{ width: "100%" }}
    >
      {isCollapsed ? "Expand" : "Collapse"}
    </button>
    <ul className="nav nav-pills flex-column mb-auto">
      <SidebarNavItem
        label="Home"
        iconClass="fa-solid fa-house"
        isCollapsed={isCollapsed}
      />
      <SidebarNavItem label="Dashboard" isCollapsed={isCollapsed} />
      <SidebarNavItem label="Dashboard" isCollapsed={isCollapsed} />
      <SidebarNavItem label="Dashboard" isCollapsed={isCollapsed} />
    </ul>
  </div>
);

const SidebarNavItem = ({ label, iconClass, isCollapsed }) => (
  <li className="nav-item">
    <a href="#" className="nav-link text-white">
      {iconClass && <i className={`${iconClass} me-2`}></i>}
      {!isCollapsed && label}
    </a>
  </li>
);

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container-fluid">
      <a className="navbar-brand" href="#">
        Navbar
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="#">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Link
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

function HomePage() {
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        console.error("No token found!");
        return;
      }

      try {
        const response = await api.get("/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        user={user}
      />
      <div className="flex-grow-1">
        <Navbar />
        <div className="container mt-3">
          <h1>Welcome to the Dashboard</h1>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
