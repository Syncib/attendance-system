import React, { useState } from "react";
import { useRegister } from "../hooks/useRegister";


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, error, isLoading } = useRegister();

  const handleRegister = async (e) => {
    e.preventDefault();
    await register(name, email, password);
  };

  return (
    <>
      <div className="auth-container">
        <form className="w-50 p-3 " onSubmit={handleRegister}>
          <h2>Register</h2>
          <div className="my-3">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              className="form-control"
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="my-3">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              className="form-control"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="my-3">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              className="form-control"
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isLoading}
          >
            Register
          </button>
          {error && <p className="text-danger">{error}</p>}
          <p>
            Already have an account? <a href="/login">Login</a> now
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
