import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import "../../styles/Services.css";

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

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Our Services</h1>
          <p>Comprehensive care and services for your beloved pets</p>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="info-section">
        <div className="container">
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
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature">
              <i className="fas fa-check-circle"></i>
              <h3>Experienced Staff</h3>
              <p>
                Our team consists of trained professionals with years of
                experience in pet care.
              </p>
            </div>
            <div className="feature">
              <i className="fas fa-check-circle"></i>
              <h3>24/7 Availability</h3>
              <p>
                We're available round the clock to address any concerns or
                emergencies.
              </p>
            </div>
            <div className="feature">
              <i className="fas fa-check-circle"></i>
              <h3>Modern Facilities</h3>
              <p>
                State-of-the-art equipment and facilities for the best care
                possible.
              </p>
            </div>
            <div className="feature">
              <i className="fas fa-check-circle"></i>
              <h3>Affordable Pricing</h3>
              <p>
                Competitive pricing with various packages to suit your needs and
                budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2>Our Services</h2>
          {loading ? (
            <div className="loading">Loading services...</div>
          ) : (
            <div className="services-grid">
              {services.map((service) => (
                <div key={service.id} className="service-card">
                  {service.image && (
                    <div className="service-image">
                      <img src={service.image} alt={service.name} />
                    </div>
                  )}
                  <div className="service-content">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    {service.packages && service.packages.length > 0 && (
                      <div className="packages">
                        {service.packages.map((pkg) => (
                          <div key={pkg.id} className="package">
                            <span className="package-name">{pkg.name}</span>
                            <span className="package-price">₹{pkg.price}</span>
                            <span className="package-duration">
                              {pkg.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <Link to="/contact" className="contact-btn">
                      Contact Us
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
