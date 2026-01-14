import {useState, useEffect} from "react";
import {getContacts} from "../api/contactApi";

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await getContacts();
                // Spring Page response → content
                setContacts(res.data.content || []);
            } catch (err) {
                setError("Failed to load contacts");
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    if (loading) return <p>Loading contacts...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{padding: "40px"}}>
            <h2>My Contacts</h2>

            {contacts.length === 0 ? (
                <p>No contacts found</p>
            ) : (
                <ul>
                    {contacts.map((c) => (
                        <li key={c.id}>
                            {c.firstName} {c.lastName} — {c.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

}