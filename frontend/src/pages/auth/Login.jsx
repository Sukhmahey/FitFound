import { signInWithEmailAndPassword, auth } from 'firebase/auth';

const Login = () => {

    const handleLogin = () => {
    
     
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