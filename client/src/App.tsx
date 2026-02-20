import "./App.css";
import { useState } from "react";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

// Centralized services data
export const SERVICE_OPTIONS = {
  delivery: "Delivery",
  pick_up: "Pick-up",
  payment: "Payment",
} as const;

export type ServiceKey = keyof typeof SERVICE_OPTIONS;

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedLead, setSelectedLead] = useState<any>(null); // for view mode

  // Callback to trigger dashboard refresh
  const handleRegisterSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setSelectedLead(null);
  };

  return (
    <div className="container-fluid vh-100 d-flex p-0 row">
      {/* Left Column */}
      <div className="col-md-4 bg-light p-5">
        <Register
          serviceOptions={SERVICE_OPTIONS}
          selectedLead={selectedLead}
          onClearView={() => setSelectedLead(null)}
          onSuccess={handleRegisterSuccess}
        />
      </div>

      {/* Right Column */}
      <div className="col-md-8 bg-light p-5 border-start">
        <Dashboard
          serviceOptions={SERVICE_OPTIONS}
          refreshKey={refreshKey}
          onViewLead={(leadId: number) => setSelectedLead(leadId)}
        />
      </div>
    </div>
  );
}

export default App;
