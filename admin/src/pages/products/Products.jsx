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

function ViewProducts() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [allProducts, setAllProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [homePageToggle, setHomePageToggle] = useState();
  const [selectedBrand, setSelectedBrand] = useState("all");
  const itemsPerPage = 5;

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    filterProducts(value, selectedBrand);
  };

  const handleBrandFilter = (event) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    filterProducts(searchTerm, brand);
  };

  const filterProducts = (searchValue, brand) => {
    if (allProducts) {
      let filtered = allProducts.filter((item) =>
        `${item.name} ${item.status} ${item.created_by} ${item.sku}`
          .toLowerCase()
          .includes(searchValue)
      );

      if (brand !== "all") {
        filtered = filtered.filter((item) => item.company === brand);
      }

      setFilteredData(filtered);
    }
  };

  const getUniqueBrands = () => {
    const brands = new Set(allProducts.map((product) => product.company));
    return Array.from(brands).filter(Boolean).sort();
  };

  const date_format = {
    year: "numeric",
    month: "long", // "short" for abbreviated months
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingUser(false);
      return;
    }
    try {
      // Fetch user details independently
      const servicesRes = api.get("/api/products/");

      // Wait for both requests to complete independently
      const [services] = await Promise.all([servicesRes]);

      // Sort products by created_at and id in ascending order
      const sortedProducts = services.data.sort((a, b) => {
        // First sort by creation date
        const dateComparison = new Date(a.created_at) - new Date(b.created_at);
        if (dateComparison !== 0) return dateComparison;

        // If dates are equal, sort by ID
        return a.id - b.id;
      });

      // Update state
      setAllProducts(sortedProducts);
      setFilteredData(sortedProducts);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");

        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          return fetchProducts(); // Retry after refreshing
        }
      } else {
        console.error("Failed to fetch user data:", error);
      }
    } finally {
      setIsLoadingProducts(false);
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

    fetchProducts();
    const interval = setInterval(() => {
      fetchProducts();
    }, 60000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [message]);

  const handleDeactivate = async (product_id) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingUser(false);
      return;
    }
    try {
      const response = await api.patch(
        `api/products/product/${product_id}/deactivate/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add JWT Token
          },
        }
      );
      setMessage(response.data.message);
      //   alert("User activated successfully!");
      fetchProducts();
    } catch (error) {
      setError(error.response.data.message || "Error deactivating product");
    }
  };

  const handleActivate = async (product_id) => {
    try {
      const response = await api.patch(
        `api/products/product/${product_id}/activate/`
      );
      setMessage(response.data.message);
      fetchProducts();
    } catch (error) {
      setError(error.response.data.message || "Error activating product");
      console.log(error);
    }
  };

  const handleToggleStatus = async (id, newStatus, name, updatedStatus) => {
    updatedStatus = 0;
    if (newStatus) {
      updatedStatus = 1;
    }
    const formData = new FormData();
    formData.append("show_on_homepage", newStatus);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
    try {
      await api.patch(`/api/products/product/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchProducts();
      if (newStatus) {
        setMessage(name + " is live on featured section!");
      } else {
        setMessage(name + " will no longer be displayed on featured section!");
      }
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleExport = () => {
    const formattedData = filteredData.map((item) => ({
      id: item.id,
      image: item.image,
      name: item.name,
      description: item.description,
      price: item.price,
      status: item.status,
      category: item.category.name,
      created_by: item.created_by
        ? `${item.created_by.first_name} ${item.created_by.last_name} [${item.created_by.email}]`
        : "",
      breed: item.breeds ? `${item.breeds.name}` : "",
      age: item.age,
      show_on_homepage: item.show_on_homepage,
    }));
    exportToCSV(
      formattedData,
      [
        "ID",
        "Image",
        "Title",
        "Description",
        "Price",
        "Age",
        "Breed",
        "Status",
        "Category",
        "Featured",
        "Created By",
      ], // Headers
      [
        "id",
        "image",
        "name",
        "description",
        "price",
        "age",
        "breed",
        "status",
        "category",
        "show_on_homepage",
        "created_by",
      ], // Fields
      "products.csv"
    );
  };

  const handleRowClick = (product_id) => {
    navigate(`/products/${encodeURIComponent(product_id)}`);
  };

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
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
          <div>
            <h1 className="fw-bold text-primary mb-2">Products</h1>
            <p className="text-muted">Manage and monitor your products</p>
          </div>
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/products/add")}
            >
              <i className="fas fa-plus me-2"></i>Add Product
            </button>
            <button className="btn btn-outline-primary" onClick={handleExport}>
              <i className="fas fa-download me-2"></i>Export
            </button>
          </div>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
              <div className="search-box position-relative mb-3 mb-md-0">
                <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ minWidth: "300px" }}
                />
              </div>
              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  value={selectedBrand}
                  onChange={handleBrandFilter}
                  style={{ minWidth: "150px" }}
                >
                  <option value="all">All Brands</option>
                  {getUniqueBrands().map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/products/category")}
                >
                  <i className="fas fa-tags me-2"></i>Categories
                </button>
              </div>
            </div>

            {isLoadingProducts ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Image</th>
                      <th scope="col">Name</th>
                      <th scope="col">SKU</th>
                      <th scope="col">Category</th>
                      <th scope="col">Price</th>
                      <th scope="col">Status</th>
                      <th scope="col">Featured</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((product) => (
                      <tr
                        key={product.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRowClick(product.name)}
                      >
                        <td>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="rounded"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="fw-medium">{product.name}</span>
                            <small className="text-muted">
                              {product.description?.substring(0, 50)}...
                            </small>
                          </div>
                        </td>
                        <td>
                          <span className="text-muted">
                            {product.sku || "N/A"}
                          </span>
                        </td>
                        <td>{product.category?.name}</td>
                        <td>₹{product.price}</td>
                        <td>
                          <span
                            className={`badge ${
                              product.status ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {product.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={product.show_on_homepage}
                              onChange={(e) =>
                                handleToggleStatus(
                                  product.id,
                                  e.target.checked,
                                  product.name
                                )
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/products/edit/${encodeURIComponent(
                                    product.name
                                  )}`
                                );
                              }}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className={`btn btn-sm ${
                                product.status
                                  ? "btn-outline-danger"
                                  : "btn-outline-success"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                product.status
                                  ? handleDeactivate(product.id)
                                  : handleActivate(product.id);
                              }}
                            >
                              <i
                                className={`fas fa-${
                                  product.status ? "ban" : "check"
                                }`}
                              ></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredData.length === 0 && !isLoadingProducts && (
              <div className="text-center py-5">
                <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                <p className="text-muted mb-0">No products found</p>
              </div>
            )}

            {filteredData.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted">
                  Showing {currentPage * itemsPerPage + 1} to{" "}
                  {Math.min(
                    (currentPage + 1) * itemsPerPage,
                    filteredData.length
                  )}{" "}
                  of {filteredData.length} entries
                </div>
                <Pagination
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  currentPage={currentPage}
                />
              </div>
            )}
          </div>
        </div>

        {message && (
          <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div
              id="liveToast"
              className="toast"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <div className="toast-header">
                <i className="fas fa-check-circle text-success me-2"></i>
                <strong className="me-auto">Success</strong>
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
        )}
      </div>
    </div>
  );
}

export default ViewProducts;
