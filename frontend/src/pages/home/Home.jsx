import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import api from "../../api";
import { motion } from "framer-motion";
import "../../styles/Home.css";
import { useLocation } from "react-router-dom";

import logo from "../../assets/images/logo/logo1.png";
import down_arrow from "../../assets/images/icons/down-arrow.png";
import image1 from "../../assets/images/hero/image1.jpg";
import team_work from "../../assets/images/about/team-work.jpg";
import LoadingScreen from "../../components/LoadingScreen";
import Navbar from "../../components/common/Navbar";

function Home() {
  const [user, setUser] = useState(null);
  const [allHeros, setAllHeros] = useState([]);
  const [allPartnerCompanies, setAllPartnerCompanies] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [allAdoptions, setAllAdoptions] = useState([]);
  const [allNavbarItems, setAllNavbarItems] = useState([]);
  const [isLoadingHero, setIsLoadingHero] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState([]);
  const [isLoadingPartnerCompany, setIsLoadingPartnerCompany] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState([]);
  const [isLoadingAdoption, setIsLoadingAdoption] = useState([]);
  const [isLoadingNavbarItems, setIsLoadingNavbarItems] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const location = useLocation(); // Get current path
  const servicesRef = useRef(null);

  const fetchHero = async () => {
    setIsLoadingHero(true);
    try {
      // Fetch user details independently
      const response = await api.get("/api/homepage/hero/");
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Unexpected response format:", response.data);
        return;
      }

      const heroes = response.data.filter((hero) => hero.status === 1);

      // Wait for both requests to complete independently
      // const [hero] = await Promise.all([heroRes]);

      // Update state
      setAllHeros(heroes);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoadingHero(false);
    }
  };

  const fetchPartnerCompany = async () => {
    setIsLoadingPartnerCompany(true);
    try {
      // Fetch user details independently
      const response = await api.get("/api/homepage/partnercompany/");
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Unexpected response format:", response.data);
        return;
      }
      const partnerCompanies = response.data
        .filter((company) => company.status === 1)
        .map((company) => company);

      // Wait for both requests to complete independently
      // const [hero] = await Promise.all([heroRes]);

      // Update state
      setAllPartnerCompanies(partnerCompanies);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoadingPartnerCompany(false);
    }
  };

  const fetchNavbarItems = async () => {
    setIsLoadingNavbarItems(true);
    try {
      const response = await api.get("/api/navbar/");
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Unexpected response format:", response.data);
        return;
      }
      const navbarItems = response.data.filter(
        (navItem) => navItem.status === 1
      );

      // Process the data to create nested structure
      const structuredNavbar = processNavbarData(navbarItems);

      setAllNavbarItems(structuredNavbar);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoadingNavbarItems(false);
    }
  };

  const processNavbarData = (items) => {
    const menu = [];
    const itemMap = {};

    // Pehle sab items ko ek object ke andar store karo
    items.forEach((item) => {
      itemMap[item.id] = { ...item, subItems: [] };
    });

    // Ab parent-child relation create karo
    items.forEach((item) => {
      if (item.dropdown_parent) {
        if (itemMap[item.dropdown_parent]) {
          itemMap[item.dropdown_parent].subItems.push(itemMap[item.id]);
        }
      } else {
        menu.push(itemMap[item.id]); // Ye parent hai, direct menu me daal do
      }
    });

    return menu;
  };

  const fetchServices = async () => {
    setIsLoadingServices(true);

    try {
      // Fetch user details independently
      const response = await api.get("/api/services/");
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Unexpected response format:", response.data);
        return;
      }

      const services = response.data.filter(
        (service) => service.show_on_homepage && service.status === 1
      );

      // Wait for both requests to complete independently
      // const [hero] = await Promise.all([heroRes]);

      // Update state
      setAllServices(services);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true);

    try {
      // Fetch user details independently
      const response = await api.get("/api/products/");
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Unexpected response format:", response.data);
        return;
      }

      const products = response.data.filter(
        (product) => product.show_on_homepage && product.status === 1
      );

      // Wait for both requests to complete independently
      // const [hero] = await Promise.all([heroRes]);

      // Update state
      setAllProducts(products);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchEvents = async () => {
    setIsLoadingEvents(true);

    try {
      // Fetch user details independently
      const response = await api.get("/api/events/event/");
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Unexpected response format:", response.data);
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      const upcomingEvents = response.data.filter(
        (event) => event.status && event.date >= today // Only future or ongoing events
      );

      // Wait for both requests to complete independently
      // const [hero] = await Promise.all([heroRes]);

      // Update state
      setAllEvents(upcomingEvents);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const fetchAdoptions = async () => {
    setIsLoadingEvents(true);

    try {
      // Fetch user details independently
      const response = await api.get("/api/adoption/");
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Unexpected response format:", response.data);
        return;
      }

      const adoptions = response.data.filter(
        (adoption) => adoption.status // Only future or ongoing events
      );

      // Wait for both requests to complete independently
      // const [hero] = await Promise.all([heroRes]);

      // Update state
      setAllAdoptions(adoptions);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoadingEvents(false);
    }
  };
  useEffect(() => {
    fetchHero();
    fetchPartnerCompany();
    fetchNavbarItems();
    fetchServices();
    fetchProducts();
    fetchEvents();
    fetchAdoptions();
  }, []);

  const scrollLeft = () => {
    if (servicesRef.current) {
      servicesRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (servicesRef.current) {
      servicesRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (isLoadingHero) return <LoadingScreen />;
  return (
    <div>
      <div className="main-content">
        <div className="container">
          <Navbar />
        </div>
        <section className="hero">
          <div
            id="carouselExampleAutoplaying"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="5000"
          >
            <div className="carousel-inner">
              {allHeros.length > 0 ? (
                allHeros.map((hero, index) => (
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
                      <div className="black-overlay"></div>
                      <img
                        src={`${BASE_URL}${hero.image}`}
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

            {/* Carousel Controls (Optional) */}
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

        <section className="partner-companies">
          <h4 className="text-center">Trusted by great companies</h4>
          <div className="overflow-hidden bg-gray-100 py-4 relative w-full mt-3">
            <div className="scrolling-wrapper">
              <div className="logos">
                {/* Rendered twice for seamless looping */}
                {[...allPartnerCompanies, ...allPartnerCompanies].map(
                  (company, index) => (
                    <img
                      key={index}
                      title={company.name}
                      src={`${BASE_URL}${company.image}`}
                      alt="Company Logo"
                      className="logo"
                    />
                  )
                )}
              </div>
            </div>
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
          <div className="services-wrapper">
            {allServices.length > 0 ? (
              allServices.map((service) => (
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
                      <a href="#" className="btn btn-primary mt-auto">
                        Explore More
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading service content...</p>
            )}
          </div>
        </section>

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
          <div className="products-wrapper">
            {allProducts.length > 0 ? (
              allProducts.map((product) => (
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
                    <div className="card-body">
                      <h3 className="card-title text-wrap">{product.name}</h3>
                      <p className="card-text text-wrap text-secondary">
                        {product.description.split(" ").slice(0, 10).join(" ") +
                          (product.description.split(" ").length > 50
                            ? "..."
                            : "")}
                      </p>
                      <h5 className="card-title">₹{product.price}/-</h5>
                      <a href="#" className="btn btn-primary">
                        Add to Cart
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading service content...</p>
            )}
          </div>
        </section>

        <section className="adoption-section container">
          <div className="justify-content-between align-items-center">
            <h2 className="text-center upcomingevents-heading">
              ✨ From Woofs to Wonders: Upcoming Happenings! 🏆
            </h2>
          </div>
          <p className="events-content text-center text-secondary">
            Get ready for tail-wagging fun, exciting activities, and
            unforgettable moments with your furry friends! 🐾🎉
          </p>
          <div className="events-wrapper">
            {allEvents.length > 0 ? (
              allEvents.map((event) => (
                <div
                  className="p-2"
                  key={event.id}
                  style={{ flex: "0 0 auto" }}
                >
                  <div className="card">
                    <img
                      src={`${BASE_URL}${event.image}`}
                      className="card-img-top"
                      alt={event.name}
                    />
                    <div className="card-body">
                      <h3 className="card-title text-wrap">{event.name}</h3>
                      <p className="card-text text-wrap text-secondary">
                        {event.description.split(" ").slice(0, 10).join(" ") +
                          (event.description.split(" ").length > 50
                            ? "..."
                            : "")}
                      </p>
                      <a href="#" className="btn btn-primary">
                        Buy Tickets
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading service content...</p>
            )}
          </div>
        </section>

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
          <div className="adoption-wrapper">
            {allAdoptions.length > 0 ? (
              allAdoptions.map((adoption) => (
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
                      <h3 className="card-title text-wrap">{adoption.name}</h3>
                      <p className="p-0 m-0">Age: {adoption.age}</p>
                      <p>Year(s) Breed: {adoption.breed.name}</p>
                      <p className="bg-warning text-wrap p-1 rounded">
                        {adoption.personality}
                      </p>
                      <a href="#" className="btn btn-primary">
                        View More
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading service content...</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

const DashboardCard = ({ title, count, image }) => (
  <div className="col-3">
    <div className="card bg-dark" style={{ maxWidth: "250px", margin: "10px" }}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h6 className="card-title text-secondary fs-6 fw-light">{title}</h6>
          <h6 className="card-text fw-semibold text-light fs-2">{count}</h6>
        </div>
        <img
          src={image}
          alt={title}
          className="rounded-circle"
          style={{ width: "50px", height: "50px" }}
        />
      </div>
    </div>
  </div>
);

export default Home;
