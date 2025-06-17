import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth, provider, signInWithPopup } from "../../services/firebase";
import { userApi, loginApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const { login } = useAuth();

  const handleEmailLogin = (e) => {
    e.preventDefault();

    setPersistence(auth, browserLocalPersistence).then(() => {
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => result.user.getIdToken())
        .then((idToken) => {
          loginApi
            .loginUser({ idToken })
            .then((res) => {
              return userApi.getUserByEmail({
                email: res.data.decodedidToken.email,
              });
            })
            .then((result) => {
              if (result.data.userId) {
                login(result.data);
                console.log("login function", result.data);
                setResponseMessage("User logged in successful");
                console.log(responseMessage);
                console.log("User logged in successful");
                navigate(
                  result.data.role === "candidate"
                    ? "/candidate/dashboard"
                    : "/employer/dashboard"
                );
              } else {
                setResponseMessage("User login failed");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.error("Error in login", error.message);
        });
    });
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => result.user.getIdToken())
      .then((idToken) => loginApi.loginUser({ idToken }))
      .then((res) => {
        userApi
          .getUserByEmail({ email: res.data.decodedidToken.email })
          .then((result) => {
            if (!result.data.userId) {
              const newUser = {
                role: role,
                email: res.data.decodedidToken.email,
                idFirebaseUser: res.data.decodedidToken.uid,
              };

              userApi.addUser(newUser).then((resultNewUser) => {
                login(resultNewUser.data);
                setResponseMessage("User registered successful");
                console.log("User registered successful", resultNewUser.data);
                navigate(
                  resultNewUser.data.role === "candidate"
                    ? "/candidate/dashboard"
                    : "/employer/dashboard"
                );
              });
            } else {
              login(result.data);
              setResponseMessage("User logged in successful");
              console.log("User logged in successful", result.data);
              navigate(
                result.data.role === "candidate"
                  ? "/candidate/dashboard"
                  : "/employer/dashboard"
              );
            }
          })
          .catch((error) => {
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

  return (
    <div>
      <h1>Login</h1>
      <div>
        <label>
          Role:
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>
              Select one
            </option>
            <option value="candidate">Candidate</option>
            <option value="employer">Employer</option>
          </select>
        </label>
        <div>
          <button>Continue with LinkedIn</button>
          <button onClick={handleGoogleLogin}>Continue with Google</button>
        </div>
        <span>or Continue with Email</span>

        <form onSubmit={handleEmailLogin}>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div>
              <input type="submit" value="Login" />
              <button onClick={handleSignupClick}>Sign in</button>
              <a href="">I forgot my password</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

/*
TODO: 
1. Redirect to the fill profile page

*/
