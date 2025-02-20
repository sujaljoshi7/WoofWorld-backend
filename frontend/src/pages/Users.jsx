import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";
import Sidebar from "../layout/Sidebar";
import SearchBar from "../layout/SearchBar";

function AllUsers() {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

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

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        console.error("No token found!");
        setIsLoadingUser(false);
        return;
      }

      try {
        const response = await api.get("/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);

        const allUsersResponse = await api.get("/api/all-users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllUsers(allUsersResponse.data);
        setFilteredData(allUsersResponse.data);
      } catch (error) {
        // Check if the error is due to token expiration
        if (error.response && error.response.status === 401) {
          console.warn("Access token expired, attempting to refresh...");
          await handleTokenRefresh();
        } else {
          console.error("Failed to fetch user data:", error);
        }
      } finally {
        setIsLoadingUser(false);
      }
    };

    const handleTokenRefresh = async () => {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      if (!refreshToken) {
        console.error("No refresh token found, logging out...");
        window.location.href = "/login"; // Redirect to login
        return;
      }

      try {
        const response = await api.post("/api/token/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem(ACCESS_TOKEN, newAccessToken); // Update the access token
        console.log("Token refreshed successfully");

        // Retry fetching user data with the new token
        await fetchUserData();
      } catch (error) {
        console.error("Failed to refresh token:", error);
        window.location.href = "/login"; // Redirect if refresh fails
      }
    };

    fetchUserData();
  }, []);

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
      <Sidebar user={user} />
      <div className="d-flex flex-column flex-grow-1  ms-5 me-5">
        <SearchBar />
        <div className="container mt-4">
          <h2>Table with Search</h2>
          <div className="input-group mb-3">
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
          <table className="table table-striped table-bordered table-dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Date Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{`${item.first_name} ${item.last_name}`}</td>
                    <td>{item.email}</td>
                    <td>{item.is_staff ? "Admin" : "User"}</td>
                    <td>
                      {item.date_joined
                        ? new Date(item.date_joined).toLocaleDateString(
                            undefined,
                            date_format
                          )
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AllUsers;
