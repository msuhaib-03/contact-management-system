import { logout as localLogout } from "../utils/auth";
import { logout as apiLogout } from "../api/authApi.js"
import { useNavigate } from "react-router-dom";

export default function Contacts() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try{
            await apiLogout();
        }catch (e){
            console.error("Logout api failed",e);
        }finally {
            localLogout();
            navigate("/login");
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h2>Contact Management Screen</h2>
            <p>Welcome! You are logged in.</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
