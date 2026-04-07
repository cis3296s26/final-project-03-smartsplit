import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { Household } from './src/db/schema';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <h1>SmartSplit</h1>
        <p>Select an option to continue:</p>

        <button onClick={() => navigate("/create")}>
          Create Household
        </button>

        <button onClick={() => navigate("/join")}>
          Join Household
        </button>
      </header>
    </div>
  );
}

function CreateHouseholdPage() {
  const [householdName, setHouseholdName] = useState("");
  const [numRoommates, setNumRoommates] = useState(1);
  const [roommateNames, setRoommateNames] = useState([""]);
  const [householdKey, setHouseholdKey] = useState("");

  const handleRoommateCountChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    setNumRoommates(count);
    setRoommateNames(
      Array.from({ length: count }, (_, i) => roommateNames[i] || "")
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

  const copyKey = () => {
    navigator.clipboard.writeText(householdKey);
    alert("Household key copied!");
  };

  const navigate = useNavigate();

  return (
    <div className="App">
      <div className="App-header">
        <div className="create-container">
          <h1>Create Household</h1> 

          <input
            type="text"
            placeholder="Household Name"
            value={householdName}
            onChange={(e) => setHouseholdName(e.target.value)}
          />

          <input
            type="number"
            min="1"
            placeholder="Number of Roommates"
            value={numRoommates}
            onChange={handleRoommateCountChange}
          />

          {roommateNames.map((name, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Roommate ${index + 1} Name`}
              value={name}
              onChange={(e) => handleRoommateNameChange(index, e.target.value)}
            />
          ))}

          <button onClick={generateKey}>Generate Household Key</button>

          {householdKey && (
            <div className="key-box">
              <p><strong>Household Key:</strong> {householdKey}</p>
              <button onClick={copyKey}>Copy Key</button>
            </div>
          )}

          <div className="button-row">
            <button>Create</button>
            <button onClick={() => navigate("/")}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function JoinHouseholdPage() {
  return (
    <div className="App">
      <div className="App-header">
        <h1>Join Household</h1>
        <p>IDK YET</p>
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
      </Routes>
    </Router>
  );
}

export default App;