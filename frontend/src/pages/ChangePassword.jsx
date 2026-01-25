import { useState } from "react";
import { changePassword } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function ChangePassword() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        identifier: "",
        oldPassword: "",
        newPassword: ""
    });
    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await changePassword(form);
            alert("Password changed successfully");
            navigate("/login");
        } catch (err) {
            setError("Error Changing Password.");
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
            <h2>Change Password</h2>

                {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input name="identifier" placeholder="Email or Phone" onChange={handleChange} required />
                </div>

                <div className="input-group">
                <input name="oldPassword" type="password" placeholder="Old Password" onChange={handleChange} required />
                </div>
                    <div className="input-group">
                <input name="newPassword" type="password" placeholder="New Password" onChange={handleChange} required />
                </div>
                <button type="submit">Reset</button>
                <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => navigate("/login")} // or history.back()
                >
                    Cancel
                </button>
            </form>
            </div>
        </div>
    );
}
