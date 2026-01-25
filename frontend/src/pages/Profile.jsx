import {useEffect, useState} from "react";
import {getCurrentUser} from "../api/contactApi.js";
import {useNavigate} from "react-router-dom";
import {clearToken} from "../utils/auth.js";
import {changePassword as apiChangePassword} from "../api/authApi.js";
import {logout as apiLogout} from "../api/authApi.js";
import "../styles/profile.css";

export default function Profile() {
    const navigate = useNavigate();

    // ---------------------------
    // ---------- STATE ----------
    // ---------------------------
    const [user, setUser] = useState(null);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [toast, setToast] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    // ---------------------------
    // --------- TOAST -----------
    // ---------------------------
    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // --------------------------
    // --------- EFFECTS ---------
    // --------------------------
    useEffect(() => {
        getCurrentUser()
            .then(res => setUser(res.data))
            .catch(err => {
                console.error("Failed to load user", err);
                showToast("Failed to load profile", "error");
            });
    }, []);

    // ------------------------
    // -------- ACTIONS -------
    // ------------------------
    const handleLogout = async () => {
        try {
            await apiLogout();
        } catch (e) {
            console.warn("Logout failed", e);
        } finally {
            clearToken();
            showToast("Logged out successfully");
            setTimeout(() => navigate("/login"), 800);
        }
    };

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            showToast("Please fill all fields", "error");
            return;
        }

        if (newPassword.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }

        try {
            setLoading(true);
            await apiChangePassword({ newPassword });
            showToast("Password updated successfully");
            setShowChangePassword(false);
            setNewPassword("");
            setConfirmPassword("");
        } catch (e) {
            showToast("Failed to update password", "error");
        } finally {
            setLoading(false);
        }
    };


    // ------------------------
    // -------- UI ------------
    //-------------------------
    return (
        <div className="profile-page">

            {/* NAVBAR */}
            <div className="navbar">
                <h2>👤 User Profile</h2>
                <div className="navbar-right">
                    <span className="username">{user?.name}</span>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* PROFILE CARD */}
            <div className="profile-content">
                <div className="profile-card">
                    <h3>Account Information</h3>
                    <p className="profile-subtitle">
                        Manage your personal details and security settings
                    </p>

                    <div className="profile-row">
                        <label>Name</label>
                        <span>{user?.name}</span>
                    </div>

                    <div className="profile-row">
                        <label>Email</label>
                        <span>{user?.email}</span>
                    </div>

                    <div className="profile-actions">
                        <button
                            className="primary-btn"
                            onClick={() => setShowChangePassword(true)}
                        >
                            Change Password
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() => navigate("/contacts")}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {/* CHANGE PASSWORD MODAL */}
            {showChangePassword && (
                <div className="profile-modal-overlay">
                    <div className="profile-modal">
                        <h3 className="profile-modal-title">🔒 Change Password</h3>

                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="profile-input"
                        />

                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="profile-input"
                        />

                        <div className="profile-modal-actions">
                            <button
                                className="secondary-btn"
                                onClick={() => setShowChangePassword(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="primary-btn"
                                onClick={handleChangePassword}
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* TOAST */}
            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );

}