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

const ModifyProduct = ({ method }) => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productType, setProductType] = useState("");
  const [productDuration, setProductDuration] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStatus, setProductStatus] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [productImage, setProductImage] = useState(null);
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
      fetchProductDetails();
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/products/category/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProductDetails = async () => {
    try {
      const res = await api.get(`/api/products/${id}/`);
      const data = res.data;
      setProductName(data.name);
      setProductStatus(data.status);
      setProductDescription(data.description);
      setSelectedCategory(data.service_category_id);
      setProductPrice(data.price);
      setProductType(data.link);
      setSelectedCategory(data.product_category_id);
      setProductDuration(data.duration);
      setProductType(data.type);
      setPreviewImage(
        data.image ? `${import.meta.env.VITE_API_URL}${data.image}` : ""
      );
    } catch (err) {
      console.error("Failed to fetch product details:", err);
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
    formData.append("name", productName);
    formData.append("description", productDescription);
    formData.append("type", productType);
    formData.append("duration", productDuration);
    formData.append("price", productPrice);
    formData.append("status", productStatus);
    formData.append("product_category_id", selectedCategory);
    if (productImage) {
      formData.append("image", productImage);
    }
    try {
      if (method === "edit") {
        await api.patch(`/api/products/product/${id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product Updated Successfully!");
      } else {
        await api.post(`/api/products/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product Added Successfully!");
      }
      navigate("/products");
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
                      Products
                    </p>
                  </li>
                  <li
                    className="breadcrumb-item active text-light"
                    aria-current="page"
                  >
                    {method === "edit" ? "Edit " : "Add "}
                    product
                  </li>
                </ol>
              </nav>
              <h1 className="fs-4 mb-0">
                {method === "edit" ? "Edit " : "Add "}product
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
                      Name
                    </label>
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
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
                    </select>
                  </div>
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="status">
                      Status
                    </label>
                    <div className="mb-4">
                      <select
                        id="status"
                        className="form-select"
                        value={productStatus}
                        onChange={(e) => setProductStatus(e.target.value)}
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
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="row">
                  <div
                    className={
                      productType === "Digital" ? "col-4 mb-4" : "col-6 mb-4"
                    }
                  >
                    <label className="form-label" htmlFor="price">
                      Price
                    </label>
                    <input
                      className="form-control"
                      id="price"
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      required
                    />
                  </div>

                  <div
                    className={
                      productType === "Digital" ? "col-4 mb-4" : "col-6 mb-4"
                    }
                  >
                    <label className="form-label" htmlFor="type">
                      Type
                    </label>
                    <div className="mb-6">
                      <select
                        id="type"
                        className="form-select"
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                        required
                      >
                        <option value={"Physical"}>Physical</option>
                        <option value={"Digital"}>Digital</option>
                      </select>
                    </div>
                  </div>
                  {productType === "Digital" && (
                    <div className="col-4 mb-4">
                      <label className="form-label" htmlFor="duration">
                        Duration
                      </label>
                      <div className="mb-6">
                        <select
                          id="duration"
                          className="form-select"
                          value={productDuration}
                          onChange={(e) => setProductDuration(e.target.value)}
                          required
                        >
                          <option value="">-- Select Duration --</option>
                          <option value={"Month"}>Month</option>
                          <option value={"Year"}>Year</option>
                          <option value={"Lifetime"}>Lifetime</option>
                        </select>
                      </div>
                    </div>
                  )}
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
                  Save Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyProduct;
