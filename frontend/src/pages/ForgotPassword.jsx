import { useState } from "react";
import { changePassword } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        identifier: "",
        oldPassword: "",
        newPassword: ""
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await changePassword(form);
            alert("Password changed successfully");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data || "Error");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Change Password</h2>
            <input name="identifier" placeholder="Email or Phone" onChange={handleChange} required />
            <input name="oldPassword" type="password" placeholder="Old Password" onChange={handleChange} required />
            <input name="newPassword" type="password" placeholder="New Password" onChange={handleChange} required />
            <button type="submit">Reset</button>
        </form>
    );
}
