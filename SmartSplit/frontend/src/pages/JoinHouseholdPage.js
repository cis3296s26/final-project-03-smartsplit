import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ROOT } from "../lib/api";

function JoinHouseholdPage() {
  const navigate = useNavigate();
  const [householdKey, setHouseholdKey] = useState("");
  const [memberName, setMemberName] = useState("");

  const handleJoin = async () => {
    if (!householdKey.trim() || !memberName.trim()) {
      alert("Please enter your name and household key.");
      return;
    }

    alert(`Joining household ${householdKey} as ${memberName}`);

    const payload = { key: householdKey, name: memberName };
    const res = await fetch(`${API_ROOT}/household/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      // Collects a json object that represents a row in the db
      const userHouseholdRow = await res.json();
      navigate("/household", {
        state: {
          key: userHouseholdRow.key,
          name: memberName,
          householdId: userHouseholdRow.id,
        },
      });
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <div className="page-card">
          <h1 className="page-title">Join Household</h1>
          <p className="page-subtitle">
            Enter your household key to join an existing household.
          </p>

          <div className="create-container">
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Household Key</label>
              <input
                type="text"
                placeholder="Enter household key"
                value={householdKey}
                onChange={(e) => setHouseholdKey(e.target.value.toUpperCase())}
              />
            </div>

            <div className="button-row">
              <button className="primary-button" onClick={handleJoin}>
                Join
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

export default JoinHouseholdPage;
