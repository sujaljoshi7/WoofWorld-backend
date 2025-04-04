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
                      src="https://img.freepik.com/free-photo/smart-dog-sideways-camera-joyful-young-adult-man-crouching-touching-friendly-smart-dog-with-leash-near-country-house-autumn-day_259150-59347.jpg?t=st=1743695042~exp=1743698642~hmac=52ef078bc01a774a6e1b58b89e6790635edc6c8f100c55a087b9583eeea23bf2&w=1380"
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
                  </div>
                  <div className="service-content">
                    <h3 className="service-title">{service.name}</h3>
                    <p className="service-description">
                      {service.description?.substring(0, 100) ||
                        "No description available"}
                      ...
                    </p>
                    <button className="service-btn">Learn More</button>
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
                  </div>
                  <div className="product-content">
                    <h3 className="product-name">
                      {product?.name || "Unknown Product"}
                    </h3>
                    <p className="product-price">${product?.price || "0.00"}</p>
                    <button className="product-btn">View Details</button>
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
                      {event.address_line_1} {event.address_line_2}
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
                  </div>
                  <div className="adoption-content">
                    <h3 className="adoption-name">
                      {adoption?.name || "Unknown"}
                    </h3>
                    <p className="adoption-details">
                      <span>{adoption?.age || "N/A"} years old</span> •{" "}
                      <span>{adoption?.breed?.name || "Unknown Breed"}</span>
                    </p>
                    <button className="adoption-btn">
                      Meet {adoption?.name || "this dog"}
                    </button>
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
          background: #0a0a0a;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          height: 100vh;
          overflow: hidden;
          background: #0a0a0a;
        }

        .parallax-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at center,
            #1a1a1a 0%,
            #0a0a0a 100%
          );
          transform: translateZ(0);
          will-change: transform;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
              circle at 20% 20%,
              rgba(246, 173, 85, 0.1) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(246, 173, 85, 0.1) 0%,
              transparent 50%
            );
          opacity: 0.5;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          color: white;
        }

        .hero-title {
          font-size: 4.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          background: linear-gradient(135deg, #fff 0%, #f6ad55 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 30px rgba(246, 173, 85, 0.3);
        }

        .hero-title .highlight {
          color: #f6ad55;
          position: relative;
          display: inline-block;
          text-shadow: 0 0 20px rgba(246, 173, 85, 0.5);
        }

        .hero-title .highlight:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 8px;
          background: linear-gradient(90deg, #f6ad55, #ed8936);
          opacity: 0.5;
          border-radius: 4px;
          filter: blur(4px);
        }

        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          max-width: 600px;
          text-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }

        .hero-buttons {
          display: flex;
          gap: 1.5rem;
        }

        .hero-buttons .btn {
          padding: 1rem 2.5rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-radius: 12px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .hero-buttons .btn:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: translateX(-100%);
          transition: transform 0.6s;
        }

        .hero-buttons .btn:hover:before {
          transform: translateX(100%);
        }

        .hero-buttons .btn-primary {
          background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
          border: none;
          box-shadow: 0 4px 15px rgba(246, 173, 85, 0.3);
        }

        .hero-buttons .btn-primary:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 25px rgba(246, 173, 85, 0.4);
        }

        .hero-buttons .btn-outline-light {
          border: 2px solid rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }

        .hero-buttons .btn-outline-light:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
        }

        .hero-image-container {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
        }

        .hero-image {
          max-width: 100%;
          height: auto;
          filter: drop-shadow(0 10px 30px rgba(246, 173, 85, 0.3));
          animation: float 6s ease-in-out infinite, rotate3D 20s linear infinite;
          transform-style: preserve-3d;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotateY(0);
          }
          50% {
            transform: translateY(-20px) rotateY(10deg);
          }
        }

        @keyframes rotate3D {
          0% {
            transform: rotateY(0) rotateX(0);
          }
          100% {
            transform: rotateY(360deg) rotateX(10deg);
          }
        }

        /* Stats Section */
        .stats-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
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
          background: radial-gradient(
              circle at 20% 20%,
              rgba(246, 173, 85, 0.1) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(246, 173, 85, 0.1) 0%,
              transparent 50%
            );
          opacity: 0.3;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          position: relative;
          z-index: 1;
        }

        .counter-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .counter-card:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(246, 173, 85, 0.1),
            transparent
          );
          transform: translateX(-100%);
          transition: transform 0.6s;
        }

        .counter-card:hover:before {
          transform: translateX(100%);
        }

        .counter-card:hover {
          transform: translateY(-5px) scale(1.02);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .counter-icon {
          background: rgba(246, 173, 85, 0.2);
          color: #f6ad55;
          width: 70px;
          height: 70px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .counter-card:hover .counter-icon {
          transform: rotate(360deg) scale(1.1);
          background: rgba(246, 173, 85, 0.3);
        }

        .counter-content {
          flex: 1;
        }

        .counter-number {
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          line-height: 1.2;
          text-shadow: 0 0 20px rgba(246, 173, 85, 0.3);
        }

        .counter-title {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Services Section */
        .services-section {
          padding: 5rem 0;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
        }

        .services-section:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
              circle at 20% 20%,
              rgba(246, 173, 85, 0.05) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(246, 173, 85, 0.05) 0%,
              transparent 50%
            );
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
          position: relative;
        }

        .section-title {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
          text-shadow: 0 0 30px rgba(246, 173, 85, 0.3);
        }

        .section-divider {
          width: 100px;
          height: 4px;
          background: linear-gradient(90deg, #f6ad55, #ed8936);
          margin: 1.5rem auto;
          border-radius: 2px;
          position: relative;
        }

        .section-divider:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.5),
            transparent
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
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
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .service-image-container {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .service-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .service-card:hover .service-image {
          transform: scale(1.1) rotate(3deg);
        }

        .service-content {
          padding: 2rem;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .service-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #f6ad55;
          position: relative;
          display: inline-block;
        }

        .service-title:after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #f6ad55, transparent);
          border-radius: 2px;
        }

        .service-description {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1.5rem;
          line-height: 1.6;
          flex: 1;
        }

        .service-btn {
          background: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.8);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          align-self: flex-start;
        }

        /* Products Section */
        .products-section {
          padding: 5rem 0;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
        }

        .products-section:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
              circle at 20% 20%,
              rgba(246, 173, 85, 0.05) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(246, 173, 85, 0.05) 0%,
              transparent 50%
            );
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .product-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .product-image-container {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .product-card:hover .product-image {
          transform: scale(1.1) rotate(3deg);
        }

        .product-content {
          padding: 2rem;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .product-name {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #f6ad55;
          position: relative;
          display: inline-block;
        }

        .product-name:after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #f6ad55, transparent);
          border-radius: 2px;
        }

        .product-price {
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 1rem;
          color: #f6ad55;
          text-shadow: 0 0 10px rgba(246, 173, 85, 0.3);
        }

        .product-btn {
          background: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.8);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          align-self: flex-start;
        }

        /* Events Section */
        .events-section {
          padding: 5rem 0;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
        }

        .events-section:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
              circle at 20% 20%,
              rgba(246, 173, 85, 0.05) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(246, 173, 85, 0.05) 0%,
              transparent 50%
            );
        }

        .events-timeline {
          max-width: 800px;
          margin: 0 auto 3rem;
          position: relative;
        }

        .events-timeline:before {
          content: "";
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(
            to bottom,
            transparent,
            #f6ad55,
            transparent
          );
          transform: translateX(-50%);
        }

        .event-card {
          display: flex;
          margin-bottom: 3rem;
          position: relative;
          width: 100%;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease forwards;
        }

        .event-card:nth-child(odd) {
          flex-direction: row-reverse;
        }

        .event-date {
          width: 120px;
          text-align: center;
          padding: 1.5rem;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(246, 173, 85, 0.2);
          transform: translateY(0);
          transition: all 0.3s ease;
        }

        .event-date:hover {
          transform: translateY(-5px);
          border-color: rgba(246, 173, 85, 0.4);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .event-day {
          display: block;
          font-size: 2.8rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .event-month {
          display: block;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .event-content {
          flex: 1;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 20px;
          padding: 2rem;
          margin: 0 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .event-title {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #f6ad55;
          position: relative;
          display: inline-block;
        }

        .event-location {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 1rem;
          padding: 0.5rem 1rem;
          background: rgba(246, 173, 85, 0.1);
          border-radius: 8px;
          width: fit-content;
        }

        .event-description {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .event-btn {
          background: linear-gradient(90deg, #f6ad55, #ed8936);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Adoption Section */
        .adoption-section {
          padding: 5rem 0;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
        }

        .adoption-section:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
              circle at 20% 20%,
              rgba(246, 173, 85, 0.05) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(246, 173, 85, 0.05) 0%,
              transparent 50%
            );
        }

        .adoption-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .adoption-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
        }

        .adoption-image-container {
          position: relative;
          height: 300px;
          overflow: hidden;
        }

        .adoption-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .adoption-card:hover .adoption-image {
          transform: scale(1.1) rotate(3deg);
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
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .adoption-content {
          padding: 2rem;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .adoption-name {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #f6ad55;
          position: relative;
          display: inline-block;
        }

        .adoption-name:after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #f6ad55, transparent);
          border-radius: 2px;
        }

        .adoption-details {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .adoption-btn {
          background: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.8);
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          align-self: flex-start;
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
          padding: 0.75rem 2.5rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .view-all-btn:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(246, 173, 85, 0.2),
            transparent
          );
          transform: translateX(-100%);
          transition: transform 0.6s;
        }

        .view-all-btn:hover:before {
          transform: translateX(100%);
        }

        .view-all-btn:hover {
          background: #f6ad55;
          color: white;
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 25px rgba(246, 173, 85, 0.3);
        }

        /* Loading Placeholder */
        .loading-placeholder {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.7);
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

          .events-timeline:before {
            left: 20px;
          }

          .event-card {
            flex-direction: column !important;
            margin-left: 40px;
          }

          .event-date {
            width: 100%;
            text-align: left;
            padding-left: 0;
            margin-bottom: 1rem;
          }

          .event-date:before {
            left: -30px;
          }

          .event-content {
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
