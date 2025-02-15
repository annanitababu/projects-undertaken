import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //For displaying the Invalid username and password message in the login page itself.
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:8081/login", { email, password });
      console.log(res);
      if (res.status === 200) {
        localStorage.setItem("voteraddr", res.data.voteraddr);
        // Redirect to voting page
        navigate("/voting");
      }
    } catch (err) {
      // Check for response errors
      if (err.response && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  const pageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f9",
    fontFamily: "Arial, sans-serif",
  };

  const formContainerStyle = {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    width: "300px",
    textAlign: "center",
  };

  const headingStyle = {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  };

  const labelStyle = {
    textAlign: "left",
    display: "block",
    fontWeight: "bold",
    color: "#555",
    marginTop: "10px",
  };

  const linkStyle = {
    display: "block",
    marginTop: "20px",
    fontSize: "14px",
    color: "#4CAF50",
    textDecoration: "none",
  };

  return (
    <div style={pageStyle}>
      <div style={formContainerStyle}>
        <h1 style={headingStyle}>Decentralized Voting System</h1>
        {errorMessage && (
          <p style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>
            {errorMessage}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" style={labelStyle}>
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <label htmlFor="password" style={labelStyle}>
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
        {/* New link added below */}
        <Link to="/admin-page" style={linkStyle}>
          Click here to direct to Admin
        </Link>
      </div>
    </div>
  );
}

export default Login;
