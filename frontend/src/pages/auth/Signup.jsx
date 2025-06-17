import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { auth } from "../../services/firebase";
import { userApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const Signup = () => {
  const [role, setRole] = useState("");
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

            navigate(
              role === "candidate"
                ? "/candidate/dashboard"
                : "/employer/dashboard"
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

  return (
    <div>
      <h1>Sign up</h1>
      <form onSubmit={handleSignUpClick}>
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

        <input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

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

        <input type="submit" value="Sign up" />
      </form>
      <div>{responseMessage}</div>
    </div>
  );
};

export default Signup;
