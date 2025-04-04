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
  const parallaxRef = useRef(null);

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

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset;
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      {/* Hero Section with Parallax */}
      <section className="hero-section">
        <div className="parallax-bg" ref={parallaxRef}>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="container">
              <div className="row align-items-center min-vh-100">
                <div className="col-lg-6">
                  <h1 className="hero-title">
                    Find Your Perfect{" "}
                    <span className="highlight">Furry Companion</span>
                  </h1>
                  <p className="hero-subtitle">
                    Join our community of pet lovers and discover the joy of
                    giving a loving home to a dog in need.
                  </p>
                  <div className="hero-buttons">
                    <button
                      className="btn btn-primary btn-lg me-3"
                      onClick={() => navigate("/adoption")}
                    >
                      Adopt Now
                    </button>
                    <button
                      className="btn btn-outline-light btn-lg"
                      onClick={() => navigate("/services")}
                    >
                      Our Services
                    </button>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="hero-image-container">
                    <img
                      src="/images/hero-dog.png"
                      alt="Happy Dog"
                      className="hero-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Animation */}
      <AnimatedSection delay={200}>
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
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

      {/* Featured Services Section */}
      <AnimatedSection delay={400}>
        <section className="services-section">
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
                  className="service-card"
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

      {/* Featured Products Section */}
      <AnimatedSection delay={600}>
        <section className="products-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Premium Products</h2>
              <div className="section-divider"></div>
              <p className="section-subtitle">
                Discover our selection of high-quality pet products
              </p>
            </div>

            <div className="products-grid">
              {data.products.slice(0, 4).map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <img
                      src={`${BASE_URL}${product.image}`}
                      alt={product.name}
                      className="product-image"
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
        <section className="events-section">
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
                <div key={event.id} className="event-card">
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
        <section className="adoption-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Adopt a Furry Friend</h2>
              <div className="section-divider"></div>
              <p className="section-subtitle">
                Give a loving home to a dog in need
              </p>
            </div>

            <div className="adoption-grid">
              {data.adoptions.slice(0, 3).map((adoption) => (
                <div key={adoption.id} className="adoption-card">
                  <div className="adoption-image-container">
                    <img
                      src={`${BASE_URL}${adoption.image}`}
                      alt={adoption.name}
                      className="adoption-image"
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
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          height: 100vh;
          overflow: hidden;
        }

        .parallax-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
          transform: translateZ(0);
          will-change: transform;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url("/images/pattern.png") repeat;
          opacity: 0.1;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          color: white;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .hero-title .highlight {
          color: #f6ad55;
          position: relative;
          display: inline-block;
        }

        .hero-title .highlight:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 8px;
          background: #f6ad55;
          opacity: 0.3;
          border-radius: 4px;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          max-width: 600px;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
        }

        .hero-buttons .btn {
          padding: 1rem 2rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .hero-buttons .btn-primary {
          background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
          border: none;
          box-shadow: 0 4px 6px rgba(246, 173, 85, 0.25);
        }

        .hero-buttons .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(246, 173, 85, 0.35);
        }

        .hero-buttons .btn-outline-light {
          border: 2px solid white;
        }

        .hero-buttons .btn-outline-light:hover {
          background: white;
          color: #1a365d;
          transform: translateY(-2px);
        }

        .hero-image-container {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-image {
          max-width: 100%;
          height: auto;
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        /* Stats Section */
        .stats-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, #2d3748 0%, #1a365d 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .stats-section:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url("/images/pattern.png") repeat;
          opacity: 0.1;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          position: relative;
          z-index: 1;
        }

        .counter-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s ease;
        }

        .counter-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.15);
        }

        .counter-icon {
          background: rgba(246, 173, 85, 0.2);
          color: #f6ad55;
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
          font-size: 2.5rem;
          font-weight: 700;
          color: #f6ad55;
          margin: 0;
          line-height: 1.2;
        }

        .counter-title {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        /* Services Section */
        .services-section {
          padding: 5rem 0;
          background: #f7fafc;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
        }

        .section-divider {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #f6ad55, #ed8936);
          margin: 1rem auto;
          border-radius: 2px;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: #4a5568;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .service-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
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

        .service-card:hover .service-image {
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
          color: #1a365d;
        }

        /* Products Section */
        .products-section {
          padding: 5rem 0;
          background: white;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
        }

        .product-image-container {
          position: relative;
          height: 300px;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-card:hover .product-image {
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
          color: #f6ad55;
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
          color: #1a365d;
        }

        /* Events Section */
        .events-section {
          padding: 5rem 0;
          background: #f7fafc;
        }

        .events-timeline {
          max-width: 800px;
          margin: 0 auto 3rem;
        }

        .event-card {
          display: flex;
          margin-bottom: 2rem;
          position: relative;
        }

        .event-card:before {
          content: "";
          position: absolute;
          left: 80px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #f6ad55, #ed8936);
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
          color: #f6ad55;
          line-height: 1;
        }

        .event-month {
          display: block;
          font-size: 1rem;
          color: #4a5568;
          text-transform: uppercase;
        }

        .event-content {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
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
          color: #1a365d;
        }

        .event-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #4a5568;
          margin-bottom: 1rem;
        }

        .event-description {
          font-size: 0.95rem;
          color: #4a5568;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .event-btn {
          background: linear-gradient(90deg, #f6ad55, #ed8936);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .event-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(246, 173, 85, 0.25);
        }

        /* Adoption Section */
        .adoption-section {
          padding: 5rem 0;
          background: white;
        }

        .adoption-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .adoption-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .adoption-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
        }

        .adoption-image-container {
          position: relative;
          height: 350px;
          overflow: hidden;
        }

        .adoption-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .adoption-card:hover .adoption-image {
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
          color: #1a365d;
        }

        /* View All Button */
        .view-all-container {
          text-align: center;
          margin-top: 2rem;
        }

        .view-all-btn {
          background: transparent;
          color: #f6ad55;
          border: 2px solid #f6ad55;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-all-btn:hover {
          background: #f6ad55;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 4px 6px rgba(246, 173, 85, 0.25);
        }

        /* Loading Placeholder */
        .loading-placeholder {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.5rem;
          color: #4a5568;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .hero-buttons {
            flex-direction: column;
          }

          .hero-buttons .btn {
            width: 100%;
            margin-bottom: 1rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .event-card {
            flex-direction: column;
          }

          .event-card:before {
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
