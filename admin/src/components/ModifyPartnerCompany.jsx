import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useLocation } from "react-router-dom";
import api from "../api";
import Sidebar from "../layout/Sidebar";
import "../styles/Styles.css";
import LoadingIndicator from "./LoadingIndicator";

import useUser from "../hooks/useUser";
import { useNavigate, useParams } from "react-router-dom";
import uploadToImgBB from "../utils/image-upload";

const ModifyPartnerCompany = ({ method }) => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [companyName, setCompanyName] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (method === "edit" && id) {
      fetchCompanyDetails();
    }
  }, []);

  const fetchCompanyDetails = async () => {
    try {
      const res = await api.get(`/api/homepage/getpartnercompany/${id}/`);
      const data = res.data;
      setCompanyName(data.name);
      setPreviewImage(data.image ? data.image : "");
    } catch (err) {
      console.error("Failed to fetch company details:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setImage(file); // Store the file in state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let imageUrl = null;

    if (image) {
      imageUrl = await uploadToImgBB(image);
      if (!imageUrl) {
        setError("Image upload failed");
        setLoading(false);
        return;
      }
    } else if (method === "add") {
      setError("No image selected");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", companyName);
    formData.append("status", 1);
    if (imageUrl) {
      formData.append("image", imageUrl);
    }
    try {
      if (method === "edit") {
        await api.patch(`/api/homepage/partnercompany/${id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Company Updated Successfully!");
      } else {
        await api.post(`/api/homepage/partnercompany/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Company Added Successfully!");
      }
      navigate("/homepage/partnercompany");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [error]);

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
                      onClick={() => navigate("/homepage/partnercompany")}
                      style={{ cursor: "pointer" }}
                    >
                      Companies
                    </p>
                  </li>
                  <li
                    className="breadcrumb-item active text-light"
                    aria-current="page"
                  >
                    {method === "edit" ? "Edit " : "Add "}
                    Company
                  </li>
                </ol>
              </nav>
              <h1 className="fs-4 mb-0">
                {method === "edit" ? "Edit " : "Add "}Company
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
                    <label className="form-label" htmlFor="name">
                      Company Name
                    </label>
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      value={companyName}
                      onChange={(e) => {
                        if (e.target.value.length <= 100) {
                          setCompanyName(e.target.value);
                        }
                      }}
                      maxLength={100} // Optional, for additional safety
                      required
                    />
                    <small
                      className={
                        companyName.length === 100 ? "text-danger" : ""
                      }
                    >
                      {companyName.length}/100{" "}
                      {companyName.length === 100 && "Character limit reached!"}
                    </small>
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
                  Save Company
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyPartnerCompany;
