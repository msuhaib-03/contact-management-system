import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChangePassword from "./pages/ChangePassword.jsx";
import Contacts from "./pages/Contacts";
import Profile from "./pages/Profile.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<ChangePassword />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/profile" element={<Profile/>} />
        </Routes>
    );
}

export default App;
