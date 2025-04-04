import React from 'react';

const Products = ({ products, BASE_URL, scrollRef }) => {
  return (
    <section className="products-section" ref={scrollRef}>
      <div className="section-header">
        <h2 className="section-title">Premium Pet Products</h2>
        <div className="section-divider"></div>
        <p className="section-subtitle">
          Discover our curated collection of high-quality products for your beloved pets
        </p>
      </div>
      
      <div className="products-container">
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="product-card" key={product.id}>
                <div className="product-image-container">
                  <img
                    src={`${BASE_URL}${product.image}`}
                    className="product-image"
                    alt={product.name}
                    loading="lazy"
                  />
                  <div className="product-overlay">
                    <span className="product-category">{product.category?.name || 'Uncategorized'}</span>
                  </div>
                </div>
                <div className="product-content">
                  <h3 className="product-title">
                    {product.name.length > 30
                      ? `${product.name.substring(0, 30)}...`
                      : product.name}
                  </h3>
                  <div className="product-details">
                    <span className="product-price">₹{product.price}</span>
                    <button className="add-to-cart-button">
                      <span>Add to Cart</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-products">No products available</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .products-section {
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
        
        .products-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }
        
        .product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
        }
        
        .product-image-container {
          position: relative;
          height: 250px;
          overflow: hidden;
        }
        
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .product-card:hover .product-image {
          transform: scale(1.1);
        }
        
        .product-overlay {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.9);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          backdrop-filter: blur(4px);
        }
        
        .product-category {
          font-size: 0.875rem;
          font-weight: 500;
          color: #3b82f6;
          text-transform: uppercase;
        }
        
        .product-content {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .product-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 1rem;
          line-height: 1.4;
        }
        
        .product-details {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }
        
        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #3b82f6;
        }
        
        .add-to-cart-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.25rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .add-to-cart-button:hover {
          background: linear-gradient(90deg, #2563eb, #7c3aed);
          transform: translateX(5px);
        }
        
        .add-to-cart-button svg {
          transition: transform 0.3s ease;
        }
        
        .add-to-cart-button:hover svg {
          transform: translateX(3px);
        }
        
        .no-products {
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
          
          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Products; 