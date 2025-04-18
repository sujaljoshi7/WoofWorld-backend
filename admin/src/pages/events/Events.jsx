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

function ViewEvents() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [allEvents, setAllEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [homePageToggle, setHomePageToggle] = useState();
  const [filterType, setFilterType] = useState("all"); // "all", "upcoming", or "past"
  const itemsPerPage = 5;

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (allEvents) {
      const filtered = allEvents.filter((item) =>
        `${item.name} ${item.status} ${item.created_by}`
          .toLowerCase()
          .includes(value)
      );
      applyDateFilter(filtered, filterType);
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

  const applyDateFilter = (events, filterType) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

    let filtered = events;

    if (filterType === "upcoming") {
      filtered = events.filter((event) => new Date(event.date) >= today);
    } else if (filterType === "past") {
      filtered = events.filter((event) => new Date(event.date) < today);
    }

    setFilteredData(filtered);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    applyDateFilter(allEvents, type);
  };

  const fetchEvents = async () => {
    setIsLoadingEvents(true);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingEvents(false);
      return;
    }
    try {
      const eventsRes = api.get("/api/events/event");
      const [events] = await Promise.all([eventsRes]);

      // Sort events by date (ascending)
      const sortedEvents = [...events.data].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setAllEvents(sortedEvents);
      applyDateFilter(sortedEvents, filterType);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");
        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          return fetchEvents();
        }
      } else {
        console.error("Failed to fetch events data:", error);
      }
    } finally {
      setIsLoadingEvents(false);
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

    fetchEvents();
    const interval = setInterval(() => {
      fetchEvents();
    }, 60000);

    return () => clearInterval(interval);
  }, [message, filterType]);

  const handleDeactivate = async (event_id) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      return;
    }
    try {
      const response = await api.patch(
        `api/events/event/${event_id}/deactivate/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      fetchEvents();
    } catch (error) {
      setError(error.response.data.message || "Error deactivating event");
    }
  };

  const handleActivate = async (event_id) => {
    try {
      const response = await api.patch(
        `api/events/event/${event_id}/activate/`
      );
      setMessage(response.data.message);
      fetchEvents();
    } catch (error) {
      setError(error.response.data.message || "Error activating event");
      console.log(error);
    }
  };

  const handleExport = () => {
    const formattedData = filteredData.map((item) => ({
      id: item.id,
      image: item.image,
      title: item.name,
      description: item.description,
      date: new Date(item.date).toLocaleDateString("en-GB", date_format),
      time: item.time,
      location: item.address_line_1 + " " + item.address_line_2,
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
        "Title",
        "Description",
        "Date",
        "Time",
        "Location",
        "Status",
        "Featured",
        "Created By",
      ],
      [
        "id",
        "image",
        "title",
        "description",
        "date",
        "time",
        "location",
        "status",
        "show_on_homepage",
        "created_by",
      ],
      "events.csv"
    );
  };

  const handleRowClick = (event_id) => {
    navigate(`/events/${encodeURIComponent(event_id)}`);
  };

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const isPastEvent = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) < today;
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
          <h1 className="h3 mb-0">Events</h1>
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/events/add")}
            >
              Add New Event
            </button>
            <button className="btn btn-success" onClick={handleExport}>
              Export to CSV
            </button>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <div className="mb-3 d-flex gap-2 flex-column flex-md-row">
              <div className="flex-grow-1">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="btn-group">
                <button
                  className={`btn ${
                    filterType === "all" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => handleFilterChange("all")}
                >
                  All Events
                </button>
                <button
                  className={`btn ${
                    filterType === "upcoming"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => handleFilterChange("upcoming")}
                >
                  Upcoming Events
                </button>
                <button
                  className={`btn ${
                    filterType === "past"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => handleFilterChange("past")}
                >
                  Past Events
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingEvents ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No events found
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((event) => {
                      const isEventPast = isPastEvent(event.date);

                      return (
                        <tr
                          key={event.id}
                          onClick={() => handleRowClick(event.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>
                            <img
                              src={event.image}
                              alt={event.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                          </td>
                          <td>{event.name}</td>
                          <td>
                            {new Date(event.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td>{event.time}</td>
                          <td>{event.address_line_1}</td>
                          <td>
                            <span
                              className={`badge ${
                                event.status ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {event.status ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>
                            {event.created_by
                              ? `${event.created_by.first_name} ${event.created_by.last_name}`
                              : "N/A"}
                          </td>
                          <td onClick={(e) => e.stopPropagation()}>
                            <div className="btn-group">
                              {!isEventPast && (
                                <button
                                  className={`btn btn-sm ${
                                    event.status ? "btn-danger" : "btn-success"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    event.status
                                      ? handleDeactivate(event.id)
                                      : handleActivate(event.id);
                                  }}
                                >
                                  {event.status ? "Deactivate" : "Activate"}
                                </button>
                              )}
                              {isEventPast && (
                                <button
                                  className={`btn btn-sm btn-warning`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/events/past/${event.id}`);
                                  }}
                                >
                                  Add Photos
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
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

export default ViewEvents;
