import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useLocation } from "react-router-dom";
import api from "../api";
import Sidebar from "../layout/Sidebar";
import SearchBar from "../layout/SearchBar";
import "../styles/Styles.css";
import LoadingIndicator from "./LoadingIndicator";

import useUser from "../hooks/useUser";
import { useNavigate, useParams } from "react-router-dom";

const ModifyWebinar = ({ method }) => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [webinarName, setWebinarName] = useState("");
  const [webinarDescription, setWebinarDescription] = useState("");
  const [webinarDate, setWebinarDate] = useState("");
  const [webinarTime, setWebinarTime] = useState("");
  const [webinarLink, setWebinarLink] = useState("");
  const [webinarPrice, setWebinarPrice] = useState("");
  const [webinarContactName, setWebinarContactName] = useState("");
  const [webinarContactNumber, setWebinarContactNumber] = useState("");
  const [webinarStatus, setWebinarStatus] = useState(0);
  const [webinarImage, setWebinarImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const today = new Date().toISOString().split("T")[0]; // Get today's date
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const config = {
    readonly: false,
    height: 400,
    placeholder: "Write your blog here...",
    toolbarButtonSize: "large",
    theme: "dark",
    buttons:
      "bold,italic,underline,strikethrough,fontsize,font,brush,paragraph,|,ul,ol,|,link,hr,table,|,align,undo,redo,preview,fullscreen,lineHeight",
    showXPathInStatusbar: false,
  };

  useEffect(() => {
    if (method === "edit" && id) {
      fetchWebinarDetails();
    }
  }, []);

  const fetchWebinarDetails = async () => {
    try {
      const res = await api.get(`/api/webinars/${id}/`);
      const data = res.data;
      setWebinarName(data.name);
      setWebinarStatus(data.status);
      setWebinarDescription(data.description);
      setWebinarDate(data.date);
      setWebinarTime(data.time);
      setWebinarPrice(data.price);
      setWebinarLink(data.link);
      setWebinarContactName(data.contact_name);
      setWebinarContactNumber(data.contact_number);
      setPreviewImage(
        data.image ? `${import.meta.env.VITE_API_URL}${data.image}` : ""
      );
    } catch (err) {
      console.error("Failed to fetch webinar details:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setWebinarImage(file); // Store the file in state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", webinarName);
    formData.append("description", webinarDescription);
    formData.append("date", webinarDate);
    formData.append("date", webinarDate);
    formData.append("time", webinarTime);
    formData.append("link", webinarLink);
    formData.append("price", webinarPrice);
    formData.append("contact_name", webinarContactName);
    formData.append("contact_number", webinarContactNumber);
    formData.append("status", webinarStatus);
    if (webinarImage) {
      formData.append("image", webinarImage);
    }

    try {
      if (method === "edit") {
        await api.patch(`/api/webinars/webinar/${id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Webinar Updated Successfully!");
      } else {
        await api.post(`/api/webinars/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Webinar Added Successfully!");
      }
      navigate("/webinars");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit webinar. Try again.");
    } finally {
      setLoading(false);
    }
  };

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
                      onClick={() => navigate("/webinars")}
                      style={{ cursor: "pointer" }}
                    >
                      Webinars
                    </p>
                  </li>
                  <li
                    className="breadcrumb-item active text-light"
                    aria-current="page"
                  >
                    {method === "edit" ? "Edit " : "Add "}
                    Webinar
                  </li>
                </ol>
              </nav>
              <h1 className="fs-4 mb-0">
                {method === "edit" ? "Edit " : "Add "}Webinar
              </h1>
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
                <div className="row">
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      value={webinarName}
                      onChange={(e) => setWebinarName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="status">
                      Status
                    </label>
                    <div className="mb-4">
                      <select
                        id="status"
                        className="form-select"
                        value={webinarStatus}
                        onChange={(e) => setWebinarStatus(e.target.value)}
                        required
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    value={webinarDescription}
                    onChange={(e) => setWebinarDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-lg-6 mb-4">
                    <label className="form-label" htmlFor="datePicker">
                      Date
                    </label>
                    <input
                      className="form-control"
                      id="datePicker"
                      type="date"
                      value={webinarDate}
                      onChange={(e) => setWebinarDate(e.target.value)}
                      min={today}
                      required
                    />
                  </div>

                  <div className="col-lg-6 mb-4">
                    <label className="form-label" htmlFor="time">
                      Time
                    </label>
                    <input
                      className="form-control"
                      id="time"
                      type="time"
                      value={webinarTime}
                      onChange={(e) => setWebinarTime(e.target.value)}
                      min={today}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 mb-4">
                    <label className="form-label" htmlFor="price">
                      Price
                    </label>
                    <input
                      className="form-control"
                      id="price"
                      type="number"
                      value={webinarPrice}
                      onChange={(e) => setWebinarPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label className="form-label" htmlFor="price">
                      Link
                    </label>
                    <input
                      className="form-control"
                      id="price"
                      type="text"
                      value={webinarLink}
                      onChange={(e) => setWebinarLink(e.target.value)}
                      required
                    />
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
                      value={webinarContactName}
                      onChange={(e) => setWebinarContactName(e.target.value)}
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
                      value={webinarContactNumber}
                      onChange={(e) => setWebinarContactNumber(e.target.value)}
                      required
                    />
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
                        className="preview-image mt-2"
                        height={200}
                      />
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-center my-3">
                  {loading && <LoadingIndicator />}
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
};

export default ModifyWebinar;
