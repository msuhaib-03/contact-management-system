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

// ===== FORGOT PASSWORD FLOW =====

// step 1
export const generateOtp = (email) =>
    api.post(`/auth/forgot-password/generate-otp?email=${email}`);

// step 2
export const verifyOtp = (email, otp) =>
    api.post(`/auth/forgot-password/verify-otp?email=${email}&otp=${otp}`);

// step 3
export const resetPassword = (data) =>
    api.post("/auth/forgot-password/reset", data);
// this file is bridge between frontend and backend.
// only http requests are made from this file to the backend.
