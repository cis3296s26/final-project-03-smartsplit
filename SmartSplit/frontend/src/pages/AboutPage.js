import React from "react";
import { useNavigate } from "react-router-dom";

const TEAM = [
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

function AboutPage() {
  const navigate = useNavigate();

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
            {TEAM.map((member, index) => (
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

export default AboutPage;
