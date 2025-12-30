import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Contacts() {
    const navigate = useNavigate();

    return (
        <>
            <h2>Contact Management Screen</h2>
            <button onClick={() => { logout(); navigate("/login"); }}>
                Logout
            </button>
        </>
    );
}
