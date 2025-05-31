import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 get current path
  const { student, logout } = useContext(AuthContext);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        logout();
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Quiz Platform</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {/* Home is always visible */}
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>

            {!student ? (
              // Show Login only if not on /admin
              !isAdminRoute && (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              )
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/take-exam">Take Exam</Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}