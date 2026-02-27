import { useEffect, useState } from "react";
import { getFavoriteContacts, getCurrentUser } from "../api/contactApi";
import {useNavigate} from "react-router-dom";
import "../styles/contacts.css";

export default function Favorites() {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [toast, setToast] = useState(null);

    // ✅ FETCH USER
    useEffect(() => {
        getCurrentUser()
            .then(res => setUser(res.data))
            .catch(err => console.error(err));
    }, []);

    // ✅ FETCH FAVORITES
    useEffect(() => {
        getFavoriteContacts()
            .then(res => setFavorites(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    // ✅ LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="contacts-page">

            {/* NAVBAR */}
            <div className="navbar">
                <h2>📇 Contacts Management System</h2>

                <div className="navbar-right">
                    <div
                        className="username"
                        onClick={() => setShowMenu(prev => !prev)}
                    >
                        <div className="avatar">
                            {user?.name?.charAt(0)}
                        </div>

                        <span>{user?.name}</span>
                        <span className="caret">▾</span>

                        {showMenu && (
                            <div className="dropdown">
                                <div
                                    className="dropdown-item profile"
                                    onClick={() => navigate("/profile")}
                                >
                                    👤 Profile
                                </div>

                                <div
                                    className="dropdown-item logout"
                                    onClick={handleLogout}
                                >
                                    🚪 Logout
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            <div className="contacts-layout">

                {/* SIDEBAR */}
                <div className="sidebar">

                    <div className="sidebar-title">📂 Menu</div>

                    <div
                        className="sidebar-item"
                        onClick={() => navigate("/contacts")}
                    >
                        📇 All Contacts
                    </div>

                    <div
                        className="sidebar-item active"
                    >
                        ❤️ Favorites
                    </div>

                    <div
                        className="sidebar-item"
                        onClick={() => navigate("/dashboard")}
                    >
                        📊 Dashboard
                    </div>
                </div>


                {/* MAIN CONTENT */}
                <div className="content-area">

                    <h2>❤️ Favorite Contacts</h2>

                    {loading && <p>Loading favorites...</p>}

                    {!loading && favorites.length === 0 && (
                        <div>No favorite contacts yet</div>
                    )}

                    <div className="contacts-grid">
                        {favorites.map(contact => (
                            <div key={contact.id} className="contact-card">
                                <h4>{contact.firstName} {contact.lastName}</h4>
                                <div className="contact-title">
                                    {contact.title}
                                </div>

                                <div className="contact-meta">
                                    📧 {(contact.emails || []).map(e => e.value).join(", ")}
                                </div>

                                <div className="contact-meta">
                                    📞 {(contact.phoneNumbers || []).map(p => p.value).join(", ")}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
