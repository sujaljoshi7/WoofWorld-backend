import React from 'react';

const Services = ({ services, BASE_URL }) => {
  return (
    <section className="services-section">
      <div className="section-header">
        <h2 className="section-title">Expert Care for Your Pet</h2>
        <div className="section-divider"></div>
        <p className="section-subtitle">
          Discover our comprehensive range of services designed to keep your furry friend happy, healthy, and thriving
        </p>
      </div>
      
      <div className="services-container">
        <div className="services-grid">
          {services.length > 0 ? (
            services.map((service) => (
              <div className="service-card" key={service.id}>
                <div className="service-image-container">
                  <img
                    src={`${BASE_URL}${service.image}`}
                    className="service-image"
                    alt={service.name}
                    loading="lazy"
                  />
                  <div className="service-overlay">
                    <span className="service-icon">🐾</span>
                  </div>
                </div>
                <div className="service-content">
                  <h3 className="service-title">{service.name}</h3>
                  <p className="service-description">
                    Professional care tailored to your pet's needs
                  </p>
                  <button className="service-button">
                    <span>Explore Service</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-services">No services available</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .services-section {
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
        
        .services-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .service-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
        }
        
        .service-image-container {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        
        .service-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .service-card:hover .service-image {
          transform: scale(1.1);
        }
        
        .service-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6));
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .service-card:hover .service-overlay {
          opacity: 1;
        }
        
        .service-icon {
          font-size: 2rem;
          color: white;
        }
        
        .service-content {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        
        .service-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }
        
        .service-description {
          color: #4a5568;
          margin-bottom: 1.5rem;
          flex-grow: 1;
        }
        
        .service-button {
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
          width: 100%;
        }
        
        .service-button:hover {
          background: linear-gradient(90deg, #2563eb, #7c3aed);
          transform: translateX(5px);
        }
        
        .service-button svg {
          transition: transform 0.3s ease;
        }
        
        .service-button:hover svg {
          transform: translateX(3px);
        }
        
        .no-services {
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
          
          .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Services; 