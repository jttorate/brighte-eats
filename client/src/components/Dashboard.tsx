import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ServiceKey = "delivery" | "pickup" | "payment";

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: ServiceKey[];
}

const users: User[] = [
  {
    id: 1,
    name: "John",
    email: "john@example.com",
    mobile: "123456",
    postcode: "0000",
    services: ["delivery", "payment"],
  },
  {
    id: 2,
    name: "Sarah",
    email: "sarah@example.com",
    mobile: "654321",
    postcode: "1234",
    services: ["pickup"],
  },
  {
    id: 3,
    name: "David",
    email: "david@example.com",
    mobile: "45768768",
    postcode: "1234",
    services: ["delivery"],
  },
  {
    id: 4,
    name: "Emma",
    email: "emma@example.com",
    mobile: "543534",
    postcode: "1234",
    services: ["delivery", "pickup"],
  },
];

const Dashboard: React.FC = () => {
  const [showTable, setShowTable] = useState<boolean>(false);
  const [selectedServices, setSelectedServices] = useState<ServiceKey[]>([]);

  const serviceCounts = {
    delivery: 0,
    pickup: 0,
    payment: 0,
  };

  users.forEach((user) => {
    user.services.forEach((service) => {
      serviceCounts[service]++;
    });
  });

  const chartData = [
    { name: "Delivery", count: serviceCounts.delivery },
    { name: "Pick-up", count: serviceCounts.pickup },
    { name: "Payment", count: serviceCounts.payment },
  ];

  const filteredUsers = useMemo(() => {
    if (selectedServices.length === 0) return users;

    return users.filter((user) =>
      selectedServices.some((service) => user.services.includes(service)),
    );
  }, [selectedServices]);

  const handleServiceToggle = (service: ServiceKey) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  return (
    <div className="w-100" style={{ height: "85vh" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-4">Dashboard</h2>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            checked={showTable}
            onChange={() => setShowTable(!showTable)}
            id="toggleTable"
          />
          <label className="form-check-label" htmlFor="toggleTable">
            Show Raw Data
          </label>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow-1 overflow-auto">
        {showTable ? (
          <>
            <div className="mb-3">
              <label className="form-label fw-bold">Filter by Services</label>

              <div className="d-flex gap-3">
                {(["delivery", "pickup", "payment"] as ServiceKey[]).map(
                  (service) => (
                    <div key={service} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedServices.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        id={service}
                      />
                      <label
                        className="form-check-label text-capitalize"
                        htmlFor={service}
                      >
                        {service}
                      </label>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Postcode</th>
                    <th>Services</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>{user.postcode}</td>
                      <td>{user.services.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <p className="text-muted mt-3">
                  No users match selected filters.
                </p>
              )}
            </div>
          </>
        ) : (
          <div style={{ width: "100%", height: 500 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4b89b5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
