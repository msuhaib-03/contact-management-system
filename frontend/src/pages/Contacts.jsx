import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Contacts() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div style={{ padding: "40px" }}>
            <h2>Contact Management Screen</h2>
            <p>Welcome! You are logged in.</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
