import api from "./axios.js";

// contact management APIs here.
export const getContacts = ({page=0, size=10, search = ""}) => {
    return api.get("/contacts/get-all-contacts", {
        params: { page, size, search }
    });
};

export const createContact = (data) => {
    return api.post("/contacts/create-contact", data);
};

export const updateContact = (id, data) => {
    return api.put(`/contacts/update-contact/${id}`, data);
};

export const deleteContact = (id) => {
    return api.delete(`/contacts/delete-contact/${id}`);
};

export const getContact = (id) => {
    return api.get(`/contacts/get-contact/${id}`);
}

export const getCurrentUser = () => {
    return api.get("/contacts/me");
}



