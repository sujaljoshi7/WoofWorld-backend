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

const ModifyProduct = ({ method }) => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productType, setProductType] = useState("");
  const [productAge, setProductAge] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStatus, setProductStatus] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [company, setCompany] = useState([]);
  const [weight, setWeight] = useState([]);
  const [productImage, setProductImage] = useState(null);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [productId, setProductId] = useState("");
  const [breeds, setBreeds] = useState([]);
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

  const [sku, setSku] = useState("");
  const [categoryCodes, setCategoryCodes] = useState({});

  // Brand codes mapping
  const brandCodes = {
    "Royal Canin": "RC",
    Drools: "DR",
    Himalaya: "HL",
    Snackers: "SN",
    JerHigh: "JH",
    Pedigree: "PD",
    BarkButler: "BB",
    DogaHolic: "DH",
    FirstBark: "FB",
    Zeedog: "ZD",
    TropiClean: "TC",
    PurePet: "PP",
    Rena: "RN",
  };

  // Size codes mapping
  const sizeCodes = {
    Small: "S",
    Medium: "M",
    Large: "L",
    "Extra Large": "XL",
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/products/category/");
      setCategories(response.data);

      // Generate category codes from fetched categories
      const codes = {};
      response.data.forEach((category) => {
        // Generate code from category name
        const words = category.name.split(/[\s,&]+/);
        const code = words
          .map((word) => word.charAt(0).toUpperCase())
          .join("")
          .slice(0, 3); // Take first 3 letters
        codes[category.name] = code;
      });
      setCategoryCodes(codes);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const generateSku = () => {
    if (!selectedCategoryName || !company || !weight) return;
    const categoryCode = categoryCodes[selectedCategoryName] || "OTH";
    const brandCode = brandCodes[company] || "OTH";

    // Determine size based on weight
    let sizeCode = "S";
    const weightNum = parseFloat(weight);
    if (weightNum > 10) sizeCode = "L";
    else if (weightNum > 5) sizeCode = "M";

    // Generate unique ID using timestamp
    const timestamp = Date.now().toString().slice(-4);
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const uniqueId = `${timestamp}${randomNum}`;

    const newSku = `WW-${brandCode}-${sizeCode}-${uniqueId}`;
    setSku(newSku);
  };

  // Generate SKU when category, company, or weight changes
  useEffect(() => {
    generateSku();
  }, [selectedCategoryName, company, weight]);

  useEffect(() => {
    if (method === "edit" && id) {
      fetchProductDetails();
    }
    fetchCategories();
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    try {
      const response = await api.get("/api/adoption/breed/");
      setBreeds(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProductDetails = async () => {
    try {
      const res = await api.get(`/api/products/${id}/`);
      const data = res.data;
      setProductId(data.id);
      setProductName(data.name);
      setProductDescription(data.description);
      setSelectedCategory(data.category.id);
      setSelectedCategoryName(data.category.name);
      setProductPrice(data.price);
      setCompany(data.company);
      setSelectedBreed(data.breeds.id);
      setProductAge(data.age);
      setWeight(data.weight);
      setPreviewImage(data.image ? data.image : "");

      // Set SKU only if it exists, otherwise generate a new one
      if (data.sku) {
        setSku(data.sku);
      } else {
        generateSku();
      }
    } catch (err) {
      console.error("Failed to fetch product details:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setProductImage(file); // Store the file in state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let imageUrl = null;

    if (productImage) {
      imageUrl = await uploadToImgBB(productImage);
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
    formData.append("name", productName);
    formData.append("description", productDescription);
    formData.append("type", productType);
    formData.append("age", productAge);
    formData.append("price", productPrice);
    formData.append("breed", selectedBreed);
    formData.append("company", company);
    formData.append("weight", weight);
    formData.append("status", 1);
    formData.append("product_category_id", selectedCategory);

    // Ensure SKU is set before submitting
    if (!sku) {
      generateSku();
    }
    formData.append("sku", sku);
    console.log("Submitting SKU:", sku);

    if (imageUrl) {
      formData.append("image", imageUrl);
    }
    try {
      if (method === "edit") {
        await api.patch(`/api/products/product/${productId}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }
        alert("Product Updated Successfully!");
      } else {
        await api.post(`/api/products/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product Added Successfully!");
      }
      navigate("/products");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit product. Try again.");
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
                      onClick={() => navigate("/products")}
                      style={{ cursor: "pointer" }}
                    >
                      Products
                    </p>
                  </li>
                  <li
                    className="breadcrumb-item active text-light"
                    aria-current="page"
                  >
                    {method === "edit" ? "Edit " : "Add "}
                    product
                  </li>
                </ol>
              </nav>
              <h1 className="fs-4 mb-0">
                {method === "edit" ? "Edit " : "Add "}product
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
                  <div className="col-12 mb-4">
                    <label className="form-label" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="mb-4">
                    <label className="form-label" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="name">
                      Select Category
                    </label>
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={(e) => {
                        const selectedOption = categories.find(
                          (cat) => cat.id === e.target.value
                        );
                        setSelectedCategory(e.target.value);
                        setSelectedCategoryName(
                          selectedOption ? selectedOption.name : ""
                        );
                      }}
                      required
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="status">
                      Breed
                    </label>

                    <select
                      id="status"
                      className="form-select"
                      value={selectedBreed}
                      onChange={(e) => setSelectedBreed(e.target.value)}
                      required
                    >
                      <option value="">-- Select Breed --</option>
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
                  <div className={"col-6 mb-4"}>
                    <label className="form-label" htmlFor="price">
                      Price
                    </label>
                    <input
                      className="form-control"
                      id="price"
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      required
                    />
                  </div>

                  <div className={"col-6 mb-4"}>
                    <label className="form-label" htmlFor="type">
                      Age
                    </label>
                    <div className="mb-6">
                      <select
                        id="type"
                        className="form-select"
                        value={productAge}
                        onChange={(e) => setProductAge(e.target.value)}
                        required
                      >
                        <option value="">-- Select Age --</option>
                        <option value={"Puppy (0 - 1 Years)"}>
                          Puppy (0 - 1 Years)
                        </option>
                        <option value={"Adult (1 - 7 Years)"}>
                          Adult (1 - 7 Years)
                        </option>
                        <option value={"Mature (7 - 12 Years)"}>
                          Mature (7 - 12 Years)
                        </option>
                        <option value={"All Age"}>For All Age</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="type">
                      Brand
                    </label>
                    <div className="mb-6">
                      <select
                        id="type"
                        className="form-select"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                      >
                        <option value="">-- Select Brand --</option>
                        <option value={"Royal Canin"}>Royal Canin</option>
                        <option value={"Drools"}>Drools</option>
                        <option value={"Himalaya"}>Himalaya</option>
                        <option value={"Snackers"}>Snackers</option>
                        <option value={"JerHigh"}>JerHigh</option>
                        <option value={"Pedigree"}>Pedigree</option>
                        <option value={"BarkButler"}>BarkButler</option>
                        <option value={"DogaHolic"}>DogaHolic</option>
                        <option value={"FirstBark"}>FirstBark</option>
                        <option value={"Zeedog"}>Zeedog</option>
                        <option value={"TropiClean"}>TropiClean</option>
                        <option value={"PurePet"}>PurePet</option>
                        <option value={"Rena"}>Rena</option>
                      </select>
                    </div>
                  </div>
                  <div className={"col-6 mb-4"}>
                    <label className="form-label" htmlFor="price">
                      Weight <span className="text-secondary">(In Kgs)</span>
                    </label>
                    <input
                      className="form-control"
                      id="price"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-4">
                    <label className="form-label" htmlFor="sku">
                      SKU Number
                    </label>
                    <input
                      className="form-control"
                      id="sku"
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      readOnly
                      placeholder="SKU will be generated automatically"
                    />
                    <small className="text-muted">
                      Format: WW-Brand-Size-UniqueID
                    </small>
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
                  Save Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyProduct;
