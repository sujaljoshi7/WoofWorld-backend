import React, { useState, useEffect } from "react";
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import api from "../../api";
import { motion } from "framer-motion";
import "../../styles/Home.css";
import logo from "../../assets/images/logo/logo1.png";
import down_arrow from "../../assets/images/icons/down-arrow.png";
import image1 from "../../assets/images/hero/image1.jpg";
import image2 from "../../assets/images/hero/image2.jpg";
import image3 from "../../assets/images/hero/image3.jpg";
import company1 from "../../assets/images/companies/company1.png";
import company2 from "../../assets/images/companies/company2.png";
import company3 from "../../assets/images/companies/company3.png";
import company4 from "../../assets/images/companies/company4.png";
import company5 from "../../assets/images/companies/company5.png";
import company6 from "../../assets/images/companies/company6.png";
import team_work from "../../assets/images/about/team-work.jpg";
import LoadingScreen from "../../components/LoadingScreen";

function Home() {
  const [user, setUser] = useState(null);
  const [allHeros, setAllHeros] = useState([]);
  const [isLoadingHero, setIsLoadingHero] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL;
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
      console.log("Filtered Heroes:", heroes);

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
  useEffect(() => {
    fetchHero();
  }, []);
  const logos = [company1, company2, company3, company4, company5, company6];
  if (isLoadingHero) return <LoadingScreen />;
  return (
    <div>
      <div className="main-content">
        <div className="container">
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
              {/* Logo on the left */}
              <a className="navbar-brand" href="#">
                <img src={logo} alt="Logo" height={40} />
              </a>

              {/* Hamburger Menu (Opens Offcanvas) */}
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#mobileNavbar"
                aria-controls="mobileNavbar"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              {/* Desktop Navbar */}
              <div
                className="collapse navbar-collapse justify-content-center text-center"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <a className="nav-link active" href="#">
                      Home
                    </a>
                  </li>

                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      Events
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          Upcoming Events
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Past Events
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Webinars
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Blog
                    </a>
                  </li>

                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      Services
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          Web Development
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          AI/ML Solutions
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          SaaS Products
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      About
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      Contact us
                    </a>
                  </li>
                </ul>
              </div>

              {/* Sign In button (Desktop View) */}
              <div className="d-none d-lg-block position-absolute top- end-0">
                <button className="btn btn-primary">Sign In</button>
              </div>
              {/* Mobile Fullscreen Menu (Offcanvas) */}
              <div
                className="offcanvas offcanvas-end d-lg-none"
                tabIndex="-1"
                id="mobileNavbar"
              >
                <div className="offcanvas-header">
                  {/* <h5 className="offcanvas-title">Menu</h5> */}
                  <a className="navbar-brand" href="#">
                    <img src={logo} alt="Logo" height={40} />
                  </a>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="offcanvas-body d-flex flex-column align-items-start w-100">
                  <ul className="navbar-nav text-start">
                    <li className="nav-item">
                      <a className="nav-link active" href="#">
                        Home
                      </a>
                    </li>

                    <hr className="m-0" />
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle d-flex align-items-center justify-content-between"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Events
                        <img
                          src={down_arrow}
                          alt="Down Arrow"
                          className="dropdown-icon"
                        />
                      </a>
                      <ul className="dropdown-menu mb-2">
                        <li>
                          <a className="dropdown-item" href="#">
                            Upcoming Events
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Past Events
                          </a>
                        </li>
                        <li></li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Webinars
                          </a>
                        </li>
                      </ul>
                    </li>

                    <hr className="m-0" />
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        Blog
                      </a>
                    </li>

                    <hr className="m-0" />
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle d-flex align-items-center justify-content-between"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Services
                        <img
                          src={down_arrow}
                          alt="Down Arrow"
                          className="dropdown-icon"
                        />
                      </a>
                      <ul className="dropdown-menu mb-2">
                        <li>
                          <a className="dropdown-item" href="#">
                            Web Development
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            AI/ML Solutions
                          </a>
                        </li>
                        <li></li>
                        <li>
                          <a className="dropdown-item" href="#">
                            SaaS Products
                          </a>
                        </li>
                      </ul>
                    </li>

                    <hr className="m-0" />
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        About
                      </a>
                    </li>

                    <hr className="m-0" />
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        Contact Us
                      </a>
                    </li>

                    <hr className="m-0" />
                  </ul>

                  {/* Sign In button (Inside Fullscreen Menu) */}
                  <button className="btn btn-primary mt-3">Sign In</button>
                </div>
              </div>
            </div>
          </nav>
        </div>
        <section className="hero">
          <div
            id="carouselExampleAutoplaying"
            className="carousel slide"
            data-bs-ride="carousel"
            data-bs-interval="2000"
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
            <motion.div
              className="flex items-center w-max"
              animate={{ x: ["0%", "-100%"] }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              style={{
                whiteSpace: "nowrap",
                display: "flex",
                gap: "150px",
                height: "45px",
              }}
            >
              {[...logos, ...logos].map((logo, index) => (
                <img
                  key={index}
                  src={logo}
                  alt="Company Logo"
                  className="h-10 w-auto"
                />
              ))}
            </motion.div>
          </div>
        </section>
        <section className="aboutus-section container">
          {/* <h2 className="aboutus-heading text-center">Who We Are</h2> */}
          <div className="row aboutus-content d-flex align-items-center">
            <div className="col-lg-6">
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "400px" }}
              >
                <svg
                  width="500"
                  height="500"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <clipPath id="blobClip">
                      <path
                        fill="#FF0066"
                        d="M28.8,-51.5C39.3,-43.9,51.1,-40.1,60.5,-32.2C70,-24.2,77,-12.1,78.3,0.8C79.6,13.6,75.2,27.2,68.6,40.1C62.1,53,53.4,65.2,41.6,73.8C29.8,82.5,14.9,87.6,2,84.1C-10.8,80.6,-21.7,68.5,-31.8,58.8C-41.9,49.2,-51.3,42.1,-61.5,32.7C-71.7,23.3,-82.8,11.7,-83.5,-0.4C-84.3,-12.5,-74.6,-25,-67,-38.9C-59.3,-52.7,-53.7,-68,-42.9,-75.4C-32,-82.8,-16,-82.4,-3.4,-76.5C9.2,-70.6,18.4,-59.1,28.8,-51.5Z"
                        transform="translate(100 100)"
                      />
                    </clipPath>
                  </defs>

                  <image
                    href={team_work}
                    width="300"
                    className="aboutus-image"
                    clipPath="url(#blobClip)"
                  />
                </svg>
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className="aboutus-header">
                Innovating the Future with Technology
              </h2>
              <p className="aboutus-content">
                Transforming businesses with cutting-edge technology! At
                TechVerse, we specialize in designing and developing
                next-generation software solutions tailored to your unique
                needs. Whether you require AI-driven innovations, scalable cloud
                computing solutions, or advanced web and mobile applications,
                our expert team is committed to bringing your vision to life.
                With a passion for technology and a focus on excellence, we help
                businesses stay ahead in the digital era. Partner with us to
                build intelligent, scalable, and future-ready solutions that
                drive success and innovation.
              </p>
              <button className="aboutus-cta">Explore</button>
            </div>
          </div>
        </section>
        <section className="ourservices-section container">
          <h2 className="text-center ourservices-heading">Our Services</h2>
          <p className="ourservices-content text-justify">
            We provide innovative and scalable technology solutions designed to
            enhance efficiency, optimize operations, and drive sustainable
            business growth. Our expertise spans custom software development,
            cloud computing, AI, IoT, and cybersecurity, ensuring businesses
            stay ahead in the digital era. 🚀
          </p>
          <div className="services-cards">
            <div className="card" style={{ width: "350px" }}>
              <img src={image1} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <a href="#" className="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
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
