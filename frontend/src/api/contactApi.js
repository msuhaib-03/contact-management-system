import api from "./axios.js";

// contact management APIs here.
export const getContacts = () => {
    return api.get("/contacts/get-all-contacts");
};



