import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/ServiceForm.css";
// This is a test to check github
const ServiceForm = ({ method, serviceId }) => {
  const navigate = useNavigate();
  const [service, setService] = useState({
    name: "",
    description: "",
    image: null,
    status: true,
  });
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleServiceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setService((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setService((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const addPackage = () => {
    setPackages((prev) => [
      ...prev,
      {
        name: "",
        price: "",
        duration: "",
        status: true,
        inclusions: [],
      },
    ]);
  };

  const updatePackage = (index, field, value) => {
    setPackages((prev) => {
      const newPackages = [...prev];
      newPackages[index] = {
        ...newPackages[index],
        [field]: value,
      };
      return newPackages;
    });
  };

  const addInclusion = (packageIndex) => {
    setPackages((prev) => {
      const newPackages = [...prev];
      newPackages[packageIndex].inclusions = [
        ...newPackages[packageIndex].inclusions,
        { name: "", description: "" },
      ];
      return newPackages;
    });
  };

  const updateInclusion = (packageIndex, inclusionIndex, field, value) => {
    setPackages((prev) => {
      const newPackages = [...prev];
      newPackages[packageIndex].inclusions[inclusionIndex] = {
        ...newPackages[packageIndex].inclusions[inclusionIndex],
        [field]: value,
      };
      return newPackages;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", service.name);
      formData.append("description", service.description);
      formData.append("status", service.status);
      if (service.image) {
        formData.append("image", service.image);
      }

      let response;
      if (method === "edit") {
        response = await api.patch(`/api/services/${serviceId}/`, formData);
      } else {
        response = await api.post("/api/services/", formData);
      }

      // Add packages
      for (const pkg of packages) {
        const packageData = {
          name: pkg.name,
          price: pkg.price,
          duration: pkg.duration,
          status: pkg.status,
        };

        const packageResponse = await api.post(
          `/api/services/${response.data.id}/add_package/`,
          packageData
        );

        // Add inclusions for each package
        for (const inclusion of pkg.inclusions) {
          await api.post(
            `/api/services/packages/${packageResponse.data.id}/add_inclusion/`,
            inclusion
          );
        }
      }

      navigate("/services");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-form">
      <h2>{method === "edit" ? "Edit" : "Add"} Service</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Service Name</label>
          <input
            type="text"
            name="name"
            value={service.name}
            onChange={handleServiceChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={service.description}
            onChange={handleServiceChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="status"
              checked={service.status}
              onChange={handleServiceChange}
            />
            Active
          </label>
        </div>

        <div className="packages-section bg-dark">
          <h3>Packages</h3>
          <button
            type="button"
            onClick={addPackage}
            className="btn btn-secondary"
          >
            Add Package
          </button>

          {packages.map((pkg, pkgIndex) => (
            <div key={pkgIndex} className="package-card bg-dark">
              <h4>Package {pkgIndex + 1}</h4>

              <div className="form-group">
                <label>Package Name</label>
                <input
                  type="text"
                  value={pkg.name}
                  onChange={(e) =>
                    updatePackage(pkgIndex, "name", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  value={pkg.price}
                  onChange={(e) =>
                    updatePackage(pkgIndex, "price", e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={pkg.duration}
                  onChange={(e) =>
                    updatePackage(pkgIndex, "duration", e.target.value)
                  }
                  required
                />
              </div>

              <div className="inclusions-section bg-dark">
                <h5>Inclusions</h5>
                <button
                  type="button"
                  onClick={() => addInclusion(pkgIndex)}
                  className="btn btn-sm btn-outline-secondary"
                >
                  Add Inclusion
                </button>

                {pkg.inclusions.map((inclusion, incIndex) => (
                  <div key={incIndex} className="inclusion-item">
                    <input
                      type="text"
                      placeholder="Inclusion name"
                      value={inclusion.name}
                      onChange={(e) =>
                        updateInclusion(
                          pkgIndex,
                          incIndex,
                          "name",
                          e.target.value
                        )
                      }
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={inclusion.description}
                      onChange={(e) =>
                        updateInclusion(
                          pkgIndex,
                          incIndex,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Service"}
        </button>
      </form>
    </div>
  );
};

export default ServiceForm;
