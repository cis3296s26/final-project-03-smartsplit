import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>SmartSplit</h1>

        <p>Select an option to continue:</p>

        <button onClick={() => alert("Create Household clicked")}>
          Create Household
        </button>

        <button onClick={() => alert("Join Household clicked")}>
          Join Household
        </button>
      </header>
    </div>
  );
}

export default App;