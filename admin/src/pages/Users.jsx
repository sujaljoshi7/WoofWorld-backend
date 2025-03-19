import axios from "axios";
import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";
import Sidebar from "../layout/Sidebar";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination"; // Import Pagination Component

function AllUsers() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (allUsers) {
      const filtered = allUsers.filter(
        (item) =>
          `${item.first_name} ${item.last_name}`
            .toLowerCase()
            .includes(value) ||
          item.email.toLowerCase().includes(value) ||
          (item.is_staff ? "admin" : "user").includes(value) ||
          item.date_joined.toLowerCase().includes(value)
      );
      setFilteredData(filtered);
    }
  };

  const date_format = {
    year: "numeric",
    month: "long", // "short" for abbreviated months
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingUser(false);
      return;
    }

    try {
      // Fetch user details independently
      const userResponse = api.get("/api/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch all users independently
      const allUsersResponse = api.get("/api/user/all-users/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Wait for both requests to complete independently
      const [userData, allUsersData] = await Promise.all([
        userResponse,
        allUsersResponse,
      ]);

      // Update state
      setUser(userData.data);
      setAllUsers(allUsersData.data);
      setFilteredData(allUsersData.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.warn("Access token expired, attempting to refresh...");
        await handleTokenRefresh();
      } else {
        console.error("Failed to fetch data:", error);
      }
    } finally {
      setIsLoadingUser(false);
    }
  };

  const handleTokenRefresh = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      console.error("No refresh token found, logging out...");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;
      localStorage.setItem(ACCESS_TOKEN, newAccessToken);
      console.log("Token refreshed successfully");

      await fetchUserData(); // Retry fetching user data
    } catch (error) {
      console.error("Failed to refresh token:", error);
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    fetchUserData();

    const interval = setInterval(() => {
      fetchUserData();
    }, 60000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleDelete = async (userId) => {
    try {
      const response = await api.patch(`api/user/${userId}/delete`); // Use api instance
      alert("User deactivated successfully!");
      fetchUserData();
    } catch (error) {
      console.error("Error deactivating user:", error);
      alert("Failed to deactivate user!");
    }
  };

  const handleActivate = async (userId) => {
    try {
      const response = await api.patch(`api/user/${userId}/activate`); // Use api instance
      alert("User activated successfully!");
      fetchUserData();
    } catch (error) {
      console.error("Error activating user:", error);
      alert("Failed to activate user!");
    }
  };

  const handleRowClick = (userId) => {
    navigate(`/view-user/${userId}`);
  };

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  if (isLoadingUser) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <div className="sidebar">
        <Sidebar user={user} />
      </div>
      <div
        className="main-content flex-grow-1 ms-2"
        style={{ marginLeft: "280px", padding: "20px" }}
      >
        <div className="container mt-4">
          <h2>Users</h2>
          <div className="input-group mt-3 mb-3">
            <span className="input-group-text bg-light border-0">
              <i className="fa fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control bg-dark text-light p-2"
              placeholder="Search..."
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <table className="table table-striped table-bordered table-dark table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{item.id}</td>
                    <td
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "150px",
                        verticalAlign: "middle",
                      }}
                    >{`${item.first_name} ${item.last_name}`}</td>
                    <td
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "150px",
                      }}
                    >
                      {item.email}
                    </td>
                    <td>{item.is_staff ? "Admin" : "User"}</td>
                    <td>
                      {item.is_active ? (
                        <span className="badge text-bg-success">Active</span>
                      ) : (
                        <span className="badge text-bg-danger">Inactive</span>
                      )}
                    </td>
                    <td>
                      {item.last_login
                        ? new Date(item.last_login).toLocaleDateString(
                            undefined,
                            date_format
                          )
                        : "N/A"}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {item.is_active ? (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item.id)}
                          title="Delete User"
                        >
                          Deactivate User
                        </button>
                      ) : (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleActivate(item.id)}
                          title="Delete User"
                        >
                          Activate User
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Component */}
          <Pagination pageCount={pageCount} onPageChange={handlePageClick} />
        </div>
      </div>
    </div>
  );
}

export default AllUsers;
