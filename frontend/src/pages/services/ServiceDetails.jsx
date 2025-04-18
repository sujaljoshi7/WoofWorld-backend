import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";
import "../../styles/Services.css";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    service_id: id,
  });

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await api.get(`/api/services/${id}/`);
        setService(response.data);
      } catch (error) {
        console.error("Error fetching service details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  const handleFaqToggle = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/inquiries/", inquiryForm);
      alert("Inquiry submitted successfully!");
      setInquiryForm({
        name: "",
        email: "",
        phone: "",
        message: "",
        service_id: id,
      });
      setShowInquiry(false);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("Failed to submit inquiry. Please try again.");
    }
  };

  const faqs = [
    {
      question: "What is included in this service?",
      answer:
        "Our service includes comprehensive care with professional staff, quality equipment, and personalized attention to meet your pet's specific needs.",
    },
    {
      question: "How long does each session take?",
      answer:
        "Session duration varies based on your pet's needs, typically ranging from 30 minutes to 2 hours to ensure thorough and proper care.",
    },
    {
      question: "Do you provide emergency services?",
      answer:
        "Yes, we offer 24/7 emergency services for urgent situations. Contact our emergency hotline for immediate assistance.",
    },
    {
      question: "What safety measures do you follow?",
      answer:
        "We maintain strict safety protocols, sanitized facilities, and trained staff to ensure your pet's wellbeing throughout their stay.",
    },
    {
      question: "Are your staff certified?",
      answer:
        "All our staff members are certified professionals with extensive training and experience in pet care and handling.",
    },
  ];

  if (loading) {
    return <div className="loading">Loading service details...</div>;
  }

  if (!service) {
    return <div className="error">Service not found</div>;
  }

  return (
    <div>
      <Navbar />
      <div>
        <div className="service-details-page">
          <div className="service-hero">
            <div className="service-image">
              <img src={service.image} alt={service.name} />
            </div>
            <div className="service-info">
              <h1>{service.name}</h1>
              <div className="service-highlights">
                <div className="highlight-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Professional Care</span>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-clock"></i>
                  <span>24/7 Support</span>
                </div>
                <div className="highlight-item">
                  <i className="fas fa-certificate"></i>
                  <span>Certified Staff</span>
                </div>
              </div>
              <p className="service-description">{service.content}</p>
              <div className="service-actions">
                <button
                  className="inquiry-btn btn-dark text-light"
                  onClick={() => setShowInquiry(true)}
                >
                  Send Inquiry
                </button>
              </div>
            </div>
          </div>

          <div className="service-content">
            <section className="service-features">
              <h2>What We Offer</h2>
              <div className="features-container">
                <div className="feature-box">
                  <i className="fas fa-heart"></i>
                  <h3>Personalized Care</h3>
                  <p>
                    Tailored services to meet your pet's unique needs and
                    preferences.
                  </p>
                </div>
                <div className="feature-box">
                  <i className="fas fa-medal"></i>
                  <h3>Expert Staff</h3>
                  <p>Highly trained professionals with years of experience.</p>
                </div>
                <div className="feature-box">
                  <i className="fas fa-home"></i>
                  <h3>Safe Environment</h3>
                  <p>Clean, secure, and comfortable facilities for your pet.</p>
                </div>
              </div>
            </section>

            <section className="service-process">
              <h2>Our Process</h2>
              <div className="process-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <h3>Initial Consultation</h3>
                  <p>
                    We discuss your pet's needs and create a personalized care
                    plan.
                  </p>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <h3>Service Delivery</h3>
                  <p>
                    Professional care with attention to detail and regular
                    updates.
                  </p>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <h3>Follow-up Care</h3>
                  <p>
                    Continuous support and adjustments based on your pet's
                    response.
                  </p>
                </div>
              </div>
            </section>

            <section className="faq-section">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`faq-item ${
                      activeFaq === index ? "active" : ""
                    }`}
                  >
                    <div
                      className="faq-question"
                      onClick={() => handleFaqToggle(index)}
                    >
                      <h3>{faq.question}</h3>
                      <span className="faq-toggle">
                        {activeFaq === index ? "-" : "+"}
                      </span>
                    </div>
                    {activeFaq === index && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {showInquiry && (
            <div className="inquiry-modal">
              <div className="inquiry-content">
                <h2>Send Inquiry</h2>
                <form onSubmit={handleInquirySubmit}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={inquiryForm.name}
                      onChange={handleInquiryChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={inquiryForm.email}
                      onChange={handleInquiryChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={inquiryForm.phone}
                      onChange={handleInquiryChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      name="message"
                      value={inquiryForm.message}
                      onChange={handleInquiryChange}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="submit-btn btn-dark">
                      Submit Inquiry
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setShowInquiry(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceDetails;
