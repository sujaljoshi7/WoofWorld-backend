import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useLocation } from "react-router-dom";
import api from "../api";
import Sidebar from "../layout/Sidebar";
import SearchBar from "../layout/SearchBar";
import "../styles/Styles.css";

import useUser from "../hooks/useUser";
import { useNavigate, useParams } from "react-router-dom";

const ModifyService = ({ method }) => {
  const { user, isLoading } = useUser();
  const [serviceTitle, setServiceTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState("");
  const [serviceImage, setServiceImage] = useState(null);
  const [serviceStatus, setServiceStatus] = useState(1);
  const [error, setError] = useState("");
  const { id } = useParams();

  const [previewImage, setPreviewImage] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const config = {
    readonly: false,
    height: 400,
    placeholder: "Write your blog here...",
    toolbarButtonSize: "large",
    theme: "dark",
    buttons:
      "bold,italic,underline,strikethrough,fontsize,font,brush,paragraph,|,ul,ol,|,link,hr,table,|,align,undo,redo,preview,fullscreen,lineHeight,image",
    showXPathInStatusbar: false,
  };

  useEffect(() => {
    if (method === "edit" && id) {
      fetchServiceDetails();
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/services/category/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchServiceDetails = async () => {
    try {
      const res = await api.get(`/api/services/${id}/`);
      const data = res.data;
      setServiceTitle(data.name);
      setContent(data.content);
      setSelectedCategory(data.service_category_id);
      setPreviewImage(
        data.image ? `${import.meta.env.VITE_API_URL}${data.image}` : ""
      );
      setServiceStatus(data.status);
    } catch (err) {
      console.error("Failed to fetch event details:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setServiceImage(file); // Store the file in state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", serviceTitle); // Add other event details
    formData.append("service_category_id", selectedCategory); // Add other event details
    formData.append("content", content);
    formData.append("status", serviceStatus);
    if (serviceImage) {
      formData.append("image", serviceImage); // Append image
    }

    try {
      if (method === "edit") {
        await api.patch(`/api/services/service/${id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Service Updated Successfully!");
      } else {
        await api.post(`/api/services/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Service Added Successfully!");
      }
      navigate("/services");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit service. Try again.");
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
                      onClick={() => navigate("/blogs")}
                      style={{ cursor: "pointer" }}
                    >
                      Services
                    </p>
                  </li>
                  <li
                    className="breadcrumb-item active text-light"
                    aria-current="page"
                  >
                    {method === "edit" ? "Edit " : "Add "}
                    Service
                  </li>
                </ol>
              </nav>
              <h1 className="fs-4 mb-0">
                {method === "edit" ? "Edit " : "Add "}
                Service
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
                  <div className="col-12 mb-4">
                    <label className="form-label" htmlFor="title">
                      Title
                    </label>
                    <input
                      className="form-control"
                      id="title"
                      type="text"
                      value={serviceTitle}
                      onChange={(e) => setServiceTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="name">
                      Select Category
                    </label>
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>{" "}
                  </div>
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="status">
                      Status
                    </label>
                    <div className="mb-4">
                      <select
                        id="status"
                        className="form-select"
                        value={serviceStatus}
                        onChange={(e) => setServiceStatus(e.target.value)}
                        required
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="title">
                      Upload Image
                    </label>
                    <div className="image-uploader">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input"
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="preview-image mt-2 mb-4"
                        height={200}
                      />
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <JoditEditor
                    config={config}
                    value={content}
                    onBlur={(newContent) => setContent(newContent)}
                  />
                </div>
                <button type="submit" className="btn btn-warning w-100">
                  Save Service
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyService;
