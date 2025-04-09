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

function EventDetails() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState([]);
  const [aboutEvent, setAboutEvent] = useState("");
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

  const words = aboutEvent.split(" ");
  const shortText = words.slice(0, 30).join(" ") + "...";
  const eventDurations = ["3 Hours", "5 Hours", "2 Hours"]; // Example data

  useEffect(() => {
    fetchEventDetails();
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

  const handlePayment = async () => {
    try {
      // Request order creation from backend
      const response = await api.post("/api/payments/order/", {
        event_id: id,
        amount: event.price, // Ensure event.price is defined
      });

      const { order_id, amount, currency } = response.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY, // Public Razorpay key
        amount,
        currency,
        name: "WoofWorld",
        description: event.name,
        order_id,
        handler: function (response) {
          alert(
            "Payment Successful! Payment ID: " + response.razorpay_payment_id
          );
          // TODO: Send payment success details to backend
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
    }
  };

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
                  <hr
                    className="border-0"
                    style={{ height: "1px", backgroundColor: "black" }}
                  />
                  <div className="d-flex align-items-center w-100">
                    <h5 className="text-bold mb-0 flex-grow-1 ms-2 text-start">
                      {event.price === 0 ? "Free" : `₹${event.price}/-`}
                    </h5>
                    <button
                      className="btn btn-dark"
                      onClick={handleBuyTickets}
                      disabled={isAddedToCart}
                    >
                      {isAddedToCart ? "Already Added to Cart" : "Buy Tickets"}
                    </button>
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

              {/* Frequently Asked Questions */}
              <section>
                <EventsFAQ />
              </section>
              <section>
                <EventsTC />
              </section>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default EventDetails;
