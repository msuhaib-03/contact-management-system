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
            {loading && <p>Loading contacts...</p>}


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
                            Emails: {(c.emails || []).map(e => `${e.label}: ${e.value}`).join(", ")}
                            <br />
                            Phones: {(c.phoneNumbers || []).map(p => `${p.label}: ${p.value}`).join(", ")}
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

                        <h4>Emails</h4>
                        {form.emails.map((email, index) => (
                            <div key={index}>
                                <input
                                    placeholder="Label (work, personal)"
                                    value={email.label}
                                    onChange={e => updateEmail(index, "label", e.target.value)}
                                />
                                <input
                                    placeholder="Email"
                                    value={email.value}
                                    onChange={e => updateEmail(index, "value", e.target.value)}
                                />
                                <button onClick={() => removeEmail(index)}>X</button>
                            </div>
                        ))}
                        <button onClick={addEmail}>+ Add Email</button>

                        <h4>Phone Numbers</h4>
                        {form.phoneNumbers.map((phone, index) => (
                            <div key={index}>
                                <input
                                    placeholder="Label (mobile, home)"
                                    value={phone.label}
                                    onChange={e => updatePhone(index, "label", e.target.value)}
                                />
                                <input
                                    placeholder="Phone Number"
                                    value={phone.value}
                                    onChange={e => updatePhone(index, "value", e.target.value)}
                                />
                                <button onClick={() => removePhone(index)}>X</button>
                            </div>
                        ))}
                        <button onClick={addPhone}>+ Add Phone</button>


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