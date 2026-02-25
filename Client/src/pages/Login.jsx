import { Navigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="">
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
