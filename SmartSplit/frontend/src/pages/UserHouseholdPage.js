import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_ROOT } from "../lib/api";

function UserHouseholdPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  const [payments, setPayments] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [paidTotal, setPaid] = useState(0);
  const [owedTotal, setOwed] = useState(0);
  const [showPayment, setShowPayment] = useState(true);

  const nameFromId = async (id) => {
    try {
      const params = { id: id };
      const ps = await fetch(
        `${API_ROOT}/roommate?${new URLSearchParams(params).toString()}`
      );
      return (await ps.json()).name;
    } catch (error) {
      console.error(error);
    }
  };

  const loadPayments = async () => {
    try {
      if (!data?.key) {
        return;
      }
      const params = { key: data.key };
      const ps = await fetch(
        `${API_ROOT}/household/payments?${new URLSearchParams(params).toString()}`
      );
      if (!ps.ok) {
        console.error("issue with db request");
        return;
      }
      const raw_payments = await ps.json();
      if (raw_payments) {
        raw_payments.forEach((payment) => {
          payment.roommateName = nameFromId(payment.roommateId);
          setPaid(payment.total + paidTotal);
        });
      }
      setPayments(raw_payments);
    } catch (error) {
      console.error(error);
    }
  };

  const loadExpenses = async () => {
    try {
      if (!data?.key) {
        return;
      }
      const params = { key: data.key };
      const es = await fetch(
        `${API_ROOT}/household/expenses?${new URLSearchParams(params).toString()}`
      );
      if (!es.ok) {
        console.error("issue with db request");
        return;
      }
      const qExpenses = await es.json();
      if (qExpenses) {
        qExpenses.forEach((expense) => {
          setOwed(expense.total + owedTotal);
        });
      }
      setExpenses(qExpenses);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!location.state?.name || !location.state?.householdId) {
      navigate("/");
    }
    if (!location.state?.key) {
      navigate("/");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const DrawPayments = () => {
    if (!payments || payments.length === 0) {
      return <div> No payments </div>;
    }
    const paymentList = payments.map((payment, idx) => (
      <div key={idx}>
        Roommate: {payment.roommateName} | ${payment.total} | Reason:{" "}
        {payment.description}
      </div>
    ));
    return <div>Payments:{paymentList}</div>;
  };

  const DrawExpenses = () => {
    if (!expenses || expenses.length === 0) {
      return <div> No expenses </div>;
    }
    const expenseList = expenses.map((expense, idx) => (
      <div key={idx}>
        ${expense.total} | Reason: {expense.description}
      </div>
    ));
    return <div>Expenses:{expenseList}</div>;
  };

  return (
    <div className="App">
      <div className="App-header">
        <p> Welcome to your household {data?.name} </p>
        <div>
          <button
            className="primary-button"
            onClick={() => navigate("/household/payment", { state: data })}
          >
            Add Payment
          </button>
          <button
            className="primary-button"
            onClick={() => navigate("/household/expense", { state: data })}
          >
            Add Expense
          </button>
        </div>
        <div>
          <button className="primary-button" onClick={() => setShowPayment(true)}>
            {" "}
            View Payments{" "}
          </button>
          <button className="primary-button" onClick={() => setShowPayment(false)}>
            {" "}
            View Expenses{" "}
          </button>
          {showPayment ? <DrawPayments /> : <DrawExpenses />}
        </div>
      </div>
    </div>
  );
}

export default UserHouseholdPage;
