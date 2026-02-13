import { useState } from "react";
import { generateOtp, verifyOtp, resetPassword } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        otp: "",
        newPassword: ""
    });
    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [message, setMessage] = useState("");
    const [step, setStep] = useState(1); // 1: Generate OTP, 2: Verify OTP, 3: Reset Password

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleGenerateOtp = async () => {
        setError("");
        setMessage("");
        setLoading(true);
        try {
            await generateOtp(form.email);
            showToast("OTP sent to your email", "success");
            setStep(2);
        } catch (err) {
            showToast("Failed to send OTP","error");
        } finally {
            setLoading(false);
        }
    };

    // STEP 2 → Verify OTP
    const handleVerifyOtp = async () => {
        setError("");
        setMessage("");
        setLoading(true);
        try {
            await verifyOtp(form.email, form.otp);
            showToast("OTP verified", "success");
            setStep(3);
        } catch (err) {
            showToast("Invalid or expired OTP","error");
        } finally {
            setLoading(false);
        }
    };

    // STEP 3 → Reset Password
    const handleResetPassword = async () => {
        setError("");
        setMessage("");
        setLoading(true);
        try {
            await resetPassword({
                email: form.email,
                newPassword: form.newPassword
            });
            showToast("Password reset Successful", "success");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            showToast("Password Reset Failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Forgot Password</h2>

                {error && <div className="auth-error">{error}</div>}
                {message && <div className="auth-success">{message}</div>}

                {/* STEP 1 */}
                {step === 1 && (
                    <div className="input-group">
                        <input
                            name="email"
                            placeholder="Enter your email"
                            onChange={handleChange}
                            required
                        />
                        <button onClick={handleGenerateOtp} disabled={loading}>
                            Generate OTP
                        </button>
                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <div className="input-group">
                        <input
                            name="otp"
                            placeholder="Enter OTP"
                            onChange={handleChange}
                            required
                        />
                        <button onClick={handleVerifyOtp} disabled={loading}>
                            Verify OTP
                        </button>
                    </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <div className="input-group">
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Enter New Password"
                            onChange={handleChange}
                            required
                        />
                        <button onClick={handleResetPassword} disabled={loading}>
                            Reset Password
                        </button>
                    </div>
                )}

                <button
                    className="secondary-btn"
                    onClick={() => navigate("/login")}
                >
                    Back to Login
                </button>
            </div>


            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>


    //     <div className="auth-page">
    //         <div className="auth-card">
    //         <h2>Change Password</h2>
    //
    //             {error && <div className="auth-error">{error}</div>}
    //
    //         <form onSubmit={handleSubmit}>
    //             <div className="input-group">
    //                 <input name="identifier" placeholder="Email or Phone" onChange={handleChange} required />
    //             </div>
    //
    //             <div className="input-group">
    //             <input name="oldPassword" type="password" placeholder="Old Password" onChange={handleChange} required />
    //             </div>
    //                 <div className="input-group">
    //             <input name="newPassword" type="password" placeholder="New Password" onChange={handleChange} required />
    //             </div>
    //             <button type="submit">Reset</button>
    //             <button
    //                 type="button"
    //                 className="secondary-btn"
    //                 onClick={() => navigate("/login")} // or history.back()
    //             >
    //                 Cancel
    //             </button>
    //         </form>
    //         </div>
    //     </div>
     );
}
