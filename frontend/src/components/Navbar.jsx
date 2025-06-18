import { useNavigate, NavLink } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/login");
    };

    return <div>
        <div>
            <span>FitFound</span>
        </div>
        <div>
            <ul>
                <li>Overview</li>
                <li>Features</li>
                <li>Team</li>
                <li>Contact</li>
            </ul>
        </div>
        <div>
            <button onClick={ handleLoginClick }>Login</button>
        </div>
    </div>
};

export default Navbar;