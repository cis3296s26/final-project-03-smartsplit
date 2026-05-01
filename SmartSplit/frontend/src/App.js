import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation} from "react-router-dom";
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
      const res = await fetch("http://localhost:5001/household/create", {
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
        console.log(JSON.stringify(payload));
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

  const [householdKey, setHouseholdKey] = useState("");
  const [memberName, setMemberName] = useState("");

  const handleJoin = async () => {
    if (!householdKey || !memberName) {
      alert("Please enter your name and household key.");
      return;
    }

  
    alert(`Joining household ${householdKey} as ${memberName}`);

    const payload = {key: householdKey, name: memberName}
    const res = await fetch("http://localhost:5001/household/join", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if(res.ok) {
        // Collects a json object that represents a row in the db
        const userHouseholdRow = await res.json()
        navigate("/household", {state: {key: userHouseholdRow.key, name: memberName, householdId: userHouseholdRow.id}});
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
      email: "nate.harris@temple.edu",
      phone: "(973)-567-9642",
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

function UserHouseholdPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;
    
    const [payments, setPayments] = useState(null);
    const [expenses, setExpenses] = useState(null);
    const [paidTotal, setPaid] = useState(0);
    const [owedTotal, setOwed] = useState(0);
    const [showPayment, setShowPayment] = useState(true)
    
      const nameFromId = async (id) => {
        try {
           const params = {id: id}; 
            const ps = await fetch(`http://localhost:5001/roommate?${new URLSearchParams(params).toString()}`);
            return (await ps.json()).name;
        } catch(error) {
            console.error(error);
        }
    }
    const loadPayments =   async () => {
        try {
            if(!data.key) {
                return
            } 
            const params = {key: data.key}
            const ps = await fetch(`http://localhost:5001/household/payments?${new URLSearchParams(params).toString()}`)
            if(!ps.ok) {
                console.error("issue with db request");
                return;
            }
            const raw_payments =  await ps.json();
            if(raw_payments) {
                raw_payments.forEach(payment => {
                    payment.roommateName = nameFromId(payment.roommateId);
                    setPaid(payment.total + paidTotal);
                });
            }
            setPayments(raw_payments);
        } catch(error) {
            console.error(error);
        }
    };
    const loadExpenses = async () => {
         try { 
            if(!data.key) {
                return
            }
            const params = {key: data.key}
            const es = await fetch(`http://localhost:5001/household/expenses?${new URLSearchParams(params).toString()}`)
            if(!es.ok) {
                console.error("issue with db request");
                return;
            }
            const qExpenses =  await es.json();
            if(qExpenses) {
                qExpenses.forEach(expense => {
                    setOwed(expense.total + owedTotal);
                });
            }
            setExpenses(qExpenses);
        } catch(error) {
            console.error(error);
        }
    };

    

    useEffect( () => {
        if(!location.state?.name || !location.state?.householdId) {
        navigate("/");
    } 
    if(!location.state?.key) {
        navigate("/");
    }
    }, [location.state, navigate]);

    useEffect( () => {
        loadPayments()
     }, []
    );

    useEffect( () => {
        loadExpenses()
     }, []
    ); 

    const DrawPayments = () => {
        if(!payments || payments.length == 0) {
            return (<div> No payments </div>)
        }
        const paymentList = payments.map(payment => 
            <div> Roommate: {payment.roommateName} | ${payment.total} | Reason: {payment.description} </div>
        );
       return (<div>Payments:{paymentList}</div>);
    }
    const DrawExpenses = () => {
        if(!expenses || expenses.length == 0) {
            return (<div> No expenses </div>)
        }
        const expenseList = expenses.map(expense => 
            <div> ${expense.total} | Reason: {expense.description} </div>
        );
        return (<div>Expenses:{expenseList}</div>);
    }
    
    return (
        <div className="App">
        <div className="App-header">
        <p> Welcome to your household {data?.name} </p>
        <div>
        <button className="primary-button" onClick={() => navigate("/household/payment", {state: data})}>Add Payment</button> 
        <button className="primary-button" onClick={() => navigate("/household/expense", {state: data})}>Add Expense</button> 
        </div>
        <div>
        <button className="primary-button" onClick={() => setShowPayment(true)}> View Payments </button>
        <button className="primary-button" onClick={() => setShowPayment(false)}> View Expenses </button>
        {showPayment? <DrawPayments /> : <DrawExpenses /> }
        </div>
        </div>
        </div>
    )
}

function CreatePayment() {
 const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState("");

    const navigate = useNavigate();
    const location = useLocation();



    useEffect( () => {
        if(!location.state?.name) {
        navigate("/");
    } 
    if(!location.state?.key) {
        navigate("/");
    }
    }, [location.state, navigate]);


    const [roommate, setRoommate] = useState(null);
       const handleCreatePayment = async () => {
    if (!amount || !description) {
      alert("Please provide an amount and description");
      return;
    }
    // get current roommate
    try {
    const res = await fetch(`http://localhost:5001/household/roommates?key=${location.state.key}`);
        if(!res.ok){
        alert("Failed to get roommate list");
        return
    }
    const roommates = await res.json()
    console.log(roommates);

    const roommate = roommates.filter(roommate =>  roommate.name == location.state.name)[0];
    console.log(roommate);
    const payload = {
        roommateId: roommate.id,
        description: description,
        amount:  parseInt(amount),
        key: location.state.key,
        houesholdId: location.state.householdId
    }
    console.log(payload);
    try {
      const res = await fetch("http://localhost:5001/household/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        alert("Payment created (id: " + data.id + ")");
        navigate("/household", {state: location.state});
      } else {
        const err = await res.json().catch(() => null);
        alert("Create failed: " + (err?.error || res.statusText));
      }
    } catch (e) {
      console.error(e);
        console.log(JSON.stringify(payload));
      alert("Network error: could not reach backend");
    }

    }
    catch(error) {
        console.error("failed to grab roommates: ", error);
        return
    }
      };
    
    





    return (
        <div className="App">
        <div className="App-header">
        <div className="page-card">
        <h1 className="page-title">Create Payment</h1>
        <p className="page-subtitle">
        Create new payment for your household
        </p>

        <div className="create-container">
        <div className="form-group">
        <label>Payment Description</label>
        <input
        type="text"
        placeholder="Enter reason for payment"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        />
        </div>

        <div className="form-group">
        <label>Amount</label>
        <input
        type="number"
        min="0.01"
        placeholder="Enter payment"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        />
        </div>


        <div className="button-row">
        <button className="primary-button" onClick={() => handleCreatePayment()}>
        Create
        </button>
        <button className="ghost-button" onClick={() => navigate("/household", {state: location.state})}>
        Cancel
        </button>
        </div>
        </div>
        </div>
        </div>
        </div>
    );
}

function CreateExpense() {
    
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState("");

    const navigate = useNavigate();
    const location = useLocation();



    useEffect( () => {
        if(!location.state?.name) {
        navigate("/");
    } 
    if(!location.state?.key) {
        navigate("/");
    }
    }, [location.state, navigate]);


    const handleCreateExpense = async () => {
    if (!amount || !description) {
      alert("Please provide an amount and description");
      return;
    }

    const payload = {
        description: description,
        amount:  parseInt(amount),
        key: location.state.key,
        houesholdId: location.state.householdId
    }
    console.log(payload);
    try {
      const res = await fetch("http://localhost:5001/household/expense/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        alert("Expense created (id: " + data.id + ")");
        navigate("/household", {state: location.state});
      } else {
        const err = await res.json().catch(() => null);
        alert("Create failed: " + (err?.error || res.statusText));
      }
    } catch (e) {
      console.error(e);
        console.log(JSON.stringify(payload));
      alert("Network error: could not reach backend");
    }
    }
    return (
        <div className="App">
        <div className="App-header">
        <div className="page-card">
        <h1 className="page-title">Create Expense</h1>
        <p className="page-subtitle">
        Create new expense for your household
        </p>

        <div className="create-container">
        <div className="form-group">
        <label>Payment Description</label>
        <input
        type="text"
        placeholder="Enter reason for expense"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        />
        </div>

        <div className="form-group">
        <label>Amount</label>
        <input
        type="number"
        min="0.01"
        placeholder="Enter payment"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        />
        </div>


        <div className="button-row">
        <button className="primary-button" onClick={() => handleCreateExpense()}>
        Create
        </button>
        <button className="ghost-button" onClick={() => navigate("/household", {state: location.state})}>
        Cancel
        </button>
        </div>
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
        <Route path="/household" element={<UserHouseholdPage />} />
        <Route path="/household/payment" element={<CreatePayment />} />
        <Route path="/household/expense" element={<CreateExpense />} />
        </Routes>
        </Router>
    );
}

export default App;
