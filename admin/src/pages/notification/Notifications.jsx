import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import api from "../../api";
import Sidebar from "../../layout/Sidebar";
import { useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { format, formatDistanceToNow, isToday, parseISO } from "date-fns";

function Notifications() {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsPerPage] = useState(10);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Sample notifications data with categories - expanded to more than 10 for pagination testing
  // const [notifications, setNotifications] = useState([
  //   {
  //     id: 1,
  //     message:
  //       "We're pleased to inform you that a new customer has registered! Please follow up promptly by contacting.",
  //     timestamp: "Just Now",
  //     isStarred: false,
  //     category: "Adoption",
  //     is_read: false,
  //   },
  //   {
  //     id: 2,
  //     message:
  //       "Hello Sales Marketing Team, we have a special offer for our customers! Enjoy a 20% discount on selected items.",
  //     timestamp: "30 min ago",
  //     isStarred: true,
  //     category: "Event",
  //     is_read: true,
  //   },
  //   {
  //     id: 3,
  //     message:
  //       "Reminder to achieve this month's sales target. Currently, we've reached 70% of our goal.",
  //     timestamp: "2 days ago",
  //     isStarred: false,
  //     category: "Service",
  //     is_read: true,
  //   },
  //   {
  //     id: 4,
  //     message: "New order #5782 has been placed and is pending approval.",
  //     timestamp: "3 hours ago",
  //     isStarred: false,
  //     category: "Orders",
  //     is_read: false,
  //   },
  //   {
  //     id: 5,
  //     message: "Customer support request #2891 requires immediate attention.",
  //     timestamp: "1 day ago",
  //     isStarred: false,
  //     category: "Contact",
  //     is_read: false,
  //   },
  //   {
  //     id: 6,
  //     message:
  //       "Quarterly performance review meeting scheduled for next Monday at 10 AM.",
  //     timestamp: "4 days ago",
  //     isStarred: true,
  //     category: "Event",
  //     is_read: true,
  //   },
  //   {
  //     id: 7,
  //     message:
  //       "System maintenance scheduled for tonight at 2 AM. Services will be temporarily unavailable.",
  //     timestamp: "5 hours ago",
  //     isStarred: false,
  //     category: "Service",
  //     is_read: false,
  //   },
  //   {
  //     id: 8,
  //     message:
  //       "Product inventory for SKU-2367 is running low. Consider restocking soon.",
  //     timestamp: "2 days ago",
  //     isStarred: false,
  //     category: "Orders",
  //     is_read: true,
  //   },
  //   {
  //     id: 9,
  //     message:
  //       "New feature launch: Customer feedback portal is now live. Share with your clients!",
  //     timestamp: "3 days ago",
  //     isStarred: true,
  //     category: "Adoption",
  //     is_read: false,
  //   },
  //   {
  //     id: 10,
  //     message:
  //       "Team meeting rescheduled to Thursday at 2 PM. Please adjust your calendars accordingly.",
  //     timestamp: "1 day ago",
  //     isStarred: false,
  //     category: "Event",
  //     is_read: true,
  //   },
  //   {
  //     id: 11,
  //     message:
  //       "Customer John Doe has submitted a complaint about recent order #6721.",
  //     timestamp: "4 hours ago",
  //     isStarred: false,
  //     category: "Contact",
  //     is_read: false,
  //   },
  //   {
  //     id: 12,
  //     message:
  //       "API integration with third-party service is now complete. Documentation available in the developer portal.",
  //     timestamp: "2 days ago",
  //     isStarred: false,
  //     category: "Service",
  //     is_read: true,
  //   },
  //   {
  //     id: 13,
  //     message:
  //       "New user registration from marketing campaign has increased by 25% this week.",
  //     timestamp: "12 hours ago",
  //     isStarred: false,
  //     category: "Adoption",
  //     is_read: true,
  //   },
  //   {
  //     id: 14,
  //     message:
  //       "Bulk order #7823 requires verification before processing. Value exceeds $5,000.",
  //     timestamp: "6 hours ago",
  //     isStarred: true,
  //     category: "Orders",
  //     is_read: false,
  //   },
  //   {
  //     id: 15,
  //     message:
  //       "Platform security audit scheduled for next week. Please ensure all documentation is up to date.",
  //     timestamp: "2 days ago",
  //     isStarred: false,
  //     category: "Service",
  //     is_read: true,
  //   },
  //   {
  //     id: 16,
  //     message:
  //       "VIP customer Sarah Williams has requested a product demo. Please schedule within 48 hours.",
  //     timestamp: "1 day ago",
  //     isStarred: true,
  //     category: "Contact",
  //     is_read: false,
  //   },
  //   {
  //     id: 17,
  //     message:
  //       "Monthly revenue report is ready for review. Sales exceeded targets by 12%.",
  //     timestamp: "5 hours ago",
  //     isStarred: false,
  //     category: "Event",
  //     is_read: true,
  //   },
  //   {
  //     id: 18,
  //     message:
  //       "New onboarding materials published. Share with recent customers.",
  //     timestamp: "3 days ago",
  //     isStarred: false,
  //     category: "Adoption",
  //     is_read: true,
  //   },
  //   {
  //     id: 19,
  //     message:
  //       "Shipping partner has reported delays. Some orders may be affected.",
  //     timestamp: "8 hours ago",
  //     isStarred: false,
  //     category: "Orders",
  //     is_read: false,
  //   },
  //   {
  //     id: 20,
  //     message: "Product training webinar scheduled for next Tuesday at 1 PM.",
  //     timestamp: "4 days ago",
  //     isStarred: false,
  //     category: "Event",
  //     is_read: true,
  //   },
  //   {
  //     id: 21,
  //     message:
  //       "Customer feedback survey results are now available for Q1 2025.",
  //     timestamp: "1 day ago",
  //     isStarred: false,
  //     category: "Service",
  //     is_read: true,
  //   },
  //   {
  //     id: 22,
  //     message:
  //       "Emergency maintenance required on server cluster B. Scheduled for tonight.",
  //     timestamp: "2 hours ago",
  //     isStarred: true,
  //     category: "Service",
  //     is_read: false,
  //   },
  //   {
  //     id: 23,
  //     message:
  //       "New product catalog has been published. Update your sales materials.",
  //     timestamp: "2 days ago",
  //     isStarred: false,
  //     category: "Adoption",
  //     is_read: true,
  //   },
  // ]);
  const [notifications, setNotifications] = useState([]);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      console.error("No token found!");
      setIsLoadingUser(false);
      return;
    }
    try {
      // Fetch user details independently
      const servicesRes = api.get("/api/notifications/");

      // Wait for both requests to complete independently
      const [services] = await Promise.all([servicesRes]);

      // Sort products by created_at and id in ascending order
      const sortedProducts = services.data.sort((a, b) => {
        const dateComparison = new Date(b.timestamp) - new Date(a.timestamp); // Descending
        if (dateComparison !== 0) return dateComparison;
        return b.id - a.id; // Descending by ID if same timestamp
      });

      // Update state
      setNotifications(sortedProducts);
      setFilteredData(sortedProducts);
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token expired, refreshing...");

        const refreshed = await handleTokenRefresh();
        if (refreshed) {
          return fetchProducts(); // Retry after refreshing
        }
      } else {
        console.error("Failed to fetch user data:", error);
      }
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleSidebarCollapse = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  const toggleStar = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isStarred: !notification.isStarred }
          : notification
      )
    );
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, is_read: true }
          : notification
      )
    );

    api.patch(`/api/notifications/${id}/`, { is_read: true }).catch((error) => {
      console.error("Failed to mark notification as read:", error);
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  // Filter notifications based on search query and active category
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = notification.message
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (activeCategory === "All") {
      return matchesSearch;
    } else if (activeCategory === "Unread") {
      return matchesSearch && !notification.is_read;
    } else if (activeCategory === "Starred") {
      return matchesSearch && notification.isStarred;
    } else {
      return matchesSearch && notification.category === activeCategory;
    }
  });

  // Get current notifications for pagination
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification =
    indexOfLastNotification - notificationsPerPage;
  const currentNotifications = filteredNotifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification
  );

  // Calculate page numbers
  const totalPages = Math.ceil(
    filteredNotifications.length / notificationsPerPage
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Count notifications by category
  const counts = {
    All: notifications.length,
    Starred: notifications.filter((n) => n.isStarred).length,
    Unread: notifications.filter((n) => !n.is_read).length,
    Orders: notifications.filter((n) => n.category === "Orders").length,
    Adoption: notifications.filter((n) => n.category === "Adoption").length,
    Contact: notifications.filter((n) => n.category === "Contact").length,
    Event: notifications.filter((n) => n.category === "Event").length,
    Service: notifications.filter((n) => n.category === "Service").length,
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleTokenRefresh = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      console.error("No refresh token found, redirecting...");
      window.location.href = "/login";
      return;
    }

    try {
      const response = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      localStorage.setItem(ACCESS_TOKEN, response.data.access);
      console.log("Token refreshed successfully");
      // await fetchDashboardData();
    } catch (error) {
      console.error("Failed to refresh token:", error);
      window.location.href = "/login";
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, is_read: true }))
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar user={user} onCollapse={handleSidebarCollapse} />
      <div
        className="main-content flex-grow-1"
        style={{
          marginLeft: isSidebarCollapsed ? "80px" : "280px",
          padding: window.innerWidth < 768 ? "1rem" : "2.5rem",
          transition: "all 0.3s ease-in-out",
          width: isSidebarCollapsed
            ? "calc(100% - 80px)"
            : "calc(100% - 280px)",
        }}
      >
        <div className="container p-4 rounded shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1">Notifications</h4>
              <p className="text-muted mb-0">
                {filteredNotifications.length} notifications found | Showing{" "}
                {indexOfFirstNotification + 1}-
                {Math.min(
                  indexOfLastNotification,
                  filteredNotifications.length
                )}{" "}
                of {filteredNotifications.length}
              </p>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleMarkAllAsRead}
              >
                <i className="bi bi-check2-all me-1"></i> Mark all as read
              </button>
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary btn-sm dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-gear me-1"></i> Actions
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Archive all
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Export notifications
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Settings
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="search"
                className="form-control border-start-0 ps-0"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Category tabs */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeCategory === "All" ? "active" : ""
                }`}
                onClick={() => handleCategoryChange("All")}
              >
                All{" "}
                <span className="badge bg-secondary ms-1">{counts.All}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeCategory === "Unread" ? "active" : ""
                }`}
                onClick={() => handleCategoryChange("Unread")}
              >
                Unread{" "}
                <span className="badge bg-danger ms-1">{counts.Unread}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeCategory === "Starred" ? "active" : ""
                }`}
                onClick={() => handleCategoryChange("Starred")}
              >
                Starred{" "}
                <span className="badge bg-warning ms-1">{counts.Starred}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeCategory === "Orders" ? "active" : ""
                }`}
                onClick={() => handleCategoryChange("Orders")}
              >
                Orders{" "}
                <span className="badge bg-info ms-1">{counts.Orders}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeCategory === "Adoption" ? "active" : ""
                }`}
                onClick={() => handleCategoryChange("Adoption")}
              >
                Adoption{" "}
                <span className="badge bg-success ms-1">{counts.Adoption}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeCategory === "Contact" ? "active" : ""
                }`}
                onClick={() => handleCategoryChange("Contact")}
              >
                Contact{" "}
                <span className="badge bg-primary ms-1">{counts.Contact}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeCategory === "Event" ? "active" : ""
                }`}
                onClick={() => handleCategoryChange("Event")}
              >
                Event{" "}
                <span className="badge bg-danger ms-1">{counts.Event}</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeCategory === "Service" ? "active" : ""
                }`}
                onClick={() => handleCategoryChange("Service")}
              >
                Service{" "}
                <span className="badge bg-dark ms-1">{counts.Service}</span>
              </button>
            </li>
          </ul>

          {/* Notifications list */}
          <div className="list-group">
            {currentNotifications.length > 0 ? (
              currentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`list-group-item list-group-item-action d-flex align-items-start p-3 ${
                    !notification.is_read ? "text-light" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <div className="d-flex align-items-start w-100">
                    <button
                      className={`btn btn-sm border-0 p-0 me-3 ${
                        notification.isStarred
                          ? "text-warning"
                          : "text-secondary"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(notification.id);
                      }}
                    >
                      <i
                        className={`bi ${
                          notification.isStarred ? "bi-star-fill" : "bi-star"
                        } fs-5`}
                      ></i>
                    </button>
                    <div className="w-100">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span
                          className={`badge bg-${getCategoryColor(
                            notification.category
                          )} me-2`}
                        >
                          {notification.category}
                        </span>
                        <small className="text-muted">
                          {(() => {
                            const parsedDate = parseISO(notification.timestamp);
                            return isToday(parsedDate)
                              ? `${formatDistanceToNow(parsedDate, {
                                  addSuffix: true,
                                })}`
                              : format(parsedDate, "MMM d, yyyy 'at' h:mm a");
                          })()}
                        </small>
                      </div>
                      <p
                        className={`mb-0 ${
                          !notification.is_read ? "fw-semibold" : ""
                        }`}
                      >
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4">
                <i className="bi bi-bell-slash fs-1 text-muted"></i>
                <p className="mt-3 mb-0">No notifications found</p>
                <p className="text-muted small">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredNotifications.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div>
                <p className="text-muted mb-0 small">
                  Showing {indexOfFirstNotification + 1}-
                  {Math.min(
                    indexOfLastNotification,
                    filteredNotifications.length
                  )}{" "}
                  of {filteredNotifications.length} notifications
                </p>
              </div>
              <nav aria-label="Notifications pagination">
                <ul className="pagination pagination-sm mb-0">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>

                  {/* First page */}
                  {currentPage > 3 && (
                    <li className="page-item">
                      <button className="page-link" onClick={() => paginate(1)}>
                        1
                      </button>
                    </li>
                  )}

                  {/* Ellipsis after first page */}
                  {currentPage > 3 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}

                  {/* Pages */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;

                    // Show current page, and 1 page before and after
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <li
                          key={pageNum}
                          className={`page-item ${
                            currentPage === pageNum ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    }
                    return null;
                  })}

                  {/* Ellipsis before last page */}
                  {currentPage < totalPages - 2 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}

                  {/* Last page */}
                  {currentPage < totalPages - 2 && totalPages > 1 && (
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => paginate(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </li>
                  )}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to get appropriate badge color for categories
function getCategoryColor(category) {
  switch (category) {
    case "Orders":
      return "info";
    case "Adoption":
      return "success";
    case "Contact":
      return "primary";
    case "Event":
      return "danger";
    case "Service":
      return "dark";
    default:
      return "secondary";
  }
}

export default Notifications;
