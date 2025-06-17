import { useAuth } from "../contexts/AuthContext";

const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <div>
      <div>
        <h1>Unauthorized</h1>
      </div>
      <div>
        <p>You are not authorized to view this page.</p>
        <p>
          If you believe this is an error, please contact the site administrator
          or return to the homepage.
        </p>
      </div>
      <p> all info of user </p>

      {user && (
        <div>
          <h3>User Info</h3>
          <p>
            <strong>Name:</strong> {user.role || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Firebase UID:</strong> {user.userId}
          </p>
          {/* <p> all info of user </p> {user} */}
        </div>
      )}
    </div>
  );
};

export default Unauthorized;
