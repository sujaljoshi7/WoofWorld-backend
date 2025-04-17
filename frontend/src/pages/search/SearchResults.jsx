import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/SearchResults.css";
import Navbar from "../../components/common/Navbar";

function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleResultClick = (type, item) => {
    switch (type) {
      case "dogs":
        navigate(`/adoption/dog/${item.id}`);
        break;
      case "events":
        navigate(`/events/${item.id}`);
        break;
      case "products":
        navigate(`/shop/product/${encodeURIComponent(item.name)}`);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const response = await api.get(
          `/api/search/?q=${encodeURIComponent(query)}`
        );
        setResults(response.data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <>
        <Navbar initialSearchQuery={query} />
        <div className="loading">Loading...</div>
      </>
    );
  }

  if (!results) {
    return (
      <>
        <Navbar initialSearchQuery={query} />
        <div className="no-results">No results found</div>
      </>
    );
  }

  return (
    <>
      <Navbar initialSearchQuery={query} />
      <div className="search-results-page">
        <div className="container">
          <h1 className="search-title">Search Results for "{query}"</h1>

          {Object.entries(results).map(
            ([type, items]) =>
              items.length > 0 && (
                <div key={type} className="search-section">
                  <h2 className="section-title">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </h2>
                  <div className="results-grid">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="result-card"
                        onClick={() => handleResultClick(type, item)}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={item.image}
                          alt={item.name || item.title}
                          className="result-image"
                          style={{ height: "350px" }}
                        />
                        <div className="result-info">
                          <h3>{item.name || item.title}</h3>
                          {item.price && <p className="price">₹{item.price}</p>}
                          {item.date && (
                            <p className="date">
                              {new Date(item.date).toLocaleDateString()}
                            </p>
                          )}
                          {item.breed && <p className="breed">{item.breed}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
}

export default SearchResults;
