import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth, provider, signInWithPopup } from '../../services/firebase';
import { userApi, loginApi } from '../../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState({});
    const [responseMessage, setResponseMessage] = useState('');

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
                
                // Login the user in Firestore
                loginApi.loginUser({ idToken })
                .then( res  => {
                    console.log('User authenticated in Firestore', res);

                    // Validate if the userId exists in MongoDB
                    return userApi.getUserByEmail( { email: res.data.decodedidToken.email } )
                    .then( result => {
                        console.log(result);

                        if (result.data.userId) {
                            setUser(result.data);
                            setResponseMessage('User loged in successful');
                            console.log('User loged in successful');
                        }
                        else {
                           setUser({});
                           setResponseMessage('User login failed');
                        }

                    })
                })
                .catch( error => {
                    console.log(error);
                })
            })
            .catch((error) => {
                console.error('Error in login', error.message);
            });
        });
     
    };

    const handleGoogleLogin = () => {
        
        signInWithPopup(auth, provider)
        .then( result => result.user.getIdToken())
        .then( idToken => {
            return loginApi.loginUser({ idToken });
        })
        .then((res) => {
            console.log('User ok in Firestore', res.data);

            // Validate if the userId exists in MongoDB
            userApi.getUserByEmail( { email: res.data.decodedidToken.email } )
            .then( result => {
                if (!result.data.userId) {

                    const newUser = {
                        role: role,
                        email: res.data.decodedidToken.email,
                        idFirebaseUser: res.data.decodedidToken.uid
                    };

                    // Create the user in MongoDB
                    userApi.addUser( newUser )
                    .then( resultNewUser => {
                        setUser(resultNewUser.data); // TODO: send the user role
                        setResponseMessage('User registered successful');
                        console.log('User registered successful', resultNewUser.data);
                    });
                }
                else {
                    setUser(result.data);
                    setResponseMessage('User loged in successful');
                    console.log('User loged in successful', result.data);
                }

            })
            .catch( error => {
                console.error(error);
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
            <label>
                    Role:
                    <select value={ role } onChange={ (e) => setRole(e.target.value) } required>
                        <option value="" disabled>Select one</option>
                        <option value="candidate">Candidate</option>
                        <option value="employer">Employer</option>
                    </select>
                    </label>
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
1. Redirect to the fill profile page

*/