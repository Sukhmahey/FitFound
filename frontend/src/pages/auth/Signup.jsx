import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    
    const handleSignUpClick = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User registered successful', user.email);

            return axios.post('http://localhost:3001/api/user', {
                email: user.email,
                idFirebaseUser: user.uid
            });
        })
        .then((response) => {
            console.log('Response:', response.data);
        })
        .catch((error) => {
            console.error('Error Message:', error.message);
        });
    };

    return <div>
        <h1>Sign in</h1>

        <div>
            <form onSubmit={ handleSignUpClick }>
                <div>
                    <input type="email" name="email" id="email" placeholder="Email" autoComplete="email"
                        value={ email } 
                        onChange={(e) => setEmail(e.target.value)} />

                    <input type="password" name="password" id="password" placeholder="Password" autoComplete="current-password"
                        value={ password }
                        onChange={(e) => setPassword(e.target.value)} />

                    <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm password" autoComplete="current-password"
                        value={ confirmPassword }
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <input type="submit" value="Sign up" />
                </div>
            </form>
            
        </div>
    </div>
};

/*
TODO: 
1. LinkedIn implementation (not for now)
2. Google implementation
3. Save data in BD
4. Redirect to the user page

*/

export default Signup;