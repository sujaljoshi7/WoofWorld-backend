import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import Sidebar from "../layout/Sidebar";
import SearchBar from "../layout/SearchBar";
import useUser from "../hooks/useUser";
import backgroundImage from "../assets/images/user_background.jpg";
import userImage from "../assets/images/user.png";

function ViewUser() {
  const { id } = useParams();
  const { user, isLoading } = useUser();
  const [viewUser, setViewUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const date_format = {
    year: "numeric",
    month: "long", // "short" for abbreviated months
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
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

    fetchUser();
  }, [id]);

  if (isLoading || loading) {
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
                  <img
                    className="avatar-img border border-white border-3"
                    src={userImage}
                    alt="Profile"
                    height={80}
                    width={80}
                    style={{ borderRadius: "50%" }}
                  />
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
                      <span>(202) 555-0126</span>
                    </li>
                    <li className="list-group-item d-flex align-items-center justify-content-between bg-body px-0">
                      <span className="text-body-secondary">Location</span>
                      <span>San Francisco, CA</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-8">
            <section class="mb-8">
              <div class="d-flex align-items-center justify-content-between mb-5">
                <h2 class="fs-5 mb-0">Recent orders</h2>
                <div class="d-flex"></div>
              </div>

              <div class="table-responsive">
                <table
                  class="table table-hover mb-0 bg-transparent"
                  style={{ backgroundColor: "transparent" }}
                >
                  <thead className="bg-transparent">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Product</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-body-secondary p-3">#3456</td>
                      <td className="p-3">Apple MacBook Pro</td>
                      <td className="p-3">2021-08-12</td>
                      <td className="p-3">
                        <span className="badge bg-success-subtle text-success">
                          Completed
                        </span>
                      </td>
                      <td className="p-3">$2,499</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ViewUser;
