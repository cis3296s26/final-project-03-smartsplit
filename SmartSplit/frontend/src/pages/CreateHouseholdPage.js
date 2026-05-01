import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ROOT } from "../lib/api";

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
    const cleanedNames = roommateNames.map((name) => name.trim()).filter(Boolean);

    if (!householdName.trim()) {
      alert("Please enter a household name.");
      return;
    }

    if (!householdKey.trim()) {
      alert("Please generate a household key.");
      return;
    }

    if (cleanedNames.length !== numRoommates) {
      alert("Please enter all roommate names.");
      return;
    }

    try {
      const res = await fetch(`${API_ROOT}/household/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          householdName: householdName.trim(),
          householdKey: householdKey.trim(),
          numRoommates,
          roommateNames: cleanedNames,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        alert("Household created successfully!");
        navigate("/households");
      } else {
        alert("Create failed: " + (data.error || res.statusText));
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

export default CreateHouseholdPage;
