import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Contacts from "./pages/Contacts";
import Profile from "./pages/Profile.jsx";
import Favorites from "./pages/Favorites.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/favorites" element={<Favorites/>} />
        </Routes>
    );
}

export default App;
