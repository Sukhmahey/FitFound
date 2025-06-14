import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, provider, signInWithPopup } from '../../services/firebase';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailLogin = (e) => {
        e.preventDefault();

        setPersistence(auth, browserLocalPersistence)
        .then( () => {
            signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                //console.log(result);
                return result.user.getIdToken();
            })
            .then((idToken) => {
                //console.log("this is the token", idToken)
                
                return axios.post('http://localhost:3001/api/login', { idToken })
                .then( result => {
                    //console.log(result);
                    return result;
                })
                .catch( error => {
                    console.log(error);
                })
            })
            .then((response) => {
                console.log('User logged in', response);
            })
            .catch((error) => {
                console.error('Error in login', error.message);
            });
        });
     
    };

    const handleGoogleLogin = () => {
        
        signInWithPopup(auth, provider)
        .then((result) => result.user.getIdToken())
        .then((idToken) => {
            //console.log("this is the token", idToken)
            return axios.post('http://localhost:3001/api/login', { idToken })
            .then( result => {
                //console.log(result);
                return result;
            })
            .catch( error => {
                    console.log(error);
            })
        })
        .then((res) => {
            console.log('User registered in Firestore', res.data);
            const email = res.data.decodedidToken.email;

            //TODO: validate if the userId exists in MongoDB
            axios.get('http://localhost:3001/api/user/byemail', { params: { email: `${email}`} })
            .then( result => {
                console.log(result);
            })
            .catch( error => {
                if (error.status == 404) {
                    console.error("User no found");

                    //TODO: add user to MongoDB
                }
                else {
                    console.error(error);
                }
            });
        })
        .catch((error) => {
            console.error(error);
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
                <button onClick={ handleGoogleLogin }>Continue with Google</button>
            </div>
            <span>or Continue with Email</span>

            <form onSubmit={ handleEmailLogin }>
                <div>
                    <input type="email" name="email" id="email" placeholder="Email" required autoComplete="email"
                        value={ email } 
                        onChange={(e) => setEmail(e.target.value)} />

                    <input type="password" name="password" id="password" placeholder="Password" required autoComplete="current-password"
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