import React, { useState, useEffect } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useLocation } from "react-router-dom";
import api from "../api";
import Sidebar from "../layout/Sidebar";
import "../styles/Styles.css";
import LoadingIndicator from "./LoadingIndicator";
import useUser from "../hooks/useUser";
import { useNavigate, useParams } from "react-router-dom";
import uploadToImgBB from "../utils/image-upload";

const ModifyAdoption = ({ method }) => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [name, setName] = useState("");
  const [breeds, setBreeds] = useState([]);
  const [age, setAge] = useState([]);
  const [gender, setGender] = useState([]);
  const [disease, setDisease] = useState([]);
  const [color, setColor] = useState([]);
  const [personality, setPersonality] = useState([]);
  const [weight, setWeight] = useState([]);
  const [energyLevel, setEnergyLevel] = useState([]);
  const [vaccinatedStatus, setVaccinatedStatus] = useState([]);
  const [lookingFor, setLookingFor] = useState("");
  const [status, setStatus] = useState(1);
  const [image, setImage] = useState(null);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const today = new Date().toISOString().split("T")[0]; // Get today's date
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const config = {
    readonly: false,
    height: 400,
    placeholder: "Write your blog here...",
    toolbarButtonSize: "large",
    theme: "dark",
    buttons:
      "bold,italic,underline,strikethrough,fontsize,font,brush,paragraph,|,ul,ol,|,link,hr,table,|,align,undo,redo,preview,fullscreen,lineHeight",
    showXPathInStatusbar: false,
  };

  useEffect(() => {
    fetchBreeds();
    if (method === "edit" && id) {
      fetchAdaptionDetails();
    }
  }, []);

  const fetchBreeds = async () => {
    try {
      const response = await api.get("/api/adoption/breed/");
      setBreeds(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAdaptionDetails = async () => {
    try {
      const res = await api.get(`/api/adoption/${id}/`);
      const data = res.data;
      setName(data.name);
      setSelectedBreed(data.breed.id);
      setAge(data.age);
      setGender(data.gender);
      setColor(data.color);
      setPersonality(data.personality);
      setWeight(data.weight);
      setEnergyLevel(data.energy_level);
      setDisease(data.disease);
      setVaccinatedStatus(data.vaccinated_status);
      setLookingFor(data.looking_for);
      setPreviewImage(data.image ? data.image : "");
    } catch (err) {
      console.error("Failed to fetch adoption details:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setImage(file); // Store the file in state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let imageUrl = null;

    if (image) {
      imageUrl = await uploadToImgBB(image);
      if (!imageUrl) {
        setError("Image upload failed");
        setLoading(false);
        return;
      }
    } else if (method === "add") {
      setError("No image selected");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("breed_id", selectedBreed);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("disease", disease);
    formData.append("color", color);
    formData.append("personality", personality);
    formData.append("looking_for", lookingFor);
    formData.append("weight", weight);
    formData.append("energy_level", energyLevel);
    formData.append("vaccinated_status", vaccinatedStatus);
    formData.append("status", status);
    if (imageUrl) {
      formData.append("image", imageUrl);
    }

    try {
      if (method === "edit") {
        await api.patch(`/api/adoption/adoption/${id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Data Updated Successfully!");
      } else {
        await api.post(`/api/adoption/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Dog Added Successfully!");
      }
      navigate("/adoption");
    } catch (error) {
      if (error.response && error.response.data.image) {
        setError(error.response.data.image[0]); // Display the error message
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [error]);

  return (
    <div className="d-flex">
      <div className="sidebar">
        <Sidebar user={user} />
      </div>
      <div
        className="main-content flex-grow-1 ms-2"
        style={{ marginLeft: "280px", padding: "20px" }}
      >
        <div className="container mt-4">
          <div className="row align-items-center mb-7">
            <div className="col">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2">
                  <li className="breadcrumb-item">
                    <p
                      className="text-body-secondary"
                      onClick={() => navigate("/adoption")}
                      style={{ cursor: "pointer" }}
                    >
                      Adoption
                    </p>
                  </li>
                  <li
                    className="breadcrumb-item active text-light"
                    aria-current="page"
                  >
                    {method === "edit" ? "Edit " : "Add "}
                    Adoption
                  </li>
                </ol>
              </nav>
              <h1 className="fs-4 mb-0">
                {method === "edit" ? "Edit " : "Add "}Adoption
              </h1>
            </div>

            {error && (
              <div
                className="alert alert-danger alert-dismissible fade show position-fixed top-0 end-0 m-3"
                role="alert"
                style={{ zIndex: 1050, width: "300px" }} // Ensure it stays visible on top
              >
                <strong>Error:</strong> {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError("")} // Hide alert when closed
                  aria-label="Close"
                ></button>
              </div>
            )}
          </div>
          <div className="row mt-5">
            <div className="col">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="breed">
                      Breed
                    </label>
                    <select
                      className="form-select"
                      value={selectedBreed}
                      onChange={(e) => setSelectedBreed(e.target.value)}
                      disabled={breeds.length === 0} // Disable if breeds is empty
                      required
                    >
                      <option value="">-- Select Category --</option>
                      {breeds.length > 0 &&
                        breeds.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6 mb-4">
                    <label className="form-label" htmlFor="price">
                      Age <span className="text-secondary">(In Years)</span>
                    </label>
                    <input
                      className="form-control"
                      id="price"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label className="form-label" htmlFor="gender">
                      Gender
                    </label>
                    <select
                      className="form-select"
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    >
                      <option value="">-- Select Category --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>{" "}
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6 mb-4">
                    <label className="form-label" htmlFor="color">
                      Color
                    </label>
                    <input
                      className="form-control"
                      id="color"
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label className="form-label" htmlFor="personality">
                      Personality
                    </label>
                    <input
                      className="form-control"
                      id="personality"
                      type="text"
                      value={personality}
                      onChange={(e) => setPersonality(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6 mb-4">
                    <label className="form-label" htmlFor="weight">
                      Weight <span className="text-secondary">(In Kgs)</span>
                    </label>
                    <input
                      className="form-control"
                      id="weight"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label className="form-label" htmlFor="energy_level">
                      Energy level
                    </label>
                    <select
                      className="form-select"
                      id="energy_level"
                      value={energyLevel}
                      onChange={(e) => setEnergyLevel(e.target.value)}
                      required
                    >
                      <option value="">-- Select energy level --</option>
                      <option value="High">High</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                    </select>{" "}
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6 mb-4">
                    <label className="form-label" htmlFor="disease">
                      Disease{" "}
                      <span className="text-secondary">
                        (If any / NA if none)
                      </span>
                    </label>
                    <input
                      className="form-control"
                      id="disease"
                      type="text"
                      value={disease}
                      onChange={(e) => setDisease(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-lg-6 mb-4">
                    <label className="form-label" htmlFor="vaccinated_status">
                      Vaccinated Status
                    </label>
                    <select
                      className="form-select"
                      id="vaccinated_status"
                      value={vaccinatedStatus}
                      onChange={(e) => setVaccinatedStatus(e.target.value)}
                      required
                    >
                      <option value="">-- Select vaccinated level --</option>
                      <option value="Fully Vaccinated">Fully Vaccinated</option>
                      <option value="Partially Vaccinated">
                        Partially Vaccinated
                      </option>
                      <option value="Not Vaccinated">Not Vaccinated</option>
                    </select>{" "}
                  </div>
                </div>

                <div className="row">
                  <div className="mb-4">
                    <label className="form-label" htmlFor="looking_for">
                      What they are looking for
                    </label>
                    <input
                      className="form-control"
                      id="looking_for"
                      value={lookingFor}
                      onChange={(e) => setLookingFor(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="image-uploader">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                    />
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="preview-image mt-2"
                        height={200}
                      />
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-center my-3">
                  {loading && <LoadingIndicator />}
                </div>
                <button type="submit" className="btn btn-warning w-100">
                  Save Dog
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyAdoption;
