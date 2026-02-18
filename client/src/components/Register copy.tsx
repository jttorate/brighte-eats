import React, { useState } from "react";

// Strongly typed form data
interface FormData {
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: string[]; // store keys only
}

// Services as key-value pairs
const serviceOptions: Record<string, string> = {
  web_design: "Web Design",
  seo: "SEO",
  social_media: "Social Media Marketing",
  app_dev: "App Development",
  consulting: "Consulting",
};

const RegisterPage: React.FC = () => {
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
    <div style={styles.container}>
      {/* Left Column - Form */}
      <div style={styles.leftColumn}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Name */}
          <div style={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div style={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mobile */}
          <div style={styles.formGroup}>
            <label htmlFor="mobile">Mobile</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          {/* Postcode */}
          <div style={styles.formGroup}>
            <label htmlFor="postcode">Postcode</label>
            <input
              type="text"
              id="postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              required
            />
          </div>

          {/* Services */}
          <div style={styles.formGroup}>
            <label>Services</label>
            {Object.entries(serviceOptions).map(([key, display]) => (
              <label key={key} style={{ display: "block", marginTop: 4 }}>
                <input
                  type="checkbox"
                  value={key}
                  checked={formData.services.includes(key)}
                  onChange={handleCheckboxChange}
                />{" "}
                {display}
              </label>
            ))}
          </div>

          <button type="submit" style={styles.submitButton}>
            Register
          </button>
        </form>
      </div>

      {/* Right Column - Blank */}
      <div style={styles.rightColumn}></div>
    </div>
  );
};

export default RegisterPage;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
  },
  leftColumn: {
    flex: 1,
    padding: "60px",
    backgroundColor: "#f4f4f4",
  },
  rightColumn: {
    flex: 2,
    backgroundColor: "#ffffff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "400px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
};
