import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";
import Sidebar from "../layout/Sidebar";
import SearchBar from "../layout/SearchBar";
import useUser from "../hooks/useUser";
import planet_earth from "../assets/images/planet-earth.png";
import user_img from "../assets/images/user.png";
import blog_img from "../assets/images/blog.png";
import event_img from "../assets/images/event.png";
import webinar_img from "../assets/images/webinar.png";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingCountry, setIsLoadingCountry] = useState(true);
  const [isLoadingCity, setIsLoadingCity] = useState(true);
  const [isLoadingTime, setIsLoadingTime] = useState(true);

  const updateTime = () => {
    const date = new Date();
    const timeString = date.toLocaleTimeString(); // Local time format
    setCurrentTime(timeString);
    setIsLoadingTime(false);
  };

  const getUserCountry = async () => {
    try {
      const response = await fetch(
        "https://ipinfo.io/json?token=f48a68ebe13b9a"
      );
      const data = await response.json();
      setCountry(data.country);
      setCity(data.city);
    } catch (error) {
      console.error("Failed to fetch location:", error);
      setCountry("Unknown");
      setCity("Unknown");
    } finally {
      setIsLoadingCountry(false); // Mark country as loaded
      setIsLoadingCity(false); // Mark country as loaded
    }
  };

  useEffect(() => {
    // Update time every second
    const timer = setInterval(updateTime, 1000);

    // Get user's country
    getUserCountry();

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

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

        const allUsersResponse = await api.get("/api/user/all-users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserCount(allUsersResponse.data.length);
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
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  if (isLoadingUser || isLoadingCountry || isLoadingTime || isLoadingCity) {
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
        <SearchBar />
        <div className="d-flex justify-content-between align-items-center mt-5">
          <h1 className="fw-semibold">Hello, {user.first_name}</h1>
          <div className="text-end align-baseline">
            <img
              src={planet_earth}
              alt="Planet Earth"
              height={25}
              className="me-2"
            />
            {city}, {country} - {currentTime}
          </div>
        </div>
        <p className="text-secondary">
          Your go-to system for creating, editing, and managing content
          seamlessly.
        </p>
        <hr className="mt-4 mb-3" />
        <div className="row justify-content-between">
          <div className="col-3">
            <div
              className="card bg-dark"
              style={{ maxWidth: "250px", margin: "10px" }}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-secondary fs-6 fw-light">
                    Users
                  </h6>
                  <h6 className="card-text fw-semibold text-light fs-2">
                    {userCount}
                  </h6>
                </div>
                <img
                  src={user_img}
                  alt="User Avatar"
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
            </div>
          </div>
          <div className="col-3">
            <div
              className="card bg-dark"
              style={{ maxWidth: "250px", margin: "10px" }}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-secondary fs-6 fw-light">
                    Blogs
                  </h6>
                  <h6 className="card-text fw-semibold text-light fs-2">100</h6>
                </div>
                <img
                  src={blog_img}
                  alt="User Avatar"
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
            </div>
          </div>
          <div className="col-3">
            <div
              className="card bg-dark"
              style={{ maxWidth: "250px", margin: "10px" }}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-secondary fs-6 fw-light">
                    Events
                  </h6>
                  <h6 className="card-text fw-semibold text-light fs-2">100</h6>
                </div>
                <img
                  src={event_img}
                  alt="User Avatar"
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
            </div>
          </div>
          <div className="col-3">
            <div
              className="card bg-dark"
              style={{ maxWidth: "250px", margin: "10px" }}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title text-secondary fs-6 fw-light">
                    Webinars
                  </h6>
                  <h6 className="card-text fw-semibold text-light fs-2">100</h6>
                </div>
                <img
                  src={webinar_img}
                  alt="User Avatar"
                  className="rounded-circle"
                  style={{ width: "50px", height: "50px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
