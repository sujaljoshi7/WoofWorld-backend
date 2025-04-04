import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Home.css";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";
import AnimatedSection from "../../components/common/AnimatedSection";

// Lazy load components
const LoadingScreen = lazy(() => import("../../components/LoadingScreen"));
const Navbar = lazy(() => import("../../components/common/Navbar"));
const Footer = lazy(() => import("../../components/common/Footer"));

// Lazy load sections
const PartnerCompanies = lazy(() => import("./sections/PartnerCompanies"));
const Services = lazy(() => import("./sections/Services"));
const Products = lazy(() => import("./sections/Products"));
const Events = lazy(() => import("./sections/Events"));
const Adoptions = lazy(() => import("./sections/Adoptions"));

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    heroes: [],
    partnerCompanies: [],
    services: [],
    products: [],
    events: [],
    adoptions: [],
  });

  const [loading, setLoading] = useState({
    heroes: true,
    partnerCompanies: true,
    services: true,
    products: true,
    events: true,
    adoptions: true,
  });

  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const carouselRef = useRef(null);

  const staticData = {
    totalEvents: 50,
    totalServices: 20,
    happyClients: 200,
    adoptedDogs: 30,
  };

  // Generic fetch function to reduce code duplication
  const fetchData = async (endpoint, filterFn, stateKey) => {
    setLoading((prev) => ({ ...prev, [stateKey]: true }));

    try {
      const response = await api.get(endpoint);

      if (!response.data || !Array.isArray(response.data)) {
        console.error(
          `Unexpected response format for ${stateKey}:`,
          response.data
        );
        return;
      }

      const filteredData = filterFn ? filterFn(response.data) : response.data;

      setData((prev) => ({ ...prev, [stateKey]: filteredData }));
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const refreshed = await handleTokenRefresh();
          if (refreshed) {
            return fetchData(endpoint, filterFn, stateKey);
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
        console.error(`Failed to fetch ${stateKey}:`, error);
      }
    } finally {
      setLoading((prev) => ({ ...prev, [stateKey]: false }));
    }
  };

  useEffect(() => {
    // Fetch all data on component mount
    fetchData(
      "/api/homepage/hero/",
      (data) => data.filter((hero) => hero.status === 1),
      "heroes"
    );

    fetchData(
      "/api/homepage/partnercompany/",
      (data) => data.filter((company) => company.status === 1),
      "partnerCompanies"
    );

    fetchData(
      "/api/services/",
      (data) =>
        data.filter(
          (service) => service.show_on_homepage && service.status === 1
        ),
      "services"
    );

    fetchData(
      "/api/products/",
      (data) =>
        data.filter(
          (product) => product.show_on_homepage && product.status === 1
        ),
      "products"
    );

    fetchData(
      "/api/events/event/",
      (data) => {
        const today = new Date().toISOString().split("T")[0];
        return data
          .filter((event) => event.status && event.date > today)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
      },
      "events"
    );

    fetchData(
      "/api/adoption/",
      (data) => data.filter((adoption) => adoption.status),
      "adoptions"
    );
  }, []);

  // Setup intersection observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Initialize carousel
  useEffect(() => {
    if (carouselRef.current) {
      const carousel = new window.bootstrap.Carousel(carouselRef.current, {
        interval: 5000,
        ride: "carousel",
        wrap: true,
        pause: false,
      });
      return () => carousel.dispose();
    }
  }, [data.heroes]);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const date_format = {
    month: "long",
    day: "2-digit",
  };

  // Extracted counter component to improve readability
  const Counter = ({ title, target, icon }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 50);

      const counterInterval = setInterval(() => {
        start += increment;
        if (start >= target) {
          start = target;
          clearInterval(counterInterval);
        }
        setCount(Math.ceil(start));
      }, 50);

      return () => clearInterval(counterInterval);
    }, [target]);

    return (
      <div className="counter-card">
        <div className="counter-icon">{icon}</div>
        <div className="counter-content">
          <h2 className="counter-number">{count}+</h2>
          <p className="counter-title">{title}</p>
        </div>
      </div>
    );
  };

  // Check if all data is still loading
  const isLoading = Object.values(loading).some((status) => status);

  if (isLoading)
    return (
      <Suspense
        fallback={<div className="loading-placeholder">Loading...</div>}
      >
        <LoadingScreen />
      </Suspense>
    );

  return (
    <div className="home-container">
      <Suspense
        fallback={<div className="loading-placeholder">Loading...</div>}
      >
        <Navbar />
      </Suspense>

      {/* Hero Section */}
      <section className="hero">
        <div
          ref={carouselRef}
          id="carouselExampleAutoplaying"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="5000"
        >
          <div className="carousel-inner">
            {data.heroes.length > 0 ? (
              data.heroes.map((hero, index) => (
                <div
                  key={hero.id}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <div className="hero-content">
                    <div className="hero-text-overlay container">
                      <h1 className="hero-text-header">{hero.headline}</h1>
                      <p className="hero-text-body">{hero.subtext}</p>
                      <button className="btn hero-btn">{hero.cta}</button>
                    </div>
                    <div className="hero-overlay"></div>
                    <img
                      src={`${BASE_URL}${hero.image}`}
                      alt={`Hero ${index + 1}`}
                      className="hero-image"
                      loading="lazy"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>Loading hero content...</p>
            )}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* Featured Services Section */}
      <AnimatedSection delay={200}>
        <section className="featured-services">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Services</h2>
              <div className="section-divider"></div>
              <p className="section-subtitle">
                Comprehensive pet care solutions for your furry friends
              </p>
            </div>

            <div className="services-grid">
              {data.services.slice(0, 3).map((service) => (
                <div
                  key={service.id}
                  className="service-item"
                  onClick={() => navigate(`/services/${service.id}`)}
                >
                  <div className="service-image-container">
                    <img
                      src={`${BASE_URL}${service.image}`}
                      alt={service.name}
                      className="service-image"
                      loading="lazy"
                    />
                    <div className="service-overlay">
                      <h3 className="service-title">{service.name}</h3>
                      <p className="service-description">
                        {service.description?.substring(0, 100) ||
                          "No description available"}
                        ...
                      </p>
                      <button className="service-btn">Learn More</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="view-all-container">
              <button
                className="view-all-btn"
                onClick={() => navigate("/services")}
              >
                View All Services
              </button>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Stats Section */}
      <AnimatedSection delay={400}>
        <section className="stats-section">
          <div className="container">
            <div className="stats-container">
              <Counter
                title="Happy Clients"
                target={staticData.happyClients}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                }
              />
              <Counter
                title="Adopted Dogs"
                target={staticData.adoptedDogs}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 5.172C10 3.782 8.884 2.667 7.495 2.667S4.99 3.782 4.99 5.172c0 1.39 1.116 2.505 2.505 2.505S10 6.562 10 5.172z"></path>
                    <path d="M16.5 8.5c0 1.933-1.567 3.5-3.5 3.5s-3.5-1.567-3.5-3.5"></path>
                    <path d="M9.5 14.5c-2.5 0-4.5 2-4.5 4.5v1.5h13v-1.5c0-2.5-2-4.5-4.5-4.5z"></path>
                    <path d="M16.5 14.5c-2.5 0-4.5 2-4.5 4.5v1.5h13v-1.5c0-2.5-2-4.5-4.5-4.5z"></path>
                  </svg>
                }
              />
              <Counter
                title="Total Events"
                target={staticData.totalEvents}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                }
              />
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Featured Products Section */}
      <AnimatedSection delay={600}>
        <section className="featured-products">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Premium Products</h2>
              <div className="section-divider"></div>
              <p className="section-subtitle">
                Discover our selection of high-quality pet products
              </p>
            </div>

            <div className="products-showcase">
              {data.products.slice(0, 4).map((product) => (
                <div key={product.id} className="product-showcase-item">
                  <div className="product-image-wrapper">
                    <img
                      src={`${BASE_URL}${product.image}`}
                      alt={product.name}
                      className="product-showcase-image"
                      loading="lazy"
                    />
                    <div className="product-overlay">
                      <h3 className="product-name">
                        {product?.name || "Unknown Product"}
                      </h3>
                      <p className="product-price">
                        ${product?.price || "0.00"}
                      </p>
                      <button
                        className="product-btn"
                        onClick={() => navigate(`/products/${product?.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="view-all-container">
              <button
                className="view-all-btn"
                onClick={() => navigate("/products")}
              >
                Shop All Products
              </button>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Featured Events Section */}
      <AnimatedSection delay={800}>
        <section className="featured-events">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Upcoming Events</h2>
              <div className="section-divider"></div>
              <p className="section-subtitle">
                Join us for exciting pet-friendly activities
              </p>
            </div>

            <div className="events-timeline">
              {data.events.slice(0, 3).map((event) => (
                <div key={event.id} className="event-timeline-item">
                  <div className="event-date">
                    <span className="event-day">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="event-month">
                      {new Date(event.date).toLocaleString("default", {
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.name}</h3>
                    <p className="event-location">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {event.location}
                    </p>
                    <p className="event-description">
                      {event.description?.substring(0, 100) ||
                        "No description available"}
                      ...
                    </p>
                    <button
                      className="event-btn"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      Get Tickets
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="view-all-container">
              <button
                className="view-all-btn"
                onClick={() => navigate("/events")}
              >
                View All Events
              </button>
            </div>
          </div>
        </section>
      </AnimatedSection>
      {/* Adoption Spotlight Section */}
      <AnimatedSection delay={1000}>
        <section className="adoption-spotlight">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Adopt a Furry Friend</h2>
              <div className="section-divider"></div>
              <p className="section-subtitle">
                Give a loving home to a dog in need
              </p>
            </div>

            <div className="adoption-showcase">
              {data.adoptions.slice(0, 3).map((adoption) => (
                <div key={adoption.id} className="adoption-showcase-item">
                  <div className="adoption-image-wrapper">
                    <img
                      src={`${BASE_URL}${adoption.image}`}
                      alt={adoption.name}
                      className="adoption-showcase-image"
                      loading="lazy"
                    />
                    <div className="adoption-status">
                      {adoption.vaccinated ? "Vaccinated" : "Not Vaccinated"}
                    </div>
                    <div className="adoption-overlay">
                      <h3 className="adoption-name">
                        {adoption?.name || "Unknown"}
                      </h3>
                      <p className="adoption-details">
                        <span>{adoption?.age || "N/A"} years old</span> •{" "}
                        <span>{adoption?.breed?.name || "Unknown Breed"}</span>
                      </p>
                      <button
                        className="adoption-btn"
                        onClick={() => navigate(`/adoptions/${adoption?.id}`)}
                      >
                        Meet {adoption?.name || "this dog"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="view-all-container">
              <button
                className="view-all-btn"
                onClick={() => navigate("/adoptions")}
              >
                View All Dogs
              </button>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Partner Companies Section */}
      <AnimatedSection delay={1200}>
        <Suspense
          fallback={<div className="loading-placeholder">Loading...</div>}
        >
          <PartnerCompanies
            companies={data.partnerCompanies}
            BASE_URL={BASE_URL}
          />
        </Suspense>
      </AnimatedSection>

      <Suspense
        fallback={<div className="loading-placeholder">Loading...</div>}
      >
        <Footer />
      </Suspense>

      <style jsx>{`
        .home-container {
          padding-top: 70px;
        }

        .hero {
          position: relative;
          height: 80vh;
          min-height: 600px;
          overflow: hidden;
        }

        .hero-content {
          position: relative;
          height: 100%;
          width: 100%;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.4) 100%
          );
        }

        .hero-text-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          text-align: center;
          color: white;
          max-width: 800px;
        }

        .hero-text-header {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-text-body {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          line-height: 1.6;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .hero-btn {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          font-size: 1.1rem;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .hero-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          background: linear-gradient(90deg, #2563eb, #7c3aed);
        }

        .carousel-control-prev,
        .carousel-control-next {
          width: 5%;
          opacity: 0.8;
        }

        .carousel-control-prev-icon,
        .carousel-control-next-icon {
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          padding: 1.5rem;
        }

        /* Section Styles */
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .section-divider {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          margin: 0 auto 1rem;
          border-radius: 2px;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Featured Services */
        .featured-services {
          padding: 5rem 0;
          background-color: #f8fafc;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .service-item {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .service-item:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }

        .service-image-container {
          position: relative;
          height: 300px;
          overflow: hidden;
        }

        .service-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .service-item:hover .service-image {
          transform: scale(1.1);
        }

        .service-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          padding: 2rem 1.5rem 1.5rem;
          color: white;
        }

        .service-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .service-description {
          font-size: 0.9rem;
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .service-btn {
          background: transparent;
          color: white;
          border: 1px solid white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .service-btn:hover {
          background: white;
          color: #1e293b;
        }

        /* Stats Section */
        .stats-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
        }

        .stats-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .counter-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
        }

        .counter-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.2);
        }

        .counter-icon {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .counter-content {
          flex: 1;
        }

        .counter-number {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin: 0;
          line-height: 1.2;
        }

        .counter-title {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        /* Featured Products */
        .featured-products {
          padding: 5rem 0;
          background-color: white;
        }

        .products-showcase {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .product-showcase-item {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .product-showcase-item:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }

        .product-image-wrapper {
          position: relative;
          height: 300px;
          overflow: hidden;
        }

        .product-showcase-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-showcase-item:hover .product-showcase-image {
          transform: scale(1.1);
        }

        .product-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          padding: 2rem 1.5rem 1.5rem;
          color: white;
        }

        .product-name {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .product-price {
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 1rem;
          color: #fbbf24;
        }

        .product-btn {
          background: transparent;
          color: white;
          border: 1px solid white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .product-btn:hover {
          background: white;
          color: #1e293b;
        }

        /* Featured Events */
        .featured-events {
          padding: 5rem 0;
          background-color: #f8fafc;
        }

        .events-timeline {
          max-width: 800px;
          margin: 0 auto 3rem;
        }

        .event-timeline-item {
          display: flex;
          margin-bottom: 2rem;
          position: relative;
        }

        .event-timeline-item:before {
          content: "";
          position: absolute;
          left: 80px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
        }

        .event-date {
          width: 80px;
          text-align: center;
          padding-right: 2rem;
          flex-shrink: 0;
        }

        .event-day {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #3b82f6;
          line-height: 1;
        }

        .event-month {
          display: block;
          font-size: 1rem;
          color: #64748b;
          text-transform: uppercase;
        }

        .event-content {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          flex: 1;
          position: relative;
        }

        .event-content:before {
          content: "";
          position: absolute;
          left: -10px;
          top: 20px;
          width: 20px;
          height: 20px;
          background: white;
          transform: rotate(45deg);
          box-shadow: -3px 3px 5px rgba(0, 0, 0, 0.05);
        }

        .event-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1e293b;
        }

        .event-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #64748b;
          margin-bottom: 1rem;
        }

        .event-description {
          font-size: 0.95rem;
          color: #475569;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .event-btn {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .event-btn:hover {
          background: linear-gradient(90deg, #2563eb, #7c3aed);
          transform: translateY(-2px);
        }

        /* Adoption Spotlight */
        .adoption-spotlight {
          padding: 5rem 0;
          background-color: white;
        }

        .adoption-showcase {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .adoption-showcase-item {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .adoption-showcase-item:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }

        .adoption-image-wrapper {
          position: relative;
          height: 350px;
          overflow: hidden;
        }

        .adoption-showcase-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .adoption-showcase-item:hover .adoption-showcase-image {
          transform: scale(1.1);
        }

        .adoption-status {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .adoption-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          padding: 2rem 1.5rem 1.5rem;
          color: white;
        }

        .adoption-name {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .adoption-details {
          font-size: 0.9rem;
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .adoption-btn {
          background: transparent;
          color: white;
          border: 1px solid white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .adoption-btn:hover {
          background: white;
          color: #1e293b;
        }

        /* View All Button */
        .view-all-container {
          text-align: center;
          margin-top: 2rem;
        }

        .view-all-btn {
          background: transparent;
          color: #3b82f6;
          border: 2px solid #3b82f6;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-all-btn:hover {
          background: #3b82f6;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
        }

        .animated-section {
          will-change: transform, opacity;
        }

        .animated-section.animate {
          animation: slideUp 0.6s ease-out forwards;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .loading-placeholder {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.5rem;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .hero {
            height: 70vh;
            min-height: 500px;
          }

          .hero-text-header {
            font-size: 2.5rem;
          }

          .hero-text-body {
            font-size: 1.1rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .event-timeline-item {
            flex-direction: column;
          }

          .event-timeline-item:before {
            left: 40px;
          }

          .event-date {
            width: 100%;
            text-align: left;
            padding-left: 40px;
            margin-bottom: 1rem;
          }

          .event-content:before {
            left: 20px;
            top: -10px;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
