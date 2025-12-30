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

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(form);
            alert("Registration successful!");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input name="name" placeholder="Name" onChange={handleChange} required />
                <input name="email" placeholder="Email" onChange={handleChange} required />
                <input name="phoneNumber" placeholder="Phone" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
