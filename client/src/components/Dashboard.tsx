import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ServiceKey } from "../App";

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: ServiceKey[];
}

interface DashboardProps {
  serviceOptions: Record<ServiceKey, string>;
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

const Dashboard: React.FC<DashboardProps> = ({ serviceOptions }) => {
  const [showTable, setShowTable] = useState(false);
  const [selectedServices, setSelectedServices] = useState<ServiceKey[]>([]);

  // Initialize counts dynamically from serviceOptions keys
  const serviceCounts: Record<ServiceKey, number> = Object.keys(
    serviceOptions,
  ).reduce(
    (acc, key) => {
      acc[key as ServiceKey] = 0;
      return acc;
    },
    {} as Record<ServiceKey, number>,
  );

  users.forEach((user) => user.services.forEach((s) => serviceCounts[s]++));

  const chartData = Object.entries(serviceOptions).map(([key, label]) => ({
    name: label,
    count: serviceCounts[key as ServiceKey],
  }));

  const filteredUsers = useMemo(() => {
    if (selectedServices.length === 0) return users;
    return users.filter((user) =>
      selectedServices.some((s) => user.services.includes(s)),
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-5">Dashboard</h2>
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

      <div className="flex-grow-1 overflow-auto">
        {showTable ? (
          <>
            <div className="mb-3">
              <label className="form-label fw-bold">Filter by Services</label>
              <div className="d-flex gap-3">
                {Object.keys(serviceOptions).map((service) => (
                  <div className="form-check" key={service}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selectedServices.includes(service as ServiceKey)}
                      onChange={() =>
                        handleServiceToggle(service as ServiceKey)
                      }
                      id={service}
                    />
                    <label
                      className="form-check-label text-capitalize"
                      htmlFor={service}
                    >
                      {serviceOptions[service as ServiceKey]}
                    </label>
                  </div>
                ))}
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
                      <td>
                        {user.services.map((s) => serviceOptions[s]).join(", ")}
                      </td>
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
