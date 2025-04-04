import { useState, useEffect } from "react";
import api from "../../api";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "../../styles/Home.css";

const AllDogs = () => {
  // State for search and filters
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [selectedAges, setSelectedAges] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    goodWithKids: false,
    goodWithDogs: false,
    goodWithCats: false,
    houseTrained: false,
    specialNeeds: false,
  });
  const [activeDog, setActiveDog] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const dogsPerPage = 6;

  // State for dogs data
  const [dogs, setDogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dogs data
  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/adoption/");
        console.log(response);
        if (!response.status === 200) {
          throw new Error("Failed to fetch dogs");
        }
        const data = await response.data;

        console.log(data);
        // Transform API data to match our component's expected format
        const transformedDogs = data.map((dog) => ({
          id: dog.id,
          name: dog.name,
          breed: dog.breed?.name || "Unknown",
          age: dog.age * 12, // Convert years to months for consistency
          weight: dog.weight,
          gender: dog.gender,
          description:
            dog.personality ||
            dog.looking_for ||
            "Lovable dog seeking a forever home",
          // For demo purposes, let's use placeholder images since the remote images might not be accessible
          image_url: `${BASE_URL}${dog.image}`,
          location: "Adoption Center",
          good_with_kids: true, // Default values since API might not provide these
          good_with_dogs: true,
          good_with_cats: true,
          house_trained: true,
          special_needs: dog.disease && dog.disease !== "NA",
          vaccinated: dog.vaccinated_status === "Fully Vaccinated",
          traits: [dog.energy_level, dog.color, dog.breed?.name].filter(
            Boolean
          ),
          energy_level: dog.energy_level,
          color: dog.color,
          looking_for: dog.looking_for,
        }));

        setDogs(transformedDogs);
        setIsLoading(false);
      } catch (err) {
        console.log(err.message);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchDogs();
  }, []);

  // Get unique breeds from all dogs
  const allBreeds = [...new Set(dogs.map((dog) => dog.breed))].sort();

  // Filter dogs based on search and filters
  const filteredDogs = dogs.filter((dog) => {
    // Search query filter
    if (
      searchQuery &&
      !dog.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !dog.breed.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !dog.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Breed filter
    if (selectedBreeds.length > 0 && !selectedBreeds.includes(dog.breed)) {
      return false;
    }

    // Age filter
    if (selectedAges.length > 0) {
      const isPuppy = dog.age <= 12; // 0-1 year
      const isYoung = dog.age > 12 && dog.age <= 36; // 1-3 years
      const isAdult = dog.age > 36 && dog.age <= 96; // 3-8 years
      const isSenior = dog.age > 96; // 8+ years

      if (
        !(
          (selectedAges.includes("puppy") && isPuppy) ||
          (selectedAges.includes("young") && isYoung) ||
          (selectedAges.includes("adult") && isAdult) ||
          (selectedAges.includes("senior") && isSenior)
        )
      ) {
        return false;
      }
    }

    // Size filter
    if (selectedSizes.length > 0) {
      const isSmall = dog.weight <= 25;
      const isMedium = dog.weight > 25 && dog.weight <= 50;
      const isLarge = dog.weight > 50 && dog.weight <= 90;
      const isXLarge = dog.weight > 90;

      if (
        !(
          (selectedSizes.includes("small") && isSmall) ||
          (selectedSizes.includes("medium") && isMedium) ||
          (selectedSizes.includes("large") && isLarge) ||
          (selectedSizes.includes("xlarge") && isXLarge)
        )
      ) {
        return false;
      }
    }

    // Other filters
    if (selectedFilters.goodWithKids && !dog.good_with_kids) return false;
    if (selectedFilters.goodWithDogs && !dog.good_with_dogs) return false;
    if (selectedFilters.goodWithCats && !dog.good_with_cats) return false;
    if (selectedFilters.houseTrained && !dog.house_trained) return false;
    if (selectedFilters.specialNeeds && !dog.special_needs) return false;

    return true;
  });

  // Sort filtered dogs
  const sortedDogs = [...filteredDogs].sort((a, b) => {
    switch (sortBy) {
      case "nameAsc":
        return a.name.localeCompare(b.name);
      case "nameDesc":
        return b.name.localeCompare(a.name);
      case "ageAsc":
        return a.age - b.age;
      case "ageDesc":
        return b.age - a.age;
      default:
        return b.id - a.id; // Default sort by newest
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedDogs.length / dogsPerPage);
  const currentDogs = sortedDogs.slice(
    (currentPage - 1) * dogsPerPage,
    currentPage * dogsPerPage
  );

  // Convert age in months to readable format
  const formatAge = (ageInMonths) => {
    // Ensure we have a valid integer
    const months = Math.round(ageInMonths);

    if (months < 12) {
      return `${months} ${months === 1 ? "month" : "months"}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      if (remainingMonths === 0) {
        return `${years} ${years === 1 ? "year" : "years"}`;
      } else {
        return `${years} ${
          years === 1 ? "year" : "years"
        }, ${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`;
      }
    }
  };

  // Get age category
  const getAgeCategory = (ageInMonths) => {
    if (ageInMonths <= 12) return { text: "Puppy", class: "bg-success" };
    if (ageInMonths <= 36) return { text: "Young", class: "bg-info" };
    if (ageInMonths <= 96) return { text: "Adult", class: "bg-primary" };
    return { text: "Senior", class: "bg-warning" };
  };

  // Get size category
  const getSizeCategory = (weight) => {
    if (weight <= 25) return "Small";
    if (weight <= 50) return "Medium";
    if (weight <= 90) return "Large";
    return "X-Large";
  };

  // Toggle breed selection
  const toggleBreed = (breed) => {
    if (selectedBreeds.includes(breed)) {
      setSelectedBreeds(selectedBreeds.filter((b) => b !== breed));
    } else {
      setSelectedBreeds([...selectedBreeds, breed]);
    }
  };

  // Toggle age selection
  const toggleAge = (age) => {
    if (selectedAges.includes(age)) {
      setSelectedAges(selectedAges.filter((a) => a !== age));
    } else {
      setSelectedAges([...selectedAges, age]);
    }
  };

  // Toggle size selection
  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Toggle other filters
  const toggleFilter = (filter) => {
    setSelectedFilters({
      ...selectedFilters,
      [filter]: !selectedFilters[filter],
    });
  };

  // Reset all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedBreeds([]);
    setSelectedAges([]);
    setSelectedSizes([]);
    setSelectedFilters({
      goodWithKids: false,
      goodWithDogs: false,
      goodWithCats: false,
      houseTrained: false,
      specialNeeds: false,
    });
    setSortBy("default");
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by the filter function
  };

  // Pagination navigation
  const changePage = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <div className="yellow-bg text-dark py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h1 className="display-4 fw-bold mb-3">
                Find Your Forever Friend
              </h1>
              <p className="lead mb-4">
                Browse our available dogs and give them the loving home they
                deserve.
              </p>
              <form onSubmit={handleSearch} className="d-flex mb-3">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Search by name, breed, or traits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-dark">
                  <i className="bi bi-search me-1"></i> Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row">
          {/* Filter Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-filter me-2"></i>Filters
                </h5>
                <button
                  className="btn btn-sm btn-outline-dark"
                  onClick={clearFilters}
                >
                  Clear all
                </button>
              </div>
              <div className="card-body">
                {/* Sort Options */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Sort By</label>
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">Newest First</option>
                    <option value="nameAsc">Name (A-Z)</option>
                    <option value="nameDesc">Name (Z-A)</option>
                    <option value="ageAsc">Age (Youngest First)</option>
                    <option value="ageDesc">Age (Oldest First)</option>
                  </select>
                </div>

                {/* Breed Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Breed</h6>
                  <div className="overflow-auto" style={{ maxHeight: "150px" }}>
                    {allBreeds.map((breed) => (
                      <div className="form-check" key={breed}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`breed-${breed}`}
                          checked={selectedBreeds.includes(breed)}
                          onChange={() => toggleBreed(breed)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`breed-${breed}`}
                        >
                          {breed}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Age Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Age</h6>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="age-puppy"
                      checked={selectedAges.includes("puppy")}
                      onChange={() => toggleAge("puppy")}
                    />
                    <label className="form-check-label" htmlFor="age-puppy">
                      Puppy (0-1 year)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="age-young"
                      checked={selectedAges.includes("young")}
                      onChange={() => toggleAge("young")}
                    />
                    <label className="form-check-label" htmlFor="age-young">
                      Young (1-3 years)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="age-adult"
                      checked={selectedAges.includes("adult")}
                      onChange={() => toggleAge("adult")}
                    />
                    <label className="form-check-label" htmlFor="age-adult">
                      Adult (3-8 years)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="age-senior"
                      checked={selectedAges.includes("senior")}
                      onChange={() => toggleAge("senior")}
                    />
                    <label className="form-check-label" htmlFor="age-senior">
                      Senior (8+ years)
                    </label>
                  </div>
                </div>

                {/* Size Filter */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Size</h6>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="size-small"
                      checked={selectedSizes.includes("small")}
                      onChange={() => toggleSize("small")}
                    />
                    <label className="form-check-label" htmlFor="size-small">
                      Small (0-25 lbs)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="size-medium"
                      checked={selectedSizes.includes("medium")}
                      onChange={() => toggleSize("medium")}
                    />
                    <label className="form-check-label" htmlFor="size-medium">
                      Medium (26-50 lbs)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="size-large"
                      checked={selectedSizes.includes("large")}
                      onChange={() => toggleSize("large")}
                    />
                    <label className="form-check-label" htmlFor="size-large">
                      Large (51-90 lbs)
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="size-xlarge"
                      checked={selectedSizes.includes("xlarge")}
                      onChange={() => toggleSize("xlarge")}
                    />
                    <label className="form-check-label" htmlFor="size-xlarge">
                      X-Large (90+ lbs)
                    </label>
                  </div>
                </div>

                {/* Additional Filters */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2">Characteristics</h6>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="filter-kids"
                      checked={selectedFilters.goodWithKids}
                      onChange={() => toggleFilter("goodWithKids")}
                    />
                    <label className="form-check-label" htmlFor="filter-kids">
                      Good with kids
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="filter-dogs"
                      checked={selectedFilters.goodWithDogs}
                      onChange={() => toggleFilter("goodWithDogs")}
                    />
                    <label className="form-check-label" htmlFor="filter-dogs">
                      Good with other dogs
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="filter-cats"
                      checked={selectedFilters.goodWithCats}
                      onChange={() => toggleFilter("goodWithCats")}
                    />
                    <label className="form-check-label" htmlFor="filter-cats">
                      Good with cats
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="filter-houseTrained"
                      checked={selectedFilters.houseTrained}
                      onChange={() => toggleFilter("houseTrained")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="filter-houseTrained"
                    >
                      House trained
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="filter-specialNeeds"
                      checked={selectedFilters.specialNeeds}
                      onChange={() => toggleFilter("specialNeeds")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="filter-specialNeeds"
                    >
                      Special needs
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dogs Listing */}
          <div className="col-lg-9">
            {/* Results Summary */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0">
                <span className="text-primary">{filteredDogs.length}</span> dogs
                available for adoption
              </h4>
              <div className="d-flex align-items-center">
                <span className="me-2">
                  Page {currentPage} of {totalPages || 1}
                </span>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading dogs...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Error: {error}. Using the default /api/dogs endpoint as
                fallback.
              </div>
            )}

            {/* No Results */}
            {!isLoading && !error && filteredDogs.length === 0 && (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="bi bi-search" style={{ fontSize: "3rem" }}></i>
                </div>
                <h3>No dogs found</h3>
                <p className="text-muted">
                  Try adjusting your filters or search criteria
                </p>
                <button className="btn btn-primary mt-2" onClick={clearFilters}>
                  Clear all filters
                </button>
              </div>
            )}

            {/* Dogs Grid */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {currentDogs.map((dog) => (
                <div className="col" key={dog.id}>
                  <div className="card h-100 shadow-sm hover-shadow">
                    <div className="position-relative">
                      <img
                        src={dog.image_url}
                        className="card-img-top dog-image"
                        alt={dog.name}
                        style={{ height: "300px", objectFit: "cover" }}
                      />
                      <span
                        className={`badge ${
                          getAgeCategory(dog.age).class
                        } position-absolute top-0 end-0 m-2`}
                      >
                        {getAgeCategory(dog.age).text}
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0 fw-bold">{dog.name}</h5>
                        <button
                          className="btn btn-sm btn-outline-danger border-0"
                          title="Add to favorites"
                        >
                          <i className="bi bi-heart"></i>
                        </button>
                      </div>
                      <p className="card-text text-muted">
                        {dog.breed} · {getSizeCategory(dog.weight)} ·{" "}
                        {formatAge(dog.age)}
                      </p>
                      <p className="card-text mb-3 text-truncate">
                        {dog.description}
                      </p>
                      <div className="mb-3">
                        {dog.traits &&
                          dog.traits.slice(0, 3).map((trait, index) => (
                            <span
                              key={index}
                              className="badge bg-light text-dark me-1 mb-1"
                            >
                              {trait}
                            </span>
                          ))}
                      </div>
                      <div className="d-flex flex-wrap mb-3">
                        {dog.good_with_kids && (
                          <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">
                            <i className="bi bi-check-circle-fill me-1"></i>
                            Kid-friendly
                          </span>
                        )}
                        {dog.house_trained && (
                          <span className="badge bg-info bg-opacity-10 text-info me-1 mb-1">
                            <i className="bi bi-check-circle-fill me-1"></i>
                            House-trained
                          </span>
                        )}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="bi bi-geo-alt me-1"></i>
                          {dog.location}
                        </small>
                      </div>
                    </div>
                    <div className="card-footer bg-white border-top-0">
                      <button
                        className="btn btn-dark w-100"
                        onClick={() => setActiveDog(dog)}
                        data-bs-toggle="modal"
                        data-bs-target="#dogModal"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-5">
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => changePage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li
                      key={index}
                      className={`page-item ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => changePage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => changePage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>

      {/* Dog Detail Modal */}
      <div
        className="modal fade"
        id="dogModal"
        tabIndex="-1"
        aria-labelledby="dogModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {activeDog && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title fw-bold" id="dogModalLabel">
                    Meet {activeDog.name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <img
                        src={activeDog.image_url}
                        className="img-fluid rounded mb-3"
                        alt={activeDog.name}
                        style={{
                          width: "100%",
                          height: "300px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <h3 className="mb-1">{activeDog.name}</h3>
                      <p className="text-muted mb-3">
                        {activeDog.breed} · {activeDog.gender}
                      </p>

                      <div className="d-flex mb-3">
                        <div className="me-4">
                          <small className="text-muted d-block">Age</small>
                          <span className="fw-bold">
                            {formatAge(activeDog.age)}
                          </span>
                        </div>
                        <div className="me-4">
                          <small className="text-muted d-block">Weight</small>
                          <span className="fw-bold">{activeDog.weight} kg</span>
                        </div>
                        <div>
                          <small className="text-muted d-block">Location</small>
                          <span className="fw-bold">{activeDog.location}</span>
                        </div>
                      </div>

                      <p className="mb-3">{activeDog.description}</p>

                      <h6 className="fw-bold mb-2">Traits</h6>
                      <div className="mb-3">
                        {activeDog.traits &&
                          activeDog.traits.map((trait, index) => (
                            <span
                              key={index}
                              className="badge bg-light text-dark me-1 mb-1"
                            >
                              {trait}
                            </span>
                          ))}
                      </div>

                      <h6 className="fw-bold mb-2">Compatibility</h6>
                      <div className="row mb-3">
                        <div className="col-6">
                          <div
                            className={`d-flex align-items-center mb-2 ${
                              activeDog.good_with_kids
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            <i
                              className={`bi ${
                                activeDog.good_with_kids
                                  ? "bi-check-circle-fill"
                                  : "bi-x-circle-fill"
                              } me-2`}
                            ></i>
                            Good with kids
                          </div>
                          <div
                            className={`d-flex align-items-center mb-2 ${
                              activeDog.good_with_dogs
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            <i
                              className={`bi ${
                                activeDog.good_with_dogs
                                  ? "bi-check-circle-fill"
                                  : "bi-x-circle-fill"
                              } me-2`}
                            ></i>
                            Good with dogs
                          </div>
                          <div
                            className={`d-flex align-items-center ${
                              activeDog.good_with_cats
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            <i
                              className={`bi ${
                                activeDog.good_with_cats
                                  ? "bi-check-circle-fill"
                                  : "bi-x-circle-fill"
                              } me-2`}
                            ></i>
                            Good with cats
                          </div>
                        </div>
                        <div className="col-6">
                          <div
                            className={`d-flex align-items-center mb-2 ${
                              activeDog.house_trained
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            <i
                              className={`bi ${
                                activeDog.house_trained
                                  ? "bi-check-circle-fill"
                                  : "bi-x-circle-fill"
                              } me-2`}
                            ></i>
                            House trained
                          </div>
                          <div
                            className={`d-flex align-items-center mb-2 ${
                              activeDog.vaccinated
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            <i
                              className={`bi ${
                                activeDog.vaccinated
                                  ? "bi-check-circle-fill"
                                  : "bi-x-circle-fill"
                              } me-2`}
                            ></i>
                            Vaccinated
                          </div>
                          <div
                            className={`d-flex align-items-center ${
                              !activeDog.special_needs
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            <i
                              className={`bi ${
                                !activeDog.special_needs
                                  ? "bi-check-circle-fill"
                                  : "bi-x-circle-fill"
                              } me-2`}
                            ></i>
                            No special needs
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" className="btn btn-dark">
                    Apply to Adopt
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AllDogs;
