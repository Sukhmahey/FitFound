import { useNavigate, NavLink } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/login");
    };

    return <div>
        
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <div>
                    <span>FitFound</span>
                </div>

                <ul className="navbar-nav mb-2 mb-lg-0 gap-4">
                    <li className="nav-item"><a href="#" className="nav-link">Overview</a></li>
                    <li className="nav-item"><a href="#" className="nav-link">Features</a></li>
                    <li className="nav-item"><a href="#" className="nav-link">Team</a></li>
                    <li className="nav-item"><a href="#" className="nav-link">Contact</a></li>
                </ul>

                <div>
                    <button className="btn btn-primary btn-sm" onClick={ handleLoginClick }>Login</button>
                </div>
            </div>
            
        </nav>    
    </div>
};

export default Navbar;