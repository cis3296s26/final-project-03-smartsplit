import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../lib/api";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export default ExpensesPage;
