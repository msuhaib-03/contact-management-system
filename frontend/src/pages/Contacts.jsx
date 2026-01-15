import {useState, useEffect} from "react";
import {getContacts} from "../api/contactApi";
import {createContact} from "../api/contactApi";

export default function Contacts() {
    // =====================
    // STATE
    // =====================
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        title: "",
        emails: "",
        phoneNumbers: ""
    });

    // =====================
    // EFFECTS
    // =====================
    useEffect(() => {
        fetchContacts();
    }, [page, debouncedSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0); // Reset to first page on new search
        }, 400); // 500ms debounce
        return () => clearTimeout(timer);
    }, [search]);


    // =====================
    // FUNCTIONS
    // =====================
    const fetchContacts = async () => {
        try {
            setLoading(true);
            const res = await getContacts({
                page,
                size:5,
                search : debouncedSearch
                });
                // Spring Page response → content
            setContacts(res.data.content || []);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            setError("Failed to load contacts");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
            try {
                const payload = {
                    firstName: form.firstName,
                    lastName: form.lastName,
                    title: form.title,
                    emails: [
                        {label: "work", value: form.emails}
                    ],
                    phoneNumbers: [
                        {label: "mobile", value: form.phoneNumbers}
                    ]
                };
                await createContact(payload);
                setShowCreateModal(false);
                setForm({firstName: "", lastName: "", title: "", emails: "", phoneNumbers: ""});
                fetchContacts(); // refresh list
            } catch {
                alert("Failed to create contact");
            }
        }


    // =====================
    // UI
    // =====================
    if (loading) return <p>Loading contacts...</p>;
    if (error) return <p>{error}</p>;

    // Get Contacts Modal
    return (
        <div style={{ padding: "40px" }}>
            <h2>My Contacts</h2>

            {/* Search */}
            <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => {
                    setPage(0);
                    setSearch(e.target.value);
                }}
                style={{ marginBottom: "15px", padding: "8px", width: "250px" }}
            />

            {/* Create Contact Button */}
            <button onClick={() => setShowCreateModal(true)}>
                + Create Contact
            </button>

            {/* List */}
            {contacts.length === 0 ? (
                <p>No contacts found</p>
            ) : (
                <ul>
                    {contacts.map((c) => (
                        <li key={c.id}>
                            <strong>{c.firstName} {c.lastName}</strong> — {c.title} -
                            <br />
                            Emails: {c.emails.map(e => `${e.label}: ${e.value}`).join(", ")}
                            <br />
                            Phones: {c.phoneNumbers.map(p => `${p.label}: ${p.value}`).join(", ")}
                        </li>
                    ))}
                </ul>
            )}

            {/* Pagination */}
            <div style={{ marginTop: "20px" }}>
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                >
                    Prev
                </button>

                <span style={{ margin: "0 10px" }}>
                    Page {page + 1} of {totalPages}
                </span>

                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>

            {/* Create Contact Modal */}
            {showCreateModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0.4)"
                }}>
                    <div style={{
                        background: "#fff",
                        padding: "20px",
                        width: "400px",
                        margin: "100px auto"
                    }}>
                        <h3>Create Contact</h3>

                        <input
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={e => setForm({ ...form, firstName: e.target.value })}
                        />

                        <input
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={e => setForm({ ...form, lastName: e.target.value })}
                        />

                        <input
                            placeholder="Title"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                        />

                        <input
                            placeholder="Emails"
                            value={form.emails}
                            onChange={e => setForm({ ...form, emails: e.target.value })}
                        />

                        <input
                            placeholder="Phone Numbers"
                            value={form.phoneNumbers}
                            onChange={e => setForm({ ...form, phoneNumbers: e.target.value })}
                        />

                        <div style={{ marginTop: "10px" }}>
                            <button onClick={handleCreate}>Save</button>
                            <button onClick={() => setShowCreateModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}