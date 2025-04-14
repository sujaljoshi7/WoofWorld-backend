import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const AllDogs = () => {
  const [dogs, setDogs] = useState([]);
  const [activeDog, setActiveDog] = useState(null);

  const fetchDogs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/dogs/`);
      console.log("API Response:", response.data);
      setDogs(response.data);
    } catch (error) {
      console.error("Error fetching dogs:", error);
    }
  };

  const handleViewDetails = async (dog) => {
    setActiveDog(dog);
    try {
      // Increment views when viewing details
      await axios.post(`${BASE_URL}/api/dogs/${dog.id}/increment-views/`);
      // Refresh the dog data to get updated view count
      const response = await axios.get(`${BASE_URL}/api/dogs/${dog.id}/`);
      const updatedDog = response.data;
      setActiveDog(updatedDog);
      // Update the dog in the list
      setDogs((prevDogs) =>
        prevDogs.map((d) => (d.id === updatedDog.id ? updatedDog : d))
      );
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  const renderDogData = (dog) => {
    console.log("Rendering dog:", dog);
    return (
      <tr key={dog.id}>
        <td>
          <div className="d-flex align-items-center">
            {dog.image && (
              <img
                src={dog.image}
                alt={dog.name}
                className="me-2"
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                }}
              />
            )}
            <div>
              <div className="fw-bold">{String(dog.name || "N/A")}</div>
              <small className="text-muted">
                ID: {String(dog.id || "N/A")}
              </small>
            </div>
          </div>
        </td>
        <td>{String(dog.breed?.name || "N/A")}</td>
        <td>{String(dog.age || "N/A")}</td>
        <td>{String(dog.gender || "N/A")}</td>
        <td>
          <span
            className={`badge ${
              dog.status === 1
                ? "bg-success"
                : dog.status === 2
                ? "bg-warning"
                : "bg-danger"
            }`}
          >
            {dog.status === 1
              ? "Available"
              : dog.status === 2
              ? "Pending"
              : "Adopted"}
          </span>
        </td>
        <td>
          {dog.created_at
            ? new Date(dog.created_at).toLocaleDateString()
            : "N/A"}
        </td>
        <td>
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleEdit(dog)}
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDelete(dog.id)}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Dog</th>
                  <th>Breed</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{dogs.map(renderDogData)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDogs;
