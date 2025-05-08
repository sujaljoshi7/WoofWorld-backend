import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import Sidebar from "../layout/Sidebar";
import SearchBar from "../layout/SearchBar";
import useUser from "../hooks/useUser";
import backgroundImage from "../assets/images/user_background.jpg";
import userImage from "../assets/images/user.png";

function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [viewUser, setViewUser] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [userOrders, setUserOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const date_format = {
    year: "numeric",
    month: "long", // "short" for abbreviated months
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const handleRowClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`api/user/get-user/${id}/`); // Use api.get
        setViewUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserAddresses = async () => {
      try {
        const response = await api.get(`api/user/address/${id}/`);
        setUserAddress(response.data);
      } catch (error) {
        console.error("Error fetching user addresses:", error);
      } finally {
        setAddressLoading(false);
      }
    };

    const fetchUserOrders = async () => {
      try {
        const response = await api.get(`api/order/all/`);
        const filteredOrders = response.data
          .filter((order) => order.order.user_id === 2)
          .sort(
            (a, b) =>
              new Date(b.order.created_at) - new Date(a.order.created_at)
          );
        setUserOrders(filteredOrders);
      } catch (error) {
        console.error("Error fetching user orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchUser();
    fetchUserAddresses();
    fetchUserOrders();
  }, [id]);

  if (isLoading || loading || addressLoading || ordersLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1>Loading...</h1>
      </div>
    );
  }
  if (!user) return <p>User not found.</p>;
  return (
    <div className="d-flex">
      <div className="sidebar">
        <Sidebar user={user} />
      </div>
      <div
        className="main-content flex-grow-1 ms-2"
        style={{ marginLeft: "280px", padding: "20px" }}
      >
        <div className="mt-5 row">
          <div className="col-12 col-lg-4">
            <div className="position-sticky mb-8" style={{ top: "40px" }}>
              <div className="card bg-body mb-3">
                {/* Background Image */}
                <div
                  className="card-img-top position-relative pb-13"
                  style={{
                    background: `no-repeat center center / cover url(${backgroundImage})`,
                    height: "150px", // Adjust height as needed
                  }}
                ></div>

                {/* User Image (Avatar) Overlapping the Background */}
                <div
                  className="avatar avatar-xl rounded-circle mx-auto position-relative"
                  style={{ marginTop: "-50px" }}
                >
                  {/* <img
                    className="avatar-img border border-white border-3"
                    src={userImage}
                    alt="Profile"
                    height={80}
                    width={80}
                    style={{ borderRadius: "50%" }}
                  /> */}
                  <div
                    className="avatar-img border border-white border-3"
                    style={{
                      borderRadius: "50%",
                      height: "80px",
                      width: "80px",
                      backgroundColor: "#f8f9fa", // Light grey background for the avatar
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "32px", // optional for better visibility
                      fontWeight: "bold", // optional
                      color: "black", // optional for contrast
                      userSelect: "none", // Prevent text selection
                    }}
                  >
                    {viewUser.first_name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="card-body text-center">
                  <h1 className="card-title fs-5">
                    {viewUser.first_name + " " + viewUser.last_name}
                  </h1>
                  <p className="text-body-secondary mb-6">
                    {viewUser.first_name} is a long-standing customer with a
                    passion for technology.
                  </p>
                  <ul className="list-group list-group-flush mb-0">
                    <li className="list-group-item d-flex align-items-center justify-content-between bg-body px-0">
                      <span className="text-body-secondary">Last Login</span>
                      <span>
                        {viewUser.last_login
                          ? new Date(viewUser.last_login).toLocaleDateString(
                              undefined,
                              date_format
                            )
                          : "N/A"}
                      </span>
                    </li>
                    <li className="list-group-item d-flex align-items-center justify-content-between bg-body px-0">
                      <span className="text-body-secondary">Phone</span>
                      <span>
                        {userAddress.country === "IN" ? "+91" : ""}{" "}
                        {userAddress.phone}
                      </span>
                    </li>
                    <li className="list-group-item d-flex align-items-center justify-content-between bg-body px-0">
                      <span className="text-body-secondary">Location</span>
                      <span>
                        {userAddress.city}, {userAddress.state}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {!viewUser.is_staff && (
            <div className="col-12 col-lg-8">
              <section className="mb-8">
                <div className="d-flex align-items-center justify-content-between mb-5">
                  <h2 className="fs-5 mb-0">Recent orders</h2>
                  <div className="d-flex"></div>
                </div>

                <div className="table-responsive">
                  <table
                    className="table table-hover mb-0 bg-transparent"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <thead className="bg-transparent">
                      <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userOrders.map((order) => (
                        <tr
                          key={order.order.id}
                          onClick={() => handleRowClick(order.order.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="text-body-secondary p-3">
                            {order.order.order_id}
                          </td>
                          <td className="p-3">₹ {order.order.total}</td>
                          <td>
                            {new Date(
                              order.order.created_at
                            ).toLocaleDateString(undefined, date_format)}
                          </td>
                          <td>
                            {order.order.order_status === 1
                              ? "Pending"
                              : order.order.order_status === 2
                              ? "Processing"
                              : order.order.order_status === 3
                              ? "Shipped"
                              : order.order.order_status === 4
                              ? "Out for Delivery"
                              : order.order.order_status === 5
                              ? "Delivered"
                              : order.order.order_status === 6
                              ? "Cancelled"
                              : "Returned"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ViewUser;
