import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import { useLocation } from "react-router-dom";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import SearchBar from "../../layout/SearchBar";
import "../../styles/Styles.css";

import useUser from "../../hooks/useUser";
import { useNavigate, useParams } from "react-router-dom";

const ModifyAboutUs = ({ method }) => {
  const blog = location.state?.blog;
  const { user, isLoading } = useUser();
  const [blogTitle, setBlogTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [blogStatus, setBlogStatus] = useState(0);
  const [error, setError] = useState("");
  const { id } = useParams();

  const [previewImage, setPreviewImage] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const config = {
    readonly: false,
    height: 400,
    placeholder: "Write about us here...",
    toolbarButtonSize: "large",
    theme: "dark",

    showXPathInStatusbar: false,
  };

  useEffect(() => {
    fetchBlogDetails();
  }, []);

  const fetchBlogDetails = async () => {
    try {
      const res = await api.get(`/api/companydetails/aboutus/1/`);
      const data = res.data[0];
      setContent(data.content);
    } catch (err) {
      console.error("Failed to fetch event details:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("content", content);

    try {
      const formDataWithId = new FormData();
      formDataWithId.append("id", 1); // Ensure ID is included
      for (const [key, value] of formData.entries()) {
        formDataWithId.append(key, value);
      }
      await api.patch(`/api/companydetails/aboutus/1/`, formDataWithId, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("About us Added Successfully!");
      navigate("/companyinfo/aboutus");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit blog. Try again.");
    } finally {
      setLoading(false);
    }

    console.log(content);
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
                      onClick={() => navigate("/companyinfo/aboutus")}
                      style={{ cursor: "pointer" }}
                    >
                      About us
                    </p>
                  </li>
                  <li
                    className="breadcrumb-item active text-light"
                    aria-current="page"
                  >
                    Edit About
                  </li>
                </ol>
              </nav>
              <h1 className="fs-4 mb-0">Edit About</h1>
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
                  <JoditEditor
                    config={config}
                    value={content}
                    onBlur={(newContent) => setContent(newContent)}
                  />
                </div>
                <button type="submit" className="btn btn-warning w-100">
                  Save Aboutus
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyAboutUs;
