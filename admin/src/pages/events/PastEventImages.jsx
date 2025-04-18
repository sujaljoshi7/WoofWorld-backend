import React, { useState, useEffect } from "react";
import api from "../../api"; // Adjust the import path as necessary
import uploadToImgBB from "../../utils/image-upload";

const PastEventImages = () => {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/api/events/event/");
      const today = new Date();

      const pastEvents = response.data.filter(
        (event) => new Date(event.date) < today
      );

      setEvents(pastEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (images.length === 0) {
      setError("No images selected");
      setLoading(false);
      return;
    }

    try {
      // Upload each image to ImgBB
      const uploadedImageUrls = [];
      for (let img of images) {
        const url = await uploadToImgBB(img);
        if (!url) {
          setError("One or more image uploads failed");
          setLoading(false);
          return;
        }
        uploadedImageUrls.push(url);
      }

      // Prepare payload
      const payload = {
        event_id: selectedEvent,
        images: uploadedImageUrls, // Array of URLs
      };

      // Send to backend
      await api.post("/api/events/past-event-images/", payload);

      setLoading(false);
      setError("");
      alert("Images uploaded successfully!");
      // Reset form if needed
    } catch (error) {
      console.error("Upload error:", error);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Past Event Images</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="event">Select Event:</label>
          <select
            className="form-select"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <option value="">-- Select Category --</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>{" "}
        </div>
        <div>
          <label htmlFor="images">Upload Images:</label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
          {images.map((image, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                margin: "5px",
                display: "inline-block",
              }}
            >
              <img
                src={image.preview}
                alt={`Preview ${index}`}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default PastEventImages;
