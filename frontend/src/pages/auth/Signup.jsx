import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { userApi } from '../../services/api';

const Signup = () => {
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [user, setUser] = useState({});
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();
    
    const handleSignUpClick = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User registered successful', user.email);

            return  userApi.addUser({ email: user.email, idFirebaseUser: user.uid, role: role })
            .then( result => {
                setUser(result.data);
                setResponseMessage('User registered successful');
                console.log(result);
            })
            .catch(error => {
                setResponseMessage('User creation failed');
            });
        })
        .catch((error) => {
            setResponseMessage("User creation failed");
        });
    };

    return <div>
        <h1>Sign in</h1>

        <div>
            <form onSubmit={ handleSignUpClick }>
                <div>
                    <label>
                    Role:
                    <select value={ role } onChange={ (e) => setRole(e.target.value) } required>
                        <option value="" disabled>Select one</option>
                        <option value="candidate">Candidate</option>
                        <option value="employer">Employer</option>
                    </select>
                    </label>
                    <input type="email" name="email" id="email" placeholder="Email" autoComplete="email"
                        value={ email } 
                        onChange={(e) => setEmail(e.target.value)} required />

                    <input type="password" name="password" id="password" placeholder="Password" autoComplete="current-password"
                        value={ password }
                        onChange={(e) => setPassword(e.target.value)} required />

                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm password" autoComplete="current-password"
                        value={ confirmPassword }
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <input type="submit" value="Sign up" />
                </div>
            </form>
            
        </div>
    </div>
};

/*
TODO: 
1. Redirect to the fill profile page

*/

export default Signup;