import React, { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";

import { useParams, useNavigate } from "react-router-dom";
import api from "../../api"; // Your Axios API instance
const BASE_URL = import.meta.env.VITE_API_URL;
import Sidebar from "../../layout/Sidebar";
import "../../styles/styles.css";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";

const BlogDetails = () => {
  const { user, isLoading } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const Spinner = () => {
    return (
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  };

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await api.get(`/api/blogs/${id}/`);
        setBlog(response.data);
      } catch (err) {
        if (error.response?.status === 401) {
          console.warn("Access token expired, refreshing...");

          const refreshed = await handleTokenRefresh();
          if (refreshed) {
            return fetchBlogDetails(); // Retry after refreshing
          }
        } else {
          console.error("Failed to fetch user data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

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
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner />
              <h4 className="text-warning ms-3">Loading Blog...</h4>
            </div>
          ) : blog ? (
            <main class="container">
              <div class="row g-5">
                <div class="col-md-12">
                  <article className="blog-post p-4 border rounded shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h2 className="display-5 fw-bold mb-1">{blog.title}</h2>
                        <p className="blog-post-meta text-muted mb-0">
                          {new Date(blog.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )}{" "}
                          by{" "}
                          <a
                            href={`/view-user/${blog?.created_by?.id}`}
                            className="fw-bold text-primary text-decoration-none"
                          >
                            {blog.created_by?.first_name}
                          </a>
                        </p>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        {blog.status ? (
                          <span
                            className="badge bg-success pulse-green"
                            style={{ fontSize: "14px" }}
                          >
                            Active
                          </span>
                        ) : (
                          <span
                            className="badge bg-danger pulse-red"
                            style={{ fontSize: "14px" }}
                          >
                            Inactive
                          </span>
                        )}

                        <button
                          className="btn btn-warning btn-sm"
                          style={{
                            whiteSpace: "nowrap",
                            width: "100px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          onClick={() =>
                            navigate(`/blogs/edit/${blog.id}`, {
                              state: { method: "edit", blog: blog },
                            })
                          }
                        >
                          ✏️ Edit Blog
                        </button>
                      </div>
                    </div>

                    {blog.image && (
                      <img
                        src={blog.image}
                        alt="Blog Image"
                        className="img-fluid mb-3 rounded shadow-sm"
                        style={{
                          maxHeight: "600px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <div
                      className="blog-content"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                      style={{ lineHeight: "1.3", textAlign: "justify" }}
                    ></div>
                  </article>
                </div>
              </div>
            </main>
          ) : (
            <h4 className="text-center text-danger fw-bold">
              ⚠️ No Blog Found
            </h4>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
