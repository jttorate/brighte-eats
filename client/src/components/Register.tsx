import React, { useState, useEffect } from "react";
import type { ServiceKey } from "../App";

interface FormData {
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: ServiceKey[];
}

interface RegisterProps {
  serviceOptions: Record<ServiceKey, string>;
  selectedLead?: number; // now leadId
  onClearView?: () => void;
  onSuccess?: () => void;
}

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT!;
if (!GRAPHQL_ENDPOINT) throw new Error("VITE_GRAPHQL_ENDPOINT is not defined");

const Register: React.FC<RegisterProps> = ({
  serviceOptions,
  selectedLead,
  onClearView,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    postcode: "",
    services: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isViewMode = !!selectedLead;

  // Fetch lead details when viewing
  useEffect(() => {
    if (selectedLead) {
      setLoading(true);
      const query = `
        query {
          lead(id: ${selectedLead}) {
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
      fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
        .then((res) => res.json())
        .then((result) => {
          const lead = result.data?.lead;
          if (lead) {
            setFormData({
              name: lead.name,
              email: lead.email,
              mobile: lead.mobile,
              postcode: lead.postcode,
              services: lead.services,
            });
          } else {
            setError("Lead not found");
          }
        })
        .catch(() => setError("Network error"))
        .finally(() => setLoading(false));
    } else {
      setFormData({
        name: "",
        email: "",
        mobile: "",
        postcode: "",
        services: [],
      });
    }
  }, [selectedLead]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isViewMode) return;
    setLoading(true);
    setError(null);

    try {
      const mutation = `
        mutation Register(
          $name: String!
          $email: String!
          $mobile: String!
          $postcode: String!
          $services: [Service!]!
        ) {
          register(
            name: $name
            email: $email
            mobile: $mobile
            postcode: $postcode
            services: $services
          ) {
            id
            name
            services
          }
        }
      `;
      const variables = { ...formData };
      const res = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation, variables }),
      });
      const result = await res.json();
      if (result.errors) {
        setError(result.errors[0]?.message || "GraphQL error");
      } else {
        alert("Registration Successful!");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          postcode: "",
          services: [],
        });
        onSuccess?.();
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="clearfix">
        <h2 className="mb-4 col-8 float-start">
          {isViewMode ? "View Lead" : "Register"}
        </h2>
        <div className="col-4 float-end text-end pt-1">
          {loading && (
            <div className="spinner-border text-primary">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          {error && <p className="text-danger">{error}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {["name", "email", "mobile", "postcode"].map((field) => (
          <div className="mb-3" key={field}>
            <label htmlFor={field} className="form-label">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === "email" ? "email" : "text"}
              className="form-control"
              id={field}
              name={field}
              value={formData[field as keyof FormData] as string}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [field]: e.target.value }))
              }
              required
              disabled={isViewMode || loading}
            />
          </div>
        ))}

        <div className="mb-3">
          <label className="form-label">Services</label>
          {Object.entries(serviceOptions).map(([key, label]) => (
            <div className="form-check" key={key}>
              <input
                className="form-check-input"
                type="checkbox"
                value={key}
                checked={formData.services.includes(key as ServiceKey)}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const keyEnum = key as ServiceKey;
                  setFormData((prev) => ({
                    ...prev,
                    services: checked
                      ? [...prev.services, keyEnum]
                      : prev.services.filter((s) => s !== keyEnum),
                  }));
                }}
                disabled={isViewMode || loading}
              />
              <label className="form-check-label">{label}</label>
            </div>
          ))}
        </div>

        {!isViewMode && (
          <button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Register"}
          </button>
        )}

        {isViewMode && (
          <button
            type="button"
            className="btn btn-secondary mt-3"
            onClick={onClearView}
          >
            Close View
          </button>
        )}
      </form>
    </div>
  );
};

export default Register;
