import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/authApi";
import "../styles/auth.css";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
    });
    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await register(form);
            alert("Registration successful!");
            navigate("/login");
        } catch (err) {
            setError("Registration failed. Please try again.");
        }finally {
            setLoading(false);
        }
    };
    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Create Account </h2>
                <p className="auth-subtitle">
                    Sign up to start managing your contacts
                </p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleRegister}>
                    <div className="input-group">
                    <input
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                    />
                    </div>

                    <div className="input-group">
                    <input
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                        required
                    />
                    </div>

                        <div className="input-group">
                    <input
                        name="phoneNumber"
                        placeholder="Phone Number"
                        onChange={handleChange}
                        required
                    />
                        </div>

                            <div className="input-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                            </div>

                    <button type="submit">Create Account</button>
                </form>

                <div className="auth-links">
                    <a href="/login">Already have an account?</a>
                </div>
            </div>
        </div>
    );

}
