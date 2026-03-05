import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// /* SAME COUNTRIES AS SIGNUP */
// const countries = [
//   { name: "India", code: "+91" },
//   { name: "United States", code: "+1" },
//   { name: "United Kingdom", code: "+44" },
//   { name: "Australia", code: "+61" },
// ];

function UserProfile() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);

  const initialUser = {
    name: "",
    email: "",
    // phone: "",
    // countryCode: "+91",
    password: "",
    confirmPassword: "",
  };

  const [user, setUser] = useState(initialUser);
  const [savedUser, setSavedUser] = useState(initialUser);

  const [editable, setEditable] = useState({
    name: false,
    email: false,
    // phone: false,
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ---------- HELPERS ---------- */
  // const detectCountryFromPhone = (phoneNumber) => {
  //   if (!phoneNumber) return { code: "+91", phone: "" };

  //   const match = countries.find((c) =>
  //     phoneNumber.startsWith(c.code)
  //   );

  //   if (match) {
  //     return {
  //       code: match.code,
  //       phone: phoneNumber.replace(match.code, ""),
  //     };
  //   }

  //   return { code: "+91", phone: phoneNumber.replace(/^\+/, "") };
  // };

  /* ---------- GET USER ---------- */
  const getUserDetails = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/getuser",
        {
          method: "GET",
          headers: { "auth-token": token },
        }
      );

      const data = await response.json();

      if (data.name || data.email) {
        // const phoneInfo = detectCountryFromPhone(data.phoneNumber);

        const cleanUser = {
          name: data.name || "",
          email: data.email || "",
          // countryCode: phoneInfo.code,
          // phone: phoneInfo.phone,
          password: "",
          confirmPassword: "",
        };

        setUser(cleanUser);
        setSavedUser(cleanUser);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/loginplease");
    } else {
      getUserDetails();
    }
  }, [navigate, token]);

  /* ---------- EDIT TOGGLE ---------- */
  const toggleEdit = (field) => {
    setEditable((prev) => {
      const next = { ...prev, [field]: !prev[field] };
      if (prev[field]) {
        setUser((u) => ({ ...u, [field]: savedUser[field] }));
      }
      return next;
    });
  };

  /* ---------- PASSWORD TOGGLE ---------- */
  const togglePasswordChange = () => {
    if (showPasswordFields) {
      setUser((u) => ({ ...u, password: "", confirmPassword: "" }));
      setError("");
    }
    setShowPasswordFields(!showPasswordFields);
  };

  /* ---------- INPUT CHANGE ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Digits only for phone
    if (name === "phone" && !/^\d*$/.test(value)) return;

    setUser({ ...user, [name]: value });
  };

  /* ---------- UPDATE ---------- */
  const handleUpdate = async () => {
    if (showPasswordFields && user.password !== user.confirmPassword) {
      setError("Password and Confirm Password do not match");
      return;
    }

    setError("");

    const payload = {};
    if (editable.name) payload.name = user.name;
    if (editable.email) payload.email = user.email;
    if (editable.phone) {
      payload.phoneNumber = `${user.countryCode}${user.phone}`;
    }
    if (showPasswordFields && user.password) {
      payload.password = user.password;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/updateProfile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.success) {
        setSavedUser({
          ...user,
          password: "",
          confirmPassword: "",
        });

        setEditable({ name: false, email: false, phone: false });
        setShowPasswordFields(false);

        setSuccess("Profile updated successfully");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.msg || "Update failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card shadow-sm p-4" style={{ width: "500px" }}>
        <h4 className="mb-4">User Profile</h4>

        {/* NAME */}
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              name="name"
              value={user.name}
              disabled={!editable.name}
              onChange={handleChange}
            />
            <button
              className="btn btn-outline-secondary"
              onClick={() => toggleEdit("name")}
            >
              {editable.name ? "Cancel" : "Edit"}
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
              className="btn btn-outline-secondary"
              onClick={() => toggleEdit("email")}
            >
              {editable.email ? "Cancel" : "Edit"}
            </button>
          </div>
        </div>

        {/* PHONE */}
        {/* <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <div className="d-flex gap-2">
            <select
              className="form-select"
              style={{ maxWidth: "120px" }}
              name="countryCode"
              value={user.countryCode}
              disabled
              onChange={handleChange}
              
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>

            <input
              type="tel"
              className="form-control"
              name="phone"
              value={user.phone}
              disabled={!editable.phone}
              onChange={handleChange}
              placeholder="Phone number"
            />
          </div>

          <button
            className="btn btn-outline-secondary mt-2"
            onClick={() => toggleEdit("phone")}
          >
            {editable.phone ? "Cancel" : "Edit"}
          </button>
        </div> */}

        {/* CHANGE PASSWORD */}
        <div className="mb-3">
          <button
            className={`btn ${
              showPasswordFields
                ? "btn-outline-danger"
                : "btn-outline-primary"
            }`}
            onClick={togglePasswordChange}
          >
            {showPasswordFields ? "Cancel" : "Change Password"}
          </button>
        </div>

        {/* PASSWORD FIELDS */}
        {showPasswordFields && (
          <div className="mb-3">
            <input
              type="password"
              className="form-control mb-2"
              name="password"
              placeholder="New Password"
              value={user.password}
              onChange={handleChange}
            />
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={user.confirmPassword}
              onChange={handleChange}
            />
          </div>
        )}

        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {success && <div className="alert alert-success mt-3">{success}</div>}

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
