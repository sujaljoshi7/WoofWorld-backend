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

const availableComponents = [
  "Home",
  "Events",
  "Past Events",
  "Upcoming Events",
  "Services",
  "WebDevelopment",
];

const ModifyNavbarItems = ({ method }) => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [order, setOrder] = useState("");
  const [parentItem, setParentItem] = useState("");
  const [navItems, setNavItems] = useState("");
  const [image, setProductImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [component, setComponent] = useState(availableComponents[""]);

  useEffect(() => {
    if (method === "edit" && id) {
      fetchNavbarItemDetails();
    }
    fetchNavItems();
  }, []);

  const fetchNavbarItemDetails = async () => {
    try {
      const res = await api.get(`/api/navbar/${id}/`);
      const data = res.data;
      setTitle(data.title);
      setUrl(data.url);
      setOrder(data.order);
      setComponent(data.component);
      setParentItem(data.dropdown_parent_data?.id || "");
    } catch (err) {
      console.error("Failed to fetch hero details:", err);
    }
  };

  const fetchNavItems = async () => {
    try {
      const response = await api.get("/api/navbar/");
      setNavItems(response.data);
    } catch (error) {
      console.error("Error fetching nav items:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("url", url);
    formData.append("order", order);
    formData.append("component", component.replace(/\s+/g, ""));
    formData.append("dropdown_parent", parentItem === "" ? "" : parentItem);
    formData.append("status", 1);
    try {
      if (method === "edit") {
        for (let pair of formData.entries()) {
        }
        await api.patch(`/api/navbar/navbar/${id}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Item Updated Successfully!");
      } else {
        await api.post(`/api/navbar/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Item Added Successfully!");
      }
      navigate("/homepage/navbar");
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
                      onClick={() => navigate("/homepage/navbar")}
                      style={{ cursor: "pointer" }}
                    >
                      Navbar Items
                    </p>
                  </li>
                  <li
                    className="breadcrumb-item active text-light"
                    aria-current="page"
                  >
                    {method === "edit" ? "Edit " : "Add "}
                    Item
                  </li>
                </ol>
              </nav>
              <h1 className="fs-4 mb-0">
                {method === "edit" ? "Edit " : "Add "}Navbar Item
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
                      Title
                    </label>
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      value={title}
                      onChange={(e) => {
                        if (e.target.value.length <= 100) {
                          setTitle(e.target.value);
                        }
                      }}
                      maxLength={100} // Optional, for additional safety
                      required
                    />
                    <small
                      className={title.length === 100 ? "text-danger" : ""}
                    >
                      {title.length}/100{" "}
                      {title.length === 100 && "Character limit reached!"}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="name">
                      Url
                    </label>
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      value={url}
                      onChange={(e) => {
                        if (e.target.value.length <= 200) {
                          setUrl(e.target.value);
                        }
                      }}
                      required
                    />
                    <small className={url.length === 200 ? "text-danger" : ""}>
                      {url.length}/200{" "}
                      {url.length === 200 && "Character limit reached!"}
                    </small>
                  </div>
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="name">
                      Order
                    </label>
                    <input
                      className="form-control"
                      id="name"
                      type="number"
                      value={order}
                      onChange={(e) => {
                        if (e.target.value.length <= 2) {
                          setOrder(e.target.value);
                        }
                      }}
                      required
                    />
                    <small className={order.length === 2 ? "text-danger" : ""}>
                      {order.length}/2{" "}
                      {order.length === 2 && "Character limit reached!"}
                    </small>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="name">
                      Page
                    </label>
                    <select
                      className="form-select"
                      value={component}
                      onChange={(e) => {
                        setComponent(e.target.value);
                      }}
                      required // Disable if breeds is empty
                    >
                      <option value=""> Select Page</option>
                      {availableComponents.map((comp) => (
                        <option key={comp} value={comp}>
                          {comp}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="name">
                      Parent
                    </label>
                    <select
                      className="form-select"
                      value={parentItem}
                      onChange={(e) => {
                        setParentItem(e.target.value);
                      }}
                      disabled={navItems.length === 0} // Disable if breeds is empty
                    >
                      <option value="">-- Select parent --</option>
                      {navItems.length > 0 &&
                        navItems.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.title}
                          </option>
                        ))}
                    </select>
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

export default ModifyNavbarItems;
