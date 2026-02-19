import "./App.css";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

// Centralized services data
export const SERVICE_OPTIONS = {
  delivery: "Delivery",
  pickup: "Pick-up",
  payment: "Payment",
} as const; // "as const" preserves literal types

// Derive ServiceKey from keys
export type ServiceKey = keyof typeof SERVICE_OPTIONS;

function App() {
  return (
    <div className="container-fluid vh-100 d-flex p-0 row">
      {/* Left Column */}
      <div className="col-md-4 bg-light p-5">
        <Register serviceOptions={SERVICE_OPTIONS} />
      </div>

      {/* Right Column */}
      <div className="col-md-8 bg-light p-5 border-start">
        <Dashboard serviceOptions={SERVICE_OPTIONS} />
      </div>
    </div>
  );
}

export default App;
