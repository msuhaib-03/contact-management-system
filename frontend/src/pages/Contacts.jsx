import {useState, useEffect} from "react";
import {getContacts} from "../api/contactApi";

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);

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


    if (loading) return <p>Loading contacts...</p>;
    if (error) return <p>{error}</p>;

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

            {/* List */}
            {contacts.length === 0 ? (
                <p>No contacts found</p>
            ) : (
                <ul>
                    {contacts.map((c) => (
                        <li key={c.id}>
                            <strong>{c.firstName} {c.lastName}</strong> — {c.title}
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
        </div>
    );

}