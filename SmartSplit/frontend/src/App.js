import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";
import aboutIcon from "./images/about.jpeg";

const API_BASE = "http://127.0.0.1:5001/api";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <button className="info-button" onClick={() => navigate("/about")}>
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
            <button className="primary-button" onClick={() => navigate("/create")}>
              Create Household
            </button>

            <button className="primary-button" onClick={() => navigate("/join")}>
              Join Household
            </button>

            <button className="primary-button" onClick={() => navigate("/households")}>
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
      const res = await fetch(`${API_BASE}/households`, {
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
    } catch (error) {
      console.error(error);
      alert("Network error: could not reach backend.");
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

function JoinHouseholdPage() {
  const navigate = useNavigate();
  const [householdKey, setHouseholdKey] = useState("");
  const [memberName, setMemberName] = useState("");

  const handleJoin = async () => {
    if (!householdKey.trim() || !memberName.trim()) {
      alert("Please enter your name and household key.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/households/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          householdKey: householdKey.trim(),
          memberName: memberName.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        alert("Joined household successfully!");
        navigate(`/expenses/${data.householdId}`);
      } else {
        alert("Join failed: " + (data.error || res.statusText));
      }
    } catch (error) {
      console.error(error);
      alert("Network error: could not reach backend.");
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

function ExpensesPage() {
  const { householdId } = useParams();
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");

  const loadExpenses = async () => {
    try {
      const res = await fetch(`${API_BASE}/expenses/household/${householdId}`);
      const data = await res.json();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      alert("Could not load expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [householdId]);

  const addExpense = async () => {
    if (!description.trim() || !amount) {
      alert("Please enter a description and amount.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description.trim(),
          amount: Number(amount),
          category,
          householdId,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setDescription("");
        setAmount("");
        setCategory("Other");
        await loadExpenses();
      } else {
        alert("Add expense failed: " + (data.error || res.statusText));
      }
    } catch (error) {
      console.error(error);
      alert("Network error: could not reach backend.");
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      const res = await fetch(`${API_BASE}/expenses/${expenseId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await loadExpenses();
      } else {
        alert("Delete failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error: could not reach backend.");
    }
  };

  const total = expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount || 0);
  }, 0);

  return (
    <div className="App">
      <div className="App-header">
        <div className="page-card">
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">
            Add and view shared expenses for this household.
          </p>

          <div className="create-container">
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                placeholder="Groceries, rent, utilities..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Groceries">Groceries</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button className="primary-button" onClick={addExpense}>
              Add Expense
            </button>

            <div className="household-card">
              <h3>Total Expenses</h3>
              <p>${total.toFixed(2)}</p>
            </div>

            {loading ? (
              <p>Loading expenses...</p>
            ) : expenses.length === 0 ? (
              <p>No expenses yet.</p>
            ) : (
              expenses.map((expense) => (
                <div className="household-card expense-card" key={expense.expenseId}>
                  <h3>{expense.description || "Untitled Expense"}</h3>
                  <p>Amount: ${Number(expense.amount).toFixed(2)}</p>
                  <p>Category: {expense.category}</p>
                  <p>Split: {expense.splitType}</p>
                  <button
                    className="ghost-button"
                    onClick={() => deleteExpense(expense.expenseId)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}

            <button className="ghost-button" onClick={() => navigate("/households")}>
              Back to Households
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
      email: "jillian.kivelier@gmail.com",
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
        <Route path="/expenses/:householdId" element={<ExpensesPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;