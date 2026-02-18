import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="container-fluid vh-100 d-flex p-0 row">
      {/* Left Column */}
      <div className="col-md-4 bg-light p-5">
        <Register />
      </div>

      {/* Right Column */}
      <div className="col-md-8 bg-light p-5 border-start">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
