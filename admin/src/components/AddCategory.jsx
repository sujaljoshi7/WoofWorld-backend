import axios from "axios";
import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../api";
import Sidebar from "../layout/Sidebar";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import useUser from "../hooks/useUser";

function AddCategory({ route, method }) {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [categoryName, setCategoryName] = useState("");
  const [categoryStatus, setCategoryStatus] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!method) {
      console.error("Method is undefined");
      setError("Unexpected error. Please try again.");
      setLoading(false);
      return;
    }
    if (method === "Event") {
      try {
        // Proceed with storing event category
        const res = await api.post(route, {
          name: categoryName.trim(),
          status: categoryStatus,
          created_by: user.first_name + " " + user.last_name,
        });

        alert("Category added successfully!");
        navigate("/events/category"); // Redirect to categories list page
      } catch (error) {
        if (error.response && error.response.data) {
          if (error.response.data.name) {
            setError(error.response.data.name[0]); // Extracts the first error message
          } else {
            setError("An error occurred while adding the category.");
          }
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    } else if (method === "Service") {
      try {
        // Proceed with storing event category
        const res = await api.post(route, {
          name: categoryName.trim(),
          status: categoryStatus,
          created_by: user.first_name + " " + user.last_name,
        });

        alert("Category added successfully!");
        navigate("/services/category"); // Redirect to categories list page
      } catch (error) {
        if (error.response && error.response.data) {
          if (error.response.data.name) {
            setError(error.response.data.name[0]); // Extracts the first error message
          } else {
            setError("An error occurred while adding the category.");
          }
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    } else if (method === "product") {
      try {
        // Proceed with storing event category
        const res = await api.post(route, {
          name: categoryName.trim(),
          status: categoryStatus,
          created_by: user.first_name + " " + user.last_name,
        });

        alert("Category added successfully!");
        navigate("/products/category"); // Redirect to categories list page
      } catch (error) {
        if (error.response && error.response.data) {
          if (error.response.data.name) {
            setError(error.response.data.name[0]); // Extracts the first error message
          } else {
            setError("An error occurred while adding the category.");
          }
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
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

  if (isLoading) {
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
          <div className="row align-items-center mb-7">
            <div className="col">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2">
                  <li className="breadcrumb-item">
                    <p
                      className="text-body-secondary"
                      onClick={() => navigate("/events/category")}
                      style={{ cursor: "pointer" }}
                    >
                      {method} Categories
                    </p>
                  </li>
                  <li
                    className="breadcrumb-item active text-light"
                    aria-current="page"
                  >
                    New Category
                  </li>
                </ol>
              </nav>
              <h1 className="fs-4 mb-0">New Category</h1>
            </div>

            {error && (
              <div className="col-12 col-sm-auto mt-4 mt-sm-0">
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  <strong>Error</strong> {error}
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
              </div>
            )}
          </div>
          <div className="row mt-5">
            <div className="col">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label" htmlFor="name">
                    Category Name
                  </label>
                  <input
                    className="form-control"
                    id="name"
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label" htmlFor="status">
                    Status
                  </label>
                  <div className="mb-4">
                    <select
                      id="status"
                      className="form-select"
                      onChange={(e) => setCategoryStatus(e.target.value)}
                      required
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-warning w-100">
                  Save Category
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCategory;
