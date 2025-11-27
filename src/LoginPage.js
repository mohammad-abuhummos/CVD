import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./LoginApi/Auth";
import fieldImage2 from "./assets/yardPlains2.png";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginUser(username, password);
      navigate("/Home");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${fieldImage2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "10px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(255,255,255,0.95)",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "320px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
        {error && (
          <div style={{ color: "#d11a2a", marginBottom: "10px", textAlign: "center" }}>
            {error}
          </div>
        )}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={{
            marginBottom: "15px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{
            marginBottom: "15px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            background: "#1ea711",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
