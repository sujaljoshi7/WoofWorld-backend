import React from "react";

const Adoptions = ({ adoptions, BASE_URL }) => {
  return (
    <section className="adoptions-section">
      <div className="section-header">
        <h2 className="section-title">Adopt a Furry Friend</h2>
        <div className="section-divider"></div>
        <p className="section-subtitle">
          Give a loving home to these adorable dogs waiting for their forever
          family
        </p>
      </div>

      <div className="adoptions-container">
        <div className="adoptions-grid">
          {adoptions.length > 0 ? (
            adoptions.map((dog) => (
              <div className="adoption-card" key={dog.id}>
                <div className="adoption-image-container">
                  <img
                    src={`${BASE_URL}${dog.image}`}
                    className="adoption-image"
                    alt={dog.name}
                    loading="lazy"
                  />
                  <div className="adoption-status">
                    <span
                      className={`status-badge ${
                        dog.vaccinated_status === "Fully Vaccinated"
                          ? "vaccinated"
                          : "not-vaccinated"
                      }`}
                    >
                      {dog.vaccinated_status}
                    </span>
                  </div>
                </div>
                <div className="adoption-content">
                  <h3 className="adoption-title">{dog.name}</h3>
                  <div className="adoption-details">
                    <div className="adoption-info">
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
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2"></path>
                      </svg>
                      <span>{dog.age} years old</span>
                    </div>
                    <div className="adoption-info">
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
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>{dog.breed?.name || "Unknown Breed"}</span>
                    </div>
                  </div>
                  <button className="adopt-button">
                    <span>View Details</span>
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
            ))
          ) : (
            <p className="no-adoptions">No dogs available for adoption</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .adoptions-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, #ffffff 0%, #f6f9fc 100%);
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

        .adoptions-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .adoptions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .adoption-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .adoption-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
        }

        .adoption-image-container {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .adoption-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .adoption-card:hover .adoption-image {
          transform: scale(1.1);
        }

        .adoption-status {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
          backdrop-filter: blur(4px);
        }

        .status-badge.vaccinated {
          background: rgba(16, 185, 129, 0.9);
          color: white;
        }

        .status-badge.not-vaccinated {
          background: rgba(239, 68, 68, 0.9);
          color: white;
        }

        .adoption-content {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .adoption-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .adoption-details {
          margin-bottom: 1.5rem;
        }

        .adoption-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4a5568;
          margin-bottom: 0.5rem;
        }

        .adoption-info svg {
          color: #3b82f6;
        }

        .adopt-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.25rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: auto;
        }

        .adopt-button:hover {
          background: linear-gradient(90deg, #2563eb, #7c3aed);
          transform: translateX(5px);
        }

        .adopt-button svg {
          transition: transform 0.3s ease;
        }

        .adopt-button:hover svg {
          transform: translateX(3px);
        }

        .no-adoptions {
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

          .adoptions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Adoptions;
