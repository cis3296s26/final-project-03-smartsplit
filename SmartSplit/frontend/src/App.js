import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import aboutIcon from "./images/about.jpeg";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="info-button"
          onClick={() => navigate("/about")}
        >
          <img src={aboutIcon} alt="About" className="info-icon" />
        </button>

        <div className="hero-card">
          <div className="brand-badge">SmartSplit</div>
          <h1 className="hero-title">Split expenses without the stress</h1>
          <p className="hero-subtitle">
            Manage shared household costs, create groups, and keep roommate finances organized
            in one place.
          </p>

          <div className="button-stack">
            <button
              className="primary-button"
              onClick={() => navigate("/create")}
            >
              Create Household
            </button>

            <button
              className="primary-button"
              onClick={() => navigate("/join")}
            >
              Join Household
            </button>

            <button
              className="primary-button"
              onClick={() => navigate("/households")}
            >
              My Households
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

function CreateHouseholdPage() {
  const [householdName, setHouseholdName] = useState("");
  const [numRoommates, setNumRoommates] = useState(1);
  const [roommateNames, setRoommateNames] = useState([""]);
  const [householdKey, setHouseholdKey] = useState("");

  const navigate = useNavigate();

  const handleRoommateCountChange = (e) => {
    const count = Math.max(1, parseInt(e.target.value) || 1);
    setNumRoommates(count);
    setRoommateNames((prev) =>
      Array.from({ length: count }, (_, i) => prev[i] || "")
    );
  };

  const handleRoommateNameChange = (index, value) => {
    const updatedNames = [...roommateNames];
    updatedNames[index] = value;
    setRoommateNames(updatedNames);
  };

  const generateKey = () => {
    const key = Math.random().toString(36).substring(2, 10).toUpperCase();
    setHouseholdKey(key);
  };

  const copyKey = async () => {
    if (!householdKey) return;
    try {
      await navigator.clipboard.writeText(householdKey);
      alert("Key copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  const handleCreate = async () => {
    if (!householdName || !householdKey) {
      alert("Please provide a household name and generate a key.");
      return;
    }

    const payload = {
      householdName,
      householdKey,
      numRoommates,
      roommateNames,
    };

    try {
      const res = await fetch("http://127.0.0.1:5001/households", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        alert("Household created (id: " + data.id + ")");
        navigate("/");
      } else {
        const err = await res.json().catch(() => null);
        alert("Create failed: " + (err?.error || res.statusText));
      }
    } catch (e) {
      console.error(e);
      alert("Network error: could not reach backend");
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <div className="page-card">
          <h1 className="page-title">Create Household</h1>
          <p className="page-subtitle">
            Set up your household and generate a key for your roommates to join.
          </p>

          <div className="create-container">
            <div className="form-group">
              <label>Household Name</label>
              <input
                type="text"
                placeholder="Enter household name"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Number of Roommates</label>
              <input
                type="number"
                min="1"
                placeholder="Enter number of roommates"
                value={numRoommates}
                onChange={handleRoommateCountChange}
              />
            </div>

            {roommateNames.map((name, index) => (
              <div className="form-group" key={index}>
                <label>Roommate {index + 1}</label>
                <input
                  type="text"
                  placeholder={`Enter roommate ${index + 1} name`}
                  value={name}
                  onChange={(e) => handleRoommateNameChange(index, e.target.value)}
                />
              </div>
            ))}

            <button className="secondary-button" onClick={generateKey}>
              Generate Household Key
            </button>

            {householdKey && (
              <div className="key-box">
                <p>
                  <strong>Household Key:</strong> {householdKey}
                </p>
                <button className="primary-button" onClick={copyKey}>
                  Copy Key
                </button>
              </div>
            )}

            <div className="button-row">
              <button className="primary-button" onClick={handleCreate}>
                Create
              </button>
              <button className="ghost-button" onClick={() => navigate("/")}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JoinHouseholdPage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className="App-header">
        <div className="empty-state">
          <h1 className="page-title">Join Household</h1>
          <p>Still under construction.</p>
          <button className="ghost-button" onClick={() => navigate("/")}>
            Back Home
          </button>
        </div>
      </div>
    </div>
  );
}

function MyHouseholdsPage() {
  const navigate = useNavigate();

  const households = [
    { name: "Temple Apartment", key: "ABCD1234" },
    { name: "Summer House", key: "XYZ7890" },
  ];

  return (
    <div className="App">
      <div className="App-header">
        <div className="page-card">
          <h1 className="page-title">My Households</h1>
          <p className="page-subtitle">
            View and manage your households.
          </p>

          <div className="create-container">
            {households.map((h, index) => (
              <div className="household-card" key={index}>
                <h3>{h.name}</h3>
                <p>Key: {h.key}</p>
              </div>
            ))}

            <button
              className="ghost-button"
              onClick={() => navigate("/")}
            >
              Back Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  const navigate = useNavigate();

  const team = [
    {
      name: "Akil",
      role: "Frontend Development & UI Design",
      email: "akil@email.com",
      phone: "(123) 456-7890",
    },
    {
      name: "Fabrizio",
      role: "Frontend Development & UI Design",
      email: "fabrizio@email.com",
      phone: "(123) 456-7890",
    },
    {
      name: "Jillian",
      role: "Database & API Integration",
      email: "jillian@email.com",
      phone: "(123) 456-7890",
    },
    {
      name: "Serge",
      role: "Backend/API",
      email: "serge@email.com",
      phone: "(123) 456-7890",
    },
    {
      name: "Nate",
      role: "Backend/API",
      email: "nate@email.com",
      phone: "(123) 456-7890",
    },
  ];

  return (
    <div className="App">
      <div className="App-header">
        <div className="page-card">
          <h1 className="page-title">About SmartSplit</h1>

          <p className="page-subtitle">
            SmartSplit helps roommates manage and split shared expenses easily.
            Our goal is to simplify financial organization and reduce confusion
            around shared household costs.
          </p>

          <div className="team-container">
            {team.map((member, index) => (
              <div className="team-member" key={index}>
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <div className="contact">
                  <span>Email: {member.email}</span>
                </div>
                <div className="contact">
                  <span>Phone: {member.phone}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "16px" }}>
            <button className="ghost-button" onClick={() => navigate("/")}>
              Back Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateHouseholdPage />} />
        <Route path="/join" element={<JoinHouseholdPage />} />
        <Route path="/households" element={<MyHouseholdsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;