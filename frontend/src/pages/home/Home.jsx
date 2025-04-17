import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import calender from "../../assets/images/icons/calendar.png";
import location_pin from "../../assets/images/icons/location.png";
import "../../styles/Home.css";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";

import LoadingScreen from "../../components/LoadingScreen";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

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

  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL;

  const staticData = {
    totalEvents: 50,
    totalServices: 20,
    happyClients: 200,
    adoptedDogs: 30,
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const searchTimeoutRef = useRef(null);
  const searchResultsRef = useRef(null);

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
            // Retry after refreshing
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

  useEffect(() => {
    // Auto-scroll carousel
    const interval = setInterval(() => {
      if (data.heroes.length > 0) {
        setCurrentSlide((prev) => (prev + 1) % data.heroes.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [data.heroes.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + data.heroes.length) % data.heroes.length
    );
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % data.heroes.length);
  };

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
    return (
      <div className="counter-card">
        <div className="counter-icon">{icon}</div>
        <div className="counter-content">
          <h2 className="counter-number">{target}+</h2>
          <p className="counter-title">{title}</p>
        </div>
      </div>
    );
  };

  // Check if all data is still loading
  const isLoading = Object.values(loading).some((status) => status);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target)
      ) {
        setSearchResults(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(
        `/api/search/?q=${encodeURIComponent(query)}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounce search to avoid too many API calls
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 300);
  };

  const handleResultClick = (type, item) => {
    setSearchResults(null);
    setSearchQuery("");

    switch (type) {
      case "dogs":
        navigate(`/adoption/dog/${item.id}`);
        break;
      case "events":
        navigate(`/events/${item.id}`);
        break;
      case "products":
        navigate(`/shop/product/${item.id}`);
        break;
      default:
        break;
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div>
      <div className="main-content">
        <Navbar />

        {/* Hero Section */}
        <section className="hero">
          <div className="carousel" ref={carouselRef}>
            <div className="carousel-inner">
              {data.heroes.length > 0 ? (
                data.heroes.map((hero, index) => (
                  <div
                    key={hero.id}
                    className={`carousel-item ${
                      index === currentSlide ? "active" : ""
                    }`}
                    style={{
                      transform: `translateX(${(index - currentSlide) * 100}%)`,
                      transition: "transform 0.5s ease-in-out",
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <div className="hero-content">
                      <div className="hero-text-overlay container">
                        <h1 className="hero-text-header">{hero.headline}</h1>
                        <p className="hero-text-body">{hero.subtext}</p>
                        <button
                          className="btn hero-btn btn-dark"
                          onClick={() => navigate(hero.url)}
                        >
                          {hero.cta}
                        </button>
                      </div>
                      <div className="black-overlay"></div>
                      <img
                        src={hero.image}
                        style={{ objectFit: "cover" }}
                        alt={`Hero ${index + 1}`}
                        className="hero-image"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>Loading hero content...</p>
              )}
            </div>

            <button
              className="carousel-control-prev visually-hidden"
              type="button"
              onClick={goToPrevSlide}
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next visually-hidden"
              type="button"
              onClick={goToNextSlide}
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </section>

        {/* Partner Companies Section */}
        <section className="partner-companies">
          <h4 className="text-center">Trusted by great companies</h4>
          <div className="container-fluid py-4">
            <div className="partner-logos-wrapper">
              <div className="partner-logos-track">
                {data.partnerCompanies.length > 0 ? (
                  <>
                    {/* First set of logos */}
                    <div className="partner-logos">
                      {data.partnerCompanies.map((company, index) => (
                        <div
                          key={`first-${index}`}
                          className="partner-logo-item"
                        >
                          <img
                            title={company.name}
                            src={company.image}
                            alt="Company Logo"
                            className="img-fluid"
                            style={{
                              height: "100px",
                              width: "auto",
                              minWidth: "150px",
                              objectFit: "contain",
                              padding: "0 40px",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    {/* Duplicate set for seamless transition */}
                    <div className="partner-logos">
                      {data.partnerCompanies.map((company, index) => (
                        <div
                          key={`second-${index}`}
                          className="partner-logo-item"
                        >
                          <img
                            title={company.name}
                            src={company.image}
                            alt="Company Logo"
                            className="img-fluid"
                            style={{
                              height: "100px",
                              width: "auto",
                              minWidth: "150px",
                              objectFit: "contain",
                              padding: "0 40px",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p>No partner companies available</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <style>
          {`
            .partner-companies {
              width: 100%;
              overflow: hidden;
            }

            .partner-logos-wrapper {
              width: 100%;
              overflow: hidden;
              position: relative;
              padding: 20px 0;
            }

            .partner-logos-track {
              display: flex;
              animation: scroll 40s linear infinite;
              will-change: transform;
              width: fit-content;
            }

            .partner-logos {
              display: flex;
              flex-shrink: 0;
              width: fit-content;
            }

            .partner-logo-item {
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              width: fit-content;
            }

            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-100% - 20px));
              }
            }

            .hover-shadow:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
            }
            
            .shadow-lg {
              box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
            }
          `}
        </style>

        {/* Counters Section */}
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

        {/* Services Section */}
        <section className="ourservices-section container">
          <div className="justify-content-between align-items-center">
            <h2 className="text-center ourservices-heading">
              Expert Care, Tailored for Your Pet! 🐶💙
            </h2>
          </div>
          <p className="ourservices-content text-center text-secondary">
            Discover our top-notch services, from grooming and training to vet
            consultations and boarding. We ensure the best care for your furry
            friend!
          </p>
          <div className="services-wrapper hide-scrollbar">
            {data.services.length > 0 ? (
              data.services.map((service) => (
                <div
                  className="p-2"
                  key={service.id}
                  style={{ flex: "0 0 auto" }}
                >
                  <div
                    className="card shadow-lg hover-shadow"
                    style={{
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      border: "none",
                      borderRadius: "15px",
                    }}
                  >
                    <img
                      src={service.image}
                      className="card-img-top"
                      alt={service.name}
                      style={{
                        borderTopLeftRadius: "15px",
                        borderTopRightRadius: "15px",
                      }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-wrap">{service.name}</h5>
                      <a href="#" className="btn btn-dark mt-auto">
                        Explore More
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No services available</p>
            )}
          </div>
        </section>

        {/* Products Section */}
        <section className="featuredproducts-section container">
          <div className="justify-content-between align-items-center">
            <h2 className="text-center ourservices-heading">
              Top Picks for Your Furry Friend 🐾
            </h2>
          </div>
          <p className="products-content text-center text-secondary">
            Explore our best-selling pet essentials, from nutritious treats to
            comfy beds—handpicked for your dog's happiness and well-being! 🐶✨
          </p>
          <div className="products-wrapper hide-scrollbar" ref={scrollRef}>
            {data.products.length > 0 ? (
              data.products.map((product) => (
                <div
                  className="p-2"
                  key={product.id}
                  style={{ flex: "0 0 auto", cursor: "pointer" }}
                  onClick={() =>
                    navigate(
                      `/shop/product/${encodeURIComponent(product.name)}`
                    )
                  }
                >
                  <div
                    className="card shadow-lg hover-shadow"
                    style={{
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      border: "none",
                      borderRadius: "15px",
                    }}
                  >
                    <img
                      src={product.image}
                      className="card-img-top"
                      alt={product.name}
                      style={{
                        borderTopLeftRadius: "15px",
                        borderTopRightRadius: "15px",
                      }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-wrap">
                        {product.name.length > 30
                          ? product.name.substring(0, 30) + "..."
                          : product.name}
                      </h5>
                      <p className="text-secondary">{product.category.name}</p>
                      <h5>₹{product.price}/-</h5>
                      <a href="#" className="btn btn-dark mt-3">
                        Add to Cart
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        </section>

        {/* Events Section */}
        <section className="upcomingevents-section container">
          <div className="justify-content-between align-items-center">
            <h2 className="text-center upcomingevents-heading">
              ✨ From Woofs to Wonders: Upcoming Happenings! 🏆
            </h2>
          </div>
          <p className="events-content text-center text-secondary">
            Get ready for tail-wagging fun, exciting activities, and
            unforgettable moments with your furry friends! 🐾🎉
          </p>
          <div className="events-wrapper hide-scrollbar">
            {data.events.length > 0 ? (
              data.events.map((event) => (
                <div
                  className="p-2"
                  key={event.id}
                  style={{ flex: "0 0 auto", cursor: "pointer" }}
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <div
                    className="card shadow-lg hover-shadow"
                    style={{
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      border: "none",
                      borderRadius: "15px",
                    }}
                  >
                    <img
                      src={event.image}
                      className="card-img-top"
                      alt={event.name}
                      style={{
                        borderTopLeftRadius: "15px",
                        borderTopRightRadius: "15px",
                      }}
                    />
                    <div className="card-body">
                      <div className="event-title">
                        <h5 className="card-title text-wrap text-bold">
                          {event.name}
                        </h5>
                      </div>
                      <p className="text-secondary mb-0">
                        <img src={calender} alt="Event Date" height={18} />
                        <span className="ms-2 text-bold">
                          {event.date
                            ? new Date(event.date).toLocaleDateString(
                                undefined,
                                date_format
                              )
                            : "N/A"}
                        </span>
                      </p>

                      <p className="text-secondary">
                        <img src={location_pin} alt="Event Date" height={18} />
                        <span className="ms-2 text-bold">
                          {event.address_line_1}
                        </span>
                      </p>
                      <div className="price-section d-flex justify-content-between align-items-center">
                        {event.price === 0 ? (
                          <p className="text-bold">Free</p>
                        ) : (
                          <p className="text-bold">₹{event.price}/-</p>
                        )}
                        <button className="btn btn-dark mb-4">
                          Buy Tickets
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No upcoming events</p>
            )}
          </div>
        </section>

        {/* Adoption Section */}
        <section className="adoption-section container">
          <div className="justify-content-between align-items-center">
            <h2 className="text-center adoption-heading">
              🐶 Find Your Furry Best Friend Today! 🏡❤️
            </h2>
          </div>
          <p className="adoption-content text-center text-secondary">
            Give a loving home to a dog in need! Browse our adoption listings
            and find your perfect match. 🐾💕
          </p>
          <div className="adoption-wrapper hide-scrollbar">
            {data.adoptions.length > 0 ? (
              data.adoptions.map((adoption) => (
                <div
                  className="p-2"
                  key={adoption.id}
                  style={{ flex: "0 0 auto" }}
                >
                  <div
                    className="card shadow-lg hover-shadow"
                    style={{
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      border: "none",
                      borderRadius: "15px",
                    }}
                  >
                    <img
                      src={adoption.image}
                      className="card-img-top"
                      alt={adoption.name}
                      style={{
                        borderTopLeftRadius: "15px",
                        borderTopRightRadius: "15px",
                        height: "350px",
                        objectFit: "fill",
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title text-wrap">
                        Hi, I am {adoption.name}
                      </h5>
                      <p className="p-0 m-0 text-secondary">
                        Age: {adoption.age} Year(s)
                      </p>
                      <p className="p-0 m-0 text-secondary">
                        Breed: {adoption.breed.name}
                      </p>
                      <p className="text-secondary">
                        {adoption.vaccinated_status}
                      </p>
                      <button className="btn btn-dark w-100">View More</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No adoptions available</p>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

export default Home;
