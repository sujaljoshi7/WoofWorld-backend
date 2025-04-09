import axios from "axios";
import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../constants";
import api from "../../../api";
import Sidebar from "../../../layout/Sidebar";
import { exportToCSV } from "../../../utils/export";

import useUser from "../../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { handleTokenRefresh } from "../../../hooks/tokenRefresh";
import Pagination from "../../../components/Pagination"; // Import Pagination Component

const BASE_URL = import.meta.env.VITE_API_URL;
function PartnerCompanies() {
  const navigate = useNavigate();

  const { user, isLoading } = useUser();
  const [allHeros, setAllCompanies] = useState([]);
  const [isLoadingHero, setIsLoadingCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (allHeros) {
      const filtered = allHeros.filter((item) =>
        `${item.headline} ${item.subtext} ${item.cta}`
          .toLowerCase()
          .includes(value)
      );
      setFilteredData(filtered);
    }
  };

  const fetchPartnedCompanies = async () => {
    setIsLoadingCompanies(true);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      alert("No token found!");
      setIsLoadingUser(false);
      return;
    }
    try {
      // Fetch user details independently
      const companyRes = api.get("/api/homepage/partnercompany/");

      // Wait for both requests to complete independently
      const [company] = await Promise.all([companyRes]);

      // Update state
      setAllCompanies(company.data);
      setFilteredData(company.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");

        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          return fetchPartnedCompanies(); // Retry after refreshing
        }
      } else {
        console.error("Failed to fetch user data:", error);
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

    fetchPartnedCompanies();
    const interval = setInterval(() => {
      fetchPartnedCompanies();
    }, 60000);

    return () => clearInterval(interval); // Cleanup on unmount
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
        `api/homepage/partnercompany/${company_id}/deactivate/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add JWT Token
          },
        }
      );
      setMessage(response.data.message);
      //   alert("User activated successfully!");
      fetchPartnedCompanies();
    } catch (error) {
      setError(error.response.data.message || "Error deactivating product");
    }
  };

  const handleActivate = async (company_id) => {
    try {
      const response = await api.patch(
        `api/homepage/partnercompany/${company_id}/activate/`
      );
      setMessage(response.data.message);
      fetchPartnedCompanies();
    } catch (error) {
      setError(error.response.data.message || "Error activating product");
      console.log(error);
    }
  };

  const handleRowClick = (hero_id) => {
    navigate(`/homepage/partnercompany/edit/${hero_id}`);
  };

  const handleExport = () => {
    exportToCSV(
      filteredData,
      ["ID", "Headline", "Subtext", "CTA", "Image URL"], // Headers
      ["id", "headline", "subtext", "cta", "image"], // Fields
      "hero_section.csv"
    );
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
            <h2>Partner Companies</h2>
            <div>
              <button className="btn btn-primary me-2" onClick={handleExport}>
                Export to CSV
              </button>
              <button
                className="btn btn-warning"
                onClick={() => navigate("/homepage/partnercompany/add")}
              >
                + Add Company
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
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading || isLoadingHero ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Loading Heros
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleRowClick(item.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{item.id}</td>
                    <td>
                      <img src={item.image} alt="Event Image" height={100} />
                    </td>
                    <td>{item.name}</td>
                    <td>
                      {item.status ? (
                        <span className="badge text-bg-success">Active</span>
                      ) : (
                        <span className="badge text-bg-danger">Inactive</span>
                      )}
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

export default PartnerCompanies;
