import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_ROOT } from "../lib/api";

function CreatePaymentPage() {
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state?.name) {
      navigate("/");
    }
    if (!location.state?.key) {
      navigate("/");
    }
  }, [location.state, navigate]);

  const handleCreatePayment = async () => {
    if (!amount || !description) {
      alert("Please provide an amount and description");
      return;
    }
    // get current roommate
    try {
      const res = await fetch(
        `${API_ROOT}/household/roommates?key=${location.state.key}`
      );
      if (!res.ok) {
        alert("Failed to get roommate list");
        return;
      }
      const roommates = await res.json();
      console.log(roommates);

      const roommate = roommates.filter(
        (roommate) => roommate.name === location.state.name
      )[0];
      console.log(roommate);
      const payload = {
        roommateId: roommate.id,
        description: description,
        amount: parseInt(amount),
        key: location.state.key,
        houesholdId: location.state.householdId,
      };
      console.log(payload);
      try {
        const res2 = await fetch(`${API_ROOT}/household/payment/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res2.ok) {
          const data = await res2.json();
          alert("Payment created (id: " + data.id + ")");
          navigate("/household", { state: location.state });
        } else {
          const err = await res2.json().catch(() => null);
          alert("Create failed: " + (err?.error || res2.statusText));
        }
      } catch (e) {
        console.error(e);
        console.log(JSON.stringify(payload));
        alert("Network error: could not reach backend");
      }
    } catch (error) {
      console.error("failed to grab roommates: ", error);
      return;
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <div className="page-card">
          <h1 className="page-title">Create Payment</h1>
          <p className="page-subtitle">Create new payment for your household</p>

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
              <button
                className="primary-button"
                onClick={() => handleCreatePayment()}
              >
                Create
              </button>
              <button
                className="ghost-button"
                onClick={() => navigate("/household", { state: location.state })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePaymentPage;
