import { useNavigate, NavLink } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/login");
    };

    return <div>
        
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <div>
                    <span>FitFound</span>
                </div>

                <ul class="navbar-nav mb-2 mb-lg-0 gap-4">
                    <li class="nav-item"><a href="#" class="nav-link">Overview</a></li>
                    <li class="nav-item"><a href="#" class="nav-link">Features</a></li>
                    <li class="nav-item"><a href="#" class="nav-link">Team</a></li>
                    <li class="nav-item"><a href="#" class="nav-link">Contact</a></li>
                </ul>

                <div>
                    <button class="btn btn-primary btn-sm" onClick={ handleLoginClick }>Login</button>
                </div>
            </div>
            
        </nav>    
    </div>
};

export default Navbar;