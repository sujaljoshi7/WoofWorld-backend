import React from 'react';

const PartnerCompanies = ({ companies, BASE_URL }) => {
  return (
    <section className="partner-companies-section">
      <div className="section-header">
        <h2 className="section-title">Trusted by Leading Brands</h2>
        <div className="section-divider"></div>
        <p className="section-subtitle">We collaborate with industry leaders to provide the best for your pets</p>
      </div>
      
      <div className="partners-container">
        <div className="partners-wrapper">
          <div className="partners-track">
            {companies.length > 0 ? (
              [...companies, ...companies].map((company, index) => (
                <div key={index} className="partner-item">
                  <div className="partner-logo-container">
                    <img
                      title={company.name}
                      src={`${BASE_URL}${company.image}`}
                      alt={`${company.name} logo`}
                      className="partner-logo"
                      loading="lazy"
                    />
                    <div className="partner-overlay">
                      <span className="partner-name">{company.name}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-partners">No partner companies available</p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .partner-companies-section {
          padding: 4rem 0;
          background: linear-gradient(to bottom, #f8f9fa, #ffffff);
          overflow: hidden;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
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
          max-width: 600px;
          margin: 0 auto;
        }
        
        .partners-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 1rem 0;
        }
        
        .partners-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        
        .partners-track {
          display: flex;
          animation: scroll 30s linear infinite;
          width: fit-content;
        }
        
        .partner-item {
          flex: 0 0 auto;
          width: 200px;
          margin: 0 2rem;
        }
        
        .partner-logo-container {
          position: relative;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .partner-logo-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        
        .partner-logo {
          max-height: 80px;
          max-width: 80%;
          object-fit: contain;
          transition: all 0.3s ease;
        }
        
        .partner-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
          padding: 1rem 0.5rem 0.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
          text-align: center;
        }
        
        .partner-logo-container:hover .partner-overlay {
          opacity: 1;
        }
        
        .partner-name {
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .no-partners {
          text-align: center;
          color: #718096;
          font-style: italic;
          width: 100%;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }
          
          .partner-item {
            width: 150px;
            margin: 0 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default PartnerCompanies; 