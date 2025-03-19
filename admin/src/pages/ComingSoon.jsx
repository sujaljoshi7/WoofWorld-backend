import React from "react";
import { Link } from "react-router-dom";

const ComingSoon = () => {
  return (
    <div
      style={{
        backgroundColor: "#383838",
        color: "#fff",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        flexDirection: "column",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>Coming soon...</h1>
      <p style={{ fontSize: "24px", marginBottom: "40px" }}>
        This page has not been created yet. Please check back later.
      </p>
      {/* <button className="btn btn-secondary" onClick={}>Go back</button> */}
      <Link to="/" className="btn btn-secondary">
        Go Back Home
      </Link>
    </div>
  );
};

export default ComingSoon;
