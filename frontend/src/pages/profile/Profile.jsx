import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import man from "../../assets/images/icons/man.png";
import AddressForm from "../../components/profile/AddressForm";
import api from "../../api";
import Navbar from "../../components/common/Navbar";
import TicketButton from "../../components/event/TicketButton";
import { QRCodeCanvas } from "qrcode.react";
import logo from "../../assets/images/logo/logo1.png";
import LoadingScreen from "../../components/LoadingScreen";
import OrderDetails from "../../components/profile/OrderDetails";
import { FaTrash, FaExclamationTriangle } from "react-icons/fa";

const UserProfile = () => {
  const navigate = useNavigate();
  const [qrData, setQrData] = useState("https://example.com/event");
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [user, setUser] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [allUpcomingEvents, setAllUpcomingEvents] = useState([]);
  const [allPastEvents, setAllPastEvents] = useState([]);
  const [totalOrders, setTotalOrders] = useState([]);
  const [totalEvents, setTotalEvents] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showLoading, setShowLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get(`api/order/`);

      // Format order data, only including orders with type 1 items
      const formattedOrders = response.data
        .map((orderData) => {
          const order = orderData.order;

          // Filter order items to only count type 1
          const type1Items = orderData.order_items.filter(
            (item) => item.type === 1
          );

          // If no type 1 items, exclude the order
          if (type1Items.length === 0) return null;

          const totalItems = type1Items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          return {
            id: order.id,
            date: new Date(order.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            order_id: order.order_id,
            status: getStatus(order.order_status),
            statusColor: getStatusColor(order.order_status),
            totalItems,
            total: order.total,
          };
        })
        .filter(Boolean); // Remove null values (orders without type 1 items)

      // Count total orders
      const totalOrders = formattedOrders.length;

      // Extract all order_items where type is 2
      const type2OrderItems = response.data.flatMap((orderData) =>
        orderData.order_items.filter((item) => item.type === 2)
      );

      if (type2OrderItems.length === 0) {
        setAllOrders(formattedOrders);
        setAllUpcomingEvents([]);
        setAllPastEvents([]);
        setTotalOrders(totalOrders);
        setTotalEvents(0);
        return;
      }

      // Fetch event details for each unique event ID
      const eventIds = [...new Set(type2OrderItems.map((item) => item.item))]; // Get unique event IDs
      const eventResponses = await Promise.all(
        eventIds.map((id) => api.get(`api/events/${id}/`))
      );

      // Map event data
      const eventsData = eventResponses.map((res) => res.data);

      // Count total events
      const totalEvents = eventsData.length;

      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize for date-only comparison

      // Map order items to event data
      const type2OrderItemsWithEvents = type2OrderItems.map((item) => {
        const event = eventsData.find((event) => event.id === item.item);
        return event ? { ...item, event } : { ...item, event: null };
      });

      // Separate upcoming and past events
      const upcomingEvents = type2OrderItemsWithEvents.filter(
        (item) => item.event && new Date(item.event.date) >= today
      );
      const pastEvents = type2OrderItemsWithEvents.filter(
        (item) => item.event && new Date(item.event.date) < today
      );

      // Update state
      setAllOrders(formattedOrders);
      setAllUpcomingEvents(upcomingEvents);
      setAllPastEvents(pastEvents);
      setTotalOrders(totalOrders);
      setTotalEvents(totalEvents);
    } catch (error) {
      console.error("Error fetching orders or events:", error);
      if (error.response?.status === 401) {
        try {
          const refreshed = await handleTokenRefresh();
          if (refreshed) {
            // Retry after refreshing
            return fetchData(endpoint, filterFn, stateKey);
          } else {
            console.error("Token refresh failed.");
            localStorage.clear();
            window.location.reload();
          }
        } catch (refreshError) {
          console.error("Error during token refresh:", refreshError);
          localStorage.clear();
          window.location.reload();
        }
      } else {
        console.error(`Failed to fetch ${stateKey}:`, error);
      }
    } finally {
      setLoading(false);
    }
  };

  const delete_user = async () => {
    try {
      const response = await api.delete(`api/user/${user.id}/delete/`);
      console.log("User deleted successfully:", response.data);
      // Optional: redirect or log the user out after deletion
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response?.data || error.message
      );
      // Optional: show toast or message
    }
  };

  // Helper functions to get status text and color
  const getStatus = (order_status) => {
    switch (order_status) {
      case 1:
        return "Placed";
      case 2:
        return "Packed";
      case 3:
        return "In Transit";
      case 4:
        return "Out for delivery";
      case 5:
        return "Delivered";
      case 6:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (order_status) => {
    switch (order_status) {
      case 1: // Placed
        return "#3498db"; // Blue
      case 2: // Confirmed
        return "#9b59b6"; // Purple
      case 3: // Packed
        return "#f39c12"; // Orange
      case 4: // In Transit
        return "#2ecc71"; // Green
      case 5: // Out for delivery
        return "#2ecc71"; // Green
      case 6: // Delivered
        return "#e74c3c"; // Red
      default:
        return "#95a5a6"; // Gray for Unknown
    }
  };

  // Function to open modal from OrdersTable

  const handleAddressSubmit = (addressData) => {
    //   // In a real app, you would send this data to your backend
    //   console.log("Address submitted:", addressData);

    // Hide the form and reset the editing state
    setShowAddressForm(false);
    setEditingAddress(null);
    window.location.reload();

    //   // Show success message (you can implement this as needed)
    //   // alert("Address saved successfully!");
  };

  const eventData = {
    eventName: "Dog Lovers Meetup",
    date: "April 10, 2025",
    time: "4:00 PM - 7:00 PM",
    location: "Central Park, NYC",
    qrCodeUrl:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://woofworld.com/event",
  };

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setShowLoading(false), 500); // Wait for fade-out to finish
      }, 3000);
    }
  }, [loading]);

  const handleDeleteAccount = async () => {
    try {
      await api.delete(`api/user/${user.id}/delete-user/`);
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  if (showLoading) return <LoadingScreen fadeOut={fadeOut} />;
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
                    {/* <img
                      src={man}
                      alt="Profile"
                      className="rounded-circle border border-3 border-white shadow"
                      width="100"
                      height="100"
                    /> */}
                    <div
                      className="rounded-circle border border-3 border-white shadow"
                      style={{
                        borderRadius: "50%",
                        height: "80px",
                        width: "80px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "32px", // optional for better visibility
                        fontWeight: "bold", // optional
                        color: "black", // optional for contrast
                        backgroundColor: "#f8f9fa",
                        userSelect: "none",
                      }}
                    >
                      {user.first_name.charAt(0).toUpperCase()}
                    </div>
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
                          <h5 className="mb-0">{totalEvents}</h5>
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
                          <h5 className="mb-0">{totalOrders}</h5>
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
              <div className="px-4 py-3 bg-light d-flex justify-content-start align-items-center border-bottom">
                <button
                  className="btn btn-warning rounded-pill me-2"
                  onClick={() => {
                    localStorage.clear(); // Clears all local storage data
                    window.location.href = "/"; // Redirects to the homepage
                  }}
                >
                  <i className="fas fa-trash-alt me-2"></i>
                  Logout
                </button>

                <button
                  className="btn btn-danger rounded-pill"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <i className="fas fa-trash-alt me-2"></i>
                  Delete Account
                </button>
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
                              <p className="mb-0 fs-5">
                                {userData.lastLogin ? userData.lastLogin : "--"}
                              </p>
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
                        {/* Display existing addresses or "No address found" message */}
                        {userData.address === "No address found" ? (
                          <div className="text-center py-5">
                            <div className="mb-4">
                              <i
                                className="fas fa-map-marker-alt text-muted"
                                style={{ fontSize: "48px" }}
                              ></i>
                            </div>
                            <h5 className="text-muted mb-3">
                              No Address Found
                            </h5>
                            <button
                              className="btn btn-primary rounded-pill"
                              onClick={() => {
                                setEditingAddress(null);
                                setShowAddressForm(true);
                              }}
                            >
                              <i className="fas fa-plus me-2"></i>Add Address
                            </button>
                          </div>
                        ) : (
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
                                        name: userData.address.name,
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
                                    <i className="fas fa-pencil-alt me-2"></i>
                                    Edit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
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
                            <th className="px-4 py-2 text-left">Order ID</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Total Items</th>
                            <th className="px-4 py-2 text-left">Total Price</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allOrders.map((order) => (
                            <tr key={order.id}>
                              <td className="fw-bold px-4 py-2">
                                #{order.order_id}
                              </td>
                              <td className="px-4 py-2">{order.date}</td>
                              <td className="px-4 py-2">{order.totalItems}</td>
                              <td className="px-4 py-2">₹{order.total}</td>
                              <td className="px-4 py-2">
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
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => setSelectedOrderId(order.id)}
                                >
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
                      {allUpcomingEvents.length > 0 ? (
                        allUpcomingEvents.map((ticket) => (
                          <div className="col-lg-4 col-md-6" key={ticket.id}>
                            <div className="card h-100 border-0 shadow-sm overflow-hidden">
                              <div className="position-relative">
                                <img
                                  src={ticket.event?.image}
                                  className="card-img-top"
                                  alt={ticket.event.name}
                                  style={{
                                    height: "250px",
                                    objectFit: "cover",
                                  }}
                                />
                                <div className="position-absolute top-0 end-0 m-2">
                                  <span className="badge bg-primary rounded-pill px-3 py-2">
                                    Upcoming
                                  </span>
                                </div>
                              </div>
                              <div className="card-body">
                                <h5 className="card-title mb-3">
                                  {ticket.event.name}
                                </h5>
                                <div className="mb-2 d-flex align-items-center">
                                  <i className="fas fa-calendar-day text-primary me-2"></i>
                                  <span>
                                    {new Date(
                                      ticket.event.date
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric",
                                    })}{" "}
                                    at {ticket.event.time}
                                  </span>
                                </div>
                                <div className="mb-3 d-flex align-items-center">
                                  <i className="fas fa-map-marker-alt text-danger me-2"></i>
                                  <span>{ticket.event.address_line_1}</span>
                                </div>
                                <div className="d-grid">
                                  {/* <button className="btn btn-primary rounded-pill">
                                    <i className="fas fa-qrcode me-2"></i>View
                                    Ticket
                                  </button> */}
                                  <TicketButton
                                    eventData={{
                                      attendeeName: userData.first_name,
                                      eventName: ticket.event.name,
                                      date: `${new Date(
                                        ticket.event.date
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                      })} at ${ticket.event.time}`,
                                      location:
                                        ticket.event.address_line_1 +
                                          " " +
                                          ticket.event.address_line_2 || "",
                                      qrCodeUrl:
                                        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://woofworld.com/event",
                                      quantity: ticket.quantity,
                                      logoUrl: `${BASE_URL}/media/logo/logo.png`,
                                      mapsUrl: ticket.event.maps_link,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No upcoming events found.</p>
                      )}

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
                            <button
                              className="btn btn-outline-primary mt-3 rounded-pill"
                              onClick={() => {
                                navigate("/events/upcoming");
                                window.scrollTo(0, 0);
                              }}
                            >
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

      {/* Order Details Modal */}
      {selectedOrderId && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <OrderDetails
              orderId={selectedOrderId}
              onClose={() => setSelectedOrderId(null)}
            />
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="container">
          <div
            className="modal-dialog modal-dialog-centered fade show"
            style={{ zIndex: 1050 }}
          >
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1051,
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                overflow: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div
                  className="modal-content"
                  style={{
                    background:
                      "linear-gradient(135deg, #f8d7da, #f5c6cb, #f1aeb5)",
                    border: "none",
                    borderRadius: "10px",
                    boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
                  }}
                >
                  <div className="modal-header border-0">
                    <h5 className="modal-title text-danger">
                      <FaExclamationTriangle className="me-2" />
                      Delete Account
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowDeleteModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body text-center py-4">
                    <h4 className="mb-3 text-dark">Are you sure?</h4>
                    <p className="text-dark opacity-75">
                      This action cannot be undone. All your data will be
                      permanently deleted.
                    </p>
                  </div>
                  <div className="modal-footer border-0 justify-content-center">
                    <button
                      type="button"
                      className="btn btn-light px-4 py-2"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger px-4 py-2"
                      onClick={handleDeleteAccount}
                    >
                      Yes, Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
