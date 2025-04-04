import axios from "axios";
import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import Pagination from "../../components/Pagination"; // Import Pagination Component
import { handleTokenRefresh } from "../../hooks/tokenRefresh";
import useUser from "../../hooks/useUser";
import { data, useNavigate } from "react-router-dom";

import { exportToCSV } from "../../utils/export";

const BASE_URL = import.meta.env.VITE_API_URL;
function ViewWebinars() {
  const navigate = useNavigate();

  const { user, isLoading } = useUser();
  const [allDogs, setAllDogs] = useState([]);
  const [isLoadingDogs, setIsLoadingDogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (allDogs) {
      const filtered = allDogs.filter((item) =>
        `${item.name} ${item.breed.name} ${item.status} ${item.created_by}`
          .toLowerCase()
          .includes(value)
      );
      setFilteredData(filtered);
    }
  };

  const fetchDogs = async () => {
    setIsLoadingDogs(true);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingUser(false);
      return;
    }
    try {
      // Fetch user details independently
      const dogsRes = api.get("/api/adoption/");

      // Wait for both requests to complete independently
      const [dogs] = await Promise.all([dogsRes]);

      // Update state
      setAllDogs(dogs.data);
      setFilteredData(dogs.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");

        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          return fetchDogs(); // Retry after refreshing
        }
      } else {
        console.error("Failed to fetch user data:", error);
      }
    } finally {
      setIsLoadingDogs(false);
    }
  };

  useEffect(() => {
    if (message) {
      const toastElement = document.getElementById("liveToast");
      if (toastElement) {
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
      }
    }

    fetchDogs();
    const interval = setInterval(() => {
      fetchDogs();
    }, 60000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [message]);

  const handleDeactivate = async (dog_id) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingUser(false);
      return;
    }
    try {
      const response = await api.patch(
        `api/adoption/dog/${dog_id}/deactivate/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add JWT Token
          },
        }
      );
      setMessage(response.data.message);
      //   alert("User activated successfully!");
      fetchDogs();
    } catch (error) {
      setError(error.response.data.message || "Error deactivating Webinar");
    }
  };

  const handleActivate = async (dog_id) => {
    try {
      const response = await api.patch(`api/adoption/dog/${dog_id}/activate/`);
      setMessage(response.data.message);
      fetchDogs();
    } catch (error) {
      setError(error.response.statusText || "Error activating Webinar");
      console.log(error);
    }
  };

  const handleRowClick = (adoption_id) => {
    navigate(`/adoption/${adoption_id}`);
  };

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleExport = () => {
    const formattedData = filteredData.map((item) => ({
      id: item.id,
      image: item.image,
      name: item.name,
      looking_for: item.looking_for,
      created_at: new Date(item.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      breed: item.breed.name,
      age: item.age,
      gender: item.gender,
      color: item.color,
      personality: item.personality,
      weight: item.weight,
      energy_level: item.energy_level,
      disease: item.disease,
      vaccinated_status: item.vaccinated_status,
      status: item.status ? "Active" : "Inactive",
      created_by: item.created_by
        ? `${item.created_by.first_name} ${item.created_by.last_name} [${item.created_by.email}]`
        : "",
    }));
    exportToCSV(
      formattedData,
      [
        "ID",
        "Image",
        "Name",
        "Breed",
        "Age",
        "Gender",
        "Color",
        "Personality",
        "Weight",
        "Energy Level",
        "Disease",
        "Vaccinated Status",
        "Looking For",
        "Status",
        "Created At",
        "Created By",
      ], // Headers
      [
        "id",
        "image",
        "name",
        "breed",
        "age",
        "gender",
        "color",
        "personality",
        "weight",
        "energy_level",
        "disease",
        "vaccinated_status",
        "looking_for",
        "status",
        "created_at",
        "created_by",
      ], // Fields
      "WoofWorld_adoptions.csv"
    );
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
          {error && (
            <div className="col-12 col-sm-auto mt-4 mt-sm-0">
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {error}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            </div>
          )}
          {message && (
            <div className="col-12 col-sm-auto mt-4 mt-sm-0">
              <div
                className="position-fixed bottom-0 end-0 p-3"
                style={{ zIndex: 11 }} // React style syntax
              >
                <div
                  id="liveToast"
                  className="toast hide"
                  role="alert"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  <div className="toast-header">
                    <strong className="me-auto">WoofWorld Admin</strong>
                    <small>Just Now</small>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="toast"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="toast-body">{message}</div>
                </div>
              </div>
            </div>
          )}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Adoption</h2>
            <div>
              <button className="btn btn-primary me-2" onClick={handleExport}>
                Export to CSV
              </button>
              <button
                className="btn btn-warning"
                onClick={() => navigate("/adoption/add")}
              >
                + Add Adoption Listing
              </button>
            </div>
          </div>
          <div className="input-group mb-3 mt-3">
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
                <th>Image</th>
                <th>Name</th>
                <th>Breed</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isLoadingDogs ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Loading Webinars
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{item.id}</td>
                    <td>
                      <img
                        src={`${BASE_URL}${item.image}`}
                        alt="Webinar Image"
                        height={100}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.breed.name}</td>
                    <td>
                      {item.status ? (
                        <span className="badge text-bg-success">Active</span>
                      ) : (
                        <span className="badge text-bg-danger">Inactive</span>
                      )}
                    </td>
                    <td>
                      {item.created_by.first_name} {item.created_by.last_name}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {item.status ? (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeactivate(item.id)}
                          title="Delete User"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleActivate(item.id)}
                          title="Delete User"
                        >
                          Activate
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

export default ViewWebinars;
