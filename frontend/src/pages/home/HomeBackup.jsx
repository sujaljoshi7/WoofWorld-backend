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
  const Counter = ({ title, target }) => {
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
      <div className="flex flex-col items-center bg-white shadow-md p-4 rounded-lg w-1/4">
        <h2 className="text-3xl font-bold text-blue-600">{count}+</h2>
        <p className="text-gray-600">{title}</p>
      </div>
    );
  };

  // Check if all data is still loading
  const isLoading = Object.values(loading).some((status) => status);

  if (isLoading) return <LoadingScreen />;

  return (
    <div>
      <div className="main-content">
        <Navbar />

        {/* Hero Section */}
        <section className="hero">
          <div
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
                        <button className="btn hero-btn btn-dark">
                          {hero.cta}
                        </button>
                      </div>
                      <div className="black-overlay"></div>
                      <img
                        src={`${BASE_URL}${hero.image}`}
                        alt={`Hero ${index + 1}`}
                        className="hero-image"
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

        {/* Partner Companies Section */}
        <section className="partner-companies">
          <h4 className="text-center">Trusted by great companies</h4>
          <div className="overflow-hidden bg-gray-100 py-4 relative w-full mt-3">
            <div className="scrolling-wrapper">
              <div className="logos">
                {data.partnerCompanies.length > 0 ? (
                  [...data.partnerCompanies, ...data.partnerCompanies].map(
                    (company, index) => (
                      <img
                        key={index}
                        title={company.name}
                        src={`${BASE_URL}${company.image}`}
                        alt="Company Logo"
                        className="logo"
                      />
                    )
                  )
                ) : (
                  <p>No partner companies available</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Counters Section */}
        <section>
          <div ref={sectionRef} className="counter-container text-center">
            <Counter title="Total Events" target={staticData.totalEvents} />
            <Counter title="Total Services" target={staticData.totalServices} />
            <Counter title="Happy Clients" target={staticData.happyClients} />
            <Counter title="Adopted Dogs" target={staticData.adoptedDogs} />
          </div>
        </section>

        <style>
          {`
            .scrolling-wrapper {
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              position: relative;
            }

            .logos {
              display: flex;
              gap: 150px;
              animation: scroll 30s linear infinite;
            }

            .logo {
              height: 100px;
              width: auto;
            }

            @keyframes scroll {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }
          `}
        </style>

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
                  <div className="card">
                    <img
                      src={`${BASE_URL}${service.image}`}
                      className="card-img-top"
                      alt={service.name}
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
                  style={{ flex: "0 0 auto" }}
                >
                  <div className="card">
                    <img
                      src={`${BASE_URL}${product.image}`}
                      className="card-img-top"
                      alt={product.name}
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
                  <div className="card">
                    <img
                      src={`${BASE_URL}${event.image}`}
                      className="card-img-top"
                      alt={event.name}
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
                  <div className="card">
                    <img
                      src={`${BASE_URL}${adoption.image}`}
                      className="card-img-top"
                      alt={adoption.name}
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
