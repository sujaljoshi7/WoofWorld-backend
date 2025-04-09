import React, { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";

import { useParams, useNavigate } from "react-router-dom";
import api from "../../api"; // Your Axios API instance
const BASE_URL = import.meta.env.VITE_API_URL;
import Sidebar from "../../layout/Sidebar";
import "../../styles/styles.css";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";

const ServiceDetails = () => {
  const { user, isLoading } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
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
    const fetchServiceDetails = async () => {
      try {
        const response = await api.get(`/api/services/${id}/`);
        setService(response.data);
      } catch (err) {
        if (error.response?.status === 401) {
          console.warn("Access token expired, refreshing...");

          const refreshed = await handleTokenRefresh();
          if (refreshed) {
            return fetchServiceDetails(); // Retry after refreshing
          }
        } else {
          console.error("Failed to fetch user data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
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
          ) : service ? (
            <main class="container">
              <div class="row g-5">
                <div class="col-md-12">
                  <article className="blog-post p-4 border rounded shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h2 className="display-5 fw-bold mb-1">
                          {service.name}
                        </h2>
                        <p className="blog-post-meta text-muted mb-0">
                          {new Date(service.created_at).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )}{" "}
                          by{" "}
                          <a
                            href={`/view-user/${service?.created_by?.id}`}
                            className="fw-bold text-primary text-decoration-none"
                          >
                            {service.created_by?.first_name}
                          </a>
                        </p>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        {service.status ? (
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
                          style={{ whiteSpace: "nowrap" }}
                          onClick={() =>
                            navigate(`/services/edit/${service.id}`)
                          }
                        >
                          ✏️ Edit Service
                        </button>
                      </div>
                    </div>

                    {service.image && (
                      <img
                        src={service.image}
                        alt="Blog Image"
                        className="img-fluid mb-3 rounded shadow-sm"
                        style={{
                          maxHeight: "400px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <div
                      className="blog-content"
                      dangerouslySetInnerHTML={{ __html: service.content }}
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

export default ServiceDetails;
