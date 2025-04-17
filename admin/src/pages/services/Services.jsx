import axios from "axios";
import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { exportToCSV } from "../../utils/export";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";

const BASE_URL = import.meta.env.VITE_API_URL;

function ViewServices() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [allServices, setAllServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [homePageToggle, setHomePageToggle] = useState();
  const itemsPerPage = 5;

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (allServices) {
      const filtered = allServices.filter((item) =>
        `${item.name} ${item.status} ${item.created_by}`
          .toLowerCase()
          .includes(value)
      );
      setFilteredData(filtered);
    }
  };

  const date_format = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const fetchServices = async () => {
    setIsLoadingServices(true);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingUser(false);
      return;
    }
    try {
      const servicesRes = api.get("/api/services/");
      const [services] = await Promise.all([servicesRes]);
      setAllServices(services.data);
      setFilteredData(services.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");
        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          return fetchServices();
        }
      } else {
        console.error("Failed to fetch services data:", error);
      }
    } finally {
      setIsLoadingServices(false);
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

    fetchServices();
    const interval = setInterval(() => {
      fetchServices();
    }, 60000);

    return () => clearInterval(interval);
  }, [message]);

  const handleDeactivate = async (service_id) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingUser(false);
      return;
    }
    try {
      const response = await api.patch(
        `api/services/service/${service_id}/deactivate/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      fetchServices();
    } catch (error) {
      setError(error.response.data.message || "Error deactivating service");
    }
  };

  const handleActivate = async (service_id) => {
    try {
      const response = await api.patch(
        `api/services/service/${service_id}/activate/`
      );
      setMessage(response.data.message);
      fetchServices();
    } catch (error) {
      setError(error.response.data.message || "Error activating service");
      console.log(error);
    }
  };

  const handleToggleStatus = async (id, newStatus, name, updatedStatus) => {
    updatedStatus = 0;
    if (newStatus) {
      updatedStatus = 1;
    }
    const formData = new FormData();
    formData.append("show_on_homepage", newStatus);
    try {
      await api.patch(`/api/services/service/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchServices();
      if (newStatus) {
        setMessage(name + " is live on featured section!");
      } else {
        setMessage(name + " will no longer be displayed on featured section!");
      }
    } catch (error) {
      console.error("Failed to update service:", error);
    }
  };

  const handleExport = () => {
    const formattedData = filteredData.map((item) => ({
      id: item.id,
      image: item.image,
      name: item.name,
      description: item.description,
      status: item.status,
      show_on_homepage: item.show_on_homepage,
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
        "Description",
        "Status",
        "Featured",
        "Created By",
      ],
      [
        "id",
        "image",
        "name",
        "description",
        "status",
        "show_on_homepage",
        "created_by",
      ],
      "services.csv"
    );
  };

  const handleRowClick = (service_id) => {
    navigate(`/services/${encodeURIComponent(service_id)}`);
  };

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar user={user} />
      <div
        className="main-content flex-grow-1"
        style={{
          marginLeft: "280px",
          padding: "2rem",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h1 className="h3 mb-0">Services</h1>
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/services/add")}
            >
              <i className="fas fa-plus me-2"></i>Add Service
            </button>
            <button className="btn btn-outline-success" onClick={handleExport}>
              <i className="fas fa-download me-2"></i>Export
            </button>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((service) => (
                    <tr
                      key={service.id}
                      onClick={() => handleRowClick(service.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <img
                          src={service.image}
                          alt={service.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      </td>
                      <td>{service.name}</td>
                      <td>
                        <span
                          className={`badge ${
                            service.status ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {service.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={service.show_on_homepage}
                            onChange={(e) =>
                              handleToggleStatus(
                                service.id,
                                e.target.checked,
                                service.name
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </td>
                      <td>
                        {service.created_by
                          ? `${service.created_by.first_name} ${service.created_by.last_name}`
                          : "N/A"}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            className={`btn btn-sm ${
                              service.status ? "btn-danger" : "btn-success"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              service.status
                                ? handleDeactivate(service.id)
                                : handleActivate(service.id);
                            }}
                          >
                            {service.status ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Pagination
            pageCount={pageCount}
            onPageChange={handlePageClick}
            currentPage={currentPage}
          />
        </div>

        <div
          className="toast-container position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 11 }}
        >
          <div
            id="liveToast"
            className="toast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="me-auto">Notification</strong>
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
    </div>
  );
}

export default ViewServices;
