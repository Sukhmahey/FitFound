import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth, provider, signInWithPopup } from "../../services/firebase";
import { userApi, loginApi, employerApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const { login } = useAuth();

  // Navigate base on the role, and if user has employer profile
  const handleNavigate = (role, userId) => {
    if (role === "employer") {
      employerApi.getEmployerProfile(userId)
      .then(result => {
        console.log(result);
        navigate("/employer/dashboard");
      })
      .catch(error => {
        // employer profile not found
        navigate("/employer/onboarding"); 
      })
    }
    else {
      navigate("/candidate/dashboard");
    }
  };

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
                localStorage.setItem("userId", result?.data?.userId);
                console.log("login function", result.data);
                setResponseMessage("User logged in successful");
                console.log(responseMessage);
                console.log("User logged in successful");

                // handeling navigation
                handleNavigate(result?.data?.role, result?.data?.userId);

                // navigate(
                //   result.data.role === "candidate"
                //     ? "/candidate/dashboard"
                //     : "/employer/dashboard"
                // );
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

  const handleOnclickRole = (e) => {
    setRole(e.target.id);
    console.log(e.target);
  };

  return (
    <div className="container bg-light mt-3">
      <div className="row p-3">
        {/* FitFount texts */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <h1>FitFound</h1>
            <p>The Smarter Way to Get Hired – Let the Jobs Find You</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="col-md-6">
          <div className="text-center">
            <span className="text-muted">Login as</span>
          </div>

          <div className="d-flex gap-3 mt-2 mb-2">
            <button
              onClick={(e) => handleOnclickRole(e)}
              type="button"
              id="candidate"
              className="btn btn-primary w-50"
            >
              Candidate
            </button>
            <button
              onClick={(e) => handleOnclickRole(e)}
              type="button"
              className="btn btn-secondary w-50"
              id="employer"
            >
              Employer
            </button>
          </div>

          {/* <div className="btn-group gap-4 text-center" >
            <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autocomplete="off" 
            onChange={(e) => setRole(e.target.value)}
            value="candidate" /> 
            <label className="btn btn-outline-primary" for="btnradio1">Candidate</label>

            <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autocomplete="off"
            onChange={(e) => setRole(e.target.value)}
            value="employer" />
            <label className="btn btn-outline-primary" for="btnradio2">Employeer</label>
          </div> */}

          <form onSubmit={handleEmailLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                id="email"
                placeholder="Email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                id="password"
                placeholder="Password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="text-end">
                <span>I forgot my password</span>
              </div>
            </div>

            <div>
              <input type="submit" className="form-control" value="Login" />
            </div>
          </form>

          {/* -----or------------ */}
          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1" />
            <span className="mx-3 text-muted">or</span>
            <hr className="flex-grow-1" />
          </div>

          <div>
            {/* <button>Continue with LinkedIn</button> */}
            <button onClick={handleGoogleLogin} className="form-control">
              Continue with Google
            </button>
          </div>
          <div className="text-center" onClick={handleSignupClick}>
            <a href="#">Are you new? Create an Account</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

/*
TODO: 
1. Redirect to the fill profile page

*/
