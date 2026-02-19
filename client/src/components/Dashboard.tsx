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
  createdAt: string;
}

interface DashboardProps {
  serviceOptions: Record<ServiceKey, string>;
  refreshKey?: number;
  onViewLead?: (leadId: number) => void; // only pass lead ID now
}

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT!;
if (!GRAPHQL_ENDPOINT) throw new Error("VITE_GRAPHQL_ENDPOINT is not defined");

const Dashboard: React.FC<DashboardProps> = ({
  serviceOptions,
  refreshKey,
  onViewLead,
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [selectedServices, setSelectedServices] = useState<ServiceKey[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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
          createdAt
        }
      }
    `;

    try {
      const res = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const result = await res.json();

      if (result.errors) {
        setError(result.errors[0]?.message || "GraphQL error");
      } else {
        const sortedLeads = result.data.leads.sort(
          (a: Lead, b: Lead) => Number(b.createdAt) - Number(a.createdAt),
        ); // Descending
        setLeads(sortedLeads);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [refreshKey]);

  const filteredLeads = useMemo(() => {
    return selectedServices.length > 0
      ? leads.filter((lead) =>
          selectedServices.some((s) => lead.services.includes(s)),
        )
      : leads;
  }, [leads, selectedServices]);

  const totalPages = Math.ceil(filteredLeads.length / pageSize);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleServiceToggle = (service: ServiceKey) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
    setCurrentPage(1);
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
          />
          <label className="form-check-label">Show Raw Data</label>
        </div>
      </div>

      <div className="flex-grow-1 overflow-auto">
        {showTable && (
          <>
            {/* Filter */}
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
                    />
                    <label className="form-check-label text-capitalize">
                      {serviceOptions[service as ServiceKey]}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Page size */}
            <div className="mb-3 d-flex align-items-center gap-3">
              <label>Rows per page:</label>
              <select
                className="form-select w-auto"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLeads.map((lead) => (
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
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => onViewLead?.(lead.id)} // only pass ID
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Total row */}
                  {paginatedLeads.length > 0 && (
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
                      <td></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                Page {currentPage} of {totalPages}
              </div>
              <div>
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {!showTable && (
          <div style={{ width: "100%", height: 500 }}>
            <ResponsiveContainer>
              <BarChart
                data={Object.entries(serviceOptions).map(([key, label]) => {
                  const count = filteredLeads.reduce(
                    (acc, lead) =>
                      acc + (lead.services.includes(key as ServiceKey) ? 1 : 0),
                    0,
                  );
                  return { name: label, count };
                })}
              >
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
