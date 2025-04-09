import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Blogs.css";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";
import LoadingScreen from "../../components/LoadingScreen";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

function Blogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/api/blogs/");
        if (response.data) {
          setBlogs(response.data.filter((blog) => blog.status === 1));
        }
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const refreshed = await handleTokenRefresh();
            if (refreshed) {
              return fetchBlogs();
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
          console.error("Failed to fetch blogs:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]/g, "-");
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="blogs-page">
      <Navbar />

      {/* Hero Section */}
      <div className="blogs-hero">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h1 className="display-4 fw-bold mb-4">Our Blog</h1>
              <p className="lead mb-4">
                Discover the latest insights, tips, and stories about pet care
              </p>
              <div className="search-container">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="container py-5">
        <div className="row g-4">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="col-md-6 col-lg-4">
              <div className="blog-card">
                <div className="blog-image-container">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="blog-image"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                </div>
                <div className="blog-content">
                  <h2 className="blog-title">{blog.title}</h2>
                  <div className="blog-meta">
                    <div className="author">
                      <i className="fa-solid fa-user"></i>
                      <span>
                        {blog.created_by.first_name} {blog.created_by.last_name}
                      </span>
                    </div>
                    <div className="date">
                      <i className="fa-solid fa-calendar-days"></i>
                      <span>{formatDate(blog.created_at)}</span>
                    </div>
                  </div>
                  <div
                    className="blog-excerpt"
                    dangerouslySetInnerHTML={{
                      __html: blog.content.substring(0, 150) + "...",
                    }}
                  />
                  <button
                    className="read-more-btn"
                    onClick={() => navigate(`/blogs/${blog.id}`)}
                  >
                    Read More
                    <i className="fa-solid fa-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-5">
            <div className="no-results">
              <i
                className="fa-solid fa-search"
                style={{ fontSize: "3rem" }}
              ></i>
              <h3>No blogs found</h3>
              <p className="text-muted">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Blogs;
