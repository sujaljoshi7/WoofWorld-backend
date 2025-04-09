import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/ProductDetail.css";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";
import LoadingScreen from "../../components/LoadingScreen";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { ACCESS_TOKEN } from "../../constants";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(
          `/api/products/${decodeURIComponent(id)}/`
        );
        if (response.data) {
          setProduct(response.data);
          // Fetch related products
          const relatedResponse = await api.get(
            `/api/products/?category=${response.data.category.id}`
          );
          setRelatedProducts(
            relatedResponse.data
              .filter((p) => p.id !== response.data.id)
              .slice(0, 4)
          );
        }
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const refreshed = await handleTokenRefresh();
            if (refreshed) {
              return fetchProduct();
            } else {
              console.error("Token refresh failed.");
              localStorage.clear();
              window.location.reload();
            }
          } catch (refreshError) {
            console.error("Error during token refresh:", refreshError);
            localStorage.clear();
            window.location.reload();
          }
        } else {
          console.error("Failed to fetch product:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async (e) => {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      localStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/login");
    } else {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("type", 1);
      formData.append("item", product.id);

      try {
        await api.post(`/api/cart/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Cart Added Successfully!");

        navigate("/cart");
      } catch (error) {
        if (error.response && error.response.data.image) {
          setError(error.response.data.image[0]); // Display the error message
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="min-vh-100">
      <Navbar />

      {/* Breadcrumb */}
      <div className="container py-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a
                href="#"
                className="text-decoration-none"
                onClick={() => navigate(`/`)}
              >
                Home
              </a>
            </li>
            <li className="breadcrumb-item">
              <a
                href="#"
                className="text-decoration-none"
                onClick={() => navigate(`/shop`)}
              >
                Shop
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      {/* Main Product Section */}
      <div className="container py-5">
        <div className="row">
          {/* Product Image Gallery */}
          <div className="col-md-6 mb-4">
            <div className="card shadow hover-shadow">
              <div className="product-gallery">
                <img
                  src={product.image}
                  className="card-img-top product-detail-image"
                  alt={product.name}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/600x600?text=No+Image";
                  }}
                />
                <div className="product-thumbnails mt-3">
                  {/* Add more thumbnails if available */}
                  <img
                    src={product.image}
                    className="thumbnail"
                    alt="Thumbnail"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <h1 className="card-title mb-3">{product.name}</h1>
                <div className="d-flex align-items-center mb-3">
                  <span className="badge bg-primary me-2">
                    {product.category.name}
                  </span>
                  <span className="badge bg-secondary">{product.age}</span>
                </div>
                <div className="product-price mb-4">
                  <h2 className="text-primary">₹{product.price}</h2>
                  <span className="text-muted">(Inclusive of all taxes)</span>
                </div>

                {/* Quantity Selector */}
                <div className="mb-4">
                  <label className="form-label">Quantity</label>
                  <div className="input-group" style={{ maxWidth: "150px" }}>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control text-center"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2 mb-4">
                  <button
                    className="btn btn-dark btn-lg"
                    onClick={handleAddToCart}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-outline-dark btn-lg"
                    onClick={() => navigate("/shop")}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Shop
                  </button>
                </div>

                {/* Product Highlights */}
                <div className="product-highlights mb-4">
                  <h5 className="mb-3">Product Highlights</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Premium Quality Materials
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Safe for Pets
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Easy to Clean
                    </li>
                  </ul>
                </div>

                <div className="product-meta">
                  <span className="meta-item">
                    <i className="fas fa-tag"></i>
                    {product.category?.name}
                  </span>
                  <span className="meta-item">
                    <i className="fas fa-paw"></i>
                    {product.breeds?.name}
                  </span>
                  {product.weight && (
                    <span className="meta-item">
                      <i className="fas fa-weight-hanging"></i>
                      {product.weight} kg
                    </span>
                  )}
                </div>

                <div className="product-details">
                  <div className="detail-item">
                    <span className="label">Company:</span>
                    <span className="value">{product.company}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Age Group:</span>
                    <span className="value">{product.age}</span>
                  </div>
                </div>

                <div className="product-description">
                  <h3>Description</h3>
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <ul
                  className="nav nav-tabs mb-4"
                  id="productTabs"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${
                        activeTab === "description" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("description")}
                    >
                      Description
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${
                        activeTab === "specifications" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("specifications")}
                    >
                      Specifications
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${
                        activeTab === "reviews" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("reviews")}
                    >
                      Reviews
                    </button>
                  </li>
                </ul>

                <div className="tab-content">
                  {activeTab === "description" && (
                    <div className="tab-pane fade show active">
                      <h4>Product Description</h4>
                      <p>{product.description}</p>
                    </div>
                  )}
                  {activeTab === "specifications" && (
                    <div className="tab-pane fade show active">
                      <h4>Product Specifications</h4>
                      <table className="table">
                        <tbody>
                          <tr>
                            <th>Category</th>
                            <td>{product.category.name}</td>
                          </tr>
                          <tr>
                            <th>Age Group</th>
                            <td>{product.age}</td>
                          </tr>
                          <tr>
                            <th>Material</th>
                            <td>Premium Quality</td>
                          </tr>
                          <tr>
                            <th>Dimensions</th>
                            <td>Standard Size</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  {activeTab === "reviews" && (
                    <div className="tab-pane fade show active">
                      <h4>Customer Reviews</h4>
                      <div className="alert alert-info">
                        No reviews yet. Be the first to review this product!
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <h3 className="mb-4">You May Also Like</h3>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {relatedProducts.map((relatedProduct) => (
                  <div
                    className="col"
                    key={relatedProduct.name}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate(
                        `/shop/product/${encodeURIComponent(
                          relatedProduct.name
                        )}`
                      );
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div className="card h-100 shadow-sm hover-shadow">
                      <img
                        src={relatedProduct.image}
                        className="card-img-top product-image"
                        alt={relatedProduct.name}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x300?text=No+Image";
                        }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{relatedProduct.name}</h5>
                        <p className="card-text text-muted">
                          {relatedProduct.category.name}
                        </p>
                        <p className="card-text fw-bold">
                          ₹{relatedProduct.price}
                        </p>
                      </div>
                      <div className="card-footer bg-white border-top-0">
                        <button
                          className="btn btn-dark w-100"
                          onClick={() =>
                            navigate(
                              `/shop/product/${encodeURIComponent(
                                relatedProduct.name
                              )}`
                            )
                          }
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetail;
