import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
    const { user } = useAuth();
    console.log(user);

    const location = useLocation();
    const navigate = useNavigate();

    const goTo = (newSegment) => {
        const segments = location.pathname.split('/');
        segments[segments.length - 1] = newSegment;
        const newPath = segments.join('/');
        navigate(newPath);
    };

    return (
        <div>
            <div>
                <p>FitFound</p>
            </div>

            <div>
                <div>Logo here</div>
                <div>Anna Paul</div>
            </div>

            <nav>
                <ul>
                    <li><button onClick={() => goTo('dashboard')}>Dashboard</button></li>
                    <li><button onClick={() => goTo('profile')}>My Profile</button></li>

                    {user.role === 'candidate' && (
                        <li><button onClick={() => goTo('ingsights')}>Ingsights</button></li>
                    )}

                    {user.role === 'employer' && (
                        <li><button onClick={() => goTo('search')}>Search</button></li>
                    )}

                    <li><button onClick={() => goTo('connections')}>Connections</button></li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;