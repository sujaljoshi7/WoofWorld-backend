import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import "../../styles/Services.css";

import LoadingScreen from "../../components/LoadingScreen";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/api/services/");
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  return (
    <div>
      <Navbar />
      <div>
        {/* Hero Section */}
        <section className="services-hero yellow-bg text-dark">
          <h1>Our Services</h1>
          <p>Comprehensive care and services for your beloved pets</p>
        </section>
        <div className="container">
          {/* Info Section */}
          <section className="info-section">
            <h2>What We Do</h2>
            <div className="info-grid">
              <div className="info-card">
                <i className="fas fa-paw"></i>
                <h3>Professional Care</h3>
                <p>
                  Our team of experienced professionals provides top-notch care
                  for your pets, ensuring their health and happiness.
                </p>
              </div>
              <div className="info-card">
                <i className="fas fa-home"></i>
                <h3>Comfortable Environment</h3>
                <p>
                  We maintain a clean, safe, and comfortable environment where
                  your pets can feel at home.
                </p>
              </div>
              <div className="info-card">
                <i className="fas fa-heart"></i>
                <h3>Personalized Attention</h3>
                <p>
                  Each pet receives individual attention and care tailored to
                  their specific needs and preferences.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="why-choose-section">
            <h2>Why Choose Us</h2>
            <div className="features-grid">
              <div className="feature-item">
                <i className="fas fa-check-circle"></i>
                <h3>Experienced Staff</h3>
                <p>
                  Our team consists of trained professionals with years of
                  experience in pet care.
                </p>
              </div>
              <div className="feature-item">
                <i className="fas fa-clock"></i>
                <h3>24/7 Availability</h3>
                <p>
                  We're available round the clock to address any concerns or
                  emergencies.
                </p>
              </div>
              <div className="feature-item">
                <i className="fas fa-hospital"></i>
                <h3>Modern Facilities</h3>
                <p>
                  State-of-the-art equipment and facilities for the best care
                  possible.
                </p>
              </div>
              <div className="feature-item">
                <i className="fas fa-tags"></i>
                <h3>Affordable Pricing</h3>
                <p>
                  Competitive pricing with various packages to suit your needs
                  and budget.
                </p>
              </div>
              <div className="feature-item">
                <i className="fas fa-shield-alt"></i>
                <h3>Safety First</h3>
                <p>
                  Rigorous safety protocols and secure facilities to protect
                  your beloved pets.
                </p>
              </div>
              <div className="feature-item">
                <i className="fas fa-certificate"></i>
                <h3>Certified Services</h3>
                <p>
                  All our services and staff are certified by recognized pet
                  care institutions.
                </p>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section className="services-section">
            <h2>Available Services</h2>
            <div className="services-grid">
              {services.map((service) => (
                <div key={service.id} className="service-card">
                  {service.image && (
                    <div className="service-image-card">
                      <img src={service.image} alt={service.name} />
                    </div>
                  )}
                  <div className="service-content">
                    <h3>{service.name}</h3>
                    <p>{truncateDescription(service.content)}</p>
                    <div className="service-footer">
                      <Link
                        to={`/services/${service.id}`}
                        className="view-details-btn btn-dark"
                      >
                        View More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Services;
