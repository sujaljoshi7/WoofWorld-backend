import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import man from "../../assets/images/icons/man.png";
import AddressForm from "../../components/profile/AddressForm";
import api from "../../api";
import Navbar from "../../components/common/Navbar";

const UserProfile = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [user, setUser] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  // Mock user data - in a real app, this would come from props or a context
  const userData = {
    name: user.first_name + " " + user.last_name,
    email: user.email,
    memberSince: new Date(user.member_since).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    lastLogin: new Date(user.last_login).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }),
    totalEvents: 10,
    totalOrders: 5,
    address: user.address
      ? {
          name: user.address.name,
          addressLine1: user.address.address_line_1,
          addressLine2: user.address.address_line_2,
          city: user.address.city,
          state: user.address.state,
          country: user.address.country,
          phone: user.address.phone,
          postalCode: user.address.postal_code,
          createdAt: new Date(user.address.created_at).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }
          ),
        }
      : "No address found",
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`api/user/loggedin-user/`); // Use api.get
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleAddressSubmit = (addressData) => {
    // In a real app, you would send this data to your backend
    console.log("Address submitted:", addressData);

    // Hide the form and reset the editing state
    setShowAddressForm(false);
    setEditingAddress(null);

    // Show success message (you can implement this as needed)
    alert("Address saved successfully!");
  };

  const orders = [
    {
      id: "ORD-12345",
      date: "March 1, 2025",
      status: "Shipped",
      statusColor: "#2ecc71",
    },
    {
      id: "ORD-12346",
      date: "March 15, 2025",
      status: "Delivered",
      statusColor: "#3498db",
    },
    {
      id: "ORD-12347",
      date: "March 25, 2025",
      status: "Processing",
      statusColor: "#f39c12",
    },
  ];

  const eventTickets = [
    {
      id: 1,
      name: "Annual Tech Conference",
      date: "April 10, 2025",
      location: "Convention Center, Downtown",
      image: "path/to/image.jpg",
    },
    {
      id: 2,
      name: "Music Festival 2025",
      date: "April 15, 2025",
      location: "Central Park Amphitheater",
      image: "path/to/image2.jpg",
    },
  ];

  return (
    <div>
      <div className="main-content">
        <Navbar />
        <div className="container py-5">
          <div className="card shadow border-0 overflow-hidden">
            {/* Profile Header */}
            <div
              className="card-header p-4 position-relative"
              style={{
                background:
                  "linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)",
                color: "white",
                borderRadius: "0",
              }}
            >
              <div className="row align-items-center">
                <div className="col-md-6 d-flex align-items-center">
                  <div className="position-relative">
                    <img
                      src={man}
                      alt="Profile"
                      className="rounded-circle border border-3 border-white shadow"
                      width="100"
                      height="100"
                    />
                    <span
                      className="position-absolute bottom-0 end-0 bg-success rounded-circle p-1 border border-white"
                      style={{ width: "16px", height: "16px" }}
                      title="Online"
                    ></span>
                  </div>
                  <div className="ms-3">
                    <h4 className="mb-1 fw-bold">{userData.name}</h4>
                    <p className="mb-1 opacity-75">
                      <i className="fas fa-envelope me-2"></i>
                      {userData.email}
                    </p>
                    <p className="mb-0 opacity-75">
                      <i className="fas fa-calendar-alt me-2"></i>Member since{" "}
                      {userData.memberSince}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row justify-content-end g-3">
                    <div className="col-auto">
                      <div
                        className="card text-dark h-100 p-3 shadow-sm border-0"
                        style={{ minWidth: "140px" }}
                      >
                        <div className="text-center">
                          <i className="fas fa-ticket-alt fs-3 mb-2 text-primary"></i>
                          <h5 className="mb-0">{userData.totalEvents}</h5>
                          <p className="mb-0 small text-muted">Total Events</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-auto">
                      <div
                        className="card text-dark h-100 p-3 shadow-sm border-0"
                        style={{ minWidth: "140px" }}
                      >
                        <div className="text-center">
                          <i className="fas fa-shopping-bag fs-3 mb-2 text-primary"></i>
                          <h5 className="mb-0">{userData.totalOrders}</h5>
                          <p className="mb-0 small text-muted">Total Orders</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              {/* Edit Profile Button */}
              <div className="px-4 py-3 bg-light d-flex justify-content-between align-items-center border-bottom">
                <button className="btn btn-primary rounded-pill">
                  <i className="fas fa-pencil-alt me-2"></i>
                  Edit Profile
                </button>
                <div className="dropdown">
                  <button
                    className="btn btn-light rounded-circle"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <li>
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-download me-2"></i>Download Data
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-trash me-2"></i>Delete Account
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-sign-out-alt me-2"></i>Log Out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Navigation Tabs */}
              <ul className="nav nav-tabs nav-fill border-0">
                {[
                  {
                    id: "details",
                    label: "Profile Details",
                    icon: "fas fa-user",
                  },
                  {
                    id: "address",
                    label: "Address",
                    icon: "fas fa-map-marker-alt",
                  },
                  {
                    id: "orders",
                    label: "Order History",
                    icon: "fas fa-shopping-cart",
                  },
                  {
                    id: "tickets",
                    label: "Event Tickets",
                    icon: "fas fa-ticket-alt",
                  },
                ].map((tab) => (
                  <li className="nav-item" key={tab.id}>
                    <button
                      className={`nav-link border-0 rounded-0 py-3 ${
                        activeTab === tab.id ? "active fw-bold" : ""
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <i className={`${tab.icon} me-2`}></i>
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Tab Content */}
              <div className="p-4">
                {activeTab === "details" && (
                  <div className="details-container">
                    <h5 className="border-bottom pb-2 mb-4">
                      <i className="fas fa-info-circle me-2"></i>Personal
                      Information
                    </h5>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="text-muted small">
                                Full Name
                              </label>
                              <p className="mb-0 fs-5">{userData.name}</p>
                            </div>
                            <div className="mb-3">
                              <label className="text-muted small">
                                Email Address
                              </label>
                              <p className="mb-0 fs-5">{userData.email}</p>
                            </div>
                            <div>
                              <label className="text-muted small">
                                Member Since
                              </label>
                              <p className="mb-0 fs-5">
                                {userData.memberSince}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="card-body">
                            <div className="mb-3">
                              <label className="text-muted small">
                                Last Login
                              </label>
                              <p className="mb-0 fs-5">{userData.lastLogin}</p>
                            </div>
                            <div className="mb-3">
                              <label className="text-muted small">
                                Account Status
                              </label>
                              <p className="mb-0 fs-5">
                                <span className="badge bg-success">Active</span>
                              </p>
                            </div>
                            <div>
                              <label className="text-muted small">
                                Verification
                              </label>
                              <p className="mb-0 fs-5">
                                <span className="badge bg-primary">
                                  Verified
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "address" && (
                  <div>
                    <h5 className="border-bottom pb-2 mb-4">
                      <i className="fas fa-home me-2"></i>Address Information
                    </h5>

                    {!showAddressForm ? (
                      <>
                        {/* Display existing addresses */}
                        <div className="card mb-4 border-0 shadow-sm">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-8">
                                <div className="d-flex align-items-center mb-3">
                                  <h6 className="text-muted mb-0">
                                    Primary Address
                                  </h6>
                                  <span className="badge bg-primary ms-2">
                                    Default
                                  </span>
                                </div>
                                <p className="mb-1">
                                  {userData.address.name},{" "}
                                  {userData.address.addressLine1},{" "}
                                  {userData.address.addressLine2},{" "}
                                  {userData.address.city},{" "}
                                  {userData.address.state},{" "}
                                  {userData.address.country},{" - "}
                                  {userData.address.postalCode}
                                </p>
                              </div>
                              <div className="col-md-4 d-flex align-items-center justify-content-end">
                                <button
                                  className="btn btn-outline-primary me-2"
                                  onClick={() => {
                                    setEditingAddress({
                                      name: userData.name,
                                      addressLine1:
                                        userData.address.addressLine1,
                                      addressLine2:
                                        userData.address.addressLine2 || "",
                                      city: userData.address.city,
                                      state: userData.address.state,
                                      postalCode: userData.address.postalCode,
                                      country: userData.address.country,
                                      phone: userData.address.phone,
                                      isDefault: true,
                                      addressType: "home",
                                    });
                                    setShowAddressForm(true);
                                  }}
                                >
                                  <i className="fas fa-pencil-alt me-2"></i>Edit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <button
                            className="btn btn-primary rounded-pill"
                            onClick={() => {
                              setEditingAddress(null);
                              setShowAddressForm(true);
                            }}
                          >
                            <i className="fas fa-plus me-2"></i>Add New Address
                          </button>
                        </div>
                      </>
                    ) : (
                      <AddressForm
                        onSubmit={handleAddressSubmit}
                        onCancel={() => {
                          setShowAddressForm(false);
                          setEditingAddress(null);
                        }}
                        existingAddress={editingAddress}
                      />
                    )}
                  </div>
                )}

                {activeTab === "orders" && (
                  <div>
                    <h5 className="border-bottom pb-2 mb-4">
                      <i className="fas fa-shopping-bag me-2"></i>Order History
                    </h5>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead className="bg-light">
                          <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id}>
                              <td className="fw-bold">{order.id}</td>
                              <td>{order.date}</td>
                              <td>
                                <span
                                  className="badge rounded-pill px-3 py-2"
                                  style={{
                                    backgroundColor: order.statusColor,
                                    color: "white",
                                  }}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="text-end">
                                <button className="btn btn-sm btn-outline-primary">
                                  <i className="fas fa-eye me-2"></i>View
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "tickets" && (
                  <div>
                    <h5 className="border-bottom pb-2 mb-4">
                      <i className="fas fa-ticket-alt me-2"></i>Event Tickets
                    </h5>
                    <div className="row g-4">
                      {eventTickets.map((ticket) => (
                        <div className="col-lg-4 col-md-6" key={ticket.id}>
                          <div className="card h-100 border-0 shadow-sm overflow-hidden">
                            <div className="position-relative">
                              <img
                                src={ticket.image || "/api/placeholder/400/200"}
                                className="card-img-top"
                                alt={ticket.name}
                                style={{ height: "180px", objectFit: "cover" }}
                              />
                              <div className="position-absolute top-0 end-0 m-2">
                                <span className="badge bg-primary rounded-pill px-3 py-2">
                                  Active
                                </span>
                              </div>
                            </div>
                            <div className="card-body">
                              <h5 className="card-title mb-3">{ticket.name}</h5>
                              <div className="mb-2 d-flex align-items-center">
                                <i className="fas fa-calendar-day text-primary me-2"></i>
                                <span>{ticket.date}</span>
                              </div>
                              <div className="mb-3 d-flex align-items-center">
                                <i className="fas fa-map-marker-alt text-danger me-2"></i>
                                <span>{ticket.location}</span>
                              </div>
                              <div className="d-grid">
                                <button className="btn btn-primary rounded-pill">
                                  <i className="fas fa-qrcode me-2"></i>View
                                  Ticket
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="col-lg-4 col-md-6">
                        <div
                          className="card h-100 border-0 shadow-sm border-dashed d-flex align-items-center justify-content-center"
                          style={{
                            borderStyle: "dashed",
                            borderWidth: "2px",
                            borderColor: "#dee2e6",
                          }}
                        >
                          <div className="card-body text-center">
                            <i
                              className="fas fa-plus-circle text-muted mb-3"
                              style={{ fontSize: "48px" }}
                            ></i>
                            <h5 className="text-muted">Browse More Events</h5>
                            <button className="btn btn-outline-primary mt-3 rounded-pill">
                              Explore Events
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
