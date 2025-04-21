import React, { useState, useEffect, useRef } from "react";
import api from "../../api";
import calender from "../../assets/images/icons/calendar.png";
import location_pin from "../../assets/images/icons/location.png";
import "../../styles/EventDetails.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import logo from "../../assets/images/logo/logo1.png";
import tag from "../../assets/images/icons/tag.png";
import timer from "../../assets/images/icons/timer.png";
import ticket from "../../assets/images/icons/ticket.png";
import kid from "../../assets/images/icons/kid.png";
import LoadingScreen from "../../components/LoadingScreen";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import EventsFAQ from "../../components/common/events/Faq";
import EventsTC from "../../components/common/events/Terms&Conditions";
import { ACCESS_TOKEN } from "../../constants";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";

function PastEventDetails() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [eventGallery, setEventGallery] = useState(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState([]);
  const [aboutEvent, setAboutEvent] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const date_format = {
    month: "long", // "short" for abbreviated months
    day: "2-digit",
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/api/events/${id}/`);
      setEvent(response.data);
      setAboutEvent(response.data.description);

      // Fetch cart items
      const cartResponse = await api.get(`/api/cart/`);
      console.log("Cart Items:", cartResponse.data); // Check cart items

      // Convert event ID to number and check if it's in the cart
      const isAddedToCart = cartResponse.data.some(
        (item) => item.item === Number(id) && item.type === 2
      );

      setIsAddedToCart(isAddedToCart);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");
        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          return fetchEventDetails(); // Retry after refreshing
        }
      } else {
        console.error("Failed to fetch event data:", error);
      }
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const fetchEventImages = async () => {
    try {
      const response = await api.get(`/api/events/past-event-images/${id}/`);
      setEventGallery(response.data);
      console.log("Event Gallery:", response.data); // Check event gallery
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");
        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          return fetchEventDetails(); // Retry after refreshing
        }
      } else {
        console.error("Failed to fetch event data:", error);
      }
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const words = aboutEvent.split(" ");
  const shortText = words.slice(0, 30).join(" ") + "...";
  const eventDurations = ["3 Hours", "5 Hours", "2 Hours"]; // Example data

  useEffect(() => {
    fetchEventDetails();
    fetchEventImages();
  }, []);

  // if (
  //   isLoadingHero &&
  //   isLoadingEvents &&
  //   isLoadingNavbarItems &&
  //   isLoadingPartnerCompany &&
  //   isLoadingNavbarItems &&
  //   isLoadingProducts &&
  //   isLoadingAdoption
  // )
  //   return <LoadingScreen />;

  const handleAddToCart = async (e) => {
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("type", 2);
    formData.append("item", event.id);

    try {
      await api.post(`/api/cart/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Cart Added Successfully!");

      navigate("/cart");
    } catch (error) {
      if (error.response && error.response.data.image) {
        setError(error.response.data.image[0]); // Display the error message
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTickets = () => {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      localStorage.setItem("redirectAfterLogin", location.pathname);
      navigate("/login");
    } else {
      handleAddToCart();
      // handlePayment();
    }
  };

  if (!event) return <p>No event found.</p>;
  return (
    <div>
      <div className="main-content">
        <Navbar />
        <div className="container mt-5 mb-5">
          <div className="row g-4">
            <div className="col-md-8">
              <img
                src={event.image}
                alt="Event Image"
                className="img-fluid rounded"
                style={{ height: "500px", width: "100%" }}
              />
            </div>
            <div className="col-md-4">
              <div className="card shadow">
                <div className="card-body">
                  <h5 className="card-title text-bold">{event.name} </h5>
                  <div className="card-content mt-4">
                    <p className="card-text">
                      <img
                        src={tag}
                        alt="Category"
                        height={20}
                        className="me-2"
                      />
                      {event.category.name}
                    </p>
                    <p className="card-text">
                      <img
                        src={calender}
                        alt="Calender"
                        height={20}
                        className="me-2"
                      />
                      {new Date(event.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                      })}{" "}
                      | {event.time}
                    </p>
                    <p className="card-text">
                      <img
                        src={location_pin}
                        alt="Location"
                        height={20}
                        className="me-2"
                      />{" "}
                      {event.address_line_1}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <h4 className="text-bold mt-5">About the Event</h4>
              <p>{isExpanded ? aboutEvent : shortText}</p>
              <button
                className="btn btn-link text-dark p-0"
                style={{ textDecoration: "none" }}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    Read Less <FaAngleUp />
                  </>
                ) : (
                  <>
                    Read More <FaAngleDown />
                  </>
                )}
              </button>
              <hr
                className="border-0"
                style={{ height: "1px", backgroundColor: "#808080" }}
              />

              {/* Event Guide */}
              <section>
                <h5 className="text-bold">Event Guide</h5>
                <div className="event-cards-container">
                  <div className="event-card">
                    <div className="image-container">
                      <img src={timer} alt="Event Duration" />
                    </div>
                    <div className="text-container">
                      <p className="label">Duration</p>
                      <p className="value">{event.duration}</p>
                    </div>
                  </div>

                  <div className="event-card">
                    <div className="image-container">
                      <img src={ticket} alt="Event Duration" />
                    </div>
                    <div className="text-container">
                      <p className="label">Tickets needed for</p>
                      <p className="value">2 years & above</p>
                    </div>
                  </div>

                  <div className="event-card">
                    <div className="image-container">
                      <img src={kid} alt="Event Duration" />
                    </div>
                    <div className="text-container">
                      <p className="label">Kids friendly?</p>
                      <p className="value">Yes</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Venue Section */}
              <section>
                <h4 className="text-bold mt-4">Venue</h4>
                <div className="location-card">
                  <div className="location-info">
                    <h3>{event.address_line_1}</h3>
                    <p>{event.address_line_2}</p>
                  </div>

                  {event.maps_link && (
                    <a
                      className="get-directions text-dark"
                      style={{ textDecoration: "none" }}
                      href={event.maps_link}
                      target="_blank"
                    >
                      <i className="fa-solid fa-location-dot"></i> GET
                      DIRECTIONS
                    </a>
                  )}
                </div>
              </section>
            </div>
            {/* Image Gallery */}
            <section>
              <h4 className="text-bold mt-4">Event Gallery</h4>
              <div className="image-gallery d-flex flex-wrap justify-content-center">
                {eventGallery?.length > 0 ? (
                  eventGallery.map((image) => (
                    <div
                      className="gallery-item m-2"
                      key={image.id}
                      onClick={() => setSelectedImage(image.image)}
                    >
                      <img
                        src={image.image}
                        className="gallery-image"
                        alt={image.name}
                        style={{
                          objectFit: "cover",
                          width: image.isVertical ? "200px" : "300px",
                          height: "200px",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <p>No images found.</p>
                )}
              </div>
            </section>

            {/* Modal for Image Preview */}
            {selectedImage && (
              <div
                className="image-modal"
                onClick={() => setSelectedImage(null)}
              >
                <div className="modal-content">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    style={{
                      height: "100vh",
                      margin: "auto",
                      objectFit: "contain",
                      maxWidth: "100%",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              </div>
            )}

            <style>
              {`
                  .image-gallery {
                    gap: 10px;
                  }
                  .gallery-item {
                    transition: transform 0.3s ease;
                  }
                  .gallery-item:hover {
                    transform: scale(1.05);
                  }
                  .image-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                  }
                  .modal-content img {
                    border-radius: 10px;
                  }
                `}
            </style>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default PastEventDetails;
