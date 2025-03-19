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

const ModifyHero = ({ method }) => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [headline, setHeadline] = useState("");
  const [subText, setSubText] = useState("");
  const [cta, setCta] = useState("");
  const [image, setProductImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (method === "edit" && id) {
      fetchHeroDetails();
    }
  }, []);

  const fetchHeroDetails = async () => {
    try {
      const res = await api.get(`/api/products/${id}/`);
      const data = res.data;
      setHeadline(data.name);
      setSubText(data.description);
      setPreviewImage(data.image ? `${BASE_URL}${data.image}` : "");
    } catch (err) {
      console.error("Failed to fetch hero details:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setProductImage(file); // Store the file in state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("headline", headline);
    formData.append("subtext", subText);
    formData.append("cta", cta);
    formData.append("status", 1);
    if (image) {
      formData.append("image", image);
    }
    try {
      if (method === "edit") {
        await api.patch(`/api/products/product/${id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product Updated Successfully!");
      } else {
        await api.post(`/api/homepage/hero/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Hero Added Successfully!");
      }
      navigate("/homepage/herosection");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit product. Try again.");
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
        <div className="container mt-4">
          <div className="row align-items-center mb-7">
            <div className="col">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2">
                  <li className="breadcrumb-item">
                    <p
                      className="text-body-secondary"
                      onClick={() => navigate("/products")}
                      style={{ cursor: "pointer" }}
                    >
                      Heros
                    </p>
                  </li>
                  <li
                    className="breadcrumb-item active text-light"
                    aria-current="page"
                  >
                    {method === "edit" ? "Edit " : "Add "}
                    Hero
                  </li>
                </ol>
              </nav>
              <h1 className="fs-4 mb-0">
                {method === "edit" ? "Edit " : "Add "}Hero
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
                      Headline
                    </label>
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      value={headline}
                      onChange={(e) => {
                        if (e.target.value.length <= 100) {
                          setHeadline(e.target.value);
                        }
                      }}
                      maxLength={100} // Optional, for additional safety
                      required
                    />
                    <small
                      className={headline.length === 100 ? "text-danger" : ""}
                    >
                      {headline.length}/100{" "}
                      {headline.length === 100 && "Character limit reached!"}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 mb-4">
                    <label className="form-label" htmlFor="name">
                      Subtext
                    </label>
                    <textarea
                      className="form-control"
                      id="name"
                      type="text"
                      value={subText}
                      onChange={(e) => {
                        if (e.target.value.length <= 200) {
                          setSubText(e.target.value);
                        }
                      }}
                      required
                    />
                    <small
                      className={subText.length === 200 ? "text-danger" : ""}
                    >
                      {subText.length}/200{" "}
                      {subText.length === 200 && "Character limit reached!"}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 mb-4">
                    <label className="form-label" htmlFor="name">
                      CTA
                    </label>
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      value={cta}
                      onChange={(e) => {
                        if (e.target.value.length <= 50) {
                          setCta(e.target.value);
                        }
                      }}
                      required
                    />
                    <small className={cta.length === 50 ? "text-danger" : ""}>
                      {cta.length}/50{" "}
                      {cta.length === 50 && "Character limit reached!"}
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
                  Save Hero
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyHero;
