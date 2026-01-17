import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const navigate = useNavigate();
  const logStatus = useSelector((state) => state.logStatus);

  const initialUser = {
    fullName: "Jatin Sharma",
    email: "jatin@example.com",
    password: "",
    confirmPassword: ""
  };

  const [user, setUser] = useState(initialUser);
  const [editable, setEditable] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/loginplease");
    }
  }, [navigate]);

  const toggleEdit = (field) => {
    setEditable((prev) => {
      const next = { ...prev, [field]: !prev[field] };

      // If cancelling edit
      if (prev[field]) {
        if (field === "password" || field === "confirmPassword") {
          setUser((u) => ({ ...u, password: "", confirmPassword: "" }));
        } else {
          setUser((u) => ({ ...u, [field]: initialUser[field] }));
        }
        setError("");
      }

      return next;
    });
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    if (
      (editable.password || editable.confirmPassword) &&
      user.password !== user.confirmPassword
    ) {
      setError("Password and Confirm Password do not match");
      return;
    }

    setError("");

    // 🔗 API / Redux update goes here
    console.log("Updated User:", user);

    // Lock everything again
    setEditable({
      fullName: false,
      email: false,
      password: false,
      confirmPassword: false
    });
  };

  const getButtonText = (field) => (editable[field] ? "Cancel" : "Edit");

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card shadow-sm p-4" style={{ width: "500px" }}>
        <h4 className="mb-4">User Profile</h4>

        {/* FULL NAME */}
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              name="fullName"
              value={user.fullName}
              disabled={!editable.fullName}
              onChange={handleChange}
            />
            <button
              className={`btn ${
                editable.fullName ? "btn-outline-danger" : "btn-outline-secondary"
              }`}
              onClick={() => toggleEdit("fullName")}
            >
              {getButtonText("fullName")}
            </button>
          </div>
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <div className="input-group">
            <input
              type="email"
              className="form-control"
              name="email"
              value={user.email}
              disabled={!editable.email}
              onChange={handleChange}
            />
            <button
              className={`btn ${
                editable.email ? "btn-outline-danger" : "btn-outline-secondary"
              }`}
              onClick={() => toggleEdit("email")}
            >
              {getButtonText("email")}
            </button>
          </div>
        </div>

        {/* PASSWORD */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <div className="input-group">
            <input
              type="password"
              className="form-control"
              name="password"
              value={user.password}
              disabled={!editable.password}
              onChange={handleChange}
            />
            <button
              className={`btn ${
                editable.password
                  ? "btn-outline-danger"
                  : "btn-outline-secondary"
              }`}
              onClick={() => toggleEdit("password")}
            >
              {getButtonText("password")}
            </button>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <div className="input-group">
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={user.confirmPassword}
              disabled={!editable.confirmPassword}
              onChange={handleChange}
            />
            <button
              className={`btn ${
                editable.confirmPassword
                  ? "btn-outline-danger"
                  : "btn-outline-secondary"
              }`}
              onClick={() => toggleEdit("confirmPassword")}
            >
              {getButtonText("confirmPassword")}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="d-grid mt-4">
          <button className="btn btn-primary btn-lg" onClick={handleUpdate}>
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
