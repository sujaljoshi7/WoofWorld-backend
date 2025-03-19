import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>404</h1>
      <h2 style={styles.h2}>Oops! Page Not Found</h2>
      <p style={styles.p}>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link to="/" style={styles.link}>
        Go Back Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
    textAlign: "center",
    padding: "50px",
    maxWidth: "600px",
    margin: "50px auto",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  },
  h1: {
    fontSize: "80px",
    color: "#ff4a4a",
    margin: "0",
  },
  h2: {
    fontSize: "24px",
    color: "#333",
    margin: "20px 0",
  },
  p: {
    fontSize: "18px",
    color: "#666",
  },
  link: {
    display: "inline-block",
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "18px",
    color: "white",
    background: "#007BFF",
    textDecoration: "none",
    borderRadius: "5px",
    transition: "0.3s",
  },
};

export default NotFoundPage;
