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

function UpcomingEvents() {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [addedToCartEvents, setAddedToCartEvents] = useState(new Set());
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all"); // "all", "free", or "paid"
  const [fadeOut, setFadeOut] = useState(false);
  const [sortOrder, setSortOrder] = useState("date"); // "date" (default) or "price-asc"
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
        .filter((event) => event.status && event.date > today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setAllEvents(upcomingEvents);
      setDisplayedEvents(upcomingEvents); // Initialize displayed events with all events

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
    }
  };

  // Apply both filtering and sorting to events
  const applyFiltersAndSort = (
    filterValue = priceFilter,
    orderValue = sortOrder
  ) => {
    // First, filter the events based on price
    let filteredEvents = [...allEvents];
    if (filterValue === "free") {
      filteredEvents = allEvents.filter((event) => event.price === 0);
    } else if (filterValue === "paid") {
      filteredEvents = allEvents.filter((event) => event.price > 0);
    }

    // Then, sort the filtered events
    if (orderValue === "price-asc") {
      filteredEvents.sort((a, b) => a.price - b.price);
    } else if (orderValue === "price-desc") {
      filteredEvents.sort((a, b) => b.price - a.price);
    } else if (orderValue === "date") {
      filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setDisplayedEvents(filteredEvents);
  };

  // Handle price filter change
  const handlePriceFilterChange = (e) => {
    const filterValue = e.target.value;
    setPriceFilter(filterValue);
    applyFiltersAndSort(filterValue, sortOrder);
  };

  // Handle sort order change
  const handleSortChange = (e) => {
    const orderValue = e.target.value;
    setSortOrder(orderValue);
    applyFiltersAndSort(priceFilter, orderValue);
  };

  // Add event to cart and apply floating animation
  const handleBuyTickets = async (eventId, e) => {
    e.stopPropagation(); // Prevent navigation to event details
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

  useEffect(() => {
    if (!isLoadingEvents) {
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setIsLoadingEvents(false), 500); // Wait for fade-out to finish
      }, 3000);
    }
  }, [isLoadingEvents]);

  if (isLoadingEvents) return <LoadingScreen fadeOut={fadeOut} />;

  return (
    <div>
      <div className="main-content">
        <Navbar />
        <div className="events">
          <div className="container mt-4">
            <div className="d-flex justify-content-end mb-4">
              <div className="d-flex gap-3">
                <div className="form-group">
                  <select
                    className="form-select form-select-sm"
                    value={priceFilter}
                    onChange={handlePriceFilterChange}
                    aria-label="Filter by price"
                    style={{
                      width: "auto",
                      minWidth: "120px",
                      paddingRight: "2rem",
                    }}
                  >
                    <option value="all">All Events</option>
                    <option value="free">Free Events</option>
                    <option value="paid">Paid Events</option>
                  </select>
                </div>

                <div className="form-group">
                  <select
                    className="form-select form-select-sm"
                    value={sortOrder}
                    onChange={handleSortChange}
                    aria-label="Sort events"
                    style={{
                      width: "auto",
                      minWidth: "150px",
                      paddingRight: "2rem",
                    }}
                  >
                    <option value="date">Sort by Date</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="events-wrapper hide-scrollbar d-flex flex-wrap justify-content-center">
              {isLoadingEvents ? (
                <p>Loading events...</p>
              ) : displayedEvents.length > 0 ? (
                displayedEvents.map((event) => (
                  <div
                    className="p-0 mt-2 event-card"
                    key={event.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <div className="card border-0">
                      <img
                        src={event.image}
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
                          <img
                            src={location_pin}
                            alt="Event Location"
                            height={18}
                          />
                          <span className="ms-2 text-bold">
                            {event.address_line_1}
                          </span>
                        </p>

                        <div className="price-section d-flex justify-content-between pt-3">
                          {event.price === 0 ? (
                            <p className="text-bold">Free</p>
                          ) : (
                            <p className="text-bold">₹{event.price}/-</p>
                          )}
                          <button
                            className={`btn btn-dark mb-4 ${
                              isButtonLoading ? "float" : ""
                            }`}
                            onClick={(e) => handleBuyTickets(event.id, e)}
                            disabled={
                              addedToCartEvents.has(event.id) || isButtonLoading
                            }
                          >
                            {addedToCartEvents.has(event.id)
                              ? "Already Added to Cart"
                              : "Buy Tickets"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">
                  No events found matching your filter.
                </p>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default UpcomingEvents;
