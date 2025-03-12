import axios from "axios";
import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import SearchBar from "../../layout/SearchBar";
import { useNavigate } from "react-router-dom";
import "../../styles/styles.css";
import useUser from "../../hooks/useUser";
import DurationSelector from "../../components/DurationSelector";
import ImageUploader from "../../components/ImageUpload";

function AddEvent({ route, method }) {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventPrice, setEventPrice] = useState("");
  const [eventDuration, setEventDuration] = useState("0 hours 0 minutes");
  const [eventContactName, setEventContactName] = useState("");
  const [eventContactNumber, setEventContactNumber] = useState("");
  const [categoryStatus, setCategoryStatus] = useState(1);
  const [eventImage, setEventImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const today = new Date().toISOString().split("T")[0]; // Get today's date
  const [selectedDate, setSelectedDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const handleDurationChange = (type, value) => {
    const newHours = type === "hours" ? value : hours;
    const newMinutes = type === "minutes" ? value : minutes;

    setHours(newHours);
    setMinutes(newMinutes);
    setEventDuration(`${newHours} hours ${newMinutes} minutes`);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setEventImage(file); // Store the file in state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("name", eventName); // Add other event details
    formData.append("description", eventDescription);
    formData.append("date", eventDate);
    formData.append("time", eventTime);
    formData.append("location", eventLocation);
    formData.append("price", eventPrice);
    formData.append("duration", eventDuration);
    formData.append("contact_name", eventContactName);
    formData.append("contact_number", eventContactNumber);
    formData.append("event_category_id", 1);
    if (eventImage) {
      formData.append("image", eventImage); // Append image
    }
    console.log(formData);
    try {
      // Proceed with storing event category
      const res = await api.post("api/events/event/", {
        event_category_id: 16,
        name: eventName,
        description: eventDescription,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        price: eventPrice,
        image: eventImage,
        duration: eventDuration,
        contact_name: eventContactName,
        contact_number: eventContactNumber,
        status: categoryStatus,
        created_by: user.first_name + " " + user.last_name,
      });
      alert("Category added successfully!");
      navigate("/events"); // Redirect to categories list page
    } catch (error) {
      console.error("Error submitting event:", error); // Full error object
      if (error.response) {
        console.error("Response Data:", error.response.data); // Logs detailed error
        console.error("Response Status:", error.response.status);
      }

      if (error.response && error.response.data) {
        setError(error.response.data.detail || "An error occurred.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
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
        <SearchBar />

        <div className="container mt-4">
          <div className="row align-items-center mb-7">
            <div className="col">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2">
                  <li className="breadcrumb-item">
                    <p
                      className="text-body-secondary"
                      onClick={() => navigate("/events")}
                      style={{ cursor: "pointer" }}
                    >
                      Events
                    </p>
                  </li>
                  <li
                    className="breadcrumb-item active text-light"
                    aria-current="page"
                  >
                    New Event
                  </li>
                </ol>
              </nav>
              <h1 className="fs-4 mb-0">New Event</h1>
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
                    Name
                  </label>
                  <input
                    className="form-control"
                    id="name"
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="datePicker">
                      Date
                    </label>
                    <input
                      className="form-control"
                      id="datePicker"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      min={today}
                      required
                    />
                  </div>

                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="time">
                      Time
                    </label>
                    <input
                      className="form-control"
                      id="time"
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      min={today}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="price">
                      Price
                    </label>
                    <input
                      className="form-control"
                      id="price"
                      type="number"
                      value={eventPrice}
                      onChange={(e) => setEventPrice(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-6 mb-4">
                    <label className="form-label">Duration:</label>
                    <div className="row">
                      <div className="col-6">
                        <select
                          className="form-select"
                          value={hours}
                          onChange={(e) =>
                            handleDurationChange("hours", e.target.value)
                          }
                        >
                          {[...Array(24).keys()].map((h) => (
                            <option key={h} value={h}>
                              {h} Hours
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-6">
                        <select
                          className="form-select"
                          value={minutes}
                          onChange={(e) =>
                            handleDurationChange("minutes", e.target.value)
                          }
                        >
                          {[0, 15, 30, 45].map((m) => (
                            <option key={m} value={m}>
                              {m} Minutes
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <p>Selected Duration: {eventDuration}</p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="contact_name">
                      Contact Name
                    </label>
                    <input
                      className="form-control"
                      id="contact_name"
                      type="text"
                      value={eventContactName}
                      onChange={(e) => setEventContactName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="contact_number">
                      Contact Number
                    </label>
                    <input
                      className="form-control"
                      id="contact_number"
                      type="number"
                      value={eventContactNumber}
                      onChange={(e) => setEventContactNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 mb-4">
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

                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="location">
                      Location
                    </label>
                    <div className="mb-4">
                      <input
                        id="location"
                        className="form-control"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="image-uploader">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                    />
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="preview-image"
                      />
                    )}
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

export default AddEvent;
