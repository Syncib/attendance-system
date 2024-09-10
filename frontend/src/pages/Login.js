import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleLogin = async (e) => {
    e.preventDefault();

    await login(email, password);
  };

  return (
    <>
      <div className="auth-container">
        <form className="w-50 p-3 " onSubmit={handleLogin}>
          <h2>Login</h2>
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
            Login
          </button>
          {error && <p className="text-danger">{error}</p>}
          <p>
            Don't have an account? <a href="/register">Register</a> now
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
