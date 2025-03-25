import React, { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";

import { useParams, useNavigate } from "react-router-dom";
import api from "../../api"; // Your Axios API instance
const BASE_URL = import.meta.env.VITE_API_URL;
import Sidebar from "../../layout/Sidebar";
import SearchBar from "../../layout/SearchBar";
import "../../styles/styles.css";

const AboutUs = () => {
  const { user, isLoading } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [aboutus, setAboutus] = useState(null);
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
    const fetchAboutUs = async () => {
      try {
        const response = await api.get(`/api/companydetails/aboutus/1/`);
        if (response.data.length > 0) {
          setAboutus(response.data[0]); // ✅ Get the first item from the array
        } else {
          setError("No data found in API response.");
        }
      } catch (err) {
        setError("Failed to fetch blog details");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUs();
  }, []);

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
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-warning btn-sm mb-3"
              onClick={() => {
                console.log("Navigating to: /companydetails/aboutus/edit");
                navigate(`/companyinfo/aboutus/edit`);
              }}
            >
              ✏️ Edit About us
            </button>
          </div>
          {loading ? (
            <div className="d-flex justify-content-center">
              <Spinner />
              <h4 className="text-warning ms-3">Loading Blog...</h4>
            </div>
          ) : aboutus ? (
            <main className="container">
              <div className="row g-5">
                <div className="col-md-12">
                  <article className="blog-post p-4 border rounded shadow-sm">
                    <div
                      className="blog-content"
                      dangerouslySetInnerHTML={{ __html: aboutus.content }}
                      style={{ lineHeight: "1.3", textAlign: "justify" }}
                    ></div>
                  </article>
                </div>
              </div>
            </main>
          ) : (
            <h4 className="text-center text-danger fw-bold">⚠️ Add About us</h4>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
