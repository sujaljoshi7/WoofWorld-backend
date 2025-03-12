import React, { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";

import { useParams, useNavigate } from "react-router-dom";
import api from "../../api"; // Your Axios API instance
const BASE_URL = import.meta.env.VITE_API_URL;
import Sidebar from "../../layout/Sidebar";
import SearchBar from "../../layout/SearchBar";
import "../../styles/styles.css";

const ProductDetails = () => {
  const { user, isLoading } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const date_format = {
    year: "numeric",
    month: "long", // "short" for abbreviated months
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

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
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/api/products/${id}/`);
        setEvent(response.data);
      } catch (err) {
        setError("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
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
        <SearchBar />
        <div className="container mt-4">
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner />
              <h4 className="text-warning ms-3">Loading Product...</h4>
            </div>
          ) : event ? (
            <div className="card bg-dark text-light shadow-lg p-4 rounded">
              {event.image && (
                <img
                  src={`${BASE_URL}${event.image}`}
                  alt="Event"
                  className="img-fluid mb-3 rounded shadow-sm"
                  style={{
                    maxHeight: "400px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              )}

              <div className="card-body">
                <h1 className="fw-bold text-warning d-flex justify-content-between">
                  {event.name}
                  <div>
                    <button
                      className="btn btn-warning btn-sm"
                      title="Edit Webinar"
                      onClick={() => navigate(`/products/edit/${event.id}`)}
                      style={{ transition: "0.3s" }}
                    >
                      ✏️ Edit product
                    </button>
                  </div>
                </h1>

                <p className="fs-5">{event.description}</p>

                <table className="table table-dark table-striped table-hover">
                  <tbody>
                    <tr>
                      <th>Type</th>
                      <td>{event.type}</td>
                    </tr>
                    <tr>
                      <th>Price</th>
                      <td>
                        ₹ {new Intl.NumberFormat("en-IN").format(event.price)}/
                        {event.duration}
                      </td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>
                        {event.status ? (
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
                      </td>
                    </tr>
                    <tr>
                      <th>Created By</th>
                      <td>
                        <span title={event.created_by.email}>
                          {event.created_by.first_name}{" "}
                          {event.created_by.last_name}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>Created At</th>
                      <td>
                        {new Date(event.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <h4 className="text-center text-danger fw-bold">
              ⚠️ No Product Found
            </h4>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
