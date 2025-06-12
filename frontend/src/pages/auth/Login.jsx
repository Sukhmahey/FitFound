import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginSubmit = () => {

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return userCredential.user.getIdToken();
        })
        .then((idToken) => {
            return axios.post('http://localhost:3001/api/login', {}, {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
        })
        .then((response) => {
            console.log('User logged in', response.data);
        })
        .catch((error) => {
            console.error('Error in login', error.message);
        });

     
    };

    const handleSignupClick = () => {
        navigate("/signup");
    };


    return <div>
        <h1>Login</h1>

        <div>
            <div>
                <button>Continue with LinkedIn</button>
                <button>Continue with Google</button>
            </div>
            <span>or Continue with Email</span>
            <form onSubmit={ handleLoginSubmit }>
                <div>
                    <input type="email" name="" id="" placeholder="Email" required
                        value={ email } 
                        onChange={(e) => setEmail(e.target.value)} />

                    <input type="password" name="" id="" placeholder="Password" required
                        value={ password }
                        onChange={(e) => setPassword(e.target.value)} />
                    <div>
                        <input type="submit" value="Login" />
                        <button onClick={ handleSignupClick }>Sign in</button>
                        <a href="">I forgot my password</a>              
                    </div>
                </div>
            </form>
        </div>
    </div>
};

export default Login;

/*
TODO: 

2. Google implementation
3. check data in BD
4. Redirect to the user page

*/