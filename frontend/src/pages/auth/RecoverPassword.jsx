import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail, setPersistence,
  browserLocalPersistence,} from "firebase/auth";
import { auth } from "../../services/firebase";

const RecoverPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handlePasswordRecover = (e) => {
    e.preventDefault();

    setPersistence(auth, browserLocalPersistence).then(() => {

      sendPasswordResetEmail(auth, email)
      .then( result => {
        setResponseMessage("Password reset email sent! Check your inbox.");
        setTimeout(() => {
          setResponseMessage('');
        }, 5000);
      })
      .catch( error => {
        setResponseMessage("There was a problem sending the email to this email. Please consult with support.");
        setTimeout(() => {
          setResponseMessage('');
        }, 5000);
      });
      
    });
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="container bg-light mt-3">
      <div>{responseMessage}</div>
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
            <span className="text-muted">Reset Password</span>
          </div>

          <form onSubmit={handlePasswordRecover}>
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

            <div>
              <input type="submit" className="form-control" value="Send Reset Link" />
            </div>
          </form>

          {/* -----or------------ */}
          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1" />
            <span className="mx-3 text-muted">or</span>
            <hr className="flex-grow-1" />
          </div>

          <div className="text-center" onClick={handleSignupClick}>
            <a href="#">Are you new? Create an Account</a>
          </div>
          <div onClick={handleLoginRedirect}>
            Go to {" "}
            <span style={{ color: "#0E3A62", fontWeight: 600 }}>Log in</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;