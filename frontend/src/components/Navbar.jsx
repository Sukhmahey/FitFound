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
                {/* <li><NavLink to="/">Overview</NavLink></li>
                <li><NavLink to="/">Features</NavLink></li>
                <li><NavLink to="/">Team</NavLink></li>
                <li><NavLink to="/">Contact</NavLink></li> */}
            </ul>
        </div>
        <div>
            <button onClick={ handleLoginClick }>Login</button>
        </div>
    </div>
};

export default Navbar;