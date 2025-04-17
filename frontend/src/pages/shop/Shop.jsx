import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Shop.css";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";
import LoadingScreen from "../../components/LoadingScreen";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { ACCESS_TOKEN } from "../../constants";

function Shop() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [selectedAges, setSelectedAges] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [cart, setCart] = useState([]);

  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get("/api/products/");
        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data.filter((product) => product.status === 1));
        }
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const refreshed = await handleTokenRefresh();
            if (refreshed) {
              return fetchProducts();
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
          console.error("Failed to fetch products:", error);
          setLoading(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    ...new Set(products.map((product) => product.category.name)),
  ];
  const companies = [...new Set(products.map((product) => product.company))];
  const breeds = [...new Set(products.map((product) => product.breeds.name))];
  const ages = [...new Set(products.map((product) => product.age))];

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case "category":
        setSelectedCategories((prev) =>
          prev.includes(value)
            ? prev.filter((cat) => cat !== value)
            : [...prev, value]
        );
        break;
      case "company":
        setSelectedCompanies((prev) =>
          prev.includes(value)
            ? prev.filter((comp) => comp !== value)
            : [...prev, value]
        );
        break;
      case "breed":
        setSelectedBreeds((prev) =>
          prev.includes(value)
            ? prev.filter((breed) => breed !== value)
            : [...prev, value]
        );
        break;
      case "age":
        setSelectedAges((prev) =>
          prev.includes(value)
            ? prev.filter((age) => age !== value)
            : [...prev, value]
        );
        break;
      default:
        break;
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category.name);
    const matchesCompany =
      selectedCompanies.length === 0 ||
      selectedCompanies.includes(product.company);
    const matchesBreed =
      selectedBreeds.length === 0 ||
      selectedBreeds.includes(product.breeds.name);
    const matchesAge =
      selectedAges.length === 0 || selectedAges.includes(product.age);
    const matchesPrice =
      product.price >= priceRange.min && product.price <= priceRange.max;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return (
      matchesCategory &&
      matchesCompany &&
      matchesBreed &&
      matchesAge &&
      matchesPrice &&
      matchesSearch
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "priceAsc":
        return a.price - b.price;
      case "priceDesc":
        return b.price - a.price;
      case "nameAsc":
        return a.name.localeCompare(b.name);
      case "nameDesc":
        return b.name.localeCompare(a.name);
      default:
        return b.id - a.id;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategories,
    selectedCompanies,
    selectedBreeds,
    selectedAges,
    priceRange,
    searchQuery,
    sortBy,
  ]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by the filter function
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedCompanies([]);
    setSelectedBreeds([]);
    setSelectedAges([]);
    setPriceRange({ min: 0, max: 10000 });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleAddToCart = async (e, product_id) => {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      localStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/login");
    } else {
      setLoading(true);
      setError("");
      const formData = new FormData();
      formData.append("type", 1);
      formData.append("item", parseInt(product_id));

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

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setFadeOut(true); // start fading
        setTimeout(() => setShowLoader(false), 500); // remove loader
      }, 1000); // short delay after fetch
    }
  }, [loading]);

  if (showLoader) return <LoadingScreen fadeOut={fadeOut} />;

  return (
    <div className="min-vh-100">
      <Navbar />
      {/* Hero Section */}
      <div className="yellow-bg text-dark py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h1 className="display-4 fw-bold mb-3">Our Products</h1>
              <p className="lead mb-4">
                Find everything your furry friend needs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row">
          {/* Filter Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-filter me-2"></i>Filters
                </h5>
                <button
                  className="btn btn-sm btn-outline-dark"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              </div>
              <div className="card-body">
                {/* Sort Options */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Sort By</label>
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">Newest First</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="nameAsc">Name (A-Z)</option>
                    <option value="nameDesc">Name (Z-A)</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Price Range</h6>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <input
                      type="number"
                      className="form-control"
                      name="min"
                      value={priceRange.min}
                      onChange={handlePriceChange}
                      min="0"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      className="form-control"
                      name="max"
                      value={priceRange.max}
                      onChange={handlePriceChange}
                      min="0"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Categories</h6>
                  <div className="overflow-auto" style={{ maxHeight: "200px" }}>
                    {categories.map((category) => (
                      <div className="form-check" key={category}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onChange={() =>
                            handleFilterChange("category", category)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`category-${category}`}
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Company</h6>
                  <div className="overflow-auto" style={{ maxHeight: "200px" }}>
                    {companies.map((company) => (
                      <div className="form-check" key={company}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`company-${company}`}
                          checked={selectedCompanies.includes(company)}
                          onChange={() =>
                            handleFilterChange("company", company)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`company-${company}`}
                        >
                          {company}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Breed Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Breed</h6>
                  <div className="overflow-auto" style={{ maxHeight: "200px" }}>
                    {breeds.map((breed) => (
                      <div className="form-check" key={breed}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`breed-${breed}`}
                          checked={selectedBreeds.includes(breed)}
                          onChange={() => handleFilterChange("breed", breed)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`breed-${breed}`}
                        >
                          {breed}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Age Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Age</h6>
                  <div className="overflow-auto" style={{ maxHeight: "200px" }}>
                    {ages.map((age) => (
                      <div className="form-check" key={age}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`age-${age}`}
                          checked={selectedAges.includes(age)}
                          onChange={() => handleFilterChange("age", age)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`age-${age}`}
                        >
                          {age}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-lg-9">
            {/* Results Summary */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">
                <span className="text-primary">{filteredProducts.length}</span>{" "}
                products found
              </h4>
            </div>

            {/* Products Grid */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {currentProducts.map((product) => (
                <div className="col" key={product.id}>
                  <div
                    className="card h-100 shadow-sm hover-shadow"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(
                        `/shop/product/${encodeURIComponent(product.name)}`
                      )
                    }
                  >
                    <div className="position-relative">
                      <img
                        src={product.image}
                        className="card-img-top product-image"
                        alt={product.name}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x300?text=No+Image";
                        }}
                        style={{ height: "450px" }}
                      />
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0 fw-bold">
                          {product.name}
                        </h5>
                      </div>
                      <p className="card-text text-muted">
                        {product.category.name}
                      </p>
                      <p className="card-text mb-3 text-truncate">
                        {product.description}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="badge bg-light text-dark">
                          {product.age}
                        </span>
                        <span className="fw-bold">₹{product.price}</span>
                      </div>
                    </div>
                    <div className="card-footer bg-white border-top-0">
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-dark"
                          onClick={() =>
                            navigate(
                              `/shop/product/${encodeURIComponent(
                                product.name
                              )}`
                            )
                          }
                        >
                          View Details
                        </button>
                        <button
                          className="btn btn-outline-dark"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(e, product.id);
                          }}
                        >
                          <i className="bi bi-cart-plus me-2"></i>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <li
                        key={number}
                        className={`page-item ${
                          currentPage === number ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(number)}
                        >
                          {number}
                        </button>
                      </li>
                    )
                  )}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="bi bi-search" style={{ fontSize: "3rem" }}></i>
                </div>
                <h3>No products found</h3>
                <p className="text-muted">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Shop;
