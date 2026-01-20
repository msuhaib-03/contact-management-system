import {useState, useEffect} from "react";
import {getContacts} from "../api/contactApi";
import {createContact} from "../api/contactApi";
import {clearToken} from "../utils/auth.js";
import {useFetcher, useNavigate} from "react-router-dom";
import {logout as apiLogout} from "../api/authApi.js";
import "../styles/contacts.css";

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
        emails: [{label: "", value: ""}],
        phoneNumbers: [{label: "", value: ""}]
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
                    emails: form.emails,
                    phoneNumbers: form.phoneNumbers
                };
                await createContact(payload);
                setShowCreateModal(false);
                setForm({
                    firstName: "",
                    lastName: "",
                    title: "",
                    emails: [{ label: "", value: "" }],
                    phoneNumbers: [{ label: "", value: "" }]
                });
                fetchContacts(); // refresh list
            } catch {
                alert("Failed to create contact");
            }
        }

    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await apiLogout();
        }catch (e){
            console.warn("Logout failed:", e);
        }finally {
            clearToken();          // remove token
            navigate("/login"); // redirect
        }
    };



    // =====================
    // UI
    // =====================
    // if (loading) return <p>Loading contacts...</p>;
    //{loading && <p>Loading contacts...</p>}
    if (error) return <p>{error}</p>;

    // ====================
    // HELPER FUNCTIONS
    // ====================
    const addEmail = () => {
        setForm({
            ...form,
            emails: [...form.emails, { label: "", value: "" }]
        });
    };

    const updateEmail = (index, field, value) => {
        const updated = [...form.emails];
        // updated[index][field] = value;
        updated[index] = {
            ...updated[index],
            [field]: value   // MUST be string
        };
        setForm({ ...form, emails: updated });
    };

    const removeEmail = (index) => {
        const updated = form.emails.filter((_, i) => i !== index);
        setForm({ ...form, emails: updated });
    };

    const addPhone = () => {
        setForm({
            ...form,
            phoneNumbers: [...form.phoneNumbers, { label: "", value: "" }]
        });
    };

    const updatePhone = (index, field, value) => {
        const updated = [...form.phoneNumbers];
        updated[index] = {
            ...updated[index],
            [field]: value
        };
        setForm({ ...form, phoneNumbers: updated });
    };

    const removePhone = (index) => {
        const updated = form.phoneNumbers.filter((_, i) => i !== index);
        setForm({ ...form, phoneNumbers: updated });
    };

    // Get Contacts Modal
    return (
        <div className="contacts-page">

            {/* NAVBAR */}
        <div className="navbar">
            <h2>📇 Contacts Management System</h2>
            <div className="navbar-right">
                <span>{form.lastName || "Muhammad Suhaib"}</span>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>

            {/* MAIN CONTENT */}
            <div className="contacts-content">

                <div className="contacts-header">
                    <input
                        className="search-input"
                        placeholder="Search contacts..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                    <button
                        className="create-btn"
                        onClick={() => setShowCreateModal(true)}
                    >
                        + Create Contact
                    </button>
                </div>

                {loading && <p>Loading contacts...</p>}

                <div className="contacts-grid">
                    {contacts.map(c => (
                        <div className="contact-card" key={c.id}>
                            <h4>{c.firstName} {c.lastName}</h4>
                            <div className="contact-title">{c.title}</div>

                            <div className="contact-meta">
                                📧 {(c.emails || []).map(e => e.value).join(", ")}
                            </div>

                            <div className="contact-meta">
                                📞 {(c.phoneNumbers || []).map(p => p.value).join(", ")}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pagination">
                    <button disabled={page === 0} onClick={() => setPage(page - 1)}>
                        Prev
                    </button>
                    <span>{page + 1} / {totalPages}</span>
                    <button
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* MODAL */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        {/* Header */}
                        <div className="modal-header">
                            <h3>Create Contact</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowCreateModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="modal-body">

                            <div className="input-row">
                                <input
                                    placeholder="First Name"
                                    value={form.firstName}
                                    onChange={e =>
                                        setForm({ ...form, firstName: e.target.value })
                                    }
                                />
                                <input
                                    placeholder="Last Name"
                                    value={form.lastName}
                                    onChange={e =>
                                        setForm({ ...form, lastName: e.target.value })
                                    }
                                />
                            </div>

                            <input
                                placeholder="Title (e.g. Software Engineer)"
                                value={form.title}
                                onChange={e =>
                                    setForm({ ...form, title: e.target.value })
                                }
                            />

                            {/* EMAILS */}
                            <div className="section">
                                <div className="section-header">
                                    <h4>Emails</h4>
                                    <button className="add-btn" onClick={addEmail}>
                                        + Add
                                    </button>
                                </div>

                                {form.emails.map((email, index) => (
                                    <div className="input-row" key={index}>
                                        <input
                                            placeholder="Label"
                                            value={email.label}
                                            onChange={e =>
                                                updateEmail(index, "label", e.target.value)
                                            }
                                        />
                                        <input
                                            placeholder="Email"
                                            value={email.value}
                                            onChange={e =>
                                                updateEmail(index, "value", e.target.value)
                                            }
                                        />
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeEmail(index)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* PHONES */}
                            <div className="section">
                                <div className="section-header">
                                    <h4>Phone Numbers</h4>
                                    <button className="add-btn" onClick={addPhone}>
                                        + Add
                                    </button>
                                </div>

                                {form.phoneNumbers.map((phone, index) => (
                                    <div className="input-row" key={index}>
                                        <input
                                            placeholder="Label"
                                            value={phone.label}
                                            onChange={e =>
                                                updatePhone(index, "label", e.target.value)
                                            }
                                        />
                                        <input
                                            placeholder="Phone Number"
                                            value={phone.value}
                                            onChange={e =>
                                                updatePhone(index, "value", e.target.value)
                                            }
                                        />
                                        <button
                                            className="remove-btn"
                                            onClick={() => removePhone(index)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="modal-footer">
                            <button className="secondary-btn" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </button>
                            <button className="primary-btn" onClick={handleCreate}>
                                Save Contact
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}