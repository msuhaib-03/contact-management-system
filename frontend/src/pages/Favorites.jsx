import { useEffect, useState } from "react";
import { getFavoriteContacts } from "../api/contactApi";
import "../styles/contacts.css";

function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFavoriteContacts()
            .then(res => setFavorites(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);


    return (
        <div className="favorites-page">
            <h2>❤️ Favorite Contacts</h2>

            {loading && <p>Loading favorites...</p>}

            {!loading && favorites.length === 0 && (
                <div>No favorite contacts yet</div>
            )}

            <div className="contacts-grid">
                {favorites.map(contact => (
                    <div key={contact.id} className="contact-card">
                        <h4>{contact.firstName} {contact.lastName}</h4>
                        <p>{contact.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FavoritesPage;