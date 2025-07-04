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
            setResponseMessage("User registered successfully");
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

  const handleRoleClick = (selectedRole) => {
    setRole(selectedRole);
  };

  return (
    <div className="container bg-light mt-3">
      <div className="row p-3">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <h1>FitFound</h1>
            <p>The Smarter Way to Get Hired – Let the Jobs Find You</p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="text-center">
            <span className="text-muted">Sign up as</span>
          </div>

          <div className="d-flex gap-3 mt-2 mb-2">
            <button
              onClick={() => handleRoleClick("candidate")}
              type="button"
              className={`btn w-50 ${
                role === "candidate" ? "btn-primary" : "btn-secondary"
              }`}
            >
              Candidate
            </button>
            <button
              onClick={() => handleRoleClick("employer")}
              type="button"
              className={`btn w-50 ${
                role === "employer" ? "btn-primary" : "btn-secondary"
              }`}
            >
              Employer
            </button>
          </div>

          <form onSubmit={handleSignUpClick}>
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
              <label htmlFor="confirm-password" className="form-label">
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

            {/* {role === "employer" && (
              <>
                <div className="mb-3">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Company Description</label>
                  <textarea
                    className="form-control"
                    placeholder="Company Description"
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    required
                  />
                </div>
              </>
            )} */}

            <div>
              <input
                type="submit"
                className="form-control btn btn-success"
                value="Sign up"
              />
            </div>
          </form>

          <div className="mt-2 text-danger">{responseMessage}</div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
