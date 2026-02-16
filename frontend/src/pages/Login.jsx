import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { login } from "../api/authApi";
import { saveToken } from "../utils/auth";
import "../styles/auth.css";
import connectingteams from "../assets/connectingteams.svg";

export default function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);


    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await login({ identifier, password });
            saveToken(res.data.token);
            showToast("Login Successful", "success");
            setTimeout(() => {
                navigate("/contacts");
            }, 2000);
        } catch (err){
            showToast("Invalid credentials. Please try again.");
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <img src = {connectingteams} alt="Connecting Teams" className="auth-image" />
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <h6 className="auth-subtitle">
                    Login to manage your contacts
                </h6>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email or Phone</label>
                        <input
                            type="text"
                            placeholder="example@email.com"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="auth-links">
                    <Link to="/forgot">Forgot Password?</Link>
                    <Link to="/register">Create Account</Link>
                </div>
            </div>
            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );

}
