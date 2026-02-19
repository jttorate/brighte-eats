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

const Register: React.FC<RegisterProps> = ({ serviceOptions }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    postcode: "",
    services: [],
  });

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

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Registration Successful!");
  };

  return (
    <div>
      <h2 className="mb-4">Register</h2>
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

        <button type="submit" className="btn btn-primary mt-3">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
