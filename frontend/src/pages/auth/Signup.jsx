import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { auth } from "../../services/firebase";
import { userApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const Signup = () => {
  const [role, setRole] = useState("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSignUpClick = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setResponseMessage("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const firebaseUser = userCredential.user;
        console.log(
          "User registered successful",
          firebaseUser.email,
          firebaseUser.uid
        );

        const userPayload = {
          email: firebaseUser.email,
          idFirebaseUser: firebaseUser.uid,
          role,
        };

        if (role === "employer") {
          userPayload.companyName = companyName;
          userPayload.companyDescription = companyDescription;
        }

        return userApi
          .addUser(userPayload)
          .then((result) => {
            login(result.data);
            setResponseMessage("User registered successful");
            localStorage.setItem("userId", firebaseUser.uid);

            navigate(
              role === "candidate"
                ? "/candidate/onboarding"
                : "/employer/onboarding"
            );
          })
          .catch(async (error) => {
            await deleteUser(firebaseUser);
            console.error("MongoDB error, Firebase user deleted", error);
            setResponseMessage("User creation failed. Check required fields.");
          });
      })
      .catch((error) => {
        console.error("Firebase error", error);
        setResponseMessage("User creation failed");
      });
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
            <span className="text-muted">Sign up as</span>
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

          <form onSubmit={handleSignUpClick}>
            {/* <label>
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
            </label> */}

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                name="confirm-password"
                placeholder="Confirm password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {role === "employer" && (
              <>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Company Description"
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  required
                />
              </>
            )}

            <div>
              <input type="submit" className="form-control" value="Sign up" />
            </div>
          </form>
          <div>{responseMessage}</div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
