import { useState } from "react";
import { loginUser } from "../api/authApi";
import { saveToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        identifier: "",
        password: ""
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(form);
            saveToken(res.data.token);
            navigate("/contacts");
        } catch (err) {
            alert("Invalid credentials");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input name="identifier" placeholder="Email or Phone" onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
            <p onClick={() => navigate("/forgot")}>Forgot Password?</p>
        </form>
    );
}
