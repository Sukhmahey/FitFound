import { useState } from 'react';
import axios from 'axios';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return userCredential.user.getIdToken();
        })
        .then((idToken) => {
            return axios.post('http://localhost:5000/api/auth/firebase-login', {}, {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
        })
        .then((response) => {
            console.log('Usuario verificado:', response.data);
        })
        .catch((error) => {
            console.error('Error al iniciar sesión:', error.message);
        });

     
    };


    return <div>
        <h1>Login</h1>

        <div>
            <div>
                <button>Continue with LinkedIn</button>
                <button>Continue with Google</button>
            </div>
            <span>or Continue with Email</span>
            <form>
                <div>
                    <input type="email" name="" id="" placeholder="Email"/>
                    <input type="password" name="" id="" placeholder="Password"></input>
                    <div>
                        <button>Login</button>
                        <button>Sign in</button>
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
1. LinkedIn implementation
2. Google implementation
3. check data in BD
4. Redirect to the user page

*/