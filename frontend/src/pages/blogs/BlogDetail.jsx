import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/BlogDetail.css";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";
import LoadingScreen from "../../components/LoadingScreen";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/api/blogs/${id}/`);
        if (response.data) {
          setBlog(response.data);
          if (response.data.category) {
            const relatedResponse = await api.get(
              `/api/blogs/?category=${response.data.category.id}`
            );
            setRelatedBlogs(
              relatedResponse.data
                .filter((b) => b.id !== response.data.id)
                .slice(0, 3)
            );
          }
        }
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const refreshed = await handleTokenRefresh();
            if (refreshed) {
              return fetchBlog();
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
          console.error("Failed to fetch blog:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog.title;
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(title)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          title + " " + url
        )}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  if (loading) return <LoadingScreen />;
  if (!blog) return <div>Blog not found</div>;

  return (
    <div className="blog-detail-page">
      <Navbar />

      <div className="container">
        <div className="blog-header">
          <div className="blog-title">
            <h1>{blog.title}</h1>
            <div className="blog-meta">
              <span className="meta-item">
                <i className="fas fa-user"></i>
                {blog.created_by.first_name} {blog.created_by.last_name}
              </span>
              <span className="meta-item">
                <i className="fas fa-calendar"></i>
                {formatDate(blog.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="blog-image">
          <img
            src={blog.image}
            alt={blog.title}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/1200x600?text=No+Image";
            }}
          />
        </div>

        <div className="blog-content">
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        <div className="blog-tags">
          {blog.tags &&
            blog.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
        </div>

        <div className="share-section">
          <h4>Share this article</h4>
          <div className="share-buttons">
            <button
              className="share-btn facebook"
              onClick={() => handleShare("facebook")}
            >
              <i className="fab fa-facebook-f"></i>
            </button>
            <button
              className="share-btn twitter"
              onClick={() => handleShare("twitter")}
            >
              <i className="fab fa-twitter"></i>
            </button>
            <button
              className="share-btn linkedin"
              onClick={() => handleShare("linkedin")}
            >
              <i className="fab fa-linkedin-in"></i>
            </button>
            <button
              className="share-btn whatsapp"
              onClick={() => handleShare("whatsapp")}
            >
              <i className="fab fa-whatsapp"></i>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BlogDetail;
