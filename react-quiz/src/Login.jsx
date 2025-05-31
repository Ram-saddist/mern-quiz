import { auth, provider, signInWithPopup } from "./firebase";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const handleLogin = () => {
    signInWithPopup(auth, provider).then((result) => {
      const name = result.user.displayName;
      const email = result.user.email;
      const user = { name, email };
      login(user); // update context
      navigate("/take-exam");
    });
  };
  return (
    <div className="container text-center mt-5">
      <h2 className="mb-4">Login to take the quiz</h2>
      <button className="btn btn-primary" onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}