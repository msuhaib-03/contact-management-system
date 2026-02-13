import { useState } from "react";
import { changePassword } from "../api/authApi";
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

    const handleGenerateOtp = async () => {
        setError("");
        setMessage("");
        setLoading(true);
        try {
            await generateOtp(form.email);
            setMessage("OTP sent to your email");
            setStep(2);
        } catch (err) {
            setError("Failed to send OTP");
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
            setMessage("OTP verified");
            setStep(3);
        } catch (err) {
            setError("Invalid or expired OTP");
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
            alert("Password reset successful");
            navigate("/login");
        } catch (err) {
            setError("Password reset failed");
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
                    <>
                        <input
                            name="email"
                            placeholder="Enter your email"
                            onChange={handleChange}
                            required
                        />
                        <button onClick={handleGenerateOtp} disabled={loading}>
                            Generate OTP
                        </button>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <input
                            name="otp"
                            placeholder="Enter OTP"
                            onChange={handleChange}
                            required
                        />
                        <button onClick={handleVerifyOtp} disabled={loading}>
                            Verify OTP
                        </button>
                    </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <>
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
                    </>
                )}

                <button
                    className="secondary-btn"
                    onClick={() => navigate("/login")}
                >
                    Back to Login
                </button>
            </div>
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
