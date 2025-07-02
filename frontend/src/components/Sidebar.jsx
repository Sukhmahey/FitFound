import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { employerApi } from '../services/api';

const Sidebar = () => {
    const [userProfile, setUserProfile] = useState({});
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

    useEffect(() => {
        // TODO: VALIDATE THE ROLE
        // Getting the user profile by ID
        employerApi.getEmployerProfile(user.userId)
        .then( result => {
          setUserProfile(result.data);
          console.log(result.data);
        })
        .catch( error => {
          console.log(error);
        });
      }, []);

      

    return (
        <div>
            <div>
                <p>FitFound</p>
            </div>

            <div>
                <div><img src={userProfile.companyLogo}
                        style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }}></img></div>
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