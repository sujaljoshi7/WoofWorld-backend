import React, { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import "../../styles/styles.css";

const ProductDetails = () => {
  const { user, isLoading } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/api/products/${id}/`);
        setProduct(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

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
        <div className="container-fluid">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : product ? (
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h1 className="fw-bold text-primary mb-2">
                      {product.name}
                    </h1>
                    <p className="text-muted mb-0">Product Details</p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      navigate(`/products/edit/${product.name}`);
                      localStorage.setItem("id", product.id);
                    }}
                  >
                    <i className="fas fa-edit me-2"></i>Edit Product
                  </button>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-4">
                    {product.image && (
                      <div className="card border-0 shadow-sm">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="img-fluid rounded"
                          style={{
                            width: "100%",
                            height: "300px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="col-md-8">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title text-primary mb-4">
                          Product Information
                        </h5>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="table-responsive">
                              <table className="table table-borderless">
                                <tbody>
                                  <tr>
                                    <th
                                      className="text-muted"
                                      style={{ width: "40%" }}
                                    >
                                      SKU
                                    </th>
                                    <td className="fw-medium">
                                      {product.sku || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="text-muted">Price</th>
                                    <td className="fw-medium">
                                      ₹{" "}
                                      {new Intl.NumberFormat("en-IN").format(
                                        product.price
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="text-muted">Age</th>
                                    <td className="fw-medium">
                                      {product.age} years
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="text-muted">Weight</th>
                                    <td className="fw-medium">
                                      {product.weight} Kg
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="table-responsive">
                              <table className="table table-borderless">
                                <tbody>
                                  <tr>
                                    <th
                                      className="text-muted"
                                      style={{ width: "40%" }}
                                    >
                                      Breed
                                    </th>
                                    <td className="fw-medium">
                                      {product.breeds?.name || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="text-muted">Company</th>
                                    <td className="fw-medium">
                                      {product.company || "N/A"}
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="text-muted">Status</th>
                                    <td>
                                      <span
                                        className={`badge ${
                                          product.status
                                            ? "bg-success"
                                            : "bg-danger"
                                        }`}
                                      >
                                        {product.status ? "Active" : "Inactive"}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="text-muted">Created By</th>
                                    <td className="fw-medium">
                                      <span title={product.created_by?.email}>
                                        {product.created_by?.first_name}{" "}
                                        {product.created_by?.last_name}
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h6 className="text-muted mb-2">Description</h6>
                          <p className="mb-0">{product.description}</p>
                        </div>
                        <div className="mt-4">
                          <h6 className="text-muted mb-2">Created At</h6>
                          <p className="mb-0">
                            {new Date(product.created_at).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-exclamation-circle fa-3x text-danger mb-3"></i>
              <h4 className="text-danger fw-bold">No Product Found</h4>
              <p className="text-muted">
                The requested product could not be found.
              </p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => navigate("/products")}
              >
                <i className="fas fa-arrow-left me-2"></i>Back to Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
