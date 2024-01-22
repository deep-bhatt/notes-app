import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await registerUser(username, password);
    if (res.error) {
      console.log(res.error);
      setErrorMessage(res.error.error);
    } else {
      console.log("Registered successfully:", res.data);
      localStorage.setItem("jwt", res.data.token);
      navigate("/dashboard");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <form onSubmit={handleSubmit} className="mt-5">
            <h2>User Register Form</h2>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username&nbsp;
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password &nbsp;
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Register
            </button>
            <p className="mt-3">
              <Link to="/login">Already have an account?</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
