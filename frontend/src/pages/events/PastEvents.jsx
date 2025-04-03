import React, { useState, useEffect } from "react";
import api from "../../api";
import calender from "../../assets/images/icons/calendar.png";
import location_pin from "../../assets/images/icons/location.png";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "../../styles/UpcomingEvents.css";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";

function PastEvents() {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [addedToCartEvents, setAddedToCartEvents] = useState(new Set());
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const date_format = {
    month: "long", // "short" for abbreviated months
    day: "2-digit",
  };

  // Fetch events and cart data
  const fetchEvents = async () => {
    setIsLoadingEvents(true);

    try {
      const response = await api.get("/api/events/event/");
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Unexpected response format:", response.data);
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      const upcomingEvents = response.data
        .filter((event) => event.status && event.date < today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setAllEvents(upcomingEvents);

      // Fetch cart items and check which events are added
      const cartResponse = await api.get(`/api/cart/`);
      const cartEventIds = new Set(
        cartResponse.data
          .filter((item) => item.type === 2)
          .map((item) => item.item)
      );
      setAddedToCartEvents(cartEventIds);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");
        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          return fetchEvents(); // Retry after refreshing
        }
      } else {
        console.error("Failed to fetch events:", error);
      }
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Add event to cart and apply floating animation
  const handleBuyTickets = async (eventId) => {
    setIsButtonLoading(true); // Start floating animation

    try {
      await api.post("/api/cart/", {
        item: eventId,
        type: 2, // Event type
      });

      setAddedToCartEvents((prev) => new Set(prev).add(eventId)); // Update cart status
      setTimeout(() => {
        setIsButtonLoading(false); // Stop animation after a short delay
        navigate("/cart"); // Redirect to the cart page
      }, 1000);
    } catch (error) {
      console.error("Failed to add event to cart:", error);
      setIsButtonLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <div className="main-content">
        <Navbar />
        <div className="events">
          <div className="mt-4 events-wrapper hide-scrollbar d-flex flex-wrap justify-content-center container">
            {allEvents.length > 0 ? (
              allEvents.map((event) => (
                <div
                  className={`p-0 mt-2 event-card ${
                    new Date(event.date) < new Date() ? "grayscale" : ""
                  }`}
                  key={event.id}
                >
                  <div
                    className="card border-0 position-relative"
                    style={{ filter: "grayscale(100%)" }}
                  >
                    <img
                      src={`${BASE_URL}${event.image}`}
                      className="card-img-top"
                      alt={event.name}
                    />
                    {new Date(event.date) < new Date() && (
                      <span className="badge bg-secondary position-absolute top-0 end-0 m-2">
                        Past
                      </span>
                    )}
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
                        <img
                          src={location_pin}
                          alt="Event Location"
                          height={18}
                        />
                        <span className="ms-2 text-bold">
                          {event.address_line_1}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading events...</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default PastEvents;
