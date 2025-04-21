import React, { useState, useEffect } from "react";
import api from "../api"; // Adjust the import path as necessary
import { useParams } from "react-router-dom";

const PastEventImages = ({ route, method }) => {
  const { id } = useParams();
  const [selectedEvent, setSelectedEvent] = useState(id || "");
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingImages, setFetchingImages] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchEventImages(selectedEvent);
    } else {
      setImages([]);
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/api/events/event/");
      const today = new Date();

      const pastEvents = response.data.filter(
        (event) => new Date(event.date) < today
      );

      setEvents(pastEvents || []);

      // If we have an ID from params and it's not already selected
      if (id && !selectedEvent) {
        setSelectedEvent(id);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  };

  // Function to extract actual image URL from nested JSON strings
  const extractImageUrl = (imageData) => {
    try {
      // If it's already a simple URL string
      if (typeof imageData === "string" && imageData.startsWith("http")) {
        return imageData;
      }

      // If it's a JSON string, parse it
      if (
        typeof imageData === "string" &&
        (imageData.includes("{") || imageData.includes("["))
      ) {
        // Try to extract URL with regex for efficiency
        const urlMatch = imageData.match(/'(https?:\/\/[^']+)'/);
        if (urlMatch && urlMatch[1]) {
          return urlMatch[1];
        }

        // If regex fails, try JSON parsing (might be nested)
        try {
          const parsed = JSON.parse(imageData.replace(/'/g, '"'));
          if (parsed.image) {
            return extractImageUrl(parsed.image); // Handle nested image objects
          }
        } catch (e) {
          console.warn("Could not parse image JSON:", e);
        }
      }

      // If it's an object with image property
      if (imageData && typeof imageData === "object" && imageData.image) {
        return extractImageUrl(imageData.image);
      }

      console.warn("Could not extract image URL from:", imageData);
      return null;
    } catch (err) {
      console.error("Error extracting image URL:", err);
      return null;
    }
  };

  const fetchEventImages = async (eventId) => {
    if (!eventId) return;

    setFetchingImages(true);
    try {
      const response = await api.get(
        `/api/events/past-event-images/${eventId}/`
      );
      const processedImages = [];

      if (response.data) {
        // If we have a single image object with nested data
        if (response.data.image) {
          const imageUrl = extractImageUrl(response.data.image);
          if (imageUrl) {
            processedImages.push({
              url: imageUrl,
              preview: imageUrl,
            });
          }
        }
        // If we have an array of images
        else if (Array.isArray(response.data)) {
          response.data.forEach((item) => {
            const imageUrl = extractImageUrl(item.image);
            if (imageUrl) {
              processedImages.push({
                url: imageUrl,
                preview: imageUrl,
              });
            }
          });
        }
        // If response data itself might be the image array
        else if (Array.isArray(response.data.images)) {
          response.data.images.forEach((item) => {
            const imageUrl = extractImageUrl(item);
            if (imageUrl) {
              processedImages.push({
                url: imageUrl,
                preview: imageUrl,
              });
            }
          });
        }
      }

      setImages(processedImages);
    } catch (err) {
      console.error("Failed to fetch event images:", err);
      setImages([]);
    } finally {
      setFetchingImages(false);
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
      isNew: true,
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

    if (!selectedEvent) {
      setError("Please select an event");
      setLoading(false);
      return;
    }

    // Get only new images that need to be uploaded
    const newImages = images.filter((img) => img.isNew);
    const existingImages = images
      .filter((img) => !img.isNew)
      .map((img) => img.url);

    if (newImages.length === 0 && existingImages.length === 0) {
      setError("No images selected");
      setLoading(false);
      return;
    }

    const apiKey = "54d95fbd813692cc07c224648c068916";
    const uploadedImageUrls = [...existingImages]; // Start with existing images

    try {
      // Only process new images that need uploading
      for (let image of newImages) {
        const file = image.file;

        if (!(file instanceof Blob)) {
          console.error("Invalid file type:", file);
          continue;
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

      await api.patch("/api/events/past-event-images/", {
        event_id: selectedEvent,
        images: uploadedImageUrls,
      });

      setLoading(false);
      alert("Images uploaded successfully!");

      // Refresh the images to show the updated list
      fetchEventImages(selectedEvent);
    } catch (error) {
      console.error("Upload error:", error);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  // Helper function to convert file to base64
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

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="h4 mb-0">Upload Past Event Images</h2>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="event" className="form-label">
                Select Event:
              </label>
              <select
                id="event"
                className="form-select"
                value={selectedEvent}
                onChange={handleEventChange}
                required
              >
                <option value="">-- Select Event --</option>
                {Array.isArray(events) &&
                  events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="images" className="form-label">
                Upload Images:
              </label>
              <input
                id="images"
                type="file"
                className="form-control"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              <small className="text-muted">
                Select multiple images to upload
              </small>
            </div>

            {fetchingImages ? (
              <div className="text-center my-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading images...</span>
                </div>
                <p className="mt-2">Loading event images...</p>
              </div>
            ) : images && images.length > 0 ? (
              <div className="mb-3">
                <label className="form-label">
                  {images.filter((img) => img.isNew).length > 0
                    ? "New and Existing Images:"
                    : "Existing Images:"}
                </label>
                <div className="d-flex flex-wrap">
                  {images.map((image, index) => (
                    <div key={index} className="position-relative m-2">
                      <img
                        src={image.preview}
                        alt={`Preview ${index}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          border: image.isNew ? "2px solid #28a745" : "none",
                        }}
                        className="rounded"
                      />
                      {image.isNew && (
                        <span className="badge bg-success position-absolute top-0 start-0 m-1">
                          New
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                        style={{ width: "24px", height: "24px", padding: "0" }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              selectedEvent && (
                <div className="alert alert-info">
                  No images found for this event. Upload some images!
                </div>
              )
            )}

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading || !selectedEvent}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Uploading...
                </>
              ) : (
                "Save Images"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PastEventImages;
