import React, { useState } from "react";

interface FormData {
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: string[]; // store keys only
}

// Services as key-value pairs
const serviceOptions: Record<string, string> = {
  delivery: "Delivery",
  pick_up: "Pick-up",
  payment: "Payment",
};

const Register: React.FC = () => {
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
    const { value: key, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      services: checked
        ? [...prev.services, key]
        : prev.services.filter((serviceKey) => serviceKey !== key),
    }));
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = { ...formData, services: formData.services };
    console.log("Form Submitted:", payload);
    alert("Registration Successful!");
  };

  return (
    <div>
      <h2 className="mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="mobile" className="form-label">
            Mobile
          </label>
          <input
            type="tel"
            className="form-control"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="postcode" className="form-label">
            Postcode
          </label>
          <input
            type="text"
            className="form-control"
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Services</label>
          {Object.entries(serviceOptions).map(([key, label]) => (
            <div className="form-check" key={key}>
              <input
                className="form-check-input"
                type="checkbox"
                value={key}
                checked={formData.services.includes(key)}
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
