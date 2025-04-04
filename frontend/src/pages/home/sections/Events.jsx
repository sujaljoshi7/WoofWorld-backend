import React from "react";

const Events = ({ events, BASE_URL, navigate, date_format }) => {
  return (
    <section className="events-section">
      <div className="section-header">
        <h2 className="section-title">Upcoming Events</h2>
        <div className="section-divider"></div>
        <p className="section-subtitle">
          Join us for exciting pet-friendly events and create unforgettable
          memories
        </p>
      </div>

      <div className="events-container">
        <div className="events-grid">
          {events.length > 0 ? (
            events.map((event) => (
              <div className="event-card" key={event.id}>
                <div className="event-image-container">
                  <img
                    src={`${BASE_URL}${event.image}`}
                    className="event-image"
                    alt={event.name}
                    loading="lazy"
                  />
                  <div className="event-date">
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
                    <span>
                      {new Date(event.date).toLocaleDateString(
                        "en-US",
                        date_format
                      )}
                    </span>
                  </div>
                </div>
                <div className="event-content">
                  <h3 className="event-title">{event.name}</h3>
                  <div className="event-details">
                    <div className="event-info">
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
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="event-footer">
                    <span className="event-price">₹{event.price}</span>
                    <button
                      className="buy-tickets-button"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      <span>Buy Tickets</span>
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
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-events">No events available</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .events-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%);
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
        }

        .section-divider {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
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

        .events-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .event-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .event-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
        }

        .event-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .event-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .event-card:hover .event-image {
          transform: scale(1.1);
        }

        .event-date {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(255, 255, 255, 0.9);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #3b82f6;
        }

        .event-content {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .event-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .event-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4a5568;
          font-size: 0.95rem;
        }

        .event-info svg {
          color: #3b82f6;
        }

        .event-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }

        .event-price {
          font-weight: 600;
          color: #3b82f6;
        }

        .buy-tickets-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.25rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .buy-tickets-button:hover {
          background: linear-gradient(90deg, #2563eb, #7c3aed);
          transform: translateY(-3px);
        }

        .buy-tickets-button svg {
          transition: transform 0.3s ease;
        }

        .buy-tickets-button:hover svg {
          transform: translateX(3px);
        }

        .no-events {
          text-align: center;
          color: #718096;
          font-style: italic;
          grid-column: 1 / -1;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }

          .events-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Events;
