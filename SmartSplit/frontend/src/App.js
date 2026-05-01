import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import HomePage from "./pages/HomePage";
import CreateHouseholdPage from "./pages/CreateHouseholdPage";
import JoinHouseholdPage from "./pages/JoinHouseholdPage";
import MyHouseholdsPage from "./pages/MyHouseholdsPage";
import ExpensesPage from "./pages/ExpensesPage";
import AboutPage from "./pages/AboutPage";
import UserHouseholdPage from "./pages/UserHouseholdPage";
import CreatePaymentPage from "./pages/CreatePaymentPage";
import CreateExpensePage from "./pages/CreateExpensePage";

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
        <Route path="/household" element={<UserHouseholdPage />} />
        <Route path="/household/payment" element={<CreatePaymentPage />} />
        <Route path="/household/expense" element={<CreateExpensePage />} />
      </Routes>
    </Router>
  );
}

export default App;
