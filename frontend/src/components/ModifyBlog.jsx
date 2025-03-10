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

const ModifyBlog = ({ method }) => {
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
    placeholder: "Write your blog here...",
    toolbarButtonSize: "large",
    theme: "dark",
    buttons:
      "bold,italic,underline,strikethrough,fontsize,font,brush,paragraph,|,ul,ol,|,link,hr,table,|,align,undo,redo,preview,fullscreen,lineHeight",
    showXPathInStatusbar: false,
  };

  useEffect(() => {
    if (method === "edit" && id) {
      fetchBlogDetails();
    }
  }, []);

  const fetchBlogDetails = async () => {
    try {
      const res = await api.get(`/api/blogs/${id}/`);
      const data = res.data;
      setBlogTitle(data.title);
      setContent(data.content);
      setPreviewImage(
        data.image ? `${import.meta.env.VITE_API_URL}${data.image}` : ""
      );
      setBlogStatus(data.status);
    } catch (err) {
      console.error("Failed to fetch event details:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setBlogImage(file); // Store the file in state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", blogTitle); // Add other event details
    formData.append("content", content);
    formData.append("status", blogStatus);
    if (blogImage) {
      formData.append("image", blogImage); // Append image
    }

    try {
      if (method === "edit") {
        await api.patch(`/api/blogs/blog/${id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Blog Updated Successfully!");
      } else {
        await api.post(`/api/blogs/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Blog Added Successfully!");
      }
      navigate("/blogs");
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
                      Blogs
                    </p>
                  </li>
                  <li
                    className="breadcrumb-item active text-light"
                    aria-current="page"
                  >
                    {method === "edit" ? "Edit " : "Add "}
                    Blog
                  </li>
                </ol>
              </nav>
              <h1 className="fs-4 mb-0">
                {method === "edit" ? "Edit " : "Add "}
                Blog
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
                    <label className="form-label" htmlFor="title">
                      Title
                    </label>
                    <input
                      className="form-control"
                      id="title"
                      type="text"
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
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
                        value={blogStatus}
                        onChange={(e) => setBlogStatus(e.target.value)}
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
                  Save Blog
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyBlog;
