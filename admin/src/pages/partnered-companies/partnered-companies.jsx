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

function ViewPartneredCompanies() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [allCompanies, setAllCompanies] = useState([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
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

    if (allCompanies) {
      const filtered = allCompanies.filter((item) =>
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

  const fetchCompanies = async () => {
    setIsLoadingCompanies(true);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingUser(false);
      return;
    }
    try {
      const companiesRes = api.get("/api/partnered-companies/");
      const [companies] = await Promise.all([companiesRes]);
      setAllCompanies(companies.data);
      setFilteredData(companies.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");
        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          return fetchCompanies();
        }
      } else {
        console.error("Failed to fetch companies data:", error);
      }
    } finally {
      setIsLoadingCompanies(false);
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

    fetchCompanies();
    const interval = setInterval(() => {
      fetchCompanies();
    }, 60000);

    return () => clearInterval(interval);
  }, [message]);

  const handleDeactivate = async (company_id) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingUser(false);
      return;
    }
    try {
      const response = await api.patch(
        `api/partnered-companies/company/${company_id}/deactivate/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      fetchCompanies();
    } catch (error) {
      setError(error.response.data.message || "Error deactivating company");
    }
  };

  const handleActivate = async (company_id) => {
    try {
      const response = await api.patch(
        `api/partnered-companies/company/${company_id}/activate/`
      );
      setMessage(response.data.message);
      fetchCompanies();
    } catch (error) {
      setError(error.response.data.message || "Error activating company");
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
      await api.patch(`/api/partnered-companies/company/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchCompanies();
      if (newStatus) {
        setMessage(name + " is live on featured section!");
      } else {
        setMessage(name + " will no longer be displayed on featured section!");
      }
    } catch (error) {
      console.error("Failed to update company:", error);
    }
  };

  const handleExport = () => {
    const formattedData = filteredData.map((item) => ({
      id: item.id,
      logo: item.logo,
      name: item.name,
      description: item.description,
      website: item.website,
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
        "Logo",
        "Name",
        "Description",
        "Website",
        "Status",
        "Featured",
        "Created By",
      ],
      [
        "id",
        "logo",
        "name",
        "description",
        "website",
        "status",
        "show_on_homepage",
        "created_by",
      ],
      "partnered-companies.csv"
    );
  };

  const handleRowClick = (company_id) => {
    navigate(`/partnered-companies/${encodeURIComponent(company_id)}`);
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
          <h1 className="h3 mb-0">Partnered Companies</h1>
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/partnered-companies/add")}
            >
              Add New Company
            </button>
            <button className="btn btn-success" onClick={handleExport}>
              Export to CSV
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
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Name</th>
                    <th>Website</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((company) => (
                    <tr
                      key={company.id}
                      onClick={() => handleRowClick(company.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <img
                          src={company.logo}
                          alt={company.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      </td>
                      <td>{company.name}</td>
                      <td>
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {company.website}
                        </a>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            company.status ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {company.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={company.show_on_homepage}
                            onChange={(e) =>
                              handleToggleStatus(
                                company.id,
                                e.target.checked,
                                company.name
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </td>
                      <td>
                        {company.created_by
                          ? `${company.created_by.first_name} ${company.created_by.last_name}`
                          : "N/A"}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            className={`btn btn-sm ${
                              company.status ? "btn-danger" : "btn-success"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              company.status
                                ? handleDeactivate(company.id)
                                : handleActivate(company.id);
                            }}
                          >
                            {company.status ? "Deactivate" : "Activate"}
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

export default ViewPartneredCompanies;
