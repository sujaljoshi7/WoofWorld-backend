import React, { useState, useEffect } from "react";
import api from "../api"; // Adjust the import path as necessary
import uploadToImgBB from "../utils/image-upload";

const PastEventImages = ({ route, method }) => {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
    if (method === "edit" && id) {
      fetchPastEventDetails();
    }
  }, []);

  const fetchPastEventDetails = async () => {
    try {
      const res = await api.get(`/api/events/past-event-images/`);
      const data = res.data;
      setEventName(data.name);
      setEventDescription(data.description);
      const duration = data.duration; // Example: "2 Hours 30 Minutes"
      if (duration) {
        const match = duration.match(/(\d+)\s*hours/);
        if (match) {
          if (match[1]) {
            setHours(Number(match[1])); // 2 Hours
          }
        }
      }
      setPreviewImage(data.image); // Show existing image
    } catch (err) {
      console.error("Failed to fetch event details:", err);
    }
  };

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

    const apiKey = "54d95fbd813692cc07c224648c068916";
    const uploadedImageUrls = [];

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
      });

    try {
      for (let file of images) {
        if (!(file instanceof Blob)) {
          throw new Error("Invalid file type");
        }

        const base64Image = await toBase64(file);

        const form = new FormData();
        form.append("image", base64Image);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: form,
          }
        );

        const data = await res.json();

        if (data.success) {
          uploadedImageUrls.push(data.data.url);
        } else {
          console.error("ImgBB upload failed:", data);
          setError("Image upload failed");
          setLoading(false);
          return;
        }
      }

      await api.post("/api/events/past-event-images/", {
        event_id: selectedEvent,
        images: uploadedImageUrls,
      });

      setLoading(false);
      alert("Images uploaded successfully!");
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
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              console.log("Selected files:", files);
              setImages(files);
            }}
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
        <button type="submit" className="btn btn-warning w-100">
          Save Event
        </button>
      </form>
    </div>
  );
};

export default PastEventImages;
