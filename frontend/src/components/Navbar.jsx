import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <h2>TaskFlow</h2>

            <button onClick={logout}>
                Logout
            </button>
        </nav>
    );
}

export default Navbar;