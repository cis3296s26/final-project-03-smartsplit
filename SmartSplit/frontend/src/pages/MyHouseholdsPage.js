import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../lib/api";

function MyHouseholdsPage() {
  const navigate = useNavigate();
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHouseholds = async () => {
    try {
      const res = await fetch(`${API_BASE}/households`);
      const data = await res.json();
      setHouseholds(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Could not load households.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHouseholds();
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        <div className="page-card">
          <h1 className="page-title">My Households</h1>
          <p className="page-subtitle">View and manage your households.</p>

          <div className="create-container">
            {loading ? (
              <p>Loading households...</p>
            ) : households.length === 0 ? (
              <div className="empty-state">
                <p>No households found.</p>
                <button className="primary-button" onClick={() => navigate("/create")}>
                  Create Household
                </button>
              </div>
            ) : (
              households.map((household) => (
                <div
                  className="household-card clickable-card"
                  key={household.householdId}
                  onClick={() => navigate(`/expenses/${household.householdId}`)}
                >
                  <h3>{household.name}</h3>
                  <p>Key: {household.householdKey}</p>
                  <p>Members: {household.memberCount}</p>
                </div>
              ))
            )}

            <button className="ghost-button" onClick={() => navigate("/")}>
              Back Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyHouseholdsPage;
