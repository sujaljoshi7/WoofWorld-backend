import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import api from "../../api";

function Login() {
  const [user, setUser] = useState(null);

  return <div>Hello</div>;
}

const DashboardCard = ({ title, count, image }) => (
  <div className="col-3">
    <div className="card bg-dark" style={{ maxWidth: "250px", margin: "10px" }}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h6 className="card-title text-secondary fs-6 fw-light">{title}</h6>
          <h6 className="card-text fw-semibold text-light fs-2">{count}</h6>
        </div>
        <img
          src={image}
          alt={title}
          className="rounded-circle"
          style={{ width: "50px", height: "50px" }}
        />
      </div>
    </div>
  </div>
);

export default Login;
