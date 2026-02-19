import React, { useState } from "react";
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
}

// Use Vite env variable
const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT;
if (!GRAPHQL_ENDPOINT) throw new Error("VITE_GRAPHQL_ENDPOINT is not defined");

const Register: React.FC<RegisterProps> = ({ serviceOptions }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    postcode: "",
    services: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const key = value as ServiceKey;

    setFormData((prev) => ({
      ...prev,
      services: checked
        ? [...prev.services, key]
        : prev.services.filter((s) => s !== key),
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use variables instead of string interpolation
      const mutation = `
        mutation Register($name: String!, $email: String!, $mobile: String!, $postcode: String!, $services: [String!]!) {
          register(name: $name, email: $email, mobile: $mobile, postcode: $postcode, services: $services) {
            id
            name
            services
          }
        }
      `;

      const variables = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        postcode: formData.postcode,
        services: formData.services,
      };

      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation, variables }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error(result.errors);
        setError(result.errors[0]?.message || "GraphQL error");
      } else {
        console.log("User registered:", result.data.register);
        alert("Registration Successful!");
        // Reset form
        setFormData({
          name: "",
          email: "",
          mobile: "",
          postcode: "",
          services: [],
        });
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Register</h2>
      {error && <p className="text-danger">{error}</p>}

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
              onChange={handleChange}
              required
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
                onChange={handleCheckboxChange}
                id={key}
              />
              <label className="form-check-label" htmlFor={key}>
                {label}
              </label>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-3"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
