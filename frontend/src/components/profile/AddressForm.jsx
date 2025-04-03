import { useState } from "react";
import api from "../../api";
import { handleTokenRefresh } from "../../hooks/tokenRefresh";
const AddressForm = ({ onSubmit, onCancel, existingAddress = null }) => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Initialize form state with existing address data or empty values
  console.log(existingAddress);
  const [formData, setFormData] = useState({
    name: existingAddress?.name || "",
    addressLine1: existingAddress?.addressLine1 || "",
    addressLine2: existingAddress?.addressLine2 || "",
    city: existingAddress?.city || "",
    state: existingAddress?.state || "",
    postalCode: existingAddress?.postalCode || "",
    country: existingAddress?.country || "",
    phone: existingAddress?.phone || "",
    isDefault: existingAddress?.isDefault || false,
    addressType: existingAddress?.addressType || "home",
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State/Province is required";
    if (!formData.postalCode.trim())
      newErrors.postalCode = "Postal/ZIP code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    // Simple phone validation
    if (formData.phone && !/^\+?[0-9()-\s]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (!validateForm()) return; // Validate form before submitting

    try {
      const payload = {
        name: formData.name,
        address_line_1: formData.addressLine1,
        address_line_2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
        isDefault: formData.isDefault,
        addressType: formData.addressType,
      };

      const url = `${BASE_URL}/api/user/address/`; // Single endpoint for both actions

      const response = await fetch(url, {
        method: existingAddress ? "PUT" : "POST", // Use PUT if address exists, else POST
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          existingAddress
            ? "Address updated successfully!"
            : "Address added successfully!"
        );
        onSubmit(data); // Pass updated address data back to parent component
      } else {
        console.error(data.errors || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving address:", error);

      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");

        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          return handleSubmit(e); // Retry request after token refresh
        }
      } else {
        console.error("Failed to save address:", error);
      }
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white p-4 border-0">
        <h5 className="mb-0">
          <i className="fas fa-map-marker-alt me-2 text-primary"></i>
          {existingAddress ? "Edit Address" : "Add New Address"}
        </h5>
      </div>

      <div className="card-body p-4">
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            {/* Full Name */}
            <div className="col-12">
              <label htmlFor="name" className="form-label">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>

            {/* Address Line 1 */}
            <div className="col-12">
              <label htmlFor="addressLine1" className="form-label">
                Address Line 1 <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.addressLine1 ? "is-invalid" : ""
                }`}
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="Street address, P.O. box, company name"
              />
              {errors.addressLine1 && (
                <div className="invalid-feedback">{errors.addressLine1}</div>
              )}
            </div>

            {/* Address Line 2 */}
            <div className="col-12">
              <label htmlFor="addressLine2" className="form-label">
                Address Line 2
              </label>
              <input
                type="text"
                className="form-control"
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Apartment, suite, unit, building, floor, etc."
              />
            </div>

            {/* City and State */}
            <div className="col-md-6">
              <label htmlFor="city" className="form-label">
                City <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.city ? "is-invalid" : ""}`}
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
              {errors.city && (
                <div className="invalid-feedback">{errors.city}</div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="state" className="form-label">
                State/Province <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.state ? "is-invalid" : ""}`}
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State/Province"
              />
              {errors.state && (
                <div className="invalid-feedback">{errors.state}</div>
              )}
            </div>

            {/* Postal Code and Country */}
            <div className="col-md-6">
              <label htmlFor="postalCode" className="form-label">
                Postal/ZIP Code <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.postalCode ? "is-invalid" : ""
                }`}
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal/ZIP Code"
              />
              {errors.postalCode && (
                <div className="invalid-feedback">{errors.postalCode}</div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="country" className="form-label">
                Country <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${errors.country ? "is-invalid" : ""}`}
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              >
                <option value="">Select country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="IN">India</option>
                {/* Add more countries as needed */}
              </select>
              {errors.country && (
                <div className="invalid-feedback">{errors.country}</div>
              )}
            </div>

            {/* Phone */}
            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g., +1 (555) 123-4567"
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>

            {/* Address Type */}
            <div className="col-md-6">
              <label htmlFor="addressType" className="form-label">
                Address Type
              </label>
              <select
                className="form-select"
                id="addressType"
                name="addressType"
                value={formData.addressType}
                onChange={handleChange}
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="billing">Billing</option>
                <option value="shipping">Shipping</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Default Address Checkbox */}
            <div className="col-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="isDefault">
                  Set as default address
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="col-12 mt-4">
              <hr />
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn btn-primary"
                >
                  {existingAddress ? "Update Address" : "Save Address"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
