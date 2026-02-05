import api from "./axios.js";

// auth and login APIs here.
export const register = (data) =>
    api.post("/auth/register", data);

export const login = (data) =>
    api.post("/auth/login", data);

//profile password change
export const changePassword = (data) =>
    api.post("/auth/change-password", data);

export const logout = () =>
    api.post("/auth/logout");
// this file is bridge between frontend and backend.
// only http requests are made from this file to the backend.
