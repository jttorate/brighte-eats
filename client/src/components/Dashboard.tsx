import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ServiceKey } from "../App";

interface Lead {
  id: number;
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: ServiceKey[];
}

interface DashboardProps {
  serviceOptions: Record<ServiceKey, string>;
  refreshKey?: number; // trigger refresh from parent
}

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT;
if (!GRAPHQL_ENDPOINT) throw new Error("VITE_GRAPHQL_ENDPOINT is not defined");

const Dashboard: React.FC<DashboardProps> = ({
  serviceOptions,
  refreshKey,
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [selectedServices, setSelectedServices] = useState<ServiceKey[]>([]);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);

    const query = `
      query Leads {
        leads {
          id
          name
          email
          mobile
          postcode
          services
        }
      }
    `;

    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      if (result.errors) {
        setError(result.errors[0]?.message || "GraphQL error");
      } else {
        setLeads(result.data.leads);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // fetch initially + whenever refreshKey changes
  useEffect(() => {
    fetchLeads();
  }, [refreshKey]);

  // Compute service counts for chart
  const serviceCounts: Record<ServiceKey, number> = Object.keys(
    serviceOptions,
  ).reduce(
    (acc, key) => {
      acc[key as ServiceKey] = 0;
      return acc;
    },
    {} as Record<ServiceKey, number>,
  );

  leads.forEach((lead) =>
    lead.services.forEach(
      (s) => (serviceCounts[s] = (serviceCounts[s] || 0) + 1),
    ),
  );

  const chartData = Object.entries(serviceOptions).map(([key, label]) => ({
    name: label,
    count: serviceCounts[key as ServiceKey],
  }));

  const filteredLeads = useMemo(() => {
    if (selectedServices.length === 0) return leads;
    return leads.filter((lead) =>
      selectedServices.some((s) => lead.services.includes(s)),
    );
  }, [selectedServices, leads]);

  const handleServiceToggle = (service: ServiceKey) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  if (loading) return <p>Loading leads...</p>;
  if (error) return <p className="text-danger">{error}</p>;

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
                    <label className="form-check-label text-capitalize">
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
                    {Object.keys(serviceOptions).map((s) => (
                      <th key={s} className="text-center">
                        {serviceOptions[s as ServiceKey]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td>{lead.id}</td>
                      <td>{lead.name}</td>
                      <td>{lead.email}</td>
                      <td>{lead.mobile}</td>
                      <td>{lead.postcode}</td>
                      {Object.keys(serviceOptions).map((s) => (
                        <td key={s} className="text-center">
                          {lead.services.includes(s as ServiceKey) ? "✔" : ""}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* Total row */}
                  {filteredLeads.length > 0 && (
                    <tr className="table-secondary fw-bold">
                      <td colSpan={5}>Total Leads: {filteredLeads.length}</td>
                      {Object.keys(serviceOptions).map((s) => (
                        <td key={s} className="text-center">
                          {
                            filteredLeads.filter((u) =>
                              u.services.includes(s as ServiceKey),
                            ).length
                          }
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
              {filteredLeads.length === 0 && (
                <p className="text-muted mt-3">
                  No leads match selected filters.
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
